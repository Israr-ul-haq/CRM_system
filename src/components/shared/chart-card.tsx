"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IconProps } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface ChartCardProps {
  title: string
  description?: string
  icon?: React.ComponentType<IconProps>
  children: React.ReactNode
  className?: string
  actions?: React.ReactNode
}

export function ChartCard({ 
  title, 
  description, 
  icon: Icon, 
  children, 
  className,
  actions
}: ChartCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
            <div>
              <CardTitle className="text-lg">{title}</CardTitle>
              {description && (
                <p className="text-sm text-muted-foreground mt-1">{description}</p>
              )}
            </div>
          </div>
          {actions && (
            <div className="flex items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
} 