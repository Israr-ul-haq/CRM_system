"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  IconBuilding,
  IconUser,
  IconDeviceFloppy,
  IconX
} from "@tabler/icons-react"

interface CreateBranchForm {
  name: string
  location: string
  address: string
  phone: string
  email: string
  manager: string
  managerEmail: string
  managerPhone: string
  status: 'active' | 'inactive' | 'maintenance'
}

interface CreateBranchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (branchData: CreateBranchForm) => void
}

export function CreateBranchModal({ open, onOpenChange, onSubmit }: CreateBranchModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<CreateBranchForm>({
    name: "",
    location: "",
    address: "",
    phone: "",
    email: "",
    manager: "",
    managerEmail: "",
    managerPhone: "",
    status: 'active'
  })

  const handleInputChange = (field: keyof CreateBranchForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Call the parent onSubmit function
      onSubmit(formData)
      
      // Reset form and close modal
      setFormData({
        name: "",
        location: "",
        address: "",
        phone: "",
        email: "",
        manager: "",
        managerEmail: "",
        managerPhone: "",
        status: 'active'
      })
      onOpenChange(false)
    } catch (error) {
      console.error('Error creating branch:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    // Reset form and close modal
    setFormData({
      name: "",
      location: "",
      address: "",
      phone: "",
      email: "",
      manager: "",
      managerEmail: "",
      managerPhone: "",
      status: 'active'
    })
    onOpenChange(false)
  }

  const isFormValid = () => {
    return formData.name && 
           formData.location && 
           formData.address && 
           formData.phone && 
           formData.email && 
           formData.manager && 
           formData.managerEmail && 
           formData.managerPhone
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleCancel}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto bg-background rounded-lg shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold">Create New Branch</h2>
            <p className="text-muted-foreground mt-1">
              Add a new branch to your business network
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancel}
            className="h-8 w-8 p-0"
          >
            <IconX className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 md:grid-cols-2">
              {/* Branch Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconBuilding className="h-5 w-5" />
                    Branch Information
                  </CardTitle>
                  <CardDescription>
                    Basic details about the new branch
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Branch Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., Downtown Branch"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Downtown, North District"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Full Address *</Label>
                    <Textarea
                      id="address"
                      placeholder="Enter complete address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      required
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        placeholder="+1 (555) 123-4567"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="branch@company.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: 'active' | 'inactive' | 'maintenance') => 
                        handleInputChange('status', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Manager Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconUser className="h-5 w-5" />
                    Branch Manager
                  </CardTitle>
                  <CardDescription>
                    Contact information for the branch manager
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="manager">Manager Name *</Label>
                    <Input
                      id="manager"
                      placeholder="e.g., John Smith"
                      value={formData.manager}
                      onChange={(e) => handleInputChange('manager', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="managerEmail">Manager Email *</Label>
                    <Input
                      id="managerEmail"
                      type="email"
                      placeholder="john.smith@company.com"
                      value={formData.managerEmail}
                      onChange={(e) => handleInputChange('managerEmail', e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="managerPhone">Manager Phone *</Label>
                    <Input
                      id="managerPhone"
                      placeholder="+1 (555) 123-4567"
                      value={formData.managerPhone}
                      onChange={(e) => handleInputChange('managerPhone', e.target.value)}
                      required
                    />
                  </div>

                  <div className="pt-4">
                    <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                      <p className="font-medium mb-2">Note:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• The manager will be able to access this branch&apos;s dashboard</li>
                        <li>• Initial staff and inventory will need to be set up separately</li>
                        <li>• Branch will start with zero revenue and expenses</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid() || isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <IconDeviceFloppy className="w-4 h-4" />
                    Create Branch
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 