import { NextRequest, NextResponse } from "next/server"

export const allowedOrigins = [
  "https://fullstack-next-with-nestjs.vercel.app/",
  "https://fullstacknextwithnestjs.onrender.com/",
  "http://localhost:3000",
  "http://localhost:3001"
]

export const corsOptions = {
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
}

export function proxy(request: NextRequest) {
  // Check the origin from the request
  const origin = request.headers.get("origin") ?? ""
  const isAllowedOrigin = allowedOrigins.includes(origin)
  console.log("origin 22222", origin, request)

  const token = request.cookies.get("access_token")?.value

  const { pathname } = request.nextUrl

  if (!token && !pathname.startsWith("/login")) {
    // Chuyển hướng về trang login
    const loginUrl = new URL("/login", request.url)
    return NextResponse.redirect(loginUrl)
  }
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url))
  }
  // Handle preflighted requests
  const isPreflight = request.method === "OPTIONS"

  if (isPreflight) {
    const preflightHeaders = {
      ...(isAllowedOrigin && { "Access-Control-Allow-Origin": origin }),
      ...corsOptions
    }
    return NextResponse.json({}, { headers: preflightHeaders })
  }

  // Handle simple requests
  const response = NextResponse.next()

  if (isAllowedOrigin) {
    response.headers.set("Access-Control-Allow-Origin", origin)
  }

  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}
