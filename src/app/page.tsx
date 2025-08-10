"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function HomePage() {
  const { isAuthenticated, userType } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect unauthenticated users to login
      router.push('/login')
      return
    }

    // Redirect authenticated users based on their type
    switch (userType) {
      case 'owner':
        router.push('/owner')
        break
      case 'staff':
        router.push('/staff-checkin')
        break
      case 'regular':
      default:
        router.push('/dashboard')
        break
    }
  }, [isAuthenticated, userType, router])

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-lg">Redirecting...</p>
      </div>
    </div>
  )
}
