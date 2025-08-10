import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, Plus } from "lucide-react"

export function DocumentTabs() {
  return (
    <div className="flex items-center justify-between border-t bg-background px-4 py-2">
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="bg-primary text-primary-foreground">
          Outline
        </Button>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          Past Performance
          <Badge variant="secondary" className="ml-1">3</Badge>
        </Button>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          Key Personnel
          <Badge variant="secondary" className="ml-1">2</Badge>
        </Button>
        <Button variant="ghost" size="sm">
          Focus Documents
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          Customize Columns
          <ChevronDown className="h-3 w-3" />
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Plus className="h-3 w-3" />
          Add Section
        </Button>
      </div>
    </div>
  )
} 