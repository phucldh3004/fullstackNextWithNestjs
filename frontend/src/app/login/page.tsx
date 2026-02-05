"use client"

import { useState, FormEvent, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import AuthLayout from "@/components/auth/AuthLayout"

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    const handleGoogleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      
      if (event.data.type === "GOOGLE_LOGIN_SUCCESS") {
         console.log("Google Login Success", event.data.accessToken)
         
         // ✅ Lưu token vào localStorage để check auth
         localStorage.setItem('access_token', event.data.accessToken)
         
         // ✅ Lưu vào cookie để server-side components có thể dùng
         document.cookie = `access_token=${event.data.accessToken}; path=/; max-age=86400`
         
         const searchParams = new URLSearchParams(window.location.search)
         const redirectTo = searchParams.get("redirect") || "/"
         console.log(redirectTo,'hihih')
         router.push(redirectTo)
         router.refresh()
      }
    }

    window.addEventListener("message", handleGoogleMessage)
    return () => window.removeEventListener("message", handleGoogleMessage)
  }, [router])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password
        }),
        credentials: "include"
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || "Đăng nhập thất bại")
      }

      const searchParams = new URLSearchParams(window.location.search)
      const redirectTo = searchParams.get("redirect") || "/"

      router.push(redirectTo)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      {/* Header */}
      <div className="text-center mb-8">
          <h2 className="text-3xl font-light text-stone-900 tracking-tight font-geist uppercase">Welcome back</h2>
          <p className="mt-2 text-sm text-stone-600 font-geist">Sign in to continue your creative journey</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <p className="text-red-700 text-sm font-geist">{error}</p>
          </div>
        </div>
      )}

      {/* Login Form */}
      <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
              {/* Email/Username Input */}
              <div className="">
                  <label htmlFor="username" className="block text-sm font-medium mb-2 text-stone-700 font-geist uppercase">Username or Email</label>
                  <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user w-5 h-5 text-gray-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      </div>
                      <input 
                        id="username" 
                        name="username" 
                        type="text" 
                        required 
                        className="custom-input block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm font-geist border-stone-300" 
                        placeholder="Enter your username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      />
                  </div>
              </div>

              {/* Password Input */}
              <div className="">
                  <label htmlFor="password" className="block text-sm font-medium mb-2 text-stone-700 font-geist uppercase">Password</label>
                  <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock w-5 h-5 text-gray-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                      </div>
                      <input 
                        id="password" 
                        name="password" 
                        type={showPassword ? "text" : "password"} 
                        required 
                        className="custom-input block w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm font-geist border-stone-300" 
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                      <button 
                        type="button" 
                        className="absolute inset-y-0 right-0 pr-3 flex items-center" 
                        onClick={() => setShowPassword(!showPassword)}
                      >
                          {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-off w-5 h-5 transition-colors text-gray-400 hover:text-gray-600"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye w-5 h-5 transition-colors text-gray-400 hover:text-gray-600"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>
                          )}
                      </button>
                  </div>
              </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
              <div className="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 focus:ring-orange-500 rounded text-orange-600 border-stone-300" />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-stone-700 font-geist">Remember me</label>
              </div>
              <div className="text-sm">
                  <a href="#" className="font-medium hover:text-orange-500 transition-colors text-orange-600 font-geist">
                      Forgot password?
                  </a>
              </div>
          </div>

          {/* Sign In Button */}
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
                        Signing in...
                    </span>
                  ) : (
                    <>
                      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right w-5 h-5 group-hover:text-indigo-200 transition-colors text-indigo-300"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                      </span>
                      Sign in to your account
                    </>
                  )}
              </button>
          </div>

          {/* Divider */}
          <div className="relative">
              <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                  <span className="px-2 text-stone-500 bg-white font-geist">Or continue with</span>
              </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
              <button 
                type="button" 
                onClick={() => {
                   const width = 500
                   const height = 600
                   const left = window.screen.width / 2 - width / 2
                   const top = window.screen.height / 2 - height / 2
                   
                   window.open(
                     "/api/auth/google", 
                     "google_login", 
                     `width=${width},height=${height},left=${left},top=${top}`
                   )
                }}
                className="w-full inline-flex justify-center py-2.5 px-4 border rounded-lg shadow-sm text-sm font-medium transition-all duration-200 font-geist border-stone-300 text-stone-700 bg-white hover:bg-stone-50"
              >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"></path>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"></path>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"></path>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"></path>
                  </svg>
                  <span className="ml-2 font-geist">Google</span>
              </button>
              <button type="button" className="w-full inline-flex justify-center py-2.5 px-4 border rounded-lg shadow-sm text-sm font-medium transition-all duration-200 font-geist border-stone-300 text-stone-700 bg-white hover:bg-stone-50">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github w-5 h-5"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
                  <span className="ml-2 font-geist">GitHub</span>
              </button>
          </div>
      </form>

          {/* Footer */}
          <div className="text-center mt-8">
              <p className="text-sm text-stone-600 font-geist">
                  Don't have an account? 
                  <Link href="/register" className="font-medium hover:text-orange-500 transition-colors text-orange-600 font-geist">
                      Sign up for free
                  </Link>
              </p>
          </div>
    </AuthLayout>
  )
}
