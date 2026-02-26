import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import axios from 'axios'

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function GET(request: NextRequest) {
  try {
    const cookies = request.cookies
    const token = cookies.get('access_token')?.value
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const response = await axios.get(`${BACKEND_URL}/customers`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    return NextResponse.json(response.data)
  } catch (error: any) {
    console.error('Customers API error:', error)
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to fetch customers' },
      { status: error.response?.status || 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookies = request.cookies
    const token = cookies.get('access_token')?.value
    console.log("POST /api/customers token:", token ? token.substring(0, 15) + "..." : null)
    
    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const response = await axios.post(`${BACKEND_URL}/customers`, body, {
      headers: { Authorization: `Bearer ${token}` }
    })

    return NextResponse.json(response.data, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data?.message || 'Failed to create customer' },
      { status: error.response?.status || 500 }
    )
  }
}