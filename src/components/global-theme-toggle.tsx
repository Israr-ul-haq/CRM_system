"use client"

import * as React from "react"
import { IconMoon, IconSun, IconDeviceDesktop } from "@tabler/icons-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface GlobalThemeToggleProps {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  showLabel?: boolean
  className?: string
}

export function GlobalThemeToggle({ 
  variant = "outline", 
  size = "icon", 
  showLabel = false,
  className 
}: GlobalThemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent hydration mismatch by not rendering theme-dependent content until mounted
  if (!mounted) {
    return (
      <Button variant={variant} size={size} className={className}>
        <div className="h-[1.2rem] w-[1.2rem]" />
        {showLabel && <span className="ml-2">Theme</span>}
      </Button>
    )
  }

  const getThemeIcon = () => {
    switch (resolvedTheme) {
      case "dark":
        return <IconMoon className="h-[1.2rem] w-[1.2rem]" />
      case "light":
        return <IconSun className="h-[1.2rem] w-[1.2rem]" />
      default:
        return <IconDeviceDesktop className="h-[1.2rem] w-[1.2rem]" />
    }
  }

  const getThemeLabel = () => {
    switch (resolvedTheme) {
      case "dark":
        return "Dark Mode"
      case "light":
        return "Light Mode"
      default:
        return "System Theme"
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          {getThemeIcon()}
          {showLabel && <span className="ml-2">{getThemeLabel()}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <IconSun className="mr-2 h-4 w-4" />
          Light Mode
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <IconMoon className="mr-2 h-4 w-4" />
          Dark Mode
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <IconDeviceDesktop className="mr-2 h-4 w-4" />
          System Theme
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 