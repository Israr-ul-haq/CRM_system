"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { IconReceipt, IconPlus, IconMinus, IconTrash } from "@tabler/icons-react"

interface MenuItem {
  id?: string
  name: string
  price: number
  category: string
  preparationTime: number
  isAvailable: boolean
}

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  notes?: string
}

interface Order {
  id?: string
  tableNumber: string
  items: OrderItem[]
  total: number
  status: string
  notes?: string
  customerName?: string
  customerPhone?: string
}

interface OrderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order?: Order | null
  menuItems: MenuItem[]
  tables: Array<{ id?: string; number: string; status: string }>
  onSave: (order: Order) => void
}

const orderStatuses = [
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800" },
  { value: "preparing", label: "Preparing", color: "bg-blue-100 text-blue-800" },
  { value: "ready", label: "Ready", color: "bg-green-100 text-green-800" },
  { value: "served", label: "Served", color: "bg-gray-100 text-gray-800" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800" }
]

export default function OrderModal({ open, onOpenChange, order, menuItems, tables, onSave }: OrderModalProps) {
  const [formData, setFormData] = useState<Order>({
    tableNumber: "",
    items: [],
    total: 0,
    status: "pending"
  })
  const [selectedMenuItem, setSelectedMenuItem] = useState<string>("")
  const [itemQuantity, setItemQuantity] = useState(1)
  const [itemNotes, setItemNotes] = useState("")

  useEffect(() => {
    if (order) {
      setFormData(order)
    } else {
      setFormData({
        tableNumber: "",
        items: [],
        total: 0,
        status: "pending"
      })
    }
  }, [order])

  const handleInputChange = (field: keyof Order, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const addItemToOrder = () => {
    if (!selectedMenuItem || itemQuantity <= 0) return

    const menuItem = menuItems.find(item => item.id === selectedMenuItem)
    if (!menuItem || !menuItem.id) return

    const existingItem = formData.items.find(item => item.id === selectedMenuItem)
    
    if (existingItem) {
      // Update existing item quantity
      setFormData(prev => ({
        ...prev,
        items: prev.items.map(item =>
          item.id === selectedMenuItem
            ? { ...item, quantity: item.quantity + itemQuantity }
            : item
        )
      }))
    } else {
      // Add new item
      const newItem: OrderItem = {
        id: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: itemQuantity,
        notes: itemNotes
      }
      
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, newItem]
      }))
    }

    // Reset form
    setSelectedMenuItem("")
    setItemQuantity(1)
    setItemNotes("")
  }

  const removeItemFromOrder = (itemId: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }))
  }

  const updateItemQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItemFromOrder(itemId)
      return
    }

    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    }))
  }

  const calculateTotal = () => {
    return formData.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const orderWithTotal = { ...formData, total: calculateTotal() }
    onSave(orderWithTotal)
    onOpenChange(false)
  }

  const availableTables = tables.filter(table => 
    table.status === "available" || table.status === "occupied"
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconReceipt className="h-5 w-5" />
            {order ? "Edit Order" : "Create New Order"}
          </DialogTitle>
          <DialogDescription>
            {order ? "Update the order details" : "Create a new order for your restaurant"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Order Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tableNumber">Table Number *</Label>
                <Select value={formData.tableNumber} onValueChange={(value) => handleInputChange('tableNumber', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select table" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTables.map((table) => (
                      <SelectItem key={table.id} value={table.number}>
                        Table {table.number} ({table.status})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Order Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {orderStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  value={formData.customerName || ""}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  placeholder="Optional customer name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customerPhone">Customer Phone</Label>
                <Input
                  id="customerPhone"
                  value={formData.customerPhone || ""}
                  onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                  placeholder="Optional phone number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Order Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes || ""}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                placeholder="Special instructions, allergies, etc."
                rows={2}
              />
            </div>
          </div>

          {/* Add Items */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Add Items</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="menuItem">Select Item</Label>
                <Select value={selectedMenuItem} onValueChange={setSelectedMenuItem}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose menu item" />
                  </SelectTrigger>
                  <SelectContent>
                    {menuItems.filter(item => item.isAvailable && item.id).map((item) => (
                      <SelectItem key={item.id} value={item.id!}>
                        {item.name} - ${item.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={itemQuantity}
                  onChange={(e) => setItemQuantity(parseInt(e.target.value) || 1)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="itemNotes">Item Notes</Label>
                <Input
                  id="itemNotes"
                  value={itemNotes}
                  onChange={(e) => setItemNotes(e.target.value)}
                  placeholder="Special requests"
                />
              </div>
            </div>

            <Button type="button" onClick={addItemToOrder} disabled={!selectedMenuItem}>
              <IconPlus className="mr-2 h-4 w-4" />
              Add to Order
            </Button>
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Order Items</h3>
            
            {formData.items.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No items added to order yet</p>
            ) : (
              <div className="space-y-3">
                {formData.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{item.name}</div>
                      {item.notes && (
                        <div className="text-sm text-muted-foreground">{item.notes}</div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-medium">${item.price}</div>
                        <div className="text-sm text-muted-foreground">
                          Total: ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                        >
                          <IconMinus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                        >
                          <IconPlus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => removeItemFromOrder(item.id)}
                      >
                        <IconTrash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          {formData.items.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Order Summary</h3>
              
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Total Amount:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {formData.items.reduce((total, item) => total + item.quantity, 0)} items
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={formData.items.length === 0}>
              {order ? "Update Order" : "Create Order"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 