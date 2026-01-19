/**
 * Authentication Helper Functions
 */

import { cookies } from 'next/headers';

/**
 * Check if user is authenticated (Server-side only)
 * @returns true if access_token exists in cookies
 */
export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token');
  return !!token;
}

/**
 * Get access token from cookies (Server-side only)
 * @returns access_token or null
 */
export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('access_token');
  return token?.value || null;
}

/**
 * Client-side auth check
 * Call this from client components
 */
export async function checkAuthClient(): Promise<boolean> {
  try {
    const { api } = await import('./axios');
    await api.get('/auth/check');
    return true;
  } catch {
    return false;
  }
}

/**
 * Login (Client-side)
 */
export async function login(username: string, password: string) {
  const { api } = await import('./axios');
  try {
    return await api.post('/auth/login', { username, password });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'Login failed');
  }
}

/**
 * Logout (Client-side)
 */
export async function logout() {
  const { api } = await import('./axios');
  try {
    return await api.post('/auth/logout');
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'Logout failed');
  }
}

/**
 * Register (Client-side)
 */
export async function register(data: any) {
  const { api } = await import('./axios');
  try {
    return await api.post('/auth/register', data);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || 'Registration failed');
  }
}

