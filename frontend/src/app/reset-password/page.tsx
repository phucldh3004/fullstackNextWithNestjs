"use client"

import { useState, FormEvent, Suspense, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import AuthLayout from "@/components/auth/AuthLayout"

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get("email") || ""
  const token = searchParams.get("token") || ""

  const [isValidating, setIsValidating] = useState(true)
  const [isTokenValid, setIsTokenValid] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!email || !token) {
      router.push("/forgot-password")
      return;
    }

    const verifyToken = async () => {
      try {
        const res = await fetch(`/api/auth/verify-reset-token?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`)
        if (!res.ok) {
           const data = await res.json().catch(() => ({}))
           setError(data.message || "Invalid or expired reset link. Please request a new one.")
        } else {
           setIsTokenValid(true)
        }
      } catch (err) {
         setError("An error occurred while validating the link.")
      } finally {
        setIsValidating(false)
      }
    }

    verifyToken()
  }, [email, token, router])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    if (!token || !email) {
      setError("Invalid or missing reset token. Please request a new link.")
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, newPassword }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || "Failed to reset password. The link might be expired.")
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
          <h2 className="text-3xl font-light text-stone-900 tracking-tight font-geist uppercase">Set new password</h2>
          <p className="mt-2 text-sm text-stone-600 font-geist">Please enter your new password below</p>
      </div>

      {isValidating && (
        <div className="flex flex-col items-center justify-center space-y-4 py-8">
          <svg className="animate-spin h-8 w-8 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-stone-600 font-geist text-sm">Validating reset link...</p>
        </div>
      )}

      {success && !isValidating && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-green-700 text-sm font-geist">Password reset successfully! Redirecting to login...</p>
          </div>
        </div>
      )}

      {error && !success && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-700 text-sm font-geist">{error}</p>
          </div>
        </div>
      )}

      {!success && !isValidating && isTokenValid && (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
                <div className="">
                    <label htmlFor="newPassword" className="block text-sm font-medium mb-2 text-stone-700 font-geist uppercase">New Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock w-5 h-5 text-gray-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        </div>
                        <input 
                          id="newPassword" 
                          name="newPassword" 
                          type="password" 
                          required 
                          className="custom-input block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm font-geist border-stone-300" 
                          placeholder="Enter new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                </div>

                <div className="">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2 text-stone-700 font-geist uppercase">Confirm Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock w-5 h-5 text-gray-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        </div>
                        <input 
                          id="confirmPassword" 
                          name="confirmPassword" 
                          type="password" 
                          required 
                          className="custom-input block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm font-geist border-stone-300" 
                          placeholder="Confirm new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="">
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="login-btn group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 text-white font-geist disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                      <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Resetting...
                      </span>
                    ) : (
                      "Reset Password"
                    )}
                </button>
            </div>
        </form>
      )}

      <div className="text-center mt-8">
          <p className="text-sm text-stone-600 font-geist">
              Remember your password?{" "}
              <Link href="/login" className="font-medium hover:text-orange-500 transition-colors text-orange-600 font-geist">
                  Back to login
              </Link>
          </p>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthLayout>
  )
}
