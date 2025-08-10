"use client"

import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface RouteGuardProps {
  children: React.ReactNode
  allowedUserTypes?: ('staff' | 'regular' | 'owner' | 'softwareProvider')[]
  redirectTo?: string
}

export function RouteGuard({ 
  children, 
  allowedUserTypes = ['staff', 'regular', 'owner', 'softwareProvider'], 
  redirectTo = '/login' 
}: RouteGuardProps) {
  const { userType, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(redirectTo)
      return
    }

    if (userType && !allowedUserTypes.includes(userType)) {
      // Redirect based on user type
      if (userType === 'owner') {
        router.push('/owner')
      } else if (userType === 'softwareProvider') {
        router.push('/provider')
      } else {
        router.push('/dashboard')
      }
      return
    }
  }, [isAuthenticated, userType, allowedUserTypes, redirectTo, router])

  // Show loading or nothing while checking authentication
  if (!isAuthenticated || (userType && !allowedUserTypes.includes(userType))) {
    return null
  }

  return <>{children}</>
} 