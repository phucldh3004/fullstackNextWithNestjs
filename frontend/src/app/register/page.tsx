"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import axios from "@/lib/axios"
import AuthLayout from "@/components/auth/AuthLayout"

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    image: ""
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showOptionalFields, setShowOptionalFields] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp")
      setIsLoading(false)
      return
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự")
      setIsLoading(false)
      return
    }

    try {
      const requestBody: Record<string, string> = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      }

      // Only add optional fields if they have values
      if (formData.phone) requestBody.phone = formData.phone
      if (formData.address) requestBody.address = formData.address
      if (formData.image) requestBody.image = formData.image

      const response = await axios.post("/auth/register", requestBody)
      
      if (response?.data) {
        setSuccess(true)
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else {
        setError(response.data.message)
        throw new Error(response.data.message || "Đăng ký thất bại")
      }
    } catch (err: unknown) {
      // Extract error message from response
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as { response?: { data?: { message?: string } } }
        if (axiosError.response?.data?.message) {
          setError(axiosError.response.data.message)
          return
        }
      }

      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Có lỗi xảy ra")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
        {/* Header */}
        <div className="text-center mb-8">
            <h2 className="text-3xl font-light text-stone-900 tracking-tight font-geist uppercase">Join PixelForge</h2>
            <p className="mt-2 text-sm text-stone-600 font-geist">Start your creative journey today</p>
        </div>

        {/* Success Message */}
        {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-green-700 text-sm font-geist">Success! Redirecting to login...</p>
            </div>
        </div>
        )}

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

        {/* Register Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium mb-1 text-stone-700 font-geist uppercase">Full Name</label>
                    <input 
                        type="text" 
                        required 
                        className="custom-input block w-full px-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm font-geist border-stone-300"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                 {/* Email */}
                 <div>
                    <label className="block text-sm font-medium mb-1 text-stone-700 font-geist uppercase">Email Address</label>
                    <input 
                        type="email" 
                        required 
                        className="custom-input block w-full px-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm font-geist border-stone-300"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {/* Password */}
                <div className="relative">
                    <label className="block text-sm font-medium mb-1 text-stone-700 font-geist uppercase">Password</label>
                    <input 
                        type={showPassword ? "text" : "password"}
                        required 
                        className="custom-input block w-full px-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm font-geist border-stone-300"
                        placeholder="••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                     <button 
                        type="button" 
                        className="absolute right-2 top-8 text-gray-400" 
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye-off"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-eye"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        )}
                    </button>
                </div>
                 {/* Confirm Password */}
                 <div>
                    <label className="block text-sm font-medium mb-1 text-stone-700 font-geist uppercase">Confirm</label>
                    <input 
                        type="password" 
                        required 
                        className="custom-input block w-full px-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm font-geist border-stone-300"
                        placeholder="••••••"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    />
                </div>
            </div>

             {/* Optional Fields Toggle */}
             <button
                type="button"
                onClick={() => setShowOptionalFields(!showOptionalFields)}
                className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1"
            >
                <svg
                    className={`w-3 h-3 transition-transform ${showOptionalFields ? "rotate-90" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                {showOptionalFields ? "Hide Optional Details" : "Add Optional Details"}
            </button>

            {/* Optional Fields */}
            {showOptionalFields && (
                <div className="space-y-4 pt-2 border-t border-stone-100 animate-fadeIn">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <label className="block text-sm font-medium mb-1 text-stone-700 font-geist uppercase">Phone</label>
                             <input 
                                type="tel" 
                                className="custom-input block w-full px-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm font-geist border-stone-300"
                                placeholder="+1 234 567 890"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                             />
                        </div>
                         <div>
                             <label className="block text-sm font-medium mb-1 text-stone-700 font-geist uppercase">Avatar URL</label>
                             <input 
                                type="url" 
                                className="custom-input block w-full px-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm font-geist border-stone-300"
                                placeholder="https://..."
                                value={formData.image}
                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                             />
                        </div>
                    </div>
                     <div>
                             <label className="block text-sm font-medium mb-1 text-stone-700 font-geist uppercase">Address</label>
                             <textarea 
                                rows={2}
                                className="custom-input block w-full px-3 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 text-sm font-geist border-stone-300 resize-none"
                                placeholder="123 Creative Street..."
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                             />
                        </div>
                </div>
            )}

            {/* Submit Button */}
            <div className="pt-2">
                <button 
                type="submit" 
                disabled={isLoading || success}
                className="login-btn group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 text-white font-geist disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                    <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Account...
                    </span>
                    ) : success ? (
                    "Account Created!"
                    ) : (
                    <>
                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right w-5 h-5 group-hover:text-indigo-200 transition-colors text-indigo-300"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
                        </span>
                        Create Account
                    </>
                    )}
                </button>
            </div>

            {/* Footer */}
            <div className="text-center mt-6">
                <p className="text-sm text-stone-600 font-geist">
                    Already have an account? 
                    <Link href="/login" className="font-medium hover:text-orange-500 transition-colors text-orange-600 font-geist">
                         Sign in
                    </Link>
                </p>
            </div>
        </form>
    </AuthLayout>
  )
}
