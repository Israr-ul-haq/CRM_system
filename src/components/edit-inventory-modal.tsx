"use client"

import { useState, useEffect } from "react"
import { IconEdit, IconX } from "@tabler/icons-react"
import { toast } from "sonner"
import { z } from "zod"
import { useForm } from "react-hook-form"
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
  FormDescription,
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

const editInventorySchema = z.object({
  name: z.string().min(1, "Product name is required"),
  sku: z.string().min(1, "SKU is required"),
  category: z.string().min(1, "Category is required"),
  price: z.string().min(1, "Price is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Price must be a positive number" }),
  cost: z.string().min(1, "Cost is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Cost must be a positive number" }),
  stock: z.string().min(1, "Stock is required").refine((val) => !isNaN(Number(val)) && Number(val) >= 0, { message: "Stock must be a non-negative number" }),
  minStock: z.string().min(1, "Minimum stock is required").refine((val) => !isNaN(Number(val)) && Number(val) >= 0, { message: "Minimum stock must be a non-negative number" }),
  supplier: z.string().min(1, "Supplier is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().optional(),
})

type EditInventoryFormData = z.infer<typeof editInventorySchema>

interface InventoryItem {
  id: number
  name: string
  sku: string
  category: string
  price: number
  cost: number
  stock: number
  minStock: number
  status: string
  supplier: string
  location: string
  lastUpdated: string
}

interface EditInventoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item?: InventoryItem
  onSave?: (item: EditInventoryFormData) => void
}

export function EditInventoryModal({ open, onOpenChange, item, onSave }: EditInventoryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<EditInventoryFormData>({
    resolver: zodResolver(editInventorySchema),
    defaultValues: {
      name: "",
      sku: "",
      category: "",
      price: "",
      cost: "",
      stock: "",
      minStock: "",
      supplier: "",
      location: "",
      description: "",
    },
  })

  // Reset form when item changes or modal opens
  useEffect(() => {
    if (open && item) {
      form.reset({
        name: item.name,
        sku: item.sku,
        category: item.category,
        price: item.price.toString(),
        cost: item.cost.toString(),
        stock: item.stock.toString(),
        minStock: item.minStock.toString(),
        supplier: item.supplier,
        location: item.location,
        description: "",
      })
    }
  }, [open, item, form])

  const onSubmit = async (data: EditInventoryFormData) => {
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onSave?.(data)
      toast.success(`Updated ${data.name} successfully`)
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to update item")
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

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconEdit className="h-5 w-5" />
            Edit Inventory Item
          </DialogTitle>
          <DialogDescription>
            Update the details for {item?.name || "this item"}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter SKU" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="clothing">Clothing</SelectItem>
                        <SelectItem value="books">Books</SelectItem>
                        <SelectItem value="home">Home & Garden</SelectItem>
                        <SelectItem value="sports">Sports & Outdoors</SelectItem>
                        <SelectItem value="beauty">Beauty & Health</SelectItem>
                        <SelectItem value="automotive">Automotive</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Stock</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="minStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Stock</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter supplier name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter storage location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter product description (optional)"
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
                {isSubmitting ? "Updating..." : "Update Item"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 