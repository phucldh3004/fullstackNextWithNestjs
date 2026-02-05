"use client"

import { useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"

function GoogleCallbackContent() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const accessToken = searchParams.get("accessToken")

    if (accessToken) {
      // Send message to parent window
      window.opener.postMessage(
        { type: "GOOGLE_LOGIN_SUCCESS", accessToken },
        window.location.origin
      )
      // Close popup
      window.close()
    } else {
        // Handle error casing
        console.error("No access token found")
        window.close()
    }
  }, [searchParams])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Authenticating...</h2>
        <p className="text-gray-600">Please wait while we log you in.</p>
      </div>
    </div>
  )
}

export default function GoogleCallbackPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <GoogleCallbackContent />
        </Suspense>
    )
}
