"use client"

import { useState, FormEvent } from "react"
import Link from "next/link"
import AuthLayout from "@/components/auth/AuthLayout"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || "Something went wrong. Please try again.")
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      {/* Header */}
      <div className="text-center mb-8">
          <h2 className="text-3xl font-light text-stone-900 tracking-tight font-geist uppercase">Forgot Password</h2>
          <p className="mt-2 text-sm text-stone-600 font-geist">Enter your email and we'll send you a reset link</p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-green-700 text-sm font-geist">Reset link sent! Please check your email.</p>
          </div>
        </div>
      )}

      {/* Error Message */}
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

      {/* Reset Form */}
      {!success && (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
                {/* Email Input */}
                <div className="">
                    <label htmlFor="email" className="block text-sm font-medium mb-2 text-stone-700 font-geist uppercase">Email Address</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mail w-5 h-5 text-gray-400"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                        </div>
                        <input 
                          id="email" 
                          name="email" 
                          type="email" 
                          required 
                          className="custom-input block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm font-geist border-stone-300" 
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Submit Button */}
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
                          Sending...
                      </span>
                    ) : (
                      <>
                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send w-5 h-5 group-hover:text-indigo-200 transition-colors text-indigo-300"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
                        </span>
                        Send Email
                      </>
                    )}
                </button>
            </div>
        </form>
      )}

      {/* Connect to Login */}
      <div className="text-center mt-8">
          <p className="text-sm text-stone-600 font-geist">
              Remember your password?{" "}
              <Link href="/login" className="font-medium hover:text-orange-500 transition-colors text-orange-600 font-geist">
                  Back to login
              </Link>
          </p>
      </div>
    </AuthLayout>
  )
}
