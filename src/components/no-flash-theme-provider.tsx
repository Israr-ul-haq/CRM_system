"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes"

export function NoFlashThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      {...props}
      enableSystem={true}
      disableTransitionOnChange={true}
      attribute="class"
      defaultTheme="light"
    >
      {children}
    </NextThemesProvider>
  )
} 