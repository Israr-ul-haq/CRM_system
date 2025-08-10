"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { IconChefHat, IconUpload } from "@tabler/icons-react"

interface MenuItem {
  id?: string
  name: string
  category: string
  price: number
  cost: number
  description: string
  isAvailable: boolean
  preparationTime: number
  image?: string
}

interface MenuItemModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item?: MenuItem | null
  onSave: (item: MenuItem) => void
}

const categories = [
  "Appetizers",
  "Soups",
  "Salads",
  "Main Course",
  "Pizza",
  "Pasta",
  "Burgers",
  "Sandwiches",
  "Desserts",
  "Beverages",
  "Alcoholic Drinks"
]

export default function MenuItemModal({ open, onOpenChange, item, onSave }: MenuItemModalProps) {
  const [formData, setFormData] = useState<MenuItem>({
    name: "",
    category: "",
    price: 0,
    cost: 0,
    description: "",
    isAvailable: true,
    preparationTime: 0
  })

  useEffect(() => {
    if (item) {
      setFormData(item)
    } else {
      setFormData({
        name: "",
        category: "",
        price: 0,
        cost: 0,
        description: "",
        isAvailable: true,
        preparationTime: 0
      })
    }
  }, [item])

  const handleInputChange = (field: keyof MenuItem, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onOpenChange(false)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // TODO: Implement actual image upload
      const reader = new FileReader()
      reader.onload = (e) => {
        handleInputChange('image', e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconChefHat className="h-5 w-5" />
            {item ? "Edit Menu Item" : "Add New Menu Item"}
          </DialogTitle>
          <DialogDescription>
            {item ? "Update the menu item details" : "Create a new menu item for your restaurant"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Basic Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Margherita Pizza"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the dish, ingredients, etc."
                rows={3}
              />
            </div>
          </div>

          {/* Pricing & Cost */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Pricing & Cost</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Selling Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cost">Cost Price *</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.cost}
                  onChange={(e) => handleInputChange('cost', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div className="p-3 bg-muted rounded-lg">
              <div className="text-sm font-medium">Profit Margin</div>
              <div className="text-lg font-bold text-green-600">
                ${((formData.price - formData.cost) || 0).toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground">
                {formData.price > 0 ? `${(((formData.price - formData.cost) / formData.price) * 100).toFixed(1)}% margin` : "0% margin"}
              </div>
            </div>
          </div>

          {/* Preparation & Availability */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Preparation & Availability</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="preparationTime">Preparation Time (minutes) *</Label>
                <Input
                  id="preparationTime"
                  type="number"
                  min="0"
                  value={formData.preparationTime}
                  onChange={(e) => handleInputChange('preparationTime', parseInt(e.target.value) || 0)}
                  placeholder="15"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="isAvailable">Available for Order</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="isAvailable"
                    checked={formData.isAvailable}
                    onCheckedChange={(checked) => handleInputChange('isAvailable', checked)}
                  />
                  <Label htmlFor="isAvailable">
                    {formData.isAvailable ? "Available" : "Unavailable"}
                  </Label>
                </div>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Item Image</h3>
            
            <div className="space-y-2">
              <Label htmlFor="image">Upload Image</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="flex-1"
                />
                <Button type="button" variant="outline" size="sm">
                  <IconUpload className="mr-2 h-4 w-4" />
                  Upload
                </Button>
              </div>
              {formData.image && (
                <div className="mt-2">
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    className="w-24 h-24 object-cover rounded-lg border"
                  />
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {item ? "Update Item" : "Add Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 