import { useState, useEffect } from 'react'

interface UsePageLoadingOptions {
  delay?: number
  loadingText?: string
  showLoading?: boolean
}

export function usePageLoading(options: UsePageLoadingOptions = {}) {
  const {
    delay = 300,
    loadingText = "Loading...",
    showLoading = true
  } = options

  const [isLoading, setIsLoading] = useState(showLoading)

  useEffect(() => {
    if (!showLoading) return

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay, showLoading])

  const startLoading = () => setIsLoading(true)
  const stopLoading = () => setIsLoading(false)

  return {
    isLoading,
    startLoading,
    stopLoading,
    loadingText
  }
}

// Hook for automatic loading on mount
export function useAutoLoading(options: UsePageLoadingOptions = {}) {
  const {
    delay = 400,
    loadingText = "Loading page...",
    showLoading = true
  } = options

  const [isLoading, setIsLoading] = useState(showLoading)

  useEffect(() => {
    if (!showLoading) return

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay, showLoading])

  return {
    isLoading,
    loadingText
  }
}

// Hook for loading states during data fetching
export function useDataLoading<T>(data: T | null, options: UsePageLoadingOptions = {}) {
  const {
    delay = 200,
    loadingText = "Loading data...",
    showLoading = true
  } = options

  const [isLoading, setIsLoading] = useState(showLoading && !data)

  useEffect(() => {
    if (data) {
      setIsLoading(false)
      return
    }

    if (!showLoading) return

    const timer = setTimeout(() => {
      setIsLoading(false)
    }, delay)

    return () => clearTimeout(timer)
  }, [data, delay, showLoading])

  return {
    isLoading,
    loadingText
  }
} 