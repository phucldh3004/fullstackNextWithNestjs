import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import axios from 'axios'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const accessToken = cookieStore.get('access_token')

    if (!accessToken) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Validate token with backend by making a request to a protected endpoint
    try {
      await axios.get(`${BACKEND_URL}/users`, {
        headers: {
          Authorization: `Bearer ${accessToken.value}`
        }
      })
      return NextResponse.json({ authenticated: true })
    } catch (error) {
      // Token is invalid or expired
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      )
    }
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}