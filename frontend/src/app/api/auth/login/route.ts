import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import axios from '@/lib/axios';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;
    // Call backend API
    const response = await axios.post(`${BACKEND_URL}/auth/login`, {
      username,
      password,
    });

    const { access_token } = response.data;

    console.log('hihihihihih')

    // Set access_token in HTTP-only cookie (secure)
    const cookieStore = await cookies();
    cookieStore.set('access_token', access_token, {
      httpOnly: true,      // Cannot be accessed via JavaScript
      secure: process.env.NODE_ENV === 'production', // Only HTTPS in production
      sameSite: 'lax',     // CSRF protection
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return NextResponse.json({ 
      success: true,
      message: 'Login successful',
    });
  } catch (error: any) {
    if (error.response) {
      return NextResponse.json(
        { message: error.response.data?.message || 'Login failed' },
        { status: error.response.status }
      );
    }
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

