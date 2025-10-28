import express from 'express';
import { prisma } from '../index';

const router = express.Router();

// GET /api/products - Tüm ürünleri getir
router.get('/', async (req, res) => {
  try {
    const { categoryId, page = 1, limit = 10, search } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {};

    if (categoryId) {
      where.categoryId = categoryId as string;
    }

    if (search) {
      where.name = {
        contains: search as string,
        mode: 'insensitive'
      };
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          category: {
            select: {
              id: true,
              name: true
            }
          },
        },
        skip,
        take: Number(limit),
        orderBy: {
          name: 'asc'
        }
      }),
      prisma.product.count({ where })
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch products'
    });
  }
});

// GET /api/products/:id - Belirli bir ürünü getir
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        },
      }
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch product'
    });
  }
});

// POST /api/products - Yeni ürün oluştur
router.post('/', async (req, res) => {
  try {
        const { name, price, imageUrl, categoryId } = req.body;

    if (!name || !price || !categoryId) {
      return res.status(400).json({
        success: false,
        error: 'Name, price, and categoryId are required'
      });
    }

    // Kategori var mı kontrol et
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      return res.status(400).json({
        success: false,
        error: 'Category not found'
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        price: Number(price),
        imageUrl: imageUrl || null,
        categoryId,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        },
      }
    });

    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create product'
    });
  }
});

// PUT /api/products/:id - Ürünü güncelle
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, imageUrl, categoryId } = req.body;

    if (!name || !price || !categoryId) {
      return res.status(400).json({
        success: false,
        error: 'Name, price, and categoryId are required'
      });
    }

    // Kategori var mı kontrol et
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    });

    if (!category) {
      return res.status(400).json({
        success: false,
        error: 'Category not found'
      });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        price: Number(price),
        imageUrl: imageUrl || null,
        categoryId,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true
          }
        },
      }
    });

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update product'
    });
  }
});

// DELETE /api/products/:id - Ürünü sil
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Önce bu ürüne ait siparişler var mı kontrol et
    const orderItemsCount = await prisma.orderItem.count({
      where: { productId: id }
    });

    if (orderItemsCount > 0) {
      return res.status(400).json({
        success: false,
        error: 'Cannot delete product with existing orders'
      });
    }

    await prisma.product.delete({
      where: { id }
    });

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete product'
    });
  }
});

export default router;
