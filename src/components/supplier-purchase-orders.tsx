"use client"

import { useState, useEffect } from "react"
import { IconReceipt, IconCurrencyDollar, IconCalendar, IconTruck, IconCheck } from "@tabler/icons-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface PurchaseOrder {
  id: number
  orderNumber: string
  supplierId: number
  companyId: number
  purchaseDate: string
  expectedDelivery: string
  totalAmount: number
  paymentStatus: string
  paymentMethod: string
  orderStatus: string
  items: Array<{
    inventoryId: number
    quantity: number
    unitCost: number
    totalCost: number
  }>
  notes: string
}

interface SupplierPurchaseOrdersProps {
  supplierId: string
  onSelectPurchaseOrder: (purchaseOrder: {
    purchaseOrderId: string
    supplierId: number
    supplierName: string
    totalAmount: number
    paidAmount: number
    outstandingAmount: number
    purchaseDate: string
    description: string
    paymentStatus: string
  }) => void
  selectedOrders: string[]
}

// Mock data - in real app this would come from API
const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: 1,
    orderNumber: "PO-2024-001",
    supplierId: 1,
    companyId: 1,
    purchaseDate: "2024-12-15T10:30:00Z",
    expectedDelivery: "2024-12-22T10:30:00Z",
    totalAmount: 25000.00,
    paymentStatus: "paid",
    paymentMethod: "bank_transfer",
    orderStatus: "delivered",
    items: [
      { inventoryId: 1, quantity: 20, unitCost: 750.00, totalCost: 15000.00 },
      { inventoryId: 7, quantity: 10, unitCost: 900.00, totalCost: 9000.00 },
      { inventoryId: 13, quantity: 15, unitCost: 66.67, totalCost: 1000.00 }
    ],
    notes: "Electronics restock order for holiday season"
  },
  {
    id: 7,
    orderNumber: "PO-2024-007",
    supplierId: 1,
    companyId: 1,
    purchaseDate: "2024-12-09T10:00:00Z",
    expectedDelivery: "2024-12-16T10:00:00Z",
    totalAmount: 35000.00,
    paymentStatus: "partial",
    paymentMethod: "check",
    orderStatus: "delivered",
    items: [
      { inventoryId: 1, quantity: 30, unitCost: 750.00, totalCost: 22500.00 },
      { inventoryId: 7, quantity: 12, unitCost: 900.00, totalCost: 10800.00 },
      { inventoryId: 13, quantity: 20, unitCost: 66.67, totalCost: 1333.40 }
    ],
    notes: "Premium electronics for corporate clients"
  },
  {
    id: 9,
    orderNumber: "PO-2024-009",
    supplierId: 1,
    companyId: 1,
    purchaseDate: "2024-12-20T14:00:00Z",
    expectedDelivery: "2024-12-27T14:00:00Z",
    totalAmount: 18000.00,
    paymentStatus: "pending",
    paymentMethod: "bank_transfer",
    orderStatus: "ordered",
    items: [
      { inventoryId: 1, quantity: 15, unitCost: 750.00, totalCost: 11250.00 },
      { inventoryId: 7, quantity: 7, unitCost: 900.00, totalCost: 6300.00 },
      { inventoryId: 13, quantity: 10, unitCost: 66.67, totalCost: 666.70 }
    ],
    notes: "Q1 2025 electronics restock"
  }
]

export function SupplierPurchaseOrders({ supplierId, onSelectPurchaseOrder, selectedOrders }: SupplierPurchaseOrdersProps) {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([])

  useEffect(() => {
    if (supplierId) {
      // Filter purchase orders for the selected supplier
      const filtered = mockPurchaseOrders.filter(order => order.supplierId.toString() === supplierId)
      setPurchaseOrders(filtered)
    } else {
      setPurchaseOrders([])
    }
  }, [supplierId])

  const getPaymentStatusVariant = (status: string) => {
    switch (status) {
      case "paid":
        return "default"
      case "pending":
        return "secondary"
      case "partial":
        return "outline"
      default:
        return "outline"
    }
  }

  const getOrderStatusVariant = (status: string) => {
    switch (status) {
      case "delivered":
        return "default"
      case "in_transit":
        return "secondary"
      case "ordered":
        return "outline"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  const calculateOutstandingAmount = (order: PurchaseOrder) => {
    // Mock calculation - in real app this would come from payment history
    switch (order.paymentStatus) {
      case "paid":
        return 0
      case "partial":
        return order.totalAmount * 0.4 // Assume 60% paid
      case "pending":
        return order.totalAmount
      default:
        return order.totalAmount
    }
  }

  const calculatePaidAmount = (order: PurchaseOrder) => {
    return order.totalAmount - calculateOutstandingAmount(order)
  }

  if (!supplierId) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <IconReceipt className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>Select a supplier to view their purchase orders</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (purchaseOrders.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <IconReceipt className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>No purchase orders found for this supplier</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-3">
        {purchaseOrders.map((order) => {
          const outstandingAmount = calculateOutstandingAmount(order)
          const paidAmount = calculatePaidAmount(order)
          const isSelected = selectedOrders.includes(order.orderNumber)
          
          return (
            <Card key={order.id} className={`transition-all ${isSelected ? 'ring-2 ring-primary' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <IconReceipt className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{order.orderNumber}</span>
                      <Badge variant={getPaymentStatusVariant(order.paymentStatus)} className="capitalize">
                        {order.paymentStatus}
                      </Badge>
                      <Badge variant={getOrderStatusVariant(order.orderStatus)} className="capitalize">
                        {order.orderStatus.replace("_", " ")}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      {order.notes}
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <IconCalendar className="h-3 w-3" />
                        <span>{new Date(order.purchaseDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <IconTruck className="h-3 w-3" />
                        <span>{new Date(order.expectedDelivery).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <IconCurrencyDollar className="h-3 w-3" />
                        <span>Total: ${order.totalAmount.toLocaleString()}</span>
                      </div>
                      {paidAmount > 0 && (
                        <div className="flex items-center gap-1 text-green-600">
                          <IconCurrencyDollar className="h-3 w-3" />
                          <span>Paid: ${paidAmount.toLocaleString()}</span>
                        </div>
                      )}
                      {outstandingAmount > 0 && (
                        <div className="flex items-center gap-1 text-orange-600">
                          <IconCurrencyDollar className="h-3 w-3" />
                          <span>Outstanding: ${outstandingAmount.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    {outstandingAmount > 0 ? (
                      <Button
                        type="button"
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => onSelectPurchaseOrder({
                          purchaseOrderId: order.orderNumber,
                          supplierId: order.supplierId,
                          supplierName: "TechCorp Solutions", // Mock data
                          totalAmount: order.totalAmount,
                          paidAmount,
                          outstandingAmount,
                          purchaseDate: order.purchaseDate,
                          description: order.notes,
                          paymentStatus: order.paymentStatus
                        })}
                        className="min-w-[120px]"
                      >
                        {isSelected ? (
                          <>
                            <IconCheck className="mr-2 h-4 w-4" />
                            Selected
                          </>
                        ) : (
                          "Add to Payment"
                        )}
                      </Button>
                    ) : (
                      <div className="text-sm text-muted-foreground px-3 py-2">
                        Fully Paid
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </ScrollArea>
  )
} 