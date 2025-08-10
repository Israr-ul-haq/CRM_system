"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { IconTable, IconUsers, IconClock, IconReceipt, IconMapPin } from "@tabler/icons-react"

interface Table {
  id?: string
  number: string
  capacity: number
  status: string
  currentOrder?: string | null
  reservation?: {
    time: string
    customerName: string
    partySize: number
    phone?: string
    notes?: string
  } | null
}

interface TableViewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table | null
}

const tableStatusInfo = {
  available: { label: "Available", color: "bg-green-100 text-green-800", description: "Table is ready for new customers" },
  occupied: { label: "Occupied", color: "bg-red-100 text-red-800", description: "Table currently has customers" },
  reserved: { label: "Reserved", color: "bg-yellow-100 text-yellow-800", description: "Table is reserved for later" },
  cleaning: { label: "Cleaning", color: "bg-blue-100 text-blue-800", description: "Table is being cleaned" },
  out_of_service: { label: "Out of Service", color: "bg-gray-100 text-gray-800", description: "Table is not available" }
}

export default function TableViewModal({ open, onOpenChange, table }: TableViewModalProps) {
  if (!table) return null

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusInfo = (status: string) => {
    return tableStatusInfo[status as keyof typeof tableStatusInfo] || tableStatusInfo.available
  }

  const statusInfo = getStatusInfo(table.status)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconTable className="h-5 w-5" />
            Table {table.number} Details
          </DialogTitle>
          <DialogDescription>
            View detailed information about this table
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Table Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Table Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">Table Number</h4>
                <div className="flex items-center gap-2">
                  <IconTable className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">Table {table.number}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">Capacity</h4>
                <div className="flex items-center gap-2">
                  <IconUsers className="h-4 w-4 text-muted-foreground" />
                  <span className="text-lg font-medium">{table.capacity} people</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">Current Status</h4>
              <div className="flex items-center gap-3">
                <Badge className={statusInfo.color}>
                  {statusInfo.label}
                </Badge>
                <span className="text-sm text-muted-foreground">{statusInfo.description}</span>
              </div>
            </div>
          </div>

          {/* Current Order */}
          {table.currentOrder && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Current Order</h3>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <IconReceipt className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-blue-800">Active Order</div>
                    <div className="text-sm text-blue-600">Order #{table.currentOrder}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Reservation Information */}
          {table.reservation && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Reservation Details</h3>
              
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg space-y-3">
                <div className="flex items-center gap-3">
                  <IconClock className="h-5 w-5 text-yellow-600" />
                  <div>
                    <div className="font-medium text-yellow-800">Reserved</div>
                    <div className="text-sm text-yellow-600">{formatTime(table.reservation.time)}</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-yellow-800">Customer Name</div>
                    <div className="text-yellow-700">{table.reservation.customerName}</div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-yellow-800">Party Size</div>
                    <div className="text-yellow-700">{table.reservation.partySize} people</div>
                  </div>
                </div>
                
                {table.reservation.phone && (
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-yellow-800">Phone Number</div>
                    <div className="text-yellow-700">{table.reservation.phone}</div>
                  </div>
                )}
                
                {table.reservation.notes && (
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-yellow-800">Special Notes</div>
                    <div className="text-yellow-700">{table.reservation.notes}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Table Location & Notes */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Additional Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">Table ID</h4>
                <p className="font-mono text-sm">{table.id}</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">Location</h4>
                <div className="flex items-center gap-2">
                  <IconMapPin className="h-4 w-4 text-muted-foreground" />
                  <span>Main Dining Area</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status History (Placeholder) */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Recent Activity</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <div className="font-medium">Status Updated</div>
                  <div className="text-sm text-muted-foreground">Changed to {statusInfo.label}</div>
                </div>
              </div>
              
              {table.currentOrder && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <div className="font-medium">Order Started</div>
                    <div className="text-sm text-muted-foreground">Order #{table.currentOrder} assigned</div>
                  </div>
                </div>
              )}
              
              {table.reservation && (
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div>
                    <div className="font-medium">Reservation Made</div>
                    <div className="text-sm text-muted-foreground">Reserved for {table.reservation.customerName}</div>
                  </div>
                </div>
              )}
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