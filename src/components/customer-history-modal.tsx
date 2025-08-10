"use client"

import { useState } from "react"
import { IconUser, IconCurrencyDollar, IconReceipt, IconClock, IconCalendar, IconMapPin, IconCreditCard, IconBuilding } from "@tabler/icons-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Customer {
  id: number
  customerId: string
  name: string
  email: string
  phone: string
  address: string
  creditLimit: number
  creditUsed: number
  creditAvailable: number
  status: "active" | "inactive" | "suspended"
  joinDate: string
  lastPurchase?: string
  totalPurchases: number
  totalSpent: number
  outstandingBalance: number
}

interface PurchaseTransaction {
  id: number
  invoiceNumber: string
  date: string
  items: Array<{
    name: string
    quantity: number
    price: number
    total: number
  }>
  totalAmount: number
  discount: number
  finalAmount: number
  paymentMethod: "cash" | "credit" | "partial"
  creditAmount?: number
  cashAmount?: number
}

interface PaymentRecord {
  id: number
  date: string
  amount: number
  method: "cash" | "bank_transfer" | "check" | "online"
  reference: string
  processedBy: string
  notes?: string
}

interface CreditAdjustment {
  id: number
  date: string
  type: "increase" | "decrease"
  amount: number
  reason: string
  processedBy: string
  previousLimit: number
  newLimit: number
}

interface CustomerHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  customer: Customer | null
}

export function CustomerHistoryModal({ isOpen, onClose, customer }: CustomerHistoryModalProps) {
  const [activeTab, setActiveTab] = useState("overview")

  if (!customer) return null

  // Mock data - in real app this would come from your database
  const purchaseTransactions: PurchaseTransaction[] = [
    {
      id: 1,
      invoiceNumber: "INV-2024-001",
      date: "2024-12-22",
      items: [
        { name: "Laptop", quantity: 1, price: 1200.00, total: 1200.00 },
        { name: "Wireless Mouse", quantity: 1, price: 45.00, total: 45.00 }
      ],
      totalAmount: 1245.00,
      discount: 50,
      finalAmount: 1195.00,
      paymentMethod: "credit",
      creditAmount: 1195.00
    },
    {
      id: 2,
      invoiceNumber: "INV-2024-002",
      date: "2024-12-20",
      items: [
        { name: "Office Chair", quantity: 1, price: 350.00, total: 350.00 },
        { name: "Desk Lamp", quantity: 1, price: 75.00, total: 75.00 }
      ],
      totalAmount: 425.00,
      discount: 25,
      finalAmount: 400.00,
      paymentMethod: "partial",
      creditAmount: 300.00,
      cashAmount: 100.00
    },
    {
      id: 3,
      invoiceNumber: "INV-2024-003",
      date: "2024-12-18",
      items: [
        { name: "Printer", quantity: 1, price: 250.00, total: 250.00 }
      ],
      totalAmount: 250.00,
      discount: 0,
      finalAmount: 250.00,
      paymentMethod: "cash",
      cashAmount: 250.00
    }
  ]

  const paymentRecords: PaymentRecord[] = [
    {
      id: 1,
      date: "2024-12-21",
      amount: 500,
      method: "cash",
      reference: "CASH-001",
      processedBy: "John Manager",
      notes: "Partial payment"
    },
    {
      id: 2,
      date: "2024-12-15",
      amount: 800,
      method: "bank_transfer",
      reference: "TRF-2024-001",
      processedBy: "Sarah Admin"
    },
    {
      id: 3,
      date: "2024-12-10",
      amount: 300,
      method: "check",
      reference: "CHK-2024-001",
      processedBy: "Mike Cashier"
    }
  ]

  const creditAdjustments: CreditAdjustment[] = [
    {
      id: 1,
      date: "2024-12-01",
      type: "increase",
      amount: 2000,
      reason: "Good payment history",
      processedBy: "Manager",
      previousLimit: 3000,
      newLimit: 5000
    },
    {
      id: 2,
      date: "2024-11-15",
      type: "decrease",
      amount: 500,
      reason: "Late payments",
      processedBy: "Manager",
      previousLimit: 3500,
      newLimit: 3000
    }
  ]

  const totalPayments = paymentRecords.reduce((sum, payment) => sum + payment.amount, 0)
  const totalCreditUsed = purchaseTransactions
    .filter(t => t.paymentMethod === "credit" || t.paymentMethod === "partial")
    .reduce((sum, t) => sum + (t.creditAmount || 0), 0)
  const currentBalance = customer.outstandingBalance

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "inactive":
        return "secondary"
      case "suspended":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case "cash":
        return "Cash"
      case "credit":
        return "Credit"
      case "partial":
        return "Partial"
      case "bank_transfer":
        return "Bank Transfer"
      case "check":
        return "Check"
      case "online":
        return "Online"
      default:
        return method
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconUser className="h-5 w-5" />
            Customer History - {customer.name}
          </DialogTitle>
          <DialogDescription>
            Complete transaction history and credit overview for {customer.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <IconUser className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{customer.name}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ID: {customer.customerId}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {customer.email}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {customer.phone}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <IconMapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{customer.address}</span>
                  </div>
                  <Badge variant={getStatusVariant(customer.status)} className="capitalize">
                    {customer.status}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    Joined: {formatDate(customer.joinDate)}
                  </div>
                  {customer.lastPurchase && (
                    <div className="text-sm text-muted-foreground">
                      Last Purchase: {formatDate(customer.lastPurchase)}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Credit Limit</CardTitle>
                <IconCreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">${customer.creditLimit.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Total limit</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Credit Used</CardTitle>
                <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">${customer.creditUsed.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Total used</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
                <IconReceipt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">${totalPayments.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Amount paid</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
                <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${currentBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  ${currentBalance.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Amount due</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for Detailed Information */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="purchases">Purchases</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="credit">Credit History</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Recent Purchases</h4>
                      <div className="space-y-2">
                        {purchaseTransactions.slice(0, 3).map(purchase => (
                          <div key={purchase.id} className="flex justify-between text-sm">
                            <span>{formatDate(purchase.date)}</span>
                            <span className="font-medium">${purchase.finalAmount.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Recent Payments</h4>
                      <div className="space-y-2">
                        {paymentRecords.slice(0, 3).map(payment => (
                          <div key={payment.id} className="flex justify-between text-sm">
                            <span>{formatDate(payment.date)}</span>
                            <span className="font-medium text-green-600">${payment.amount.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="purchases" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Purchase History</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Discount</TableHead>
                        <TableHead>Final Amount</TableHead>
                        <TableHead>Payment Method</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {purchaseTransactions.map(purchase => (
                        <TableRow key={purchase.id}>
                          <TableCell>{formatDate(purchase.date)}</TableCell>
                          <TableCell className="font-medium">{purchase.invoiceNumber}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {purchase.items.map((item, index) => (
                                <div key={index} className="text-sm">
                                  {item.name} x{item.quantity}
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>${purchase.totalAmount.toFixed(2)}</TableCell>
                          <TableCell>{purchase.discount}%</TableCell>
                          <TableCell className="font-semibold">${purchase.finalAmount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {getPaymentMethodLabel(purchase.paymentMethod)}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Reference</TableHead>
                        <TableHead>Processed By</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paymentRecords.map(payment => (
                        <TableRow key={payment.id}>
                          <TableCell>{formatDate(payment.date)}</TableCell>
                          <TableCell className="font-semibold text-green-600">${payment.amount.toFixed(2)}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {getPaymentMethodLabel(payment.method)}
                            </Badge>
                          </TableCell>
                          <TableCell>{payment.reference}</TableCell>
                          <TableCell>{payment.processedBy}</TableCell>
                          <TableCell>{payment.notes || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="credit" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Credit Limit Adjustments</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Previous Limit</TableHead>
                        <TableHead>New Limit</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Processed By</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {creditAdjustments.map(adjustment => (
                        <TableRow key={adjustment.id}>
                          <TableCell>{formatDate(adjustment.date)}</TableCell>
                          <TableCell>
                            <Badge variant={adjustment.type === "increase" ? "default" : "destructive"}>
                              {adjustment.type === "increase" ? "Increase" : "Decrease"}
                            </Badge>
                          </TableCell>
                          <TableCell className={`font-semibold ${adjustment.type === "increase" ? 'text-green-600' : 'text-red-600'}`}>
                            ${adjustment.amount.toFixed(2)}
                          </TableCell>
                          <TableCell>${adjustment.previousLimit.toFixed(2)}</TableCell>
                          <TableCell>${adjustment.newLimit.toFixed(2)}</TableCell>
                          <TableCell>{adjustment.reason}</TableCell>
                          <TableCell>{adjustment.processedBy}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 