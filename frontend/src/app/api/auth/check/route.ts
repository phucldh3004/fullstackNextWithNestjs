import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Check if user is authenticated
 * Used by client-side to verify auth status
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token');

    if (!token) {
      return NextResponse.json(
        { authenticated: false },
        { status: 401 }
      );
    }

    // Optionally: Verify token with backend
    // const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    // const response = await fetch(`${BACKEND_URL}/auth/profile`, {
    //   headers: {
    //     'Authorization': `Bearer ${token.value}`,
    //   },
    // });
    // 
    // if (!response.ok) {
    //   return NextResponse.json(
    //     { authenticated: false },
    //     { status: 401 }
    //   );
    // }

    return NextResponse.json({ authenticated: true });

  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { authenticated: false },
      { status: 500 }
    );
  }
}

