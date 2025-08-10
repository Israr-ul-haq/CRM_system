"use client"

import { useState } from "react"
import { IconPlus, IconCurrencyDollar, IconTrash } from "@tabler/icons-react"
import { toast } from "sonner"
import { z } from "zod"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { Textarea } from "@/components/ui/textarea"
import { SupplierPurchaseOrders } from "@/components/supplier-purchase-orders"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const purchaseOrderSchema = z.object({
  purchaseOrderId: z.string().min(1, "Purchase order is required"),
  amount: z.string().min(1, "Amount is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Amount must be a positive number" }),
})

const addPaymentSchema = z.object({
  supplierId: z.string().min(1, "Supplier is required"),
  purchaseOrders: z.array(purchaseOrderSchema),
  paymentMethod: z.string().min(1, "Payment method is required"),
  paymentDate: z.string().min(1, "Payment date is required"),
  reference: z.string().min(1, "Reference is required"),
  notes: z.string().optional(),
}).refine((data) => data.purchaseOrders.length > 0, {
  message: "At least one purchase order is required",
  path: ["purchaseOrders"],
})

type AddPaymentFormData = z.infer<typeof addPaymentSchema>

interface AddPaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddPayment: (payment: {
    supplierId: string
    purchaseOrders: Array<{
      purchaseOrderId: string
      amount: number
    }>
    totalAmount: number
    paymentMethod: string
    paymentDate: string
    reference: string
    notes?: string
  }) => void
}

export function AddPaymentModal({ open, onOpenChange, onAddPayment }: AddPaymentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)


  const form = useForm<AddPaymentFormData>({
    resolver: zodResolver(addPaymentSchema),
    defaultValues: {
      supplierId: "",
      purchaseOrders: [],
      paymentMethod: "",
      paymentDate: new Date().toISOString().split('T')[0],
      reference: "",
      notes: "",
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "purchaseOrders",
  })

  const watchPurchaseOrders = form.watch("purchaseOrders")
  const totalAmount = watchPurchaseOrders.reduce((sum, order) => {
    return sum + (Number(order.amount) || 0)
  }, 0)

  const onSubmit = async (data: AddPaymentFormData) => {
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const paymentData = {
        supplierId: data.supplierId,
        purchaseOrders: data.purchaseOrders.map(order => ({
          purchaseOrderId: order.purchaseOrderId,
          amount: Number(order.amount),
        })),
        totalAmount,
        paymentMethod: data.paymentMethod,
        paymentDate: data.paymentDate,
        reference: data.reference,
        notes: data.notes,
      }
      
      onAddPayment(paymentData)
      form.reset()
      toast.success("Payment added successfully")
    } catch (error) {
      toast.error("Failed to add payment")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false)
      form.reset()
    }
  }

  const handleSelectPurchaseOrder = (purchaseOrder: {
    purchaseOrderId: string
    supplierId: number
    supplierName: string
    totalAmount: number
    paidAmount: number
    outstandingAmount: number
    purchaseDate: string
    description: string
    paymentStatus: string
  }) => {
    // Check if this purchase order is already selected
    const existingIndex = watchPurchaseOrders.findIndex(
      order => order.purchaseOrderId === purchaseOrder.purchaseOrderId
    )
    
    if (existingIndex >= 0) {
      // Remove if already selected
      remove(existingIndex)
    } else {
      // Add if not selected
      append({
        purchaseOrderId: purchaseOrder.purchaseOrderId,
        amount: purchaseOrder.outstandingAmount.toString(),
      })
    }
  }

  const addPurchaseOrder = () => {
    append({ purchaseOrderId: "", amount: "" })
  }

  const removePurchaseOrder = (index: number) => {
    if (fields.length > 1) {
      remove(index)
    }
  }

          return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent 
          className="sm:max-w-[1400px] max-h-[90vh] overflow-y-auto"
          onPointerDownOutside={(e) => e.preventDefault()}
        >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconPlus className="h-5 w-5" />
            Add Payment
          </DialogTitle>
          <DialogDescription>
            Select a supplier to view their purchase orders, then choose which orders to include in this payment. You can select multiple orders and adjust payment amounts for each.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Payment Form */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="supplierId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select supplier" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">TechCorp Solutions</SelectItem>
                          <SelectItem value="2">Global Textiles Ltd</SelectItem>
                          <SelectItem value="3">Office Supplies Plus</SelectItem>
                          <SelectItem value="4">Home & Garden Co</SelectItem>
                          <SelectItem value="5">Sports Equipment Pro</SelectItem>
                          <SelectItem value="6">Beauty Supplies Inc</SelectItem>
                          <SelectItem value="7">Automotive Parts Co</SelectItem>
                          <SelectItem value="8">Book Publishers Ltd</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Method</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                            <SelectItem value="credit_card">Credit Card</SelectItem>
                            <SelectItem value="check">Check</SelectItem>
                            <SelectItem value="cash">Cash</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paymentDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="reference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reference</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., PAY-2024-001, Check #1234" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter any additional notes (optional)"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Adding..." : "Add Payment"}
                  </Button>
                </DialogFooter>
              </div>

              {/* Right Column - Supplier Purchase Orders */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Supplier Purchase Orders</h3>
                  <span className="text-sm text-muted-foreground">
                    Select orders to include in this payment
                  </span>
                </div>
                
                <SupplierPurchaseOrders 
                  supplierId={form.watch("supplierId")} 
                  onSelectPurchaseOrder={handleSelectPurchaseOrder}
                  selectedOrders={watchPurchaseOrders.map(order => order.purchaseOrderId)}
                />
              </div>
            </div>

            {/* Purchase Orders Table */}
            <Separator />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Selected Purchase Orders</h3>
                <Button type="button" variant="outline" size="sm" onClick={addPurchaseOrder}>
                  <IconPlus className="mr-2 h-4 w-4" />
                  Add Manual Entry
                </Button>
              </div>

              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Purchase Order</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`purchaseOrders.${index}.purchaseOrderId`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input 
                                    placeholder="Enter purchase order ID" 
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          <FormField
                            control={form.control}
                            name={`purchaseOrders.${index}.amount`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <div className="relative">
                                    <IconCurrencyDollar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                      type="number"
                                      step="0.01"
                                      placeholder="0.00"
                                      className="pl-9"
                                      {...field}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </TableCell>
                        <TableCell>
                          {fields.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removePurchaseOrder(index)}
                            >
                              <IconTrash className="h-4 w-4" />
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Total Amount */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <span className="flex items-center gap-2">
                      <IconCurrencyDollar className="h-5 w-5" />
                      Total Payment Amount
                    </span>
                    <span className="text-2xl text-green-600">${totalAmount.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 