"use client"

import { useState, useEffect } from "react"
import { IconBuilding, IconCurrencyDollar, IconAlertTriangle, IconCheck } from "@tabler/icons-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AddPaymentModal } from "@/components/add-payment-modal"

interface SupplierBalance {
  supplierId: number
  supplierName: string
  totalCredits: number
  totalPayments: number
  outstandingBalance: number
  lastPaymentDate?: string
}

interface SupplierBalanceCardProps {
  supplierBalance: SupplierBalance
  onAddPayment: (payment: {
    supplierId: string
    amount: number
    paymentMethod: string
    paymentDate: string
    reference: string
    notes?: string
  }) => void
}

export function SupplierBalanceCard({ supplierBalance, onAddPayment }: SupplierBalanceCardProps) {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

  const getBalanceStatus = (balance: number) => {
    if (balance === 0) return { status: "paid", color: "text-green-600", bgColor: "bg-green-50", icon: IconCheck }
    if (balance > 0) return { status: "outstanding", color: "text-red-600", bgColor: "bg-red-50", icon: IconAlertTriangle }
    return { status: "overpaid", color: "text-blue-600", bgColor: "bg-blue-50", icon: IconCurrencyDollar }
  }

  const balanceStatus = getBalanceStatus(supplierBalance.outstandingBalance)

  return (
    <>
      <Card className={`${balanceStatus.bgColor} border-l-4 border-l-current`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <IconBuilding className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">{supplierBalance.supplierName}</CardTitle>
            </div>
            <Badge 
              variant={supplierBalance.outstandingBalance === 0 ? "default" : "destructive"}
              className="capitalize"
            >
              {balanceStatus.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Total Credits</p>
              <p className="font-semibold text-red-600">
                ${supplierBalance.totalCredits.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Total Payments</p>
              <p className="font-semibold text-green-600">
                ${supplierBalance.totalPayments.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Outstanding</p>
              <p className={`font-semibold ${balanceStatus.color}`}>
                ${supplierBalance.outstandingBalance.toLocaleString()}
              </p>
            </div>
          </div>

          {supplierBalance.lastPaymentDate && (
            <div className="text-xs text-muted-foreground">
              Last payment: {new Date(supplierBalance.lastPaymentDate).toLocaleDateString()}
            </div>
          )}

          {supplierBalance.outstandingBalance > 0 && (
            <Button 
              onClick={() => setIsPaymentModalOpen(true)}
              className="w-full"
              size="sm"
            >
              <IconCurrencyDollar className="mr-2 h-4 w-4" />
              Record Payment
            </Button>
          )}
        </CardContent>
      </Card>

      <AddPaymentModal
        open={isPaymentModalOpen}
        onOpenChange={setIsPaymentModalOpen}
        onAddPayment={(payment) => {
          // Transform the payment data to match the expected interface
          onAddPayment({
            supplierId: payment.supplierId,
            amount: payment.totalAmount,
            paymentMethod: payment.paymentMethod,
            paymentDate: payment.paymentDate,
            reference: payment.reference,
            notes: payment.notes
          })
          setIsPaymentModalOpen(false)
        }}
      />
    </>
  )
} 