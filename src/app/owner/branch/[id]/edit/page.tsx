"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { 
  IconArrowLeft,
  IconBuilding,
  IconMapPin,
  IconUser,
  IconMail,
  IconPhone,
  IconDeviceFloppy,
  IconTrash
} from "@tabler/icons-react"

interface Branch {
  id: string
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

const mockBranch: Branch = {
  id: "1",
  name: "Main Branch - Downtown",
  location: "Downtown",
  address: "123 Main Street, Downtown, City, State 12345",
  phone: "+1 (555) 987-6543",
  email: "downtown@company.com",
  manager: "John Smith",
  managerEmail: "john.smith@company.com",
  managerPhone: "+1 (555) 123-4567",
  status: 'active'
}

export default function EditBranchPage() {
  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [branch, setBranch] = useState<Branch | null>(null)
  const [formData, setFormData] = useState<Branch>({
    id: "",
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

  useEffect(() => {
    // Simulate API call to fetch branch data
    setTimeout(() => {
      setBranch(mockBranch)
      setFormData(mockBranch)
    }, 500)
  }, [params.id])

  const handleInputChange = (field: keyof Branch, value: string) => {
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
      
      // In a real app, you would send the data to your API
      console.log('Updating branch:', formData)
      
      // Redirect to branch detail page
      router.push(`/owner/branch/${params.id}`)
    } catch (error) {
      console.error('Error updating branch:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this branch? This action cannot be undone.')) {
      return
    }

    setIsDeleting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In a real app, you would send the delete request to your API
      console.log('Deleting branch:', params.id)
      
      // Redirect to owner dashboard
      router.push('/owner')
    } catch (error) {
      console.error('Error deleting branch:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleBack = () => {
    router.push(`/owner/branch/${params.id}`)
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

  if (!branch) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading branch details...</p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {/* Header */}
              <div className="border-b bg-card">
                <div className="max-w-4xl mx-auto px-4 py-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleBack}
                        className="flex items-center gap-2"
                      >
                        <IconArrowLeft className="w-4 h-4" />
                        Back to Branch
                      </Button>
                      <div>
                        <h1 className="text-3xl font-bold">Edit Branch</h1>
                        <p className="text-muted-foreground mt-2">
                          Modify branch information and settings
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="flex items-center gap-2"
                    >
                      {isDeleting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <IconTrash className="w-4 h-4" />
                          Delete Branch
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="px-4 lg:px-6">
                <div className="max-w-4xl mx-auto">
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
                            Basic details about the branch
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
                                <li>• Changes will be reflected immediately</li>
                                <li>• Manager access will be updated automatically</li>
                                <li>• Branch status changes may affect operations</li>
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
                        onClick={handleBack}
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
                            Saving...
                          </>
                        ) : (
                          <>
                            <IconDeviceFloppy className="w-4 h-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 