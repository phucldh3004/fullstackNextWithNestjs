import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const token = searchParams.get("token");

  if (!email || !token) {
    return NextResponse.json({ message: "Missing required parameters" }, { status: 400 });
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  
  try {
    const backendRes = await fetch(`${apiUrl}/auth/verify-reset-token?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!backendRes.ok) {
        const errorData = await backendRes.json().catch(() => ({}));
        return NextResponse.json(
          { message: errorData.message || "Invalid or expired token" },
          { status: backendRes.status }
        );
    }

    const data = await backendRes.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
