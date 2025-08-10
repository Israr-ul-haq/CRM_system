"use client"

import { IconEye, IconBuilding, IconMail, IconPhone, IconMapPin, IconCalendar, IconCurrencyDollar, IconPackage } from "@tabler/icons-react"
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

interface Supplier {
  id: number
  name: string
  email: string
  phone: string
  address: string
  contactPerson: string
  category: string
  status: string
  lastContact: string
  totalOrders: number
  totalSpent: number
  notes: string
}

interface ViewSupplierModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplier?: Supplier
}

export function ViewSupplierModal({ open, onOpenChange, supplier }: ViewSupplierModalProps) {
  if (!supplier) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconEye className="h-5 w-5" />
            View Supplier Details
          </DialogTitle>
          <DialogDescription>
            Detailed information for {supplier.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{supplier.name}</h3>
                <p className="text-sm text-muted-foreground">Contact: {supplier.contactPerson}</p>
              </div>
              <Badge className={getStatusColor(supplier.status)}>
                {supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <IconPackage className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Category</p>
                  <p className="text-sm text-muted-foreground capitalize">{supplier.category}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <IconCalendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Last Contact</p>
                  <p className="text-sm text-muted-foreground">{formatDate(supplier.lastContact)}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <IconBuilding className="h-4 w-4" />
              Contact Information
            </h4>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-2">
                <IconMail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{supplier.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <IconPhone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{supplier.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <IconMapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">{supplier.address}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Business Information */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <IconCurrencyDollar className="h-4 w-4" />
              Business Information
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Total Orders</p>
                <p className="text-lg font-semibold text-blue-600">{supplier.totalOrders}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Total Spent</p>
                <p className="text-lg font-semibold text-green-600">${supplier.totalSpent.toLocaleString()}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium">Average Order Value</p>
                <p className="text-lg font-semibold text-purple-600">
                  ${supplier.totalOrders > 0 ? (supplier.totalSpent / supplier.totalOrders).toFixed(2) : '0.00'}
                </p>
              </div>
            </div>
          </div>

          {supplier.notes && (
            <>
              <Separator />
              
              {/* Notes */}
              <div className="space-y-4">
                <h4 className="font-medium">Notes</h4>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">{supplier.notes}</p>
                </div>
              </div>
            </>
          )}

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