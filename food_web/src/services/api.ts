import axios from 'axios';

const API_BASE_URL = 'https://api.uymarmarket.com.tr/api';
/* const API_BASE_URL = 'http://localhost:3000/api'; */

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach auth token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    (config.headers as any)['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Category API
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getById: (id: string) => api.get(`/categories/${id}`),
};

// Product API
export const productAPI = {
  getAll: (params?: { page?: number; limit?: number; search?: string; categoryId?: string }) => api.get('/products', { params }),
  getById: (id: string) => api.get(`/products/${id}`),
  getByCategory: (categoryId: string) => api.get(`/products?categoryId=${categoryId}`),
};

// Order API
export const orderAPI = {
  getAll: () => api.get('/orders'),
  getById: (id: string) => api.get(`/orders/${id}`),
  getMine: () => api.get('/orders/mine'),
  create: (orderData: { 
    items: any[]; 
    total: number; 
    status: string;
    customerName: string;
    customerPhone: string;
    customerAddress: string;
  }) => api.post('/orders', orderData),
};

// Auth API
export const authAPI = {
  register: (data: { fullName: string; phone: string; password: string }) => api.post('/auth/register', data),
  login: (data: { phone: string; password: string }) => api.post('/auth/login', data),
  me: () => api.get('/auth/me'),
  updateMe: (data: { address?: string; fullName?: string }) => api.put('/auth/me', data),
};

// Upload API
export const uploadAPI = {
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post<{ imageUrl: string }>('/upload/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default api;
