"use client"

import { useAutoLoading } from '@/hooks/use-page-loading'
import { LoadingSpinner } from './loading-spinner'

interface GlobalLoadingProps {
  children: React.ReactNode
  loadingText?: string
  loadingDelay?: number
  showLoading?: boolean
  className?: string
}

export function GlobalLoading({
  children,
  loadingText = "Loading page...",
  loadingDelay = 400,
  showLoading = true,
  className = ""
}: GlobalLoadingProps) {
  const { isLoading } = useAutoLoading({
    delay: loadingDelay,
    loadingText,
    showLoading
  })

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-[400px] ${className}`}>
        <LoadingSpinner size="lg" text={loadingText} />
      </div>
    )
  }

  return <>{children}</>
}

// Simple wrapper for quick page loading
export function withLoading<T extends object>(
  Component: React.ComponentType<T>,
  options: {
    loadingText?: string
    loadingDelay?: number
    showLoading?: boolean
  } = {}
) {
  return function WrappedComponent(props: T) {
    return (
      <GlobalLoading {...options}>
        <Component {...props} />
      </GlobalLoading>
    )
  }
}

// Inline loading component for specific sections
export function InlineLoading({
  loadingText = "Loading...",
  className = ""
}: {
  loadingText?: string
  className?: string
}) {
  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <LoadingSpinner size="md" text={loadingText} />
    </div>
  )
} 