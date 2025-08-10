"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { CreateBranchModal } from "@/components/create-branch-modal"
import { PageWrapper } from "@/components/page-wrapper"
import { 
  IconBuilding, 
  IconUsers, 
  IconPackage, 
  IconCurrencyDollar,
  IconPlus,
  IconSearch,
  IconEye,
  IconEdit,
  IconTrash,
  IconTrendingUp,
  IconMapPin,
  IconPhone,
  IconMail
} from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { RouteGuard } from "@/components/route-guard"

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
  totalStaff: number
  totalInventory: number
  monthlyRevenue: number
  monthlyExpenses: number
  createdAt: string
  lastActivity: string
}

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

const mockBranches: Branch[] = [
  {
    id: "1",
    name: "Main Branch - Downtown",
    location: "Downtown",
    address: "123 Main St, Downtown, City",
    phone: "+1 (555) 123-4567",
    email: "main@company.com",
    manager: "John Smith",
    managerEmail: "john.smith@company.com",
    managerPhone: "+1 (555) 123-4568",
    status: 'active',
    totalStaff: 25,
    totalInventory: 1500,
    monthlyRevenue: 45000,
    monthlyExpenses: 28000,
    createdAt: "2024-01-15",
    lastActivity: "2024-12-19T10:30:00Z"
  },
  {
    id: "2",
    name: "North Branch - Shopping Mall",
    location: "North District",
    address: "456 Mall Ave, North District, City",
    phone: "+1 (555) 234-5678",
    email: "north@company.com",
    manager: "Sarah Johnson",
    managerEmail: "sarah.johnson@company.com",
    managerPhone: "+1 (555) 234-5679",
    status: 'active',
    totalStaff: 18,
    totalInventory: 1200,
    monthlyRevenue: 38000,
    monthlyExpenses: 22000,
    createdAt: "2024-03-20",
    lastActivity: "2024-12-19T09:15:00Z"
  },
  {
    id: "3",
    name: "South Branch - Industrial Area",
    location: "South Zone",
    address: "789 Industrial Blvd, South Zone, City",
    phone: "+1 (555) 345-6789",
    email: "south@company.com",
    manager: "Mike Wilson",
    managerEmail: "mike.wilson@company.com",
    managerPhone: "+1 (555) 345-6790",
    status: 'active',
    totalStaff: 15,
    totalInventory: 800,
    monthlyRevenue: 32000,
    monthlyExpenses: 18000,
    createdAt: "2024-06-10",
    lastActivity: "2024-12-19T08:45:00Z"
  },
  {
    id: "4",
    name: "East Branch - University",
    location: "East District",
    address: "321 Campus Rd, East District, City",
    phone: "+1 (555) 456-7890",
    email: "east@company.com",
    manager: "Lisa Brown",
    managerEmail: "lisa.brown@company.com",
    managerPhone: "+1 (555) 456-7891",
    status: 'maintenance',
    totalStaff: 12,
    totalInventory: 600,
    monthlyRevenue: 28000,
    monthlyExpenses: 15000,
    createdAt: "2024-08-05",
    lastActivity: "2024-12-18T16:20:00Z"
  },
  {
    id: "5",
    name: "West Branch - Suburban",
    location: "West Suburbs",
    address: "654 Suburban Dr, West Suburbs, City",
    phone: "+1 (555) 567-8901",
    email: "west@company.com",
    manager: "David Lee",
    managerEmail: "david.lee@company.com",
    managerPhone: "+1 (555) 567-8902",
    status: 'active',
    totalStaff: 20,
    totalInventory: 1100,
    monthlyRevenue: 42000,
    monthlyExpenses: 25000,
    createdAt: "2024-09-12",
    lastActivity: "2024-12-19T11:00:00Z"
  }
]

export default function BranchManagementPage() {
  const [branches, setBranches] = useState<Branch[]>(mockBranches)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const router = useRouter()

  // Calculate summary statistics
  const totalBranches = branches.length
  const activeBranches = branches.filter(b => b.status === 'active').length
  const totalStaff = branches.reduce((sum, b) => sum + b.totalStaff, 0)
  const totalInventory = branches.reduce((sum, b) => sum + b.totalInventory, 0)
  const totalRevenue = branches.reduce((sum, b) => sum + b.monthlyRevenue, 0)
  const totalExpenses = branches.reduce((sum, b) => sum + b.monthlyExpenses, 0)
  const totalProfit = totalRevenue - totalExpenses

  // Filter branches based on search and status
  const filteredBranches = branches.filter(branch => {
    const matchesSearch = branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         branch.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         branch.manager.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || branch.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const handleViewBranch = (branchId: string) => {
    router.push(`/owner/branch/${branchId}`)
  }

  const handleEditBranch = (branchId: string) => {
    router.push(`/owner/branch/${branchId}/edit`)
  }

  const handleCreateBranch = () => {
    setIsCreateModalOpen(true)
  }

  const handleCreateBranchSubmit = async (branchData: CreateBranchForm) => {
    try {
      const newBranch: Branch = {
        id: (branches.length + 1).toString(),
        ...branchData,
        totalStaff: 0,
        totalInventory: 0,
        monthlyRevenue: 0,
        monthlyExpenses: 0,
        createdAt: new Date().toISOString().split('T')[0],
        lastActivity: new Date().toISOString()
      }
      
      setBranches(prev => [...prev, newBranch])
      setIsCreateModalOpen(false)
      
      // In a real app, you would make an API call here
      console.log("Creating new branch:", newBranch)
    } catch (error) {
      console.error("Failed to create branch:", error)
    }
  }

  const handleDeleteBranch = async (branchId: string) => {
    if (confirm("Are you sure you want to delete this branch? This action cannot be undone.")) {
      try {
        setBranches(prev => prev.filter(b => b.id !== branchId))
        
        // In a real app, you would make an API call here
        console.log("Deleting branch:", branchId)
      } catch (error) {
        console.error("Failed to delete branch:", error)
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'inactive': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatLastActivity = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return 'Yesterday'
    return formatDate(dateString)
  }

  return (
    <RouteGuard allowedUserTypes={['owner']}>
      <PageWrapper loadingText="Loading branch management..." loadingDelay={500}>
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
                  <div className="px-4 lg:px-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h1 className="text-3xl font-bold">Branch Management</h1>
                        <p className="text-muted-foreground mt-2">
                          Manage all company branches, staff, and performance metrics
                        </p>
                      </div>
                      <Button onClick={handleCreateBranch} className="flex items-center gap-2">
                        <IconPlus className="w-4 h-4" />
                        Create New Branch
                      </Button>
                    </div>
                  </div>

                  {/* Stats Overview */}
                  <div className="px-4 lg:px-6">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5 mb-8">
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Total Branches</CardTitle>
                          <IconBuilding className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{totalBranches}</div>
                          <p className="text-xs text-muted-foreground">
                            {activeBranches} active
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Total Staff</CardTitle>
                          <IconUsers className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{totalStaff}</div>
                          <p className="text-xs text-muted-foreground">
                            Across all branches
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Total Inventory</CardTitle>
                          <IconPackage className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{totalInventory.toLocaleString()}</div>
                          <p className="text-xs text-muted-foreground">
                            Items across branches
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
                          <IconTrendingUp className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</div>
                          <p className="text-xs text-muted-foreground">
                            All branches combined
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium text-muted-foreground">Net Profit</CardTitle>
                          <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className={`text-2xl font-bold ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatCurrency(totalProfit)}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            This month
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                      <div className="relative flex-1">
                        <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          placeholder="Search branches by name, location, or manager..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                      <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="px-3 py-2 border border-input rounded-md bg-background text-foreground"
                      >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="maintenance">Maintenance</option>
                      </select>
                    </div>

                    {/* Branches Grid */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {filteredBranches.map((branch) => (
                        <Card key={branch.id} className="hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-lg mb-2">{branch.name}</CardTitle>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                  <IconMapPin className="w-4 h-4" />
                                  {branch.location}
                                </div>
                                <Badge className={getStatusColor(branch.status)}>
                                  {branch.status.charAt(0).toUpperCase() + branch.status.slice(1)}
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {/* Manager Info */}
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm">Manager</h4>
                              <div className="text-sm text-muted-foreground">
                                <div className="flex items-center gap-2 mb-1">
                                  <IconUsers className="w-4 h-4" />
                                  {branch.manager}
                                </div>
                                <div className="flex items-center gap-2 mb-1">
                                  <IconMail className="w-4 h-4" />
                                  {branch.managerEmail}
                                </div>
                                <div className="flex items-center gap-2">
                                  <IconPhone className="w-4 h-4" />
                                  {branch.managerPhone}
                                </div>
                              </div>
                            </div>

                            {/* Branch Stats */}
                            <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                              <div className="text-center">
                                <div className="text-lg font-semibold">{branch.totalStaff}</div>
                                <div className="text-xs text-muted-foreground">Staff</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-semibold">{branch.totalInventory.toLocaleString()}</div>
                                <div className="text-xs text-muted-foreground">Inventory</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-semibold text-green-600">{formatCurrency(branch.monthlyRevenue)}</div>
                                <div className="text-xs text-muted-foreground">Revenue</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-semibold text-red-600">{formatCurrency(branch.monthlyExpenses)}</div>
                                <div className="text-xs text-muted-foreground">Expenses</div>
                              </div>
                            </div>

                            {/* Branch Details */}
                            <div className="space-y-2 pt-2 border-t">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Created:</span>
                                <span>{formatDate(branch.createdAt)}</span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">Last Activity:</span>
                                <span>{formatLastActivity(branch.lastActivity)}</span>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-4 border-t">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewBranch(branch.id)}
                                className="flex-1"
                              >
                                <IconEye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditBranch(branch.id)}
                                className="flex-1"
                              >
                                <IconEdit className="w-4 h-4 mr-2" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteBranch(branch.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <IconTrash className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {filteredBranches.length === 0 && (
                      <div className="text-center py-12">
                        <IconBuilding className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium mb-2">No branches found</h3>
                        <p className="text-muted-foreground mb-4">
                          {searchTerm || selectedStatus !== "all" 
                            ? "Try adjusting your search or filters"
                            : "Get started by creating your first branch"
                          }
                        </p>
                        {!searchTerm && selectedStatus === "all" && (
                          <Button onClick={handleCreateBranch}>
                            <IconPlus className="w-4 h-4 mr-2" />
                            Create First Branch
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
        
        <CreateBranchModal
          open={isCreateModalOpen}
          onOpenChange={setIsCreateModalOpen}
          onSubmit={handleCreateBranchSubmit}
        />
      </PageWrapper>
    </RouteGuard>
  )
} 