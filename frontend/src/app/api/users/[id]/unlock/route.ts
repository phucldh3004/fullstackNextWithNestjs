import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  console.log('request', request)
  try {
    const { id } = await params
    console.log(`🔓 UNLOCK API HIT for ID: ${id}`)
    const cookies = request.cookies
    console.log('🍪 Cookies keys:', cookies.getAll().map(c => c.name))
    const token = cookies.get('access_token')?.value
    console.log('🔑 Token exists:', !!token)
    
    // Check if token exists before making request
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 })
    }

    const response = await fetch(`${API_URL}/users/${id}/unlock`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (!response.ok) {
        return NextResponse.json(data, { status: response.status })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json(
        { error: error?.response?.data?.message || 'Failed to unlock user' }, 
        { status: error?.response?.status || 500 }
    )
  }
}
