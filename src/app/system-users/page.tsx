"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  IconUsers, 
  IconShield, 
  IconPlus, 
  IconEdit, 
  IconTrash, 
  IconEye,
  IconUserCheck,
  IconLock
} from "@tabler/icons-react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import RoleModal from "@/components/system-users/role-modal"
import UserModal from "@/components/system-users/user-modal"
import UserActivityModal from "@/components/system-users/user-activity-modal"
import RoleViewModal from "@/components/system-users/role-view-modal"
import UserViewModal from "@/components/system-users/user-view-modal"
import { SYSTEM_PERMISSIONS } from "@/components/system-users/permissions-config"

// Mock data for demonstration
const mockRoles = [
  {
    id: "1",
    name: "Super Admin",
    description: "Full system access with all permissions",
    permissions: [
      "users.view", "users.create", "users.edit", "users.delete", "users.activate",
      "roles.view", "roles.create", "roles.edit", "roles.delete",
      "inventory.view", "inventory.create", "inventory.edit", "inventory.delete", "inventory.stock", "inventory.categories",
      "billing.view", "billing.create", "billing.edit", "billing.delete", "billing.refunds", "billing.discounts",
      "purchases.view", "purchases.create", "purchases.edit", "purchases.delete", "purchases.approve",
      "suppliers.view", "suppliers.create", "suppliers.edit", "suppliers.delete", "suppliers.payments",
      "customers.view", "customers.create", "customers.edit", "customers.delete", "customers.credit",
      "staff.view", "staff.create", "staff.edit", "staff.delete", "staff.schedule", "staff.salary", "staff.checkin", "staff.own.view",
      "restaurant.view", "restaurant.menu", "restaurant.orders", "restaurant.tables", "restaurant.staff", "restaurant.stats", "restaurant.sales",
      "reports.view", "reports.sales", "reports.inventory", "reports.financial", "reports.export", "reports.restaurant",
      "settings.view", "settings.general", "settings.business", "settings.backup", "settings.security"
    ],
    isActive: true,
    isSystem: true,
    userCount: 1
  },
  {
    id: "2",
    name: "Branch Manager",
    description: "Manages branch operations and staff",
    permissions: [
      "inventory.view", "inventory.create", "inventory.edit", "inventory.stock",
      "billing.view", "billing.create", "billing.edit", "billing.refunds",
      "purchases.view", "purchases.create", "purchases.edit",
      "suppliers.view", "suppliers.create", "suppliers.edit",
      "customers.view", "customers.create", "customers.edit",
      "staff.view", "staff.create", "staff.edit", "staff.schedule", "staff.salary",
      "restaurant.view", "restaurant.menu", "restaurant.orders", "restaurant.tables", "restaurant.staff",
      "reports.view", "reports.sales", "reports.inventory", "reports.restaurant"
    ],
    isActive: true,
    isSystem: false,
    userCount: 3
  },
  {
    id: "3",
    name: "Sales Staff",
    description: "Handles sales and customer interactions",
    permissions: [
      "billing.view", "billing.create", "billing.edit",
      "customers.view", "customers.create", "customers.edit",
      "staff.own.view", "staff.checkin"
    ],
    isActive: true,
    isSystem: false,
    userCount: 8
  },
  {
    id: "4",
    name: "Inventory Manager",
    description: "Manages stock and suppliers",
    permissions: [
      "inventory.view", "inventory.create", "inventory.edit", "inventory.delete", "inventory.stock", "inventory.categories",
      "suppliers.view", "suppliers.create", "suppliers.edit",
      "purchases.view", "purchases.create", "purchases.edit"
    ],
    isActive: true,
    isSystem: false,
    userCount: 2
  },
  {
    id: "5",
    name: "Restaurant Staff",
    description: "Manages restaurant operations and orders",
    permissions: [
      "restaurant.view", "restaurant.menu", "restaurant.orders", "restaurant.tables",
      "staff.own.view", "staff.checkin"
    ],
    isActive: true,
    isSystem: false,
    userCount: 5
  }
]

const mockUsers = [
  {
    id: "1",
    name: "John Admin",
    email: "admin@company.com",
    roleId: "1",
    role: "Super Admin",
    isActive: true,
    lastLogin: "2024-01-15T10:30:00Z"
  },
  {
    id: "2",
    name: "Sarah Manager",
    email: "sarah@company.com",
    roleId: "2",
    role: "Branch Manager",
    isActive: true,
    lastLogin: "2024-01-15T09:15:00Z"
  },
  {
    id: "3",
    name: "Mike Sales",
    email: "mike@company.com",
    roleId: "3",
    role: "Sales Staff",
    isActive: true,
    lastLogin: "2024-01-15T08:45:00Z"
  }
]

const permissionLabels = {
  users: "User Management",
  roles: "Role Management", 
  inventory: "Inventory",
  billing: "Billing",
  purchases: "Purchase Management",
  suppliers: "Supplier Management",
  customers: "Customer Management",
  staff: "Staff Management",
  restaurant: "Restaurant Management",
  reports: "Reports & Analytics",
  settings: "System Settings"
}

// Helper function to get permission category from permission key
const getPermissionCategory = (permissionKey: string) => {
  const [category] = permissionKey.split('.')
  return category
}

// Helper function to format permission display
const formatPermissionDisplay = (permissions: string[]) => {
  const categories = new Set(permissions.map(p => getPermissionCategory(p)))
  return Array.from(categories).map(category => {
    const permission = SYSTEM_PERMISSIONS.find(p => p.key === category)
    return permission?.label || category
  })
}

export default function SystemUsersPage() {
  const [activeTab, setActiveTab] = useState("roles")
  const [roles, setRoles] = useState(mockRoles)
  const [users, setUsers] = useState(mockUsers)
  
  // Modal states
  const [roleModalOpen, setRoleModalOpen] = useState(false)
  const [userModalOpen, setUserModalOpen] = useState(false)
  const [activityModalOpen, setActivityModalOpen] = useState(false)
  
  // View modal states
  const [viewingRole, setViewingRole] = useState<typeof mockRoles[0] | null>(null)
  const [viewingUser, setViewingUser] = useState<typeof mockUsers[0] | null>(null)
  const [roleViewModalOpen, setRoleViewModalOpen] = useState(false)
  const [userViewModalOpen, setUserViewModalOpen] = useState(false)
  
  // Edit states
  const [editingRole, setEditingRole] = useState<typeof mockRoles[0] | null>(null)
  const [editingUser, setEditingUser] = useState<typeof mockUsers[0] | null>(null)

  const handleAddNew = () => {
    if (activeTab === "roles") {
      setEditingRole(null)
      setRoleModalOpen(true)
    } else {
      setEditingUser(null)
      setUserModalOpen(true)
    }
  }

  const handleEditRole = (role: typeof mockRoles[0]) => {
    setEditingRole(role)
    setRoleModalOpen(true)
  }

  const handleEditUser = (user: typeof mockUsers[0]) => {
    setEditingUser(user)
    setUserModalOpen(true)
  }

  const handleSaveRole = (roleData: { name: string; description: string; permissions: string[]; isActive: boolean }) => {
    if (editingRole) {
      // Update existing role
      setRoles(prev => prev.map(r => r.id === editingRole.id ? { ...roleData, id: editingRole.id, userCount: editingRole.userCount, isSystem: editingRole.isSystem } : r))
    } else {
      // Add new role
      const newRole = { ...roleData, id: Date.now().toString(), userCount: 0, isSystem: false }
      setRoles(prev => [...prev, newRole])
    }
  }

  const handleSaveUser = (userData: { name: string; email: string; phone?: string; roleId: string; isActive: boolean; password?: string }) => {
    if (editingUser) {
      // Update existing user
      setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...userData } : u))
    } else {
      // Add new user
      const newUser = { 
        ...userData, 
        id: Date.now().toString(), 
        role: roles.find(r => r.id === userData.roleId)?.name || "Unknown",
        lastLogin: new Date().toISOString()
      }
      setUsers(prev => [...prev, newUser])
      
      // Update role user count
      setRoles(prev => prev.map(r => r.id === userData.roleId ? { ...r, userCount: r.userCount + 1 } : r))
    }
  }

  const handleDeleteRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId)
    if (role && role.userCount > 0) {
      alert(`Cannot delete role "${role.name}" - it has ${role.userCount} users assigned`)
      return
    }
    setRoles(prev => prev.filter(r => r.id !== roleId))
  }

  const handleDeleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId)
    if (user) {
      // Update role user count
      setRoles(prev => prev.map(r => r.name === user.role ? { ...r, userCount: r.userCount - 1 } : r))
    }
    setUsers(prev => prev.filter(u => u.id !== userId))
  }

  const handleViewRole = (role: typeof mockRoles[0]) => {
    setViewingRole(role)
    setRoleViewModalOpen(true)
  }

  const handleViewUser = (user: typeof mockUsers[0]) => {
    setViewingUser(user)
    setUserViewModalOpen(true)
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
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">System Users</h1>
                    <p className="text-muted-foreground">
                      Manage user roles, permissions, and access control
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setActivityModalOpen(true)}>
                      <IconUserCheck className="mr-2 h-4 w-4" />
                      User Activity
                    </Button>
                    <Button onClick={handleAddNew}>
                      <IconPlus className="mr-2 h-4 w-4" />
                      Add New
                    </Button>
                  </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="roles" className="flex items-center gap-2">
                      <IconShield className="h-4 w-4" />
                      Roles & Permissions
                    </TabsTrigger>
                    <TabsTrigger value="users" className="flex items-center gap-2">
                      <IconUsers className="h-4 w-4" />
                      System Users
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="roles" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {roles.map((role) => (
                        <Card key={role.id} className="relative">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <CardTitle className="text-lg flex items-center gap-2">
                                  {role.name}
                                  {role.isSystem && (
                                    <Badge variant="secondary" className="text-xs">
                                      System
                                    </Badge>
                                  )}
                                  {!role.isActive && (
                                    <Badge variant="destructive" className="text-xs">
                                      Inactive
                                    </Badge>
                                  )}
                                </CardTitle>
                                <CardDescription className="text-sm">
                                  {role.description}
                                </CardDescription>
                              </div>
                              <div className="flex gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleViewRole(role)}
                                >
                                  <IconEye className="h-4 w-4" />
                                </Button>
                                {!role.isSystem && (
                                  <>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleEditRole(role)}
                                    >
                                      <IconEdit className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-destructive"
                                      onClick={() => handleDeleteRole(role.id)}
                                    >
                                      <IconTrash className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Users:</span>
                              <span className="font-medium">{role.userCount}</span>
                            </div>
                            <div className="space-y-2">
                              <div className="text-sm font-medium text-muted-foreground">
                                Permissions:
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {formatPermissionDisplay(role.permissions).map((permission) => (
                                  <Badge key={permission} variant="outline" className="text-xs">
                                    {permission}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="users" className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>System Users</CardTitle>
                        <CardDescription>
                          Manage user accounts and their role assignments
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {users.map((user) => (
                            <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                  <IconUsers className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                  <div className="font-medium">{user.name}</div>
                                  <div className="text-sm text-muted-foreground">{user.email}</div>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="outline">{user.role}</Badge>
                                    {user.isActive ? (
                                      <Badge variant="default" className="bg-green-100 text-green-800">
                                        Active
                                      </Badge>
                                    ) : (
                                      <Badge variant="destructive">Inactive</Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="text-right text-sm text-muted-foreground">
                                  <div>Last login:</div>
                                  <div>{new Date(user.lastLogin).toLocaleDateString()}</div>
                                </div>
                                <div className="flex gap-1">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleViewUser(user)}
                                  >
                                    <IconEye className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleEditUser(user)}
                                  >
                                    <IconEdit className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-destructive"
                                    onClick={() => handleDeleteUser(user.id)}
                                  >
                                    <IconTrash className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
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

      {/* Modals */}
      <RoleModal
        open={roleModalOpen}
        onOpenChange={setRoleModalOpen}
        role={editingRole}
        onSave={handleSaveRole}
      />

      <UserModal
        open={userModalOpen}
        onOpenChange={setUserModalOpen}
        user={editingUser}
        roles={roles}
        onSave={handleSaveUser}
      />

      <UserActivityModal
        open={activityModalOpen}
        onOpenChange={setActivityModalOpen}
      />

      <RoleViewModal
        open={roleViewModalOpen}
        onOpenChange={setRoleViewModalOpen}
        role={viewingRole}
      />

      <UserViewModal
        open={userViewModalOpen}
        onOpenChange={setUserViewModalOpen}
        user={viewingUser}
        roles={roles}
      />
    </SidebarProvider>
  )
} 