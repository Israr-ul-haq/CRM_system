import { LucideProps } from "lucide-react"
import { Icons, IconName } from "@/components/ui/icons"

interface IconProps extends Omit<LucideProps, "ref"> {
  name: IconName
  size?: number
  className?: string
}

export function Icon({ name, size = 24, className = "", ...props }: IconProps) {
  const IconComponent = Icons[name]
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`)
    return null
  }

  return (
    <IconComponent
      size={size}
      className={className}
      {...props}
    />
  )
}

// Utility function for social login buttons
export function SocialLoginButton({ 
  provider, 
  onClick, 
  className = "",
  size = 24,
  ...props 
}: {
  provider: "apple" | "google" | "meta" | "github" | "twitter" | "linkedin"
  onClick?: () => void
  className?: string
  size?: number
} & Omit<LucideProps, "ref">) {
  const IconComponent = Icons[provider]
  
  if (!IconComponent) {
    console.warn(`Social provider "${provider}" not found`)
    return null
  }

  return (
    <IconComponent
      size={size}
      className={className}
      onClick={onClick}
      {...props}
    />
  )
}

// Predefined social login configurations
export const socialLoginConfig = {
  apple: {
    name: "apple" as const,
    label: "Login with Apple",
    color: "hover:bg-gray-100 dark:hover:bg-gray-800",
  },
  google: {
    name: "google" as const,
    label: "Login with Google",
    color: "hover:bg-red-50 dark:hover:bg-red-900/20",
  },
  meta: {
    name: "meta" as const,
    label: "Login with Meta",
    color: "hover:bg-blue-50 dark:hover:bg-blue-900/20",
  },
  github: {
    name: "github" as const,
    label: "Login with GitHub",
    color: "hover:bg-gray-100 dark:hover:bg-gray-800",
  },
  twitter: {
    name: "twitter" as const,
    label: "Login with Twitter",
    color: "hover:bg-blue-50 dark:hover:bg-blue-900/20",
  },
  linkedin: {
    name: "linkedin" as const,
    label: "Login with LinkedIn",
    color: "hover:bg-blue-50 dark:hover:bg-blue-900/20",
  },
} as const 