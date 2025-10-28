import axios from 'axios';

const API_BASE_URL = 'https://api.uymarmarket.com.tr/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config: any) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error: any) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Category API
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getById: (id: string) => api.get(`/categories/${id}`),
  create: (data: { name: string; imageUrl?: string }) => api.post('/categories', data),
  update: (id: string, data: { name: string; imageUrl?: string }) => api.put(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
};

// Product API
export const productAPI = {
  getAll: (params?: { categoryId?: string; page?: number; limit?: number; search?: string }) => 
    api.get('/products', { params }),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (data: { 
    name: string; 
    price: number; 
    imageUrl?: string; 
    categoryId: string; 
  }) => api.post('/products', data),
  update: (id: string, data: { 
    name: string; 
    price: number; 
    imageUrl?: string; 
    categoryId: string; 
  }) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`),
};

// Order API
export const orderAPI = {
  getAll: (params?: { status?: string; page?: number; limit?: number }) => 
    api.get('/orders', { params }),
  getById: (id: string) => api.get(`/orders/${id}`),
  create: (data: { 
    items: Array<{ productId: string; quantity: number; variants?: string[] }>; 
    total: number,
    customerName: string,
    customerPhone: string,
    customerAddress: string
  }) => api.post('/orders', data),
  update: (id: string, data: { status?: string; customerName?: string; customerPhone?: string; customerAddress?: string }) => api.put(`/orders/${id}`, data),
  delete: (id: string) => api.delete(`/orders/${id}`),
};

// Upload API
export const uploadAPI = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  uploadImages: (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    return api.post('/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  deleteImage: (filename: string) => api.delete(`/upload/image/${filename}`),
  getImages: () => api.get('/upload/images'),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getAnalytics: (period?: number) => api.get('/dashboard/analytics', { params: { period } }),
};

export default api;
