"use client"

import { useState } from "react"
import { IconX } from "@tabler/icons-react"
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

const addInventorySchema = z.object({
  name: z.string().min(1, "Product name is required"),
  sku: z.string().min(1, "SKU is required"),
  category: z.string().min(1, "Category is required"),
  price: z.string().min(1, "Price is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a positive number"
  }),
  cost: z.string().min(1, "Cost is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Cost must be a positive number"
  }),
  stock: z.string().min(1, "Stock is required").refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Stock must be a non-negative number"
  }),
  minStock: z.string().min(1, "Minimum stock is required").refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Minimum stock must be a non-negative number"
  }),
  supplierId: z.string().min(1, "Supplier is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().optional(),
})

type AddInventoryFormData = z.infer<typeof addInventorySchema>

interface AddInventoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddItem?: (item: AddInventoryFormData) => void
}

export function AddInventoryModal({ open, onOpenChange, onAddItem }: AddInventoryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<AddInventoryFormData>({
    resolver: zodResolver(addInventorySchema),
    defaultValues: {
      name: "",
      sku: "",
      category: "",
      price: "",
      cost: "",
      stock: "",
      minStock: "",
      supplierId: "",
      location: "",
      description: "",
    },
  })

  const onSubmit = async (data: AddInventoryFormData) => {
    setIsSubmitting(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Call the parent component's callback
      onAddItem?.(data)
      
      // Show success message
      toast.success("Item added successfully!")
      
      // Reset form and close modal
      form.reset()
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to add item. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Add New Inventory Item
          </DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new product to your inventory.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name *</FormLabel>
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
                    <FormLabel>SKU *</FormLabel>
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
                    <FormLabel>Category *</FormLabel>
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
                        <SelectItem value="sports">Sports</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplierId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier *</FormLabel>
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
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price *</FormLabel>
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

              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cost *</FormLabel>
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

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Stock *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field} 
                      />
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
                    <FormLabel>Minimum Stock *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Location *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Warehouse A, Shelf B3" {...field} />
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
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Optional description for the product
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                {isSubmitting ? "Adding..." : "Add Item"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 