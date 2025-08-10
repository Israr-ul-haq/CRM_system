"use client"

import { useState, useEffect } from 'react'
import { LoadingSpinner } from './loading-spinner'

interface PageLoadingProps {
  delay?: number
  text?: string
  children: React.ReactNode
}

export function PageLoading({ delay = 200, text = "Loading page...", children }: PageLoadingProps) {
  const [showLoading, setShowLoading] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  if (showLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text={text} />
      </div>
    )
  }

  return <>{children}</>
}

export function SkeletonLoader() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-muted rounded w-1/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded w-full"></div>
        <div className="h-4 bg-muted rounded w-5/6"></div>
        <div className="h-4 bg-muted rounded w-4/6"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-32 bg-muted rounded"></div>
        <div className="h-32 bg-muted rounded"></div>
        <div className="h-32 bg-muted rounded"></div>
      </div>
    </div>
  )
}

export function TableSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-10 bg-muted rounded w-1/3"></div>
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 bg-muted rounded"></div>
        ))}
      </div>
    </div>
  )
} 