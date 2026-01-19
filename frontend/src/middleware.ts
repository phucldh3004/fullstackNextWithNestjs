/**
 * Next.js Middleware - Authentication Guard
 * Runs before every request to check authentication
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public routes that don't require authentication
const PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/check',
];

// Routes that are always public (static files, etc)
const PUBLIC_FILE_REGEX = /\.(.*)$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public files
  if (PUBLIC_FILE_REGEX.test(pathname)) {
    return NextResponse.next();
  }

  // Allow public routes
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check for access_token in cookies
  const token = request.cookies.get('access_token');

  // If no token and trying to access protected route, redirect to login
  if (!token) {
    console.log(`[Middleware] No token found, redirecting to login from ${pathname}`);
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname); // Save where user wanted to go
    return NextResponse.redirect(loginUrl);
  }

  // User is authenticated, allow access
  console.log(`[Middleware] Authenticated access to ${pathname}`);
  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, other static files
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

