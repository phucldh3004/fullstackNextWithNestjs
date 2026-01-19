/**
 * API Helper Functions
 * Centralized API calling logic
 */

// Get base API URL
const getBaseUrl = () => {
  // In browser, use relative path (will be proxied by next.config.ts rewrites)
  if (typeof window !== 'undefined') {
    return '/api';
  }
  
  // On server-side, use direct backend URL
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
};

export const API_BASE_URL = getBaseUrl();

// API client with error handling
export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const error = await response.json().catch(() => ({
          message: response.statusText,
        }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// Export singleton instance
export const api = new ApiClient();

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

