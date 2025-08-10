"use client"

import { IconEye, IconReceipt, IconBuilding, IconCalendar, IconTruck, IconCreditCard, IconCurrencyDollar, IconPackage, IconFileText } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Purchase {
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

interface ViewPurchaseModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  purchase?: Purchase
}

export function ViewPurchaseModal({ open, onOpenChange, purchase }: ViewPurchaseModalProps) {
  if (!purchase) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

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

  const getPaymentMethodDisplay = (method: string) => {
    switch (method) {
      case "bank_transfer":
        return "Bank Transfer"
      case "credit_card":
        return "Credit Card"
      case "check":
        return "Check"
      case "cash":
        return "Cash"
      default:
        return method
    }
  }

  const supplierNames: { [key: number]: string } = {
    1: "TechCorp Solutions",
    2: "Global Textiles Ltd",
    3: "Office Supplies Plus",
    4: "Home & Garden Co",
    5: "Sports Equipment Pro",
    6: "Beauty Supplies Inc",
    7: "Automotive Parts Co",
    8: "Book Publishers Ltd",
  }

  const companyNames: { [key: number]: string } = {
    1: "TechCorp Solutions Inc",
    2: "Global Textiles Ltd",
    3: "Office Supplies Plus",
    4: "Home & Garden Co",
    5: "Sports Equipment Pro",
    6: "Beauty Supplies Inc",
    7: "Automotive Parts Co",
    8: "Book Publishers Ltd",
  }

  const productNames: { [key: number]: string } = {
    1: "iPhone 15 Pro",
    2: "Samsung Galaxy S24",
    3: "Nike Air Max 270",
    4: "The Great Gatsby",
    5: "Coffee Maker Deluxe",
    6: "Levi's 501 Jeans",
    7: "MacBook Air M2",
    8: "Yoga Mat Premium",
    9: "To Kill a Mockingbird",
    10: "Blender Pro 2000",
    11: "Adidas Ultraboost",
    12: "H&M T-Shirt",
    13: "iPad Air 5th Gen",
    14: "Garden Hose 50ft",
    15: "1984 by George Orwell",
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconEye className="h-5 w-5" />
            Purchase Order Details
          </DialogTitle>
          <DialogDescription>
            Detailed information for {purchase.orderNumber}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Purchase Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconReceipt className="h-5 w-5" />
                Purchase Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <IconReceipt className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Order Number:</span>
                    <span className="font-semibold">{purchase.orderNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconBuilding className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Supplier:</span>
                    <span>{supplierNames[purchase.supplierId] || "Unknown"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconBuilding className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Company:</span>
                    <span>{companyNames[purchase.companyId] || "Unknown"}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <IconCalendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Purchase Date:</span>
                    <span>{formatDate(purchase.purchaseDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconTruck className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Expected Delivery:</span>
                    <span>{formatDate(purchase.expectedDelivery)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Total Amount:</span>
                    <span className="text-lg font-semibold text-green-600">
                      ${purchase.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Status Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconCreditCard className="h-5 w-5" />
                Status Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground">Payment Status</div>
                  <Badge variant={getPaymentStatusVariant(purchase.paymentStatus)} className="mt-2 capitalize">
                    {purchase.paymentStatus}
                  </Badge>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground">Order Status</div>
                  <Badge variant={getOrderStatusVariant(purchase.orderStatus)} className="mt-2 capitalize">
                    {purchase.orderStatus.replace("_", " ")}
                  </Badge>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-sm font-medium text-muted-foreground">Payment Method</div>
                  <div className="mt-2 font-medium">{getPaymentMethodDisplay(purchase.paymentMethod)}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Purchase Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconPackage className="h-5 w-5" />
                Purchase Items ({purchase.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Unit Cost</TableHead>
                    <TableHead>Total Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {purchase.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {productNames[item.inventoryId] || `Product ${item.inventoryId}`}
                          </span>
                          <span className="text-sm text-muted-foreground">ID: {item.inventoryId}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <span className="font-medium">{item.quantity}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{item.unitCost.toFixed(2)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <IconCurrencyDollar className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-green-600">{item.totalCost.toFixed(2)}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Notes */}
          {purchase.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconFileText className="h-5 w-5" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{purchase.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Purchase Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconCalendar className="h-5 w-5" />
                Purchase Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-medium">Purchase Order Created</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(purchase.purchaseDate)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-medium">Order Confirmed</div>
                    <div className="text-sm text-muted-foreground">
                      Order {purchase.orderNumber} confirmed with {purchase.items.length} items
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-medium">Expected Delivery</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(purchase.expectedDelivery)}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

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