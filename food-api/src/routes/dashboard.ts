import express from 'express';
import { prisma } from '../index';

const router = express.Router();

// GET /api/dashboard/stats - Dashboard istatistikleri
router.get('/stats', async (req, res) => {
  try {
    // Temel sayılar
    const [
      totalCategories,
      totalProducts,
      totalOrders,
      totalRevenue
    ] = await Promise.all([
      prisma.category.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: {
          total: true
        }
      })
    ]);

    // Sipariş durumlarına göre sayılar
    const orderStats = await prisma.order.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });

    // Son 7 günün siparişleri
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentOrders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });

    // Kategori bazında ürün sayıları
    const categoryStats = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true
          }
        }
      },
      orderBy: {
        products: {
          _count: 'desc'
        }
      }
    });

    // En çok satılan ürünler
    const topProducts = await prisma.product.findMany({
      include: {
        _count: {
          select: {
            orderItems: true
          }
        },
        category: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        orderItems: {
          _count: 'desc'
        }
      },
      take: 5
    });

    // Aylık gelir (son 12 ay) - Prisma ile
    const monthlyRevenueData = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 12))
        }
      },
      select: {
        createdAt: true,
        total: true
      }
    });

    // Aylık verileri grupla
    const monthlyRevenue = monthlyRevenueData.reduce((acc, order) => {
      const month = order.createdAt.toISOString().substring(0, 7); // YYYY-MM format
      if (!acc[month]) {
        acc[month] = { revenue: 0, order_count: 0 };
      }
      acc[month].revenue += order.total;
      acc[month].order_count += 1;
      return acc;
    }, {} as Record<string, { revenue: number; order_count: number }>);

    const monthlyRevenueArray = Object.entries(monthlyRevenue).map(([month, data]) => ({
      month: new Date(month + '-01').toISOString(),
      revenue: data.revenue,
      order_count: data.order_count
    })).sort((a, b) => new Date(b.month).getTime() - new Date(a.month).getTime());

    // Günlük sipariş sayıları (son 30 gün) - Prisma ile
    const dailyOrdersData = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30))
        }
      },
      select: {
        createdAt: true,
        total: true
      }
    });

    // Günlük verileri grupla
    const dailyOrders = dailyOrdersData.reduce((acc, order) => {
      const day = order.createdAt.toISOString().substring(0, 10); // YYYY-MM-DD format
      if (!acc[day]) {
        acc[day] = { order_count: 0, daily_revenue: 0 };
      }
      acc[day].order_count += 1;
      acc[day].daily_revenue += order.total;
      return acc;
    }, {} as Record<string, { order_count: number; daily_revenue: number }>);

    const dailyOrdersArray = Object.entries(dailyOrders).map(([day, data]) => ({
      day: new Date(day).toISOString(),
      order_count: data.order_count,
      daily_revenue: data.daily_revenue
    })).sort((a, b) => new Date(b.day).getTime() - new Date(a.day).getTime());

    res.json({
      success: true,
      data: {
        overview: {
          totalCategories,
          totalProducts,
          totalOrders,
          totalRevenue: totalRevenue._sum.total || 0
        },
        orderStats: orderStats.reduce((acc, stat) => {
          acc[stat.status] = stat._count.status;
          return acc;
        }, {} as Record<string, number>),
        recentOrders,
        categoryStats: categoryStats.map(cat => ({
          id: cat.id,
          name: cat.name,
          productCount: cat._count.products,
          imageUrl: cat.imageUrl
        })),
        topProducts: topProducts.map(product => ({
          id: product.id,
          name: product.name,
          price: product.price,
          orderCount: product._count.orderItems,
          categoryName: product.category!.name,
          imageUrl: product.imageUrl
        })),
        monthlyRevenue: monthlyRevenueArray,
        dailyOrders: dailyOrdersArray
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard statistics'
    });
  }
});

// GET /api/dashboard/analytics - Detaylı analitik veriler
router.get('/analytics', async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period as string);

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Dönem bazında sipariş analizi
    const orderAnalytics = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate
        }
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                price: true,
                category: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        }
      }
    });

    // Kategori bazında satış analizi
    const categorySales = orderAnalytics.reduce((acc, order) => {
      order.items.forEach(item => {
        const categoryName = item.product!.category!.name;
        if (!acc[categoryName]) {
          acc[categoryName] = {
            totalSales: 0,
            orderCount: 0,
            productCount: 0
          };
        }
        acc[categoryName].totalSales += item.product!.price * item.quantity;
        acc[categoryName].orderCount += 1;
        acc[categoryName].productCount += item.quantity;
      });
      return acc;
    }, {} as Record<string, any>);

    // Ortalama sipariş değeri
    const avgOrderValue = orderAnalytics.length > 0 
      ? orderAnalytics.reduce((sum, order) => sum + order.total, 0) / orderAnalytics.length
      : 0;

    res.json({
      success: true,
      data: {
        period: `${days} days`,
        totalOrders: orderAnalytics.length,
        totalRevenue: orderAnalytics.reduce((sum, order) => sum + order.total, 0),
        avgOrderValue: Math.round(avgOrderValue * 100) / 100,
        categorySales: Object.entries(categorySales).map(([category, data]) => ({
          category,
          ...(data as any)
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics data'
    });
  }
});

export default router;
