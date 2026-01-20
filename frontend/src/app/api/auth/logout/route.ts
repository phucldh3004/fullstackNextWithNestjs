import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Delete access_token cookie
    const cookieStore = await cookies();
    // Ensure deletion matches cookie options used when setting it (path, etc.)
    cookieStore.delete('access_token');
    cookieStore.delete({ name: 'access_token', path: '/' });
    cookieStore.set({
      name: 'access_token',
      value: '',
      path: '/',
      maxAge: 0,
    });

    return NextResponse.json({ 
      success: true,
      message: 'Logged out successfully',
    });

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'Logout failed' },
      { status: 500 }
    );
  }
}

