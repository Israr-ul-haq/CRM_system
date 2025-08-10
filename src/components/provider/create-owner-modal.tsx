"use client"

import { useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "@/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { IconUpload, IconBuilding, IconX } from "@tabler/icons-react"
import { toast } from "sonner"

interface Owner {
  id: string
  logo: string | null
  name: string
  email: string
  phone: string
  website: string
  businessType: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  subscriptionPlan: string
  paymentMethod: string
  status: string
  branches: number
  maxBranches: number
  storageUsed: string
  storageLimit: string
  subscriptionEndDate: string
  monthlyRevenue: number
  createdAt: string
  description: string
}

interface CreateOwnerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onOwnerCreated: (owner: Owner) => void
}

export function CreateOwnerModal({ open, onOpenChange, onOwnerCreated }: CreateOwnerModalProps) {
  const { subscriptions } = useSelector((state: RootState) => state.subscription)
  const { paymentMethods } = useSelector((state: RootState) => state.paymentMethod)
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    businessType: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    subscriptionPlanId: "",
    paymentMethodId: "",
    description: ""
  })
  
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const businessTypes = [
    "Restaurant",
    "Retail Store",
    "Coffee Shop",
    "Grocery Store",
    "Pharmacy",
    "Salon",
    "Gym",
    "Medical Clinic",
    "Law Office",
    "Real Estate",
    "Technology",
    "Manufacturing",
    "Other"
  ]

  const countries = [
    "United States",
    "Canada",
    "United Kingdom",
    "Australia",
    "Germany",
    "France",
    "Japan",
    "India",
    "Brazil",
    "Mexico",
    "Other"
  ]

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onload = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeLogo = () => {
    setLogoFile(null)
    setLogoPreview(null)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.subscriptionPlanId || !formData.paymentMethodId) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const newOwner: Owner = {
        id: Date.now().toString(),
        logo: logoPreview,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        website: formData.website,
        businessType: formData.businessType,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
        subscriptionPlan: subscriptions.find(s => s.id === formData.subscriptionPlanId)?.name || "Unknown Plan",
        paymentMethod: paymentMethods.find(pm => pm.id === formData.paymentMethodId)?.name || "Unknown Method",
        status: "trial",
        branches: 0,
        maxBranches: subscriptions.find(s => s.id === formData.subscriptionPlanId)?.maxBranches || 1,
        storageUsed: "0 GB",
        storageLimit: `${subscriptions.find(s => s.id === formData.subscriptionPlanId)?.dataStorageLimit || 2} GB`,
        subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        monthlyRevenue: 0,
        createdAt: new Date().toISOString().split('T')[0],
        description: formData.description
      }

      onOwnerCreated(newOwner)
      toast.success("Owner created successfully!")
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        website: "",
        businessType: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
        subscriptionPlanId: "",
        paymentMethodId: "",
        description: ""
      })
      setLogoFile(null)
      setLogoPreview(null)
      
    } catch (error) {
      toast.error("Failed to create owner. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      website: "",
      businessType: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      subscriptionPlanId: "",
      paymentMethodId: "",
      description: ""
    })
    setLogoFile(null)
    setLogoPreview(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconBuilding className="w-5 h-5" />
            Create New Owner
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo Upload Section */}
          <div className="space-y-4">
            <Label>Company Logo</Label>
            <div className="flex items-center gap-4">
              {logoPreview ? (
                <div className="relative">
                  <img 
                    src={logoPreview} 
                    alt="Logo preview" 
                    className="w-20 h-20 rounded-lg object-cover border"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={removeLogo}
                    className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full"
                  >
                    <IconX className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <div className="w-20 h-20 border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center">
                  <IconBuilding className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Upload a company logo (PNG, JPG, SVG up to 5MB)
                </p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter company name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Enter phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange("website", e.target.value)}
                placeholder="Enter website URL"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessType">Business Type</Label>
              <Select value={formData.businessType} onValueChange={(value) => handleInputChange("businessType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <Label>Address Information</Label>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter street address"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Enter city"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  placeholder="Enter state/province"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange("zipCode", e.target.value)}
                  placeholder="Enter ZIP/postal code"
                />
              </div>
            </div>
          </div>

          {/* Subscription & Payment */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="subscriptionPlan">Subscription Plan *</Label>
              <Select value={formData.subscriptionPlanId} onValueChange={(value) => handleInputChange("subscriptionPlanId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subscription plan" />
                </SelectTrigger>
                <SelectContent>
                  {subscriptions.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      {plan.name} - ${plan.price}/{plan.billingCycle}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method *</Label>
              <Select value={formData.paymentMethodId} onValueChange={(value) => handleInputChange("paymentMethodId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.id} value={method.id}>
                      {method.name} ({method.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Additional Notes</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter any additional notes or special requirements"
              rows={3}
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              disabled={isSubmitting}
            >
              Reset Form
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Owner"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 