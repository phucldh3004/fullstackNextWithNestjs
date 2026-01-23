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
    login: (username: string, password: string) =>
      api.post('/auth/login', { username, password }),
    register: (data: unknown) =>
      api.post('/auth/register', data),
  },

  // Users APIs
  users: {
    getAll: (id?: string) => id ? api.get(`/users?id=${id}`) : api.get('/users'),
    getById: (id: string) => api.get(`/users/${id}`),
    getByEmail: (email: string) => api.get(`/users/${email}`),
    create: (data: unknown) => api.post('/users', data),
    update: (data: unknown) => api.patch('/users', data),
    delete: (id: string) => api.delete(`/users/${id}`),
  },

  // Customers APIs
  customers: {
    getAll: () => api.get('/customers'),
    getById: (id: string) => api.get(`/customers/${id}`),
    create: (data: unknown) => api.post('/customers', data),
    update: (id: string, data: unknown) => api.patch(`/customers/${id}`, data),
    delete: (id: string) => api.delete(`/customers/${id}`),
    classify: (id: string, type: string) => api.patch(`/customers/${id}/classify/${type}`),
    getInteractions: (id: string) => api.get(`/customers/${id}/interactions`),
  },

  // Leads APIs
  leads: {
    getAll: () => api.get('/leads'),
    getById: (id: string) => api.get(`/leads/${id}`),
    create: (data: unknown) => api.post('/leads', data),
    update: (id: string, data: unknown) => api.patch(`/leads/${id}`, data),
    delete: (id: string) => api.delete(`/leads/${id}`),
    assign: (id: string, assigneeId: string) => api.patch(`/leads/${id}/assign/${assigneeId}`),
    changeStatus: (id: string, status: string) => api.patch(`/leads/${id}/status/${status}`),
    convertToCustomer: (id: string, customerId: string) => api.patch(`/leads/${id}/convert/${customerId}`),
    getByAssignee: (assigneeId: string) => api.get(`/leads/assignee/${assigneeId}`),
    getByStatus: (status: string) => api.get(`/leads/status/${status}`),
  },

  // Marketing/Campaigns APIs
  campaigns: {
    getAll: () => api.get('/marketing/campaigns'),
    getById: (id: string) => api.get(`/marketing/campaigns/${id}`),
    create: (data: unknown) => api.post('/marketing/campaigns', data),
    update: (id: string, data: unknown) => api.patch(`/marketing/campaigns/${id}`, data),
    delete: (id: string) => api.delete(`/marketing/campaigns/${id}`),
    sendEmail: (id: string) => api.post(`/marketing/campaigns/${id}/send-email`),
    sendSMS: (id: string) => api.post(`/marketing/campaigns/${id}/send-sms`),
    trackResult: (id: string, metrics: unknown) => api.post(`/marketing/campaigns/${id}/track`, metrics),
    analyzeROI: (id: string) => api.get(`/marketing/campaigns/${id}/roi`),
  },
};

