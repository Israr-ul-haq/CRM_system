"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { IconUser, IconMail, IconPhone, IconMapPin, IconCreditCard, IconUserCheck } from "@tabler/icons-react"
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

const editCustomerSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  creditLimit: z.string().min(1, "Credit limit is required").refine(
    (val) => !isNaN(Number(val)) && Number(val) >= 0,
    "Credit limit must be a positive number"
  ),
  status: z.enum(["active", "inactive", "suspended"])
})

type EditCustomerFormData = z.infer<typeof editCustomerSchema>

interface EditCustomerModalProps {
  isOpen: boolean
  onClose: () => void
  customer: Customer | null
  onSubmit: (data: EditCustomerFormData) => Promise<void>
}

export function EditCustomerModal({ isOpen, onClose, customer, onSubmit }: EditCustomerModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<EditCustomerFormData>({
    resolver: zodResolver(editCustomerSchema),
    defaultValues: {
      customerId: "",
      name: "",
      email: "",
      phone: "",
      address: "",
      creditLimit: "",
      status: "active"
    }
  })

  // Update form when customer data changes
  useEffect(() => {
    if (customer) {
      form.reset({
        customerId: customer.customerId,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        creditLimit: customer.creditLimit.toString(),
        status: customer.status
      })
    }
  }, [customer, form])

  const handleSubmit = async (data: EditCustomerFormData) => {
    try {
      setIsSubmitting(true)
      await onSubmit(data)
    } catch (error) {
      console.error("Error updating customer:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      onClose()
    }
  }

  if (!customer) return null

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconUser className="h-5 w-5" />
            Edit Customer - {customer.name}
          </DialogTitle>
          <DialogDescription>
            Update customer information and credit settings
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Customer ID */}
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <IconUser className="h-4 w-4" />
                      Customer ID
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="CUST001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <IconMail className="h-4 w-4" />
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john.smith@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <IconPhone className="h-4 w-4" />
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="+1-555-0123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Credit Limit */}
              <FormField
                control={form.control}
                name="creditLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <IconCreditCard className="h-4 w-4" />
                      Credit Limit ($)
                    </FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="5000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <IconUserCheck className="h-4 w-4" />
                      Status
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Address - Full Width */}
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <IconMapPin className="h-4 w-4" />
                    Address
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="123 Main St, City, State 12345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Current Credit Information */}
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <h4 className="font-medium text-sm">Current Credit Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Credit Used:</span>
                  <span className="ml-2 font-medium text-orange-600">${customer.creditUsed.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Available:</span>
                  <span className="ml-2 font-medium text-green-600">${customer.creditAvailable.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Outstanding:</span>
                  <span className="ml-2 font-medium text-red-600">${customer.outstandingBalance.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Total Purchases:</span>
                  <span className="ml-2 font-medium">{customer.totalPurchases}</span>
                </div>
              </div>
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Customer"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 