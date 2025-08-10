"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "@/store"
import { updateCompany } from "@/store/slices/companySlice"
import { fetchSubscriptions } from "@/store/slices/subscriptionSlice"
import { fetchPaymentMethods } from "@/store/slices/paymentMethodSlice"
import { Company, UpdateCompanyForm } from "@/backend/models/Company"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IconUpload, IconBuilding, IconGlobe, IconPhone, IconMail, IconMapPin, IconCurrency, IconClock } from "@tabler/icons-react"
import { toast } from "sonner"

interface CompanyProfileFormProps {
  company: Company | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨' }
]

const timezones = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Kolkata',
  'Asia/Dubai',
  'Australia/Sydney'
]

const businessTypes = [
  'Retail',
  'Restaurant',
  'Technology Services',
  'Healthcare',
  'Manufacturing',
  'Consulting',
  'Education',
  'Real Estate',
  'Finance',
  'Other'
]

export function CompanyProfileForm({ company, open, onOpenChange }: CompanyProfileFormProps) {
  const dispatch = useDispatch<AppDispatch>()
  const { subscriptions, loading: subscriptionLoading } = useSelector((state: RootState) => state.subscription)
  const { paymentMethods, loading: paymentMethodLoading } = useSelector((state: RootState) => state.paymentMethod)
  
  const [formData, setFormData] = useState<UpdateCompanyForm>({})
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name,
        email: company.email,
        phone: company.phone,
        website: company.website,
        address: company.address,
        city: company.city,
        state: company.state,
        country: company.country,
        postalCode: company.postalCode,
        businessType: company.businessType,
        taxId: company.taxId,
        currency: company.currency,
        timezone: company.timezone,
        subscriptionId: company.subscriptionId,
        paymentMethodId: company.paymentMethodId
      })
      setLogoPreview(company.logo || "")
    }
  }, [company])

  useEffect(() => {
    if (open) {
      dispatch(fetchSubscriptions())
      dispatch(fetchPaymentMethods())
    }
  }, [open, dispatch])

  const handleInputChange = (field: keyof UpdateCompanyForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!company) return

    setIsSubmitting(true)
    try {
      const updateData: UpdateCompanyForm = { ...formData }
      
      // Handle logo upload (in real app, this would upload to cloud storage)
      if (logoFile) {
        // Simulate logo upload
        updateData.logo = logoPreview
      }

      await dispatch(updateCompany({ id: company.id, data: updateData })).unwrap()
      
      toast.success("Company profile updated successfully!")
      onOpenChange(false)
    } catch (error) {
      toast.error("Failed to update company profile")
      console.error("Update error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getCurrencySymbol = (currencyCode: string) => {
    const currency = currencies.find(c => c.code === currencyCode)
    return currency?.symbol || currencyCode
  }

  const formatTimezone = (timezone: string) => {
    return timezone.replace('_', ' ').split('/').pop() || timezone
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconBuilding className="w-5 h-5" />
            Company Profile Settings
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Logo Section */}
          <Card>
            <CardHeader>
              <CardTitle>Company Logo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center overflow-hidden">
                  {logoPreview ? (
                    <img 
                      src={logoPreview} 
                      alt="Company logo" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <IconBuilding className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1">
                  <Label htmlFor="logo" className="text-sm font-medium">
                    Upload Logo
                  </Label>
                  <p className="text-sm text-muted-foreground mb-2">
                    Recommended size: 150x150px, Max file size: 2MB
                  </p>
                  <Input
                    id="logo"
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="max-w-xs"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Company Name *</Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter company name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type *</Label>
                <Select 
                  value={formData.businessType || ""} 
                  onValueChange={(value) => handleInputChange('businessType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  value={formData.phone || ""}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website || ""}
                  onChange={(e) => handleInputChange('website', e.target.value)}
                  placeholder="https://your-website.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID</Label>
                <Input
                  id="taxId"
                  value={formData.taxId || ""}
                  onChange={(e) => handleInputChange('taxId', e.target.value)}
                  placeholder="Enter tax identification number"
                />
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle>Address Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Street Address *</Label>
                <Input
                  id="address"
                  value={formData.address || ""}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="Enter street address"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city || ""}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Enter city"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State/Province *</Label>
                  <Input
                    id="state"
                    value={formData.state || ""}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="Enter state or province"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code *</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode || ""}
                    onChange={(e) => handleInputChange('postalCode', e.target.value)}
                    placeholder="Enter postal code"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  value={formData.country || ""}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  placeholder="Enter country"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Business Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Business Settings</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency *</Label>
                <Select 
                  value={formData.currency || ""} 
                  onValueChange={(value) => handleInputChange('currency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.symbol} {currency.name} ({currency.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone *</Label>
                <Select 
                  value={formData.timezone || ""} 
                  onValueChange={(value) => handleInputChange('timezone', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    {timezones.map((timezone) => (
                      <SelectItem key={timezone} value={timezone}>
                        {formatTimezone(timezone)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subscription">Subscription Plan *</Label>
                <Select 
                  value={formData.subscriptionId || ""} 
                  onValueChange={(value) => handleInputChange('subscriptionId', value)}
                  disabled={subscriptionLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subscription plan" />
                  </SelectTrigger>
                  <SelectContent>
                    {subscriptions.map((subscription) => (
                      <SelectItem key={subscription.id} value={subscription.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{subscription.name}</span>
                          <Badge variant="outline" className="ml-2">
                            {subscription.currency} {subscription.price}/{subscription.billingCycle}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select 
                  value={formData.paymentMethodId || ""} 
                  onValueChange={(value) => handleInputChange('paymentMethodId', value)}
                  disabled={paymentMethodLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((paymentMethod) => (
                      <SelectItem key={paymentMethod.id} value={paymentMethod.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{paymentMethod.name}</span>
                          <Badge variant="outline" className="ml-2 capitalize">
                            {paymentMethod.type}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 