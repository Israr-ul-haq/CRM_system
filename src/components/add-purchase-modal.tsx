"use client"

import { useState, useRef } from "react"
import { IconPlus, IconTrash, IconCalculator, IconSearch } from "@tabler/icons-react"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { InventoryModal } from "@/components/inventory-modal"

const purchaseItemSchema = z.object({
  inventoryId: z.string().min(1, "Product is required"),
  quantity: z.string().min(1, "Quantity is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Quantity must be a positive number" }),
  unitCost: z.string().min(1, "Unit cost is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Unit cost must be a positive number" }),
})

const addPurchaseSchema = z.object({
  supplierId: z.string().min(1, "Supplier is required"),
  companyId: z.string().min(1, "Company is required"),
  expectedDelivery: z.string().min(1, "Expected delivery date is required"),
  paymentStatus: z.string().min(1, "Payment status is required"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  checkDate: z.string().optional(),
  partialAmount: z.string().optional(),
  items: z.array(purchaseItemSchema).min(1, "At least one item is required"),
  notes: z.string().optional(),
})

type AddPurchaseFormData = z.infer<typeof addPurchaseSchema>

interface AddPurchaseModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddPurchase: (purchase: {
    supplierId: string
    companyId: string
    items: Array<{
      inventoryId: string
      quantity: number
      unitCost: number
    }>
    totalAmount: number
    paymentStatus: string
    paymentMethod: string
    checkDate?: string
    partialAmount?: number
    expectedDelivery: string
    notes?: string
  }) => void
}

export function AddPurchaseModal({ open, onOpenChange, onAddPurchase }: AddPurchaseModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<AddPurchaseFormData>({
    resolver: zodResolver(addPurchaseSchema),
                  defaultValues: {
          supplierId: "",
          companyId: "",
          expectedDelivery: "",
          paymentStatus: "pending",
          paymentMethod: "",
          checkDate: "",
          partialAmount: "",
          items: [],
          notes: "",
        },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  })

  const watchItems = form.watch("items")
  const watchPaymentStatus = form.watch("paymentStatus")
  const watchPaymentMethod = form.watch("paymentMethod")
  const totalAmount = watchItems.reduce((sum, item) => {
    const quantity = Number(item.quantity) || 0
    const unitCost = Number(item.unitCost) || 0
    return sum + (quantity * unitCost)
  }, 0)

  const onSubmit = async (data: AddPurchaseFormData) => {
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const purchaseData = {
        supplierId: data.supplierId,
        companyId: data.companyId,
        items: data.items.map(item => ({
          inventoryId: item.inventoryId,
          quantity: Number(item.quantity),
          unitCost: Number(item.unitCost),
        })),
        totalAmount,
        paymentStatus: data.paymentStatus,
        paymentMethod: data.paymentMethod,
        checkDate: data.checkDate || undefined,
        partialAmount: data.partialAmount ? Number(data.partialAmount) : undefined,
        expectedDelivery: data.expectedDelivery,
        notes: data.notes,
      }
      
      onAddPurchase(purchaseData)
      
      // Automatically create a credit entry for the supplier
      const creditEntry = {
        supplierId: data.supplierId,
        type: "credit" as const,
        amount: totalAmount,
        reference: `PO-${Date.now()}`,
        description: data.notes || "Purchase order",
        date: new Date().toISOString(),
        paymentMethod: null,
        balance: totalAmount, // This would be calculated based on existing balance
      }
      
      console.log("Created credit entry:", creditEntry)
      form.reset()
      toast.success("Purchase order created successfully")
    } catch (error) {
      toast.error("Failed to create purchase order")
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

  const addItem = () => {
    append({ inventoryId: "", quantity: "", unitCost: "" })
  }

  const removeItem = (index: number) => {
    if (fields.length > 1) {
      remove(index)
    }
  }

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      // For now, just open the inventory modal
      // In a real app, you'd search for the product first
      setIsInventoryModalOpen(true)
    }
  }

  const handleAddItemFromInventory = (item: { id: number; cost: number; name: string; sku: string }) => {
    append({
      inventoryId: item.id.toString(),
      quantity: "1",
      unitCost: item.cost.toString(),
    })
    setSearchQuery("")
    setIsInventoryModalOpen(false)
    searchInputRef.current?.focus()
  }

  // Product name mapping for display
  const getProductDisplayName = (inventoryId: string) => {
    if (!inventoryId) return ""
    
    const productNames: { [key: string]: string } = {
      "1": "iPhone 15 Pro",
      "2": "Samsung Galaxy S24",
      "3": "Nike Air Max 270",
      "4": "The Great Gatsby",
      "5": "Coffee Maker Deluxe",
      "6": "Levi's 501 Jeans",
      "7": "MacBook Air M2",
      "8": "Yoga Mat Premium",
      "9": "To Kill a Mockingbird",
      "10": "Blender Pro 2000",
      "11": "Adidas Ultraboost",
      "12": "H&M T-Shirt",
      "13": "iPad Air 5th Gen",
      "14": "Garden Hose 50ft",
      "15": "1984 by George Orwell",
    }
    
    return productNames[inventoryId] || `Product ID: ${inventoryId}`
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[1200px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconPlus className="h-5 w-5" />
            Create New Purchase Order
          </DialogTitle>
          <DialogDescription>
            Add a new purchase order with items and payment details.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              <FormField
                control={form.control}
                name="companyId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select company" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">TechCorp Solutions Inc</SelectItem>
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

              <FormField
                control={form.control}
                name="expectedDelivery"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expected Delivery</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paymentStatus"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="partial">Partial</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

                                 <FormField
                     control={form.control}
                     name="paymentMethod"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel>Payment Method</FormLabel>
                         <Select onValueChange={field.onChange} defaultValue={field.value}>
                           <FormControl>
                             <SelectTrigger>
                               <SelectValue placeholder="Select payment method" />
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
                 </div>

                 {/* Conditional Fields */}
                 {watchPaymentMethod === "check" && (
                   <FormField
                     control={form.control}
                     name="checkDate"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel>Check Date</FormLabel>
                         <FormControl>
                           <Input type="date" {...field} />
                         </FormControl>
                         <FormMessage />
                       </FormItem>
                     )}
                   />
                 )}

                 {watchPaymentStatus === "partial" && (
                   <FormField
                     control={form.control}
                     name="partialAmount"
                     render={({ field }) => (
                       <FormItem>
                         <FormLabel>Amount Paid</FormLabel>
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
                 )}

            <Separator />

            {/* Items Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Purchase Items</h3>
                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                  <IconPlus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  ref={searchInputRef}
                  placeholder="Search products by name or barcode, press Enter to add..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  className="pl-9"
                />
              </div>

              {/* Items Table */}
              <div className="border rounded-md">
                <ScrollArea className="h-[300px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[250px]">Product (Added via Search)</TableHead>
                        <TableHead className="w-[100px]">Quantity</TableHead>
                        <TableHead className="w-[120px]">Unit Cost</TableHead>
                        <TableHead className="w-[120px]">Total</TableHead>
                        <TableHead className="w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fields.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            No items added yet. Use the search bar above to add products.
                          </TableCell>
                        </TableRow>
                      ) : (
                        fields.map((field, index) => (
                          <TableRow key={field.id}>
                            <TableCell>
                              <FormField
                                control={form.control}
                                name={`items.${index}.inventoryId`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input 
                                        placeholder="Product will be added via search" 
                                        value={getProductDisplayName(field.value)}
                                        disabled
                                        className="bg-muted"
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
                                name={`items.${index}.quantity`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input type="number" placeholder="0" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <FormField
                                control={form.control}
                                name={`items.${index}.unitCost`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormControl>
                                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="font-medium text-green-600">
                                ${((Number(watchItems[index]?.quantity) || 0) * (Number(watchItems[index]?.unitCost) || 0)).toFixed(2)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(index)}
                              >
                                <IconTrash className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            </div>

            {/* Total Amount */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between text-lg font-semibold">
                  <span className="flex items-center gap-2">
                    <IconCalculator className="h-5 w-5" />
                    Total Amount
                  </span>
                  <span className="text-2xl text-green-600">${totalAmount.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
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
                {isSubmitting ? "Creating..." : "Create Purchase Order"}
              </Button>
            </DialogFooter>
          </form>
        </Form>

        {/* Inventory Modal */}
        <InventoryModal
          open={isInventoryModalOpen}
          onOpenChange={setIsInventoryModalOpen}
          onSelectProduct={handleAddItemFromInventory}
        />
      </DialogContent>
    </Dialog>
  )
} 