"use client"

import { forwardRef } from "react"
import { IconSearch, IconBarcode } from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface BillingSearchProps {
  value: string
  onChange: (value: string) => void
  onSearch: (value: string) => void
}

export const BillingSearch = forwardRef<HTMLInputElement, BillingSearchProps>(
  ({ value, onChange, onSearch }, ref) => {
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      if (value.trim()) {
        onSearch(value.trim())
      }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Only update the input value, don't trigger search
      onChange(e.target.value)
    }

    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <IconBarcode className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            ref={ref}
            placeholder="Scan barcode or search product name/SKU... (Press Enter to search)"
            value={value}
            onChange={handleInputChange}
            className="pl-9 pr-20"
            autoComplete="off"
          />
          <Button 
            type="submit" 
            size="sm" 
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-2"
            disabled={!value.trim()}
          >
            <IconSearch className="h-3 w-3" />
          </Button>
        </div>
      </form>
    )
  }
)

BillingSearch.displayName = "BillingSearch" 