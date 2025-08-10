"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

interface AuthGuardProps {
  children: React.ReactNode
  requiredUserType?: 'staff' | 'regular' | 'owner'
}

export function AuthGuard({ children, requiredUserType }: AuthGuardProps) {
  const { isAuthenticated, userType } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    // If a specific user type is required, check if user has access
    if (requiredUserType && userType !== requiredUserType) {
      // Redirect based on user type
      switch (userType) {
        case 'owner':
          router.push('/owner')
          break
        case 'staff':
          router.push('/staff-checkin')
          break
        case 'regular':
          router.push('/dashboard')
          break
        default:
          router.push('/login')
      }
      return
    }
  }, [isAuthenticated, userType, requiredUserType, router])

  // Show loading or nothing while checking authentication
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // If user type is required and doesn't match, show loading
  if (requiredUserType && userType !== requiredUserType) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Redirecting...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
} 