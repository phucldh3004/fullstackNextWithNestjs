import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Clear the access_token cookie
    const response = NextResponse.json({ message: 'Logged out successfully' })

    response.cookies.set('access_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    })

    return response
  } catch {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}