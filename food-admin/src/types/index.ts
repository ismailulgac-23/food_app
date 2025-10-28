export interface Category {
  id: string;
  name: string;
  imageUrl?: string;
  products?: Product[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  categoryId: string;
  category?: Category;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  product?: Product;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  total: number;
  status: OrderStatus;
  items: OrderItem[];
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface DashboardStats {
  overview: {
    totalCategories: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
  };
  orderStats: Record<OrderStatus, number>;
  recentOrders: Order[];
  categoryStats: Array<{
    id: string;
    name: string;
    productCount: number;
    imageUrl?: string;
  }>;
  topProducts: Array<{
    id: string;
    name: string;
    price: number;
    orderCount: number;
    categoryName: string;
    imageUrl?: string;
  }>;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    order_count: number;
  }>;
  dailyOrders: Array<{
    day: string;
    order_count: number;
    daily_revenue: number;
  }>;
}

export interface UploadResponse {
  filename: string;
  originalName: string;
  size: number;
  url: string;
}

export interface CreateCategoryData {
  name: string;
  imageUrl?: string;
}

export interface UpdateCategoryData {
  name: string;
  imageUrl?: string;
}

export interface CreateProductData {
  name: string;
  price: number;
  imageUrl?: string;
  categoryId: string;
}

export interface UpdateProductData {
  name: string;
  price: number;
  imageUrl?: string;
  categoryId: string;
}

export interface CreateOrderData {
  items: Array<{
    productId: string;
    quantity: number;
    variants?: string[];
  }>;
  total: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
}

export interface UpdateOrderData {
  status?: OrderStatus;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
}
