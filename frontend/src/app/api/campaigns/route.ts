import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import axios from 'axios'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_token')?.value

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const response = await axios.get(`${BACKEND_URL}/marketing/campaigns`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('Campaigns API error:', error)
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to fetch campaigns' },
      { status: error.response?.status || 500 }
    )
  }
}