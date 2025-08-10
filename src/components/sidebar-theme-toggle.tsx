"use client"

import * as React from "react"
import { IconMoon, IconSun, IconDeviceDesktop } from "@tabler/icons-react"
import { useTheme } from "next-themes"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function SidebarThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent hydration mismatch by not rendering theme-dependent content until mounted
  if (!mounted) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="Theme" className="h-9 w-9">
            <div className="h-[1.2rem] w-[1.2rem]" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  const getThemeIcon = () => {
    switch (resolvedTheme) {
      case "dark":
        return <IconMoon className="h-4 w-4" />
      case "light":
        return <IconSun className="h-4 w-4" />
      default:
        return <IconDeviceDesktop className="h-4 w-4" />
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
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton tooltip="Theme">
              {getThemeIcon()}
              <span>{getThemeLabel()}</span>
            </SidebarMenuButton>
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
      </SidebarMenuItem>
    </SidebarMenu>
  )
} 