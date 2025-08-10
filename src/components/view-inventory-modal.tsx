"use client"

import { IconEye, IconPackage, IconCurrencyDollar, IconBuilding, IconMapPin, IconCalendar } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface InventoryItem {
  id: number
  name: string
  sku: string
  category: string
  price: number
  cost: number
  stock: number
  minStock: number
  status: string
  supplier: string
  location: string
  lastUpdated: string
}

interface ViewInventoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item?: InventoryItem
}

export function ViewInventoryModal({ open, onOpenChange, item }: ViewInventoryModalProps) {
  if (!item) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
      case 'discontinued':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    }
  }

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock === 0) return { status: 'Out of Stock', color: 'text-red-600' }
    if (stock <= minStock) return { status: 'Low Stock', color: 'text-orange-600' }
    return { status: 'In Stock', color: 'text-green-600' }
  }

  const stockInfo = getStockStatus(item.stock, item.minStock)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconEye className="h-5 w-5" />
            View Inventory Item
          </DialogTitle>
          <DialogDescription>
            Detailed information for {item.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
              </div>
              <Badge className={getStatusColor(item.status)}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <IconPackage className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Category</p>
                  <p className="text-sm text-muted-foreground capitalize">{item.category}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <IconCalendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-sm text-muted-foreground">{formatDate(item.lastUpdated)}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Financial Information */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <IconCurrencyDollar className="h-4 w-4" />
              Financial Details
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Selling Price</p>
                <p className="text-lg font-semibold text-green-600">${item.price.toFixed(2)}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Cost Price</p>
                <p className="text-lg font-semibold text-blue-600">${item.cost.toFixed(2)}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Profit Margin</p>
                <p className="text-lg font-semibold text-purple-600">
                  ${(item.price - item.cost).toFixed(2)} (${(((item.price - item.cost) / item.price) * 100).toFixed(1)}%)
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Stock Information */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <IconPackage className="h-4 w-4" />
              Stock Information
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Current Stock</p>
                <p className={`text-lg font-semibold ${stockInfo.color}`}>
                  {item.stock} units
                </p>
                <p className="text-sm text-muted-foreground">{stockInfo.status}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Minimum Stock</p>
                <p className="text-lg font-semibold">{item.minStock} units</p>
                <p className="text-sm text-muted-foreground">Reorder threshold</p>
              </div>
            </div>

            {/* Stock Level Indicator */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Stock Level</span>
                <span>{item.stock} / {Math.max(item.stock, item.minStock * 2)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                <div 
                  className={`h-2 rounded-full ${
                    item.stock === 0 ? 'bg-red-500' :
                    item.stock <= item.minStock ? 'bg-orange-500' : 'bg-green-500'
                  }`}
                  style={{ 
                    width: `${Math.min(100, (item.stock / Math.max(item.stock, item.minStock * 2)) * 100)}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Supplier & Location */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <IconBuilding className="h-4 w-4" />
              Supplier & Location
            </h4>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-2">
                <IconBuilding className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Supplier</p>
                  <p className="text-sm text-muted-foreground">{item.supplier}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <IconMapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Storage Location</p>
                  <p className="text-sm text-muted-foreground">{item.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 