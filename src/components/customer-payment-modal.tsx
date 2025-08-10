"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { IconCurrencyDollar, IconUser, IconCreditCard, IconReceipt, IconCalculator } from "@tabler/icons-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

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

const paymentSchema = z.object({
  amount: z.string().min(1, "Amount is required").refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0,
    "Amount must be a positive number"
  ),
  method: z.enum(["cash", "bank_transfer", "check", "online"]),
  reference: z.string().min(1, "Reference is required"),
  notes: z.string().optional()
})

type PaymentFormData = z.infer<typeof paymentSchema>

interface CustomerPaymentModalProps {
  isOpen: boolean
  onClose: () => void
  customer: Customer | null
  onSubmit: (amount: number) => Promise<void>
}

export function CustomerPaymentModal({ isOpen, onClose, customer, onSubmit }: CustomerPaymentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: "",
      method: "cash",
      reference: "",
      notes: ""
    }
  })

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      form.reset({
        amount: customer?.outstandingBalance.toString() || "",
        method: "cash",
        reference: "",
        notes: ""
      })
    }
  }, [isOpen, customer, form])

  const handleSubmit = async (data: PaymentFormData) => {
    if (!customer) return

    const amount = Number(data.amount)
    
    if (amount > customer.outstandingBalance) {
      toast.error("Payment amount cannot exceed outstanding balance")
      return
    }

    try {
      setIsSubmitting(true)
      await onSubmit(amount)
      form.reset()
    } catch (error) {
      console.error("Error processing payment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      form.reset()
      onClose()
    }
  }

  const handleFullPayment = () => {
    if (customer) {
      form.setValue("amount", customer.outstandingBalance.toString())
    }
  }

  const handlePartialPayment = () => {
    if (customer) {
      const partialAmount = Math.ceil(customer.outstandingBalance * 0.5)
      form.setValue("amount", partialAmount.toString())
    }
  }

  if (!customer) return null

  const amount = Number(form.watch("amount")) || 0
  const remainingBalance = customer.outstandingBalance - amount

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconCurrencyDollar className="h-5 w-5" />
            Process Payment - {customer.name}
          </DialogTitle>
          <DialogDescription>
            Process payment to clear outstanding credit balance
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <IconUser className="h-4 w-4" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Customer ID:</span>
                <span className="font-medium">{customer.customerId}</span>
              </div>
              <div className="flex justify-between">
                <span>Name:</span>
                <span className="font-medium">{customer.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Credit Limit:</span>
                <span className="font-medium text-green-600">${customer.creditLimit.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Credit Used:</span>
                <span className="font-medium text-orange-600">${customer.creditUsed.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Available Credit:</span>
                <span className="font-medium text-blue-600">${customer.creditAvailable.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Outstanding Balance Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <IconCreditCard className="h-4 w-4" />
                Outstanding Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-red-600">
                  ${customer.outstandingBalance.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground">Amount due</p>
                <div className="flex gap-2 justify-center">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={handlePartialPayment}
                  >
                    Pay 50%
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={handleFullPayment}
                  >
                    Pay Full Amount
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Payment Amount */}
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <IconCurrencyDollar className="h-4 w-4" />
                        Payment Amount ($)
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="0.00" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Payment Method */}
                <FormField
                  control={form.control}
                  name="method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select method" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                          <SelectItem value="check">Check</SelectItem>
                          <SelectItem value="online">Online Payment</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Reference */}
              <FormField
                control={form.control}
                name="reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference Number</FormLabel>
                    <FormControl>
                      <Input placeholder="PAY-2024-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Payment notes..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Payment Summary */}
              {amount > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <IconCalculator className="h-4 w-4" />
                      Payment Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Outstanding Balance:</span>
                      <span className="font-medium text-red-600">${customer.outstandingBalance.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Amount:</span>
                      <span className="font-medium text-green-600">${amount.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span>Remaining Balance:</span>
                      <span className={`font-semibold ${remainingBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                        ${remainingBalance.toFixed(2)}
                      </span>
                    </div>
                    {remainingBalance < 0 && (
                      <p className="text-sm text-destructive mt-2">
                        Payment amount exceeds outstanding balance
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}
            </form>
          </Form>
        </div>

        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={form.handleSubmit(handleSubmit)}
            disabled={isSubmitting || amount <= 0 || amount > customer.outstandingBalance}
          >
            {isSubmitting ? (
              <>
                <IconCalculator className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <IconReceipt className="mr-2 h-4 w-4" />
                Process Payment
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 