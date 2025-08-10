"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { IconReceipt, IconClock, IconTable, IconUsers, IconCheck, IconX } from "@tabler/icons-react"

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  notes?: string
}

interface Order {
  id?: string
  tableNumber: string
  items: OrderItem[]
  total: number
  status: string
  notes?: string
  customerName?: string
  customerPhone?: string
  orderTime?: string
  estimatedTime?: string
}

interface OrderViewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: Order | null
}

const orderStatusInfo = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800", icon: IconClock },
  preparing: { label: "Preparing", color: "bg-blue-100 text-blue-800", icon: IconClock },
  ready: { label: "Ready", color: "bg-green-100 text-green-800", icon: IconCheck },
  served: { label: "Served", color: "bg-gray-100 text-gray-800", icon: IconCheck },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800", icon: IconX }
}

export default function OrderViewModal({ open, onOpenChange, order }: OrderViewModalProps) {
  if (!order) return null

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
    return orderStatusInfo[status as keyof typeof orderStatusInfo] || orderStatusInfo.pending
  }

  const statusInfo = getStatusInfo(order.status)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconReceipt className="h-5 w-5" />
            Order #{order.id} - Table {order.tableNumber}
          </DialogTitle>
          <DialogDescription>
            View detailed information about this order
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Order Header */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Order Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">Order ID</h4>
                <p className="font-mono text-lg">#{order.id}</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">Table Number</h4>
                <div className="flex items-center gap-2">
                  <IconTable className="h-4 w-4 text-muted-foreground" />
                  <span className="text-lg font-medium">Table {order.tableNumber}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">Order Status</h4>
                <Badge className={statusInfo.color}>
                  <statusInfo.icon className="h-3 w-3 mr-1" />
                  {statusInfo.label}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">Total Amount</h4>
                <div className="text-2xl font-bold text-green-600">${order.total.toFixed(2)}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {order.orderTime && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">Order Time</h4>
                  <div className="flex items-center gap-2">
                    <IconClock className="h-4 w-4 text-muted-foreground" />
                    <span>{formatTime(order.orderTime)}</span>
                  </div>
                </div>
              )}
              
              {order.estimatedTime && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">Estimated Ready Time</h4>
                  <div className="flex items-center gap-2">
                    <IconClock className="h-4 w-4 text-muted-foreground" />
                    <span>{formatTime(order.estimatedTime)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Customer Information */}
          {(order.customerName || order.customerPhone) && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Customer Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {order.customerName && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground">Customer Name</h4>
                    <div className="flex items-center gap-2">
                      <IconUsers className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{order.customerName}</span>
                    </div>
                  </div>
                )}
                
                {order.customerPhone && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground">Phone Number</h4>
                    <span className="font-medium">{order.customerPhone}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Order Items</h3>
            
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{item.name}</span>
                      <Badge variant="outline">x{item.quantity}</Badge>
                    </div>
                    {item.notes && (
                      <div className="text-sm text-muted-foreground mt-1">
                        Note: {item.notes}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <div className="font-medium">${item.price.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">
                      Total: ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between text-lg font-bold">
                <span>Order Total:</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {order.items.reduce((total, item) => total + item.quantity, 0)} items
              </div>
            </div>
          </div>

          {/* Order Notes */}
          {order.notes && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Special Instructions</h3>
              
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800">{order.notes}</p>
              </div>
            </div>
          )}

          {/* Order Timeline */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Order Timeline</h3>
            
            <div className="space-y-3">
              {order.orderTime && (
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <div className="font-medium">Order Placed</div>
                    <div className="text-sm text-muted-foreground">{formatTime(order.orderTime)}</div>
                  </div>
                </div>
              )}
              
              {order.estimatedTime && (
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div>
                    <div className="font-medium">Estimated Ready</div>
                    <div className="text-sm text-muted-foreground">{formatTime(order.estimatedTime)}</div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <div>
                  <div className="font-medium">Current Status</div>
                  <div className="text-sm text-muted-foreground">{statusInfo.label}</div>
                </div>
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