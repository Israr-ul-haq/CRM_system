"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { IconX, IconPlus } from "@tabler/icons-react"
import { toast } from "sonner"

interface Subscription {
  id: string
  name: string
  description: string
  price: number
  billingCycle: string
  maxUsers: number
  maxBranches: number
  storageLimit: string
  features: string[]
  status: string
  totalSubscribers: number
  monthlyRevenue: number
  createdAt: string
}

interface CreateSubscriptionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubscriptionCreated: (subscription: Subscription) => void
}

export function CreateSubscriptionModal({
  open,
  onOpenChange,
  onSubscriptionCreated
}: CreateSubscriptionModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    billingCycle: "monthly",
    maxUsers: "",
    maxBranches: "",
    storageLimit: "",
    status: "draft"
  })
  const [features, setFeatures] = useState<string[]>([])
  const [newFeature, setNewFeature] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()])
      setNewFeature("")
    }
  }

  const removeFeature = (featureToRemove: string) => {
    setFeatures(features.filter(feature => feature !== featureToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const newSubscription: Subscription = {
        id: "",
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        billingCycle: formData.billingCycle,
        maxUsers: parseInt(formData.maxUsers) || 0,
        maxBranches: parseInt(formData.maxBranches) || 0,
        storageLimit: formData.storageLimit,
        features: features,
        status: formData.status,
        totalSubscribers: 0,
        monthlyRevenue: 0,
        createdAt: new Date().toISOString().split('T')[0]
      }

      onSubscriptionCreated(newSubscription)
      toast.success("Subscription plan created successfully!")
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        billingCycle: "monthly",
        maxUsers: "",
        maxBranches: "",
        storageLimit: "",
        status: "draft"
      })
      setFeatures([])
      setNewFeature("")
    } catch (error) {
      toast.error("Failed to create subscription plan")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Subscription Plan</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Plan Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., Basic Plan"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="29.99"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe what this plan includes..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="billingCycle">Billing Cycle</Label>
                <Select value={formData.billingCycle} onValueChange={(value) => handleInputChange("billingCycle", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Limits */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Limits & Restrictions</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxUsers">Max Users</Label>
                <Input
                  id="maxUsers"
                  type="number"
                  min="1"
                  value={formData.maxUsers}
                  onChange={(e) => handleInputChange("maxUsers", e.target.value)}
                  placeholder="5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxBranches">Max Branches</Label>
                <Input
                  id="maxBranches"
                  type="number"
                  min="1"
                  value={formData.maxBranches}
                  onChange={(e) => handleInputChange("maxBranches", e.target.value)}
                  placeholder="2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="storageLimit">Storage Limit</Label>
                <Input
                  id="storageLimit"
                  value={formData.storageLimit}
                  onChange={(e) => handleInputChange("storageLimit", e.target.value)}
                  placeholder="10GB"
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Features</h3>
            
            <div className="space-y-2">
              <Label>Plan Features</Label>
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add a feature..."
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                />
                <Button type="button" onClick={addFeature} variant="outline" size="sm">
                  <IconPlus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {features.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {features.map((feature, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFeature(feature)}
                      className="ml-1 hover:text-destructive"
                    >
                      <IconX className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Plan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 