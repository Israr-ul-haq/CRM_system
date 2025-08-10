"use client"

import { useState, useEffect, ReactNode } from 'react'
import { LoadingSpinner } from './loading-spinner'

interface PageWrapperProps {
  children: ReactNode
  loadingText?: string
  loadingDelay?: number
  showLoading?: boolean
}

export function PageWrapper({ 
  children, 
  loadingText = "Loading page...", 
  loadingDelay = 300,
  showLoading = true 
}: PageWrapperProps) {
  const [isLoading, setIsLoading] = useState(showLoading)

  useEffect(() => {
    if (!showLoading) return

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, loadingDelay)

    return () => clearTimeout(timer)
  }, [loadingDelay, showLoading])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text={loadingText} />
      </div>
    )
  }

  return <>{children}</>
}

// Higher-order component for automatic page loading
export function withPageLoading<T extends object>(
  Component: React.ComponentType<T>,
  options: {
    loadingText?: string
    loadingDelay?: number
    showLoading?: boolean
  } = {}
) {
  return function WrappedComponent(props: T) {
    return (
      <PageWrapper {...options}>
        <Component {...props} />
      </PageWrapper>
    )
  }
} 