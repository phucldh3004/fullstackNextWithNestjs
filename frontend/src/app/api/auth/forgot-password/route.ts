import { NextResponse } from "next/server";
import { Resend } from "resend";

// NOTE: Ensure to replace 're_xxxxxxxxx' with your actual Resend API Key,
// or ideally set it via process.env.RESEND_API_KEY
const resend = new Resend(process.env.RESEND_API_KEY || "re_xxxxxxxxx");

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Call backend API to generate reset token
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    
    // Call backend to generate token
    const backendRes = await fetch(`${apiUrl}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!backendRes.ok) {
      const errorData = await backendRes.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData.message || "Failed to initiate password reset" },
        { status: backendRes.status }
      );
    }

    const { token } = await backendRes.json();

    const baseUrl = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";
    
    // Build reset link with token and email
    const resetLink = `${baseUrl}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email, // Sending to the requested email (make sure domain is verified on Resend)
      subject: "Password Reset Request",
      html: `
        <h2>Password Reset</h2>
        <p>You recently requested to reset your password.</p>
        <p>Click the link below to reset it. This link will expire in 15 minutes.</p>
        <a href="${resetLink}">Reset Password</a>
        <br/><br/>
        <p>If you did not request a password reset, please ignore this email.</p>
      `,
    });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Reset link sent successfully", data },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
