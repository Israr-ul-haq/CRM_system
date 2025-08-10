"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { PageLoader } from '@/components/loading-spinner'

interface NavigationContextType {
  isLoading: boolean
  setIsLoading: (loading: boolean) => void
  startNavigation: () => void
  endNavigation: () => void
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined)

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  // Show loading when pathname changes
  useEffect(() => {
    if (isNavigating) {
      setIsLoading(true)
      
      // Hide loading after a short delay to ensure smooth transition
      const timer = setTimeout(() => {
        setIsLoading(false)
        setIsNavigating(false)
      }, 500)

      return () => clearTimeout(timer)
    }
  }, [pathname, isNavigating])

  // Intercept navigation events
  useEffect(() => {
    const handleStart = () => setIsNavigating(true)
    const handleComplete = () => setIsNavigating(false)

    // Listen for navigation start
    window.addEventListener('beforeunload', handleStart)
    
    // Listen for navigation complete
    window.addEventListener('load', handleComplete)

    return () => {
      window.removeEventListener('beforeunload', handleStart)
      window.removeEventListener('load', handleComplete)
    }
  }, [])

  const startNavigation = () => {
    setIsNavigating(true)
    setIsLoading(true)
  }

  const endNavigation = () => {
    setIsLoading(false)
    setIsNavigating(false)
  }

  return (
    <NavigationContext.Provider value={{ 
      isLoading, 
      setIsLoading, 
      startNavigation, 
      endNavigation 
    }}>
      {children}
      {isLoading && <PageLoader />}
    </NavigationContext.Provider>
  )
}

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
} 