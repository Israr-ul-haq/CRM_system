"use client"

import { Button } from "@/components/ui/button"
import { Icon, socialLoginConfig } from "@/lib/icon-utils"
import { cn } from "@/lib/utils"

interface SocialLoginProps {
  providers?: Array<"apple" | "google" | "meta" | "github" | "twitter" | "linkedin">
  onProviderClick?: (provider: string) => void
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "grid" | "stack"
}

export function SocialLogin({
  providers = ["apple", "google", "meta"],
  onProviderClick,
  className,
  size = "md",
  variant = "grid"
}: SocialLoginProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12"
  }

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20
  }

  const handleClick = (provider: string) => {
    onProviderClick?.(provider)
  }

  const buttons = providers.map((provider) => {
    const config = socialLoginConfig[provider]
    
    return (
      <Button
        key={provider}
        variant="outline"
        type="button"
        className={cn(
          sizeClasses[size],
          config.color,
          variant === "grid" ? "w-full" : "w-full mb-2"
        )}
        onClick={() => handleClick(provider)}
      >
        <Icon name={provider} size={iconSizes[size]} />
      </Button>
    )
  })

  return (
    <div className={cn(
      variant === "grid" ? "grid grid-cols-3 gap-4" : "flex flex-col",
      className
    )}>
      {buttons}
    </div>
  )
}

// Individual social login button component
interface SocialLoginButtonProps {
  provider: "apple" | "google" | "meta" | "github" | "twitter" | "linkedin"
  onClick?: () => void
  className?: string
  size?: "sm" | "md" | "lg"
  variant?: "outline" | "default"
}

export function SocialLoginButton({
  provider,
  onClick,
  className,
  size = "md",
  variant = "outline"
}: SocialLoginButtonProps) {
  const config = socialLoginConfig[provider]
  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20
  }

  return (
    <Button
      variant={variant}
      type="button"
      className={cn("w-full", config.color, className)}
      onClick={onClick}
    >
      <Icon name={provider} size={iconSizes[size]} />
    </Button>
  )
} 