import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import axios from "axios"

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Call backend API
    const response = await axios.post(`${BACKEND_URL}/auth/register`, body)
    const data = response.data

    // Auto-login after registration
    // Call login to get access token
    try {
      const loginResponse = await axios.post(`${BACKEND_URL}/auth/login`, {
        username: body.email,
        password: body.password
      })
      const { access_token } = loginResponse.data

      // Set access_token in HTTP-only cookie
      const cookieStore = await cookies()
      cookieStore.set("access_token", access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/"
      })
    } catch (loginError) {
      // Login failed but registration succeeded
      console.error("Auto-login error:", loginError)
    }

    return NextResponse.json({
      success: true,
      message: "Registration successful",
      user: data.user
    })
  } catch (error: unknown) {
    console.error("Registration error:", error)
    console.log(error, "errorororo")
    // Handle backend API errors
    if (axios.isAxiosError(error) && error.response?.data) {
      const { status, data } = error.response

      return NextResponse.json(data, { status })
    }

    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

