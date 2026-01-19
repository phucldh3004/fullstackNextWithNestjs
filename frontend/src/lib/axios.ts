/**
 * Axios Client Configuration
 * Common axios instance with proxy support
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
// Note: CORS configuration is defined in ./proxy.ts
// CORS headers are handled by proxy middleware in middleware.ts
// Axios uses withCredentials: true to send cookies with requests

// Get base API URL
const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
};

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  },
  withCredentials: true, // Important for cookies
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Use CORS configuration from proxy.ts
    // Headers are automatically handled by the proxy middleware
    // withCredentials: true ensures cookies are sent with requests
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle common errors
    if (error.response) {
      // Server responded with error status
      const message = (error.response.data as { message?: string })?.message || error.message || 'An error occurred';
      console.error(`API Error [${error.config?.url}]:`, message);
    } else if (error.request) {
      // Request was made but no response received
      console.error('Network Error:', error.request);
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;

// Export helper functions for common HTTP methods
export const api = {
  get: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.get<T>(url, config).then((res) => res.data),

  post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.post<T>(url, data, config).then((res) => res.data),

  put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.put<T>(url, data, config).then((res) => res.data),

  patch: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.patch<T>(url, data, config).then((res) => res.data),

  delete: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.delete<T>(url, config).then((res) => res.data),
};

// Export axios instance for custom usage
export { axiosInstance };

