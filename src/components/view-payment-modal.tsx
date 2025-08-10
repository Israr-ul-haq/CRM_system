"use client"

import { IconReceipt, IconCurrencyDollar, IconCalendar, IconBuilding, IconCreditCard, IconFileText } from "@tabler/icons-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface SupplierPayment {
  id: number
  supplierId: number
  purchaseOrders: Array<{
    purchaseOrderId: string
    amount: number
  }>
  totalAmount: number
  paymentMethod: string
  paymentDate: string
  reference: string
  notes?: string
  type: "credit" | "debit"
  balance: number
  outstandingAmount: number
}

interface ViewPaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  payment: SupplierPayment | null
}

export function ViewPaymentModal({ open, onOpenChange, payment }: ViewPaymentModalProps) {
  if (!payment) return null

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

  const getPaymentTypeVariant = (type: string) => {
    switch (type) {
      case "credit":
        return "default"
      case "debit":
        return "secondary"
      default:
        return "outline"
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconReceipt className="h-5 w-5" />
            Payment Details
          </DialogTitle>
          <DialogDescription>
            View detailed information about this supplier payment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Payment Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconCurrencyDollar className="h-5 w-5" />
                Payment Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <IconBuilding className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Supplier:</span>
                    <span>{supplierNames[payment.supplierId] || "Unknown"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconReceipt className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Reference:</span>
                    <span>{payment.reference}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconCalendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Payment Date:</span>
                    <span>{formatDate(payment.paymentDate)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <IconCreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Payment Method:</span>
                    <span>{getPaymentMethodDisplay(payment.paymentMethod)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={getPaymentTypeVariant(payment.type)} className="capitalize">
                      {payment.type}
                    </Badge>
                    <span className="font-medium">Type</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Total Amount:</span>
                    <span className="text-lg font-semibold text-green-600">
                      ${payment.totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Purchase Orders Covered */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconReceipt className="h-5 w-5" />
                Purchase Orders Covered ({payment.purchaseOrders.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Purchase Order</TableHead>
                    <TableHead>Amount Paid</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payment.purchaseOrders.map((order, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <IconReceipt className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{order.purchaseOrderId}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <IconCurrencyDollar className="h-4 w-4 text-green-600" />
                          <span className="font-medium text-green-600">
                            ${order.amount.toLocaleString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Paid
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Financial Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconCurrencyDollar className="h-5 w-5" />
                Financial Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    ${payment.totalAmount.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Payment</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    ${payment.balance.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Current Balance</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    ${payment.outstandingAmount.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Outstanding</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          {payment.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconFileText className="h-5 w-5" />
                  Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{payment.notes}</p>
              </CardContent>
            </Card>
          )}

          {/* Payment Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconCalendar className="h-5 w-5" />
                Payment Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-medium">Payment Processed</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(payment.paymentDate)}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-medium">Payment Recorded</div>
                    <div className="text-sm text-muted-foreground">
                      Payment of ${payment.totalAmount.toLocaleString()} recorded for {payment.purchaseOrders.length} purchase order(s)
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <div className="font-medium">Balance Updated</div>
                    <div className="text-sm text-muted-foreground">
                      Supplier balance updated to ${payment.balance.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
} 