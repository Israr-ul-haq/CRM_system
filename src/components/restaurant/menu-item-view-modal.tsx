"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { IconChefHat, IconClock, IconCheck, IconX } from "@tabler/icons-react"

interface MenuItem {
  id?: string
  name: string
  category: string
  price: number
  cost: number
  description: string
  isAvailable: boolean
  preparationTime: number
  image?: string
}

interface MenuItemViewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: MenuItem | null
}

export default function MenuItemViewModal({ open, onOpenChange, item }: MenuItemViewModalProps) {
  if (!item) return null

  const profitMargin = ((item.price - item.cost) / item.price) * 100

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconChefHat className="h-5 w-5" />
            Menu Item Details: {item.name}
          </DialogTitle>
          <DialogDescription>
            View detailed information about this menu item
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Item Image */}
          {item.image && (
            <div className="flex justify-center">
              <img 
                src={item.image} 
                alt={item.name} 
                className="w-48 h-48 object-cover rounded-lg border"
              />
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Item Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">Item Name</h4>
                <p className="text-lg font-medium">{item.name}</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">Category</h4>
                <Badge variant="outline">{item.category}</Badge>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">Description</h4>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          </div>

          {/* Pricing Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Pricing & Cost</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Selling Price</div>
                <div className="text-2xl font-bold text-green-600">${item.price.toFixed(2)}</div>
              </div>
              
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Cost Price</div>
                <div className="text-2xl font-bold text-red-600">${item.cost.toFixed(2)}</div>
              </div>
              
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Profit</div>
                <div className="text-2xl font-bold text-blue-600">${(item.price - item.cost).toFixed(2)}</div>
              </div>
            </div>

            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-center">
                <div className="text-sm text-green-800">Profit Margin</div>
                <div className="text-xl font-bold text-green-600">{profitMargin.toFixed(1)}%</div>
              </div>
            </div>
          </div>

          {/* Preparation & Availability */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Preparation & Availability</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">Preparation Time</h4>
                <div className="flex items-center gap-2">
                  <IconClock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-lg font-medium">{item.preparationTime} minutes</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">Availability Status</h4>
                <div className="flex items-center gap-2">
                  {item.isAvailable ? (
                    <IconCheck className="h-4 w-4 text-green-600" />
                  ) : (
                    <IconX className="h-4 w-4 text-red-600" />
                  )}
                  <Badge variant={item.isAvailable ? "default" : "destructive"}>
                    {item.isAvailable ? "Available" : "Unavailable"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Additional Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">Item ID</h4>
                <p className="font-mono text-sm">{item.id}</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">Category Type</h4>
                <Badge variant="secondary">{item.category}</Badge>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 