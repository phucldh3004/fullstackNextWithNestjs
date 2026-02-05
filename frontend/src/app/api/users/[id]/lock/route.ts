import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    console.log(`🔒 LOCK API HIT for ID: ${id}`)
    const cookies = request.cookies
    console.log('🍪 Cookies keys:', cookies.getAll().map(c => c.name))
    const token = cookies.get('access_token')?.value
    console.log('🔑 Token exists:', !!token)

    const response = await fetch(`${API_URL}/users/${id}/lock`, {
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
        { error: error?.response?.data?.message || 'Failed to lock user' }, 
        { status: error?.response?.status || 500 }
    )
  }
}
