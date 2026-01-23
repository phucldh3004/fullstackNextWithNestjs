/**
 * Axios Client Configuration
 * Common axios instance with proxy support
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
// Note: CORS configuration is defined in ./proxy.ts
// CORS headers are handled by proxy middleware in middleware.ts
// IMPORTANT:
// - Không set `Access-Control-Allow-*` trong request (đó là response headers do server trả về)
// - Chỉ bật withCredentials nếu backend dùng cookie auth cross-site

// Get base API URL
const getBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
};

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
  // Nếu backend KHÔNG dùng cookie (trả token trong JSON) thì để false để tránh CORS credential rules
  withCredentials: false,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Use CORS configuration from proxy.ts
    // Headers are automatically handled by the proxy middleware
    // withCredentials: true ensures cookies are sent with requests

    // Add JWT token from cookies if available (client-side only)
    if (typeof window !== 'undefined') {
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('access_token='))
        ?.split('=')[1];

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

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

  post: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) => {
   return  axiosInstance.post<T>(url, data, config).then((res) => res.data)
  } ,
  put: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.put<T>(url, data, config).then((res) => res.data),

  patch: <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    axiosInstance.patch<T>(url, data, config).then((res) => res.data),

  delete: <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    axiosInstance.delete<T>(url, config).then((res) => res.data),
};

// Export axios instance for custom usage
export { axiosInstance };

