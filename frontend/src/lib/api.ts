/**
 * API Helper Functions
 * Centralized API calling logic using axios
 */

import { api as axiosApi } from './axios';

// Export axios api instance
export const api = axiosApi;

// Export helper functions
export const apiHelpers = {
  // Auth APIs
  auth: {
    login: (email: string, password: string) =>
      api.post('/auth/login', { username: email, password }),
    register: (data: unknown) =>
      api.post('/auth/register', data),
  },

  // Users APIs
  users: {
    getAll: () => api.get('/users'),
    getById: (id: string) => api.get(`/users/${id}`),
    create: (data: unknown) => api.post('/users', data),
    update: (id: string, data: unknown) => api.patch(`/users/${id}`, data),
    delete: (id: string) => api.delete(`/users/${id}`),
  },

  // Products APIs
  products: {
    getAll: () => api.get('/products'),
    getById: (id: string) => api.get(`/products/${id}`),
    create: (data: unknown) => api.post('/products', data),
    update: (id: string, data: unknown) => api.patch(`/products/${id}`, data),
    delete: (id: string) => api.delete(`/products/${id}`),
  },
};

