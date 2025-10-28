import express from 'express';
import { prisma } from '../index';
import { authMiddleware } from './auth';

const router = express.Router();

// GET /api/orders - Tüm siparişleri getir
router.get('/', authMiddleware as any, async (req: any, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};

    if (status) {
      where.status = status as string;
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                  imageUrl: true
                }
              },
            }
          }
        },
        skip,
        take: Number(limit),
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.order.count({ where })
    ]);

    res.json({
      success: true,
      data: orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch orders'
    });
  }
});

// GET /api/orders/mine - Authenticated user's orders
router.get('/mine', authMiddleware as any, async (req: any, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.userId },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, price: true, imageUrl: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching my orders:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch my orders' });
  }
});

// GET /api/orders/:id - Belirli bir siparişi getir
router.get('/:id', authMiddleware as any, async (req: any, res) => {
  try {
    const { id } = req.params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true
              }
            },
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch order'
    });
  }
});

// POST /api/orders - Yeni sipariş oluştur
router.post('/', authMiddleware as any, async (req: any, res) => {
  try {
    const { items, total, customerName, customerPhone, customerAddress } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Order items are required'
      });
    }

    if (!total || total <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Valid total amount is required'
      });
    }

    // Fetch user to fallback name/phone and store address
    const user = req.userId ? await prisma.user.findUnique({ where: { id: req.userId } }) : null;
    const resolvedName = (customerName && customerName.trim().length >= 3) ? customerName.trim() : (user?.fullName || '');
    const normalizedPhone = (customerPhone ? customerPhone : user?.phone) || '';
    const addressValid = typeof customerAddress === 'string' && customerAddress.trim().length >= 5;
    if (!resolvedName || !normalizedPhone || !addressValid) {
      return res.status(400).json({ success: false, error: 'Name, phone and address required' });
    }
    // Optionally update user's saved address
    if (user && customerAddress && customerAddress.trim()) {
      await prisma.user.update({ where: { id: user.id }, data: { address: customerAddress.trim() } });
    }

    // Ürünlerin varlığını kontrol et
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!product) {
        return res.status(400).json({
          success: false,
          error: `Product with id ${item.productId} not found`
        });
      }
    }

    const order = await prisma.order.create({
      data: {
        total: Number(total),
        status: 'PENDING',
        userId: req.userId,
        customerName: resolvedName,
        customerPhone: normalizedPhone,
        customerAddress: customerAddress.trim(),
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,  
          }))
        }
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true
              }
            },
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create order'
    });
  }
});

// PUT /api/orders/:id - Sipariş durumunu/ müşteri bilgisini güncelle
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, customerName, customerPhone, customerAddress } = req.body;

    const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

    const data: any = {};
    if (status !== undefined) {
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, error: 'Invalid status' });
      }
      data.status = status;
    }
    if (customerName !== undefined) {
      if (typeof customerName !== 'string' || customerName.trim().length < 3) {
        return res.status(400).json({ success: false, error: 'Invalid customerName' });
      }
      data.customerName = customerName.trim();
    }
    if (customerPhone !== undefined) {
      if (typeof customerPhone !== 'string' || !/^[0-9+\-()\s]{10,20}$/.test(customerPhone.trim())) {
        return res.status(400).json({ success: false, error: 'Invalid customerPhone' });
      }
      data.customerPhone = customerPhone.trim();
    }
    if (customerAddress !== undefined) {
      if (typeof customerAddress !== 'string' || customerAddress.trim().length < 10) {
        return res.status(400).json({ success: false, error: 'Invalid customerAddress' });
      }
      data.customerAddress = customerAddress.trim();
    }

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ success: false, error: 'No valid fields to update' });
    }

    const order = await prisma.order.update({
      where: { id },
      data,
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                imageUrl: true
              }
            },
          }
        }
      }
    });

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update order'
    });
  }
});

// DELETE /api/orders/:id - Siparişi sil
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.order.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete order'
    });
  }
});

export default router;
