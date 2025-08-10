"use client"

import { useState, useEffect } from "react"
import { IconCalculator, IconCash, IconReceipt, IconCreditCard, IconUser, IconCurrencyDollar } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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

interface StaffMember {
  id: number
  employeeId: string
  name: string
  salary: number
  advanceTaken: number
  remainingSalary: number
  status: "active" | "inactive" | "on_leave"
}

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

interface PaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  total: number
  discount: number
  onCompletePayment: (paymentData: { method: "cash" | "staff_credit" | "customer_credit", staffId?: number, customerId?: number }) => void
}

export function PaymentModal({ 
  open, 
  onOpenChange, 
  total, 
  discount, 
  onCompletePayment 
}: PaymentModalProps) {
  const [cashReceived, setCashReceived] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "credit">("cash")
  const [selectedStaffId, setSelectedStaffId] = useState<string>("")
  const cashReceivedNum = parseFloat(cashReceived) || 0
  const change = cashReceivedNum - total

  // Mock staff data - in real app this would come from your staff management system
  const staffMembers: StaffMember[] = [
    {
      id: 1,
      employeeId: "EMP001",
      name: "John Smith",
      salary: 4500,
      advanceTaken: 500,
      remainingSalary: 4000,
      status: "active"
    },
    {
      id: 2,
      employeeId: "EMP002",
      name: "Sarah Johnson",
      salary: 3200,
      advanceTaken: 200,
      remainingSalary: 3000,
      status: "active"
    },
    {
      id: 3,
      employeeId: "EMP003",
      name: "Mike Davis",
      salary: 6000,
      advanceTaken: 1000,
      remainingSalary: 5000,
      status: "active"
    },
    {
      id: 4,
      employeeId: "EMP004",
      name: "Lisa Wilson",
      salary: 1800,
      advanceTaken: 150,
      remainingSalary: 1650,
      status: "active"
    }
  ]

  const selectedStaff = staffMembers.find(staff => staff.id.toString() === selectedStaffId)

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      setCashReceived("")
      setIsSubmitting(false)
      setPaymentMethod("cash")
      setSelectedStaffId("")
    }
  }, [open])

  // Handle payment completion
  const handleCompletePayment = () => {
    if (paymentMethod === "cash" && cashReceivedNum < total) {
      toast.error("Cash received must be equal to or greater than the total amount")
      return
    }

    if (paymentMethod === "credit" && !selectedStaffId) {
      toast.error("Please select a staff member for credit payment")
      return
    }

    if (paymentMethod === "credit" && selectedStaff && total > selectedStaff.remainingSalary) {
      toast.error(`Insufficient salary balance. Available: $${selectedStaff.remainingSalary.toFixed(2)}`)
      return
    }

    setIsSubmitting(true)
    
    // Simulate payment processing
    setTimeout(() => {
      const paymentData = {
        method: (paymentMethod === "credit" ? "staff_credit" : "cash") as "cash" | "staff_credit" | "customer_credit",
        staffId: paymentMethod === "credit" ? parseInt(selectedStaffId) : undefined
      }
      
      if (paymentMethod === "cash") {
        toast.success(`Payment completed! Change: $${change.toFixed(2)}`)
      } else {
        toast.success(`Credit payment processed for ${selectedStaff?.name}`)
      }
      
      onCompletePayment(paymentData)
      onOpenChange(false)
      setIsSubmitting(false)
    }, 1000)
  }

  // Handle key press (Enter to complete payment)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && cashReceivedNum >= total) {
      handleCompletePayment()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconCash className="h-5 w-5" />
            Complete Payment
          </DialogTitle>
          <DialogDescription>
            Enter the cash amount received and complete the transaction
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Payment Summary */}
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>${(total / (1 - discount / 100)).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Discount ({discount}%):</span>
              <span>-${((total / (1 - discount / 100)) * (discount / 100)).toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold text-lg">
              <span>Total Amount:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-4">
            <Label>Payment Method</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant={paymentMethod === "cash" ? "default" : "outline"}
                onClick={() => setPaymentMethod("cash")}
                className="flex items-center gap-2"
              >
                <IconCash className="h-4 w-4" />
                Cash Payment
              </Button>
              <Button
                type="button"
                variant={paymentMethod === "credit" ? "default" : "outline"}
                onClick={() => setPaymentMethod("credit")}
                className="flex items-center gap-2"
              >
                <IconCreditCard className="h-4 w-4" />
                Staff Credit
              </Button>
            </div>
          </div>

          {/* Cash Payment Section */}
          {paymentMethod === "cash" && (
            <>
              {/* Cash Received Input */}
              <div className="space-y-2">
                <Label htmlFor="cash-received">Cash Received ($)</Label>
                <Input
                  id="cash-received"
                  type="number"
                  min={total}
                  step="0.01"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`${total.toFixed(2)} or more`}
                  className="text-lg font-medium"
                  autoFocus
                />
                {cashReceivedNum > 0 && cashReceivedNum < total && (
                  <p className="text-sm text-destructive">
                    Cash received must be equal to or greater than ${total.toFixed(2)}
                  </p>
                )}
              </div>

              {/* Change Calculation */}
              {cashReceivedNum > 0 && (
                <div className="space-y-2 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Change to Give:</span>
                    <span className={`text-lg font-bold ${change >= 0 ? 'text-green-600' : 'text-destructive'}`}>
                      ${change.toFixed(2)}
                    </span>
                  </div>
                  {change < 0 && (
                    <p className="text-sm text-destructive">
                      Insufficient cash received
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          {/* Credit Payment Section */}
          {paymentMethod === "credit" && (
            <div className="space-y-4">
              {/* Staff Selection */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <IconUser className="h-4 w-4" />
                  Select Staff Member
                </Label>
                <Select value={selectedStaffId} onValueChange={setSelectedStaffId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    {staffMembers
                      .filter(staff => staff.status === "active")
                      .map(staff => (
                        <SelectItem key={staff.id} value={staff.id.toString()}>
                          <div className="flex items-center justify-between w-full">
                            <span>{staff.name} ({staff.employeeId})</span>
                            <Badge variant="outline" className="ml-2">
                              ${staff.remainingSalary.toFixed(0)}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Staff Credit Information */}
              {selectedStaff && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <IconCurrencyDollar className="h-4 w-4" />
                      Credit Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Staff Member:</span>
                      <span className="font-medium">{selectedStaff.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Employee ID:</span>
                      <span>{selectedStaff.employeeId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Salary:</span>
                      <span>${selectedStaff.salary.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Advance Taken:</span>
                      <span className="text-orange-600">${selectedStaff.advanceTaken.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Available Balance:</span>
                      <span className="font-semibold text-green-600">${selectedStaff.remainingSalary.toFixed(2)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between">
                      <span>Purchase Amount:</span>
                      <span className="font-semibold">${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Remaining After Purchase:</span>
                      <span className={`font-semibold ${selectedStaff.remainingSalary - total >= 0 ? 'text-green-600' : 'text-destructive'}`}>
                        ${(selectedStaff.remainingSalary - total).toFixed(2)}
                      </span>
                    </div>
                    {selectedStaff.remainingSalary - total < 0 && (
                      <p className="text-sm text-destructive mt-2">
                        Insufficient balance for this purchase
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleCompletePayment}
            disabled={
              isSubmitting || 
              (paymentMethod === "cash" && cashReceivedNum < total) ||
              (paymentMethod === "credit" && (!selectedStaffId || (selectedStaff && total > selectedStaff.remainingSalary)))
            }
            className="min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <IconCalculator className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <IconReceipt className="mr-2 h-4 w-4" />
                {paymentMethod === "cash" ? "Complete Payment" : "Process Credit"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 