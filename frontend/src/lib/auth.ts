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
    const response = await fetch('/api/auth/check');
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Login (Client-side)
 */
export async function login(username: string, password: string) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  return response.json();
}

/**
 * Logout (Client-side)
 */
export async function logout() {
  const response = await fetch('/api/auth/logout', {
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error('Logout failed');
  }

  return response.json();
}

/**
 * Register (Client-side)
 */
export async function register(data: any) {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }

  return response.json();
}

