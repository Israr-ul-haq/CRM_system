"use client"

import { useState, useEffect } from "react"
import { IconReceipt, IconCurrencyDollar, IconCalendar, IconBuilding } from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface OutstandingPurchaseOrder {
  purchaseOrderId: string
  supplierId: number
  supplierName: string
  totalAmount: number
  paidAmount: number
  outstandingAmount: number
  purchaseDate: string
  description: string
  paymentStatus: string
}

interface OutstandingPurchaseOrdersProps {
  supplierId: string
  onSelectPurchaseOrder: (purchaseOrder: OutstandingPurchaseOrder) => void
}

export function OutstandingPurchaseOrders({ supplierId, onSelectPurchaseOrder }: OutstandingPurchaseOrdersProps) {
  const [outstandingOrders, setOutstandingOrders] = useState<OutstandingPurchaseOrder[]>([])

  useEffect(() => {
    // In a real app, this would fetch from API
    // For now, using mock data based on supplier-payments data
    const mockOutstandingOrders: OutstandingPurchaseOrder[] = [
      {
        purchaseOrderId: "PO-2024-001",
        supplierId: 1,
        supplierName: "TechCorp Solutions",
        totalAmount: 25000.00,
        paidAmount: 25000.00,
        outstandingAmount: 0.00,
        purchaseDate: "2024-12-15T10:30:00Z",
        description: "Electronics restock order for holiday season",
        paymentStatus: "paid"
      },
      {
        purchaseOrderId: "PO-2024-007",
        supplierId: 1,
        supplierName: "TechCorp Solutions",
        totalAmount: 35000.00,
        paidAmount: 20000.00,
        outstandingAmount: 15000.00,
        purchaseDate: "2024-12-09T10:00:00Z",
        description: "Premium electronics for corporate clients",
        paymentStatus: "partial"
      },
      {
        purchaseOrderId: "PO-2024-002",
        supplierId: 2,
        supplierName: "Global Textiles Ltd",
        totalAmount: 12000.00,
        paidAmount: 8000.00,
        outstandingAmount: 4000.00,
        purchaseDate: "2024-12-14T14:20:00Z",
        description: "Clothing materials for spring collection",
        paymentStatus: "partial"
      },
      {
        purchaseOrderId: "PO-2024-004",
        supplierId: 5,
        supplierName: "Sports Equipment Pro",
        totalAmount: 18000.00,
        paidAmount: 12000.00,
        outstandingAmount: 6000.00,
        purchaseDate: "2024-12-12T11:30:00Z",
        description: "Sports equipment for fitness center",
        paymentStatus: "partial"
      },
      {
        purchaseOrderId: "PO-2024-006",
        supplierId: 7,
        supplierName: "Automotive Parts Co",
        totalAmount: 22000.00,
        paidAmount: 0.00,
        outstandingAmount: 22000.00,
        purchaseDate: "2024-12-10T15:10:00Z",
        description: "Large book order for educational institutions",
        paymentStatus: "pending"
      },
      {
        purchaseOrderId: "PO-2024-008",
        supplierId: 3,
        supplierName: "Office Supplies Plus",
        totalAmount: 9500.00,
        paidAmount: 5000.00,
        outstandingAmount: 4500.00,
        purchaseDate: "2024-12-08T16:45:00Z",
        description: "Office supplies for new branch opening",
        paymentStatus: "partial"
      }
    ]

    // Filter by supplier and only show orders with outstanding amounts
    const filtered = mockOutstandingOrders.filter(
      order => order.supplierId.toString() === supplierId && order.outstandingAmount > 0
    )
    setOutstandingOrders(filtered)
  }, [supplierId])

  const getPaymentStatusVariant = (status: string) => {
    switch (status) {
      case "paid":
        return "default"
      case "partial":
        return "secondary"
      case "pending":
        return "outline"
      default:
        return "outline"
    }
  }

  if (outstandingOrders.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            <IconReceipt className="mx-auto h-12 w-12 mb-4 opacity-50" />
            <p>No outstanding purchase orders found for this supplier.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Outstanding Purchase Orders</h3>
        <Badge variant="outline">{outstandingOrders.length} orders</Badge>
      </div>
      
      <div className="space-y-3">
        {outstandingOrders.map((order) => (
          <Card key={order.purchaseOrderId} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="pt-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <IconReceipt className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{order.purchaseOrderId}</span>
                    <Badge variant={getPaymentStatusVariant(order.paymentStatus)} className="capitalize">
                      {order.paymentStatus}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{order.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <IconCalendar className="h-3 w-3" />
                      {new Date(order.purchaseDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <IconBuilding className="h-3 w-3" />
                      {order.supplierName}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Outstanding</div>
                  <div className="text-lg font-bold text-red-600">
                    ${order.outstandingAmount.toLocaleString()}
                  </div>
                </div>
              </div>
              
              <Separator className="my-3" />
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-muted-foreground">Total Amount</div>
                  <div className="font-medium">${order.totalAmount.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Paid Amount</div>
                  <div className="font-medium text-green-600">${order.paidAmount.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Remaining</div>
                  <div className="font-medium text-red-600">${order.outstandingAmount.toLocaleString()}</div>
                </div>
              </div>
              
              <Button 
                onClick={() => onSelectPurchaseOrder(order)}
                className="w-full mt-3"
                size="sm"
              >
                <IconCurrencyDollar className="mr-2 h-4 w-4" />
                Pay Against This Order
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 