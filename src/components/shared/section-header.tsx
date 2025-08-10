import { IconProps } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  title: string
  description?: string
  icon?: React.ComponentType<IconProps>
  actions?: React.ReactNode
  className?: string
}

export function SectionHeader({ 
  title, 
  description, 
  icon: Icon, 
  actions, 
  className 
}: SectionHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between mb-6", className)}>
      <div className="flex items-center gap-3">
        {Icon && <Icon className="h-6 w-6 text-muted-foreground" />}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground mt-1">{description}</p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  )
} 