"use client"

import { useState } from "react"
import { toast } from "sonner"
import { 
  IconUser, 
  IconMail, 
  IconPhone, 
  IconMapPin, 
  IconBuilding, 
  IconCalendar,
  IconEdit,
  IconDeviceFloppy,
  IconX,
  IconShield,
  IconKey,
  IconBell
} from "@tabler/icons-react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  avatar: string
  role: string
  department: string
  joinDate: string
  lastLogin: string
  status: "active" | "inactive"
  permissions: string[]
  address: string
  city: string
  state: string
  zipCode: string
  country: string
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // Mock user data - in real app this would come from your auth system
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: "USR001",
    name: "John Smith",
    email: "john.smith@company.com",
    phone: "+1 (555) 123-4567",
    avatar: "/avatars/john-smith.jpg",
    role: "Branch Manager",
    department: "Operations",
    joinDate: "2023-01-15",
    lastLogin: "2024-12-30 09:30 AM",
    status: "active",
    permissions: [
      "dashboard_view",
      "inventory_manage",
      "billing_process",
      "customer_manage",
      "staff_manage",
      "reports_view",
      "settings_manage"
    ],
    address: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States"
  })

  const [editForm, setEditForm] = useState<UserProfile>(userProfile)

  const handleEdit = () => {
    setEditForm(userProfile)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditForm(userProfile)
  }

  const handleSave = async () => {
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setUserProfile(editForm)
      setIsEditing(false)
      setIsLoading(false)
      toast.success("Profile updated successfully!")
    }, 1000)
  }

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const getPermissionLabel = (permission: string) => {
    const labels: Record<string, string> = {
      dashboard_view: "Dashboard View",
      inventory_manage: "Inventory Management",
      billing_process: "Billing Process",
      customer_manage: "Customer Management",
      staff_manage: "Staff Management",
      reports_view: "Reports View",
      settings_manage: "Settings Management"
    }
    return labels[permission] || permission
  }

  const getPermissionIcon = (permission: string) => {
    const icons: Record<string, string> = {
      dashboard_view: "📊",
      inventory_manage: "📦",
      billing_process: "💳",
      customer_manage: "👥",
      staff_manage: "👨‍💼",
      reports_view: "📈",
      settings_manage: "⚙️"
    }
    return icons[permission] || "🔑"
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
              <div className="px-4 lg:px-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
                    <p className="text-muted-foreground">
                      Manage your account settings and preferences
                    </p>
                  </div>
                  {!isEditing ? (
                    <Button onClick={handleEdit} className="flex items-center gap-2">
                      <IconEdit className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={handleCancel}
                        disabled={isLoading}
                      >
                        <IconX className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                                             <Button 
                         onClick={handleSave}
                         disabled={isLoading}
                         className="flex items-center gap-2"
                       >
                         <IconDeviceFloppy className="h-4 w-4" />
                         {isLoading ? "Saving..." : "Save Changes"}
                       </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-4 lg:px-6">
                <Tabs defaultValue="overview" className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                  </TabsList>

                  <TabsContent value="overview" className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Profile Card */}
                      <div className="lg:col-span-1">
                        <Card>
                          <CardHeader className="text-center">
                            <div className="flex justify-center mb-4">
                              <Avatar className="h-24 w-24">
                                <AvatarImage src={userProfile.avatar} alt={userProfile.name} />
                                <AvatarFallback className="text-2xl">
                                  {userProfile.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            <CardTitle>{userProfile.name}</CardTitle>
                            <CardDescription>{userProfile.role}</CardDescription>
                            <Badge variant={userProfile.status === "active" ? "default" : "secondary"}>
                              {userProfile.status}
                            </Badge>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <IconBuilding className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Department:</span>
                                <span className="font-medium">{userProfile.department}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <IconCalendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Joined:</span>
                                <span className="font-medium">{userProfile.joinDate}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <IconCalendar className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Last Login:</span>
                                <span className="font-medium">{userProfile.lastLogin}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Personal Information */}
                      <div className="lg:col-span-2 space-y-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <IconUser className="h-5 w-5" />
                              Personal Information
                            </CardTitle>
                            <CardDescription>
                              Update your personal details and contact information
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                  id="name"
                                  value={isEditing ? editForm.name : userProfile.name}
                                  onChange={(e) => handleInputChange('name', e.target.value)}
                                  disabled={!isEditing}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                  id="email"
                                  type="email"
                                  value={isEditing ? editForm.email : userProfile.email}
                                  onChange={(e) => handleInputChange('email', e.target.value)}
                                  disabled={!isEditing}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                  id="phone"
                                  value={isEditing ? editForm.phone : userProfile.phone}
                                  onChange={(e) => handleInputChange('phone', e.target.value)}
                                  disabled={!isEditing}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <Input
                                  id="role"
                                  value={isEditing ? editForm.role : userProfile.role}
                                  onChange={(e) => handleInputChange('role', e.target.value)}
                                  disabled={!isEditing}
                                />
                              </div>
                            </div>

                            <Separator />

                            <div className="space-y-2">
                              <Label htmlFor="address">Address</Label>
                              <Input
                                id="address"
                                value={isEditing ? editForm.address : userProfile.address}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                                disabled={!isEditing}
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input
                                  id="city"
                                  value={isEditing ? editForm.city : userProfile.city}
                                  onChange={(e) => handleInputChange('city', e.target.value)}
                                  disabled={!isEditing}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="state">State</Label>
                                <Input
                                  id="state"
                                  value={isEditing ? editForm.state : userProfile.state}
                                  onChange={(e) => handleInputChange('state', e.target.value)}
                                  disabled={!isEditing}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="zipCode">ZIP Code</Label>
                                <Input
                                  id="zipCode"
                                  value={isEditing ? editForm.zipCode : userProfile.zipCode}
                                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                                  disabled={!isEditing}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="country">Country</Label>
                                <Input
                                  id="country"
                                  value={isEditing ? editForm.country : userProfile.country}
                                  onChange={(e) => handleInputChange('country', e.target.value)}
                                  disabled={!isEditing}
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        {/* Permissions */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <IconShield className="h-5 w-5" />
                              Permissions
                            </CardTitle>
                            <CardDescription>
                              Your current system permissions and access levels
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {userProfile.permissions.map((permission) => (
                                <div
                                  key={permission}
                                  className="flex items-center gap-2 p-2 rounded-lg border"
                                >
                                  <span className="text-lg">{getPermissionIcon(permission)}</span>
                                  <span className="text-sm font-medium">
                                    {getPermissionLabel(permission)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="security" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <IconKey className="h-5 w-5" />
                          Security Settings
                        </CardTitle>
                        <CardDescription>
                          Manage your password and security preferences
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="current-password">Current Password</Label>
                            <Input id="current-password" type="password" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input id="new-password" type="password" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <Input id="confirm-password" type="password" />
                        </div>
                                                 <Button className="flex items-center gap-2">
                           <IconDeviceFloppy className="h-4 w-4" />
                           Update Password
                         </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="notifications" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <IconBell className="h-5 w-5" />
                          Notification Preferences
                        </CardTitle>
                        <CardDescription>
                          Configure how you receive notifications
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Email Notifications</h4>
                              <p className="text-sm text-muted-foreground">
                                Receive notifications via email
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              Configure
                            </Button>
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">System Alerts</h4>
                              <p className="text-sm text-muted-foreground">
                                Important system notifications
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              Configure
                            </Button>
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Inventory Alerts</h4>
                              <p className="text-sm text-muted-foreground">
                                Low stock and inventory notifications
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              Configure
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
} 