"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { CreateBranchModal } from "@/components/create-branch-modal"
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
  IconChartBar,
  IconTrendingUp,
  IconTrendingDown
} from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { RouteGuard } from "@/components/route-guard"

interface Branch {
  id: string
  name: string
  location: string
  manager: string
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
    location: "123 Main St, Downtown",
    manager: "John Smith",
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
    location: "456 Mall Ave, North District",
    manager: "Sarah Johnson",
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
    location: "789 Industrial Blvd, South Zone",
    manager: "Mike Wilson",
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
    location: "321 Campus Rd, East District",
    manager: "Lisa Brown",
    status: 'maintenance',
    totalStaff: 12,
    totalInventory: 600,
    monthlyRevenue: 28000,
    monthlyExpenses: 15000,
    createdAt: "2024-08-05",
    lastActivity: "2024-12-18T16:20:00Z"
  }
]

export default function OwnerDashboard() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const filteredBranches = mockBranches.filter(branch => {
    const matchesSearch = branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         branch.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         branch.manager.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || branch.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const totalBranches = mockBranches.length
  const activeBranches = mockBranches.filter(b => b.status === 'active').length
  const totalStaff = mockBranches.reduce((sum, b) => sum + b.totalStaff, 0)
  const totalRevenue = mockBranches.reduce((sum, b) => sum + b.monthlyRevenue, 0)
  const totalExpenses = mockBranches.reduce((sum, b) => sum + b.monthlyExpenses, 0)
  const totalProfit = totalRevenue - totalExpenses

  const handleViewBranch = (branchId: string) => {
    router.push(`/owner/branch/${branchId}`)
  }

  const handleCreateBranch = () => {
    setIsCreateModalOpen(true)
  }

  const handleCreateBranchSubmit = async (branchData: CreateBranchForm) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In a real app, you would send the data to your API
      console.log('Creating branch:', branchData)
      
      // Show success message
      alert('Branch created successfully!')
      
      // Refresh the page to show updated data
      window.location.reload()
    } catch (error) {
      console.error('Error creating branch:', error)
      alert('Failed to create branch')
    }
  }

  const handleDeleteBranch = async (branchId: string) => {
    if (!confirm('Are you sure you want to delete this branch? This action cannot be undone.')) {
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // In a real app, you would send the delete request to your API
      console.log('Deleting branch:', branchId)
      
      // Remove from local state (in a real app, this would be handled by API response)
      // For now, we'll just show a success message
      alert('Branch deleted successfully')
      
      // Refresh the page to show updated data
      window.location.reload()
    } catch (error) {
      console.error('Error deleting branch:', error)
      alert('Failed to delete branch')
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
                      <h1 className="text-3xl font-bold">Owner Dashboard</h1>
                      <p className="text-muted-foreground mt-2">
                        Manage all branches and view company-wide statistics
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
                        <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Expenses</CardTitle>
                        <IconTrendingDown className="h-4 w-4 text-red-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</div>
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
                        placeholder="Search branches..."
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

                  {/* Branches Table */}
                  <Card>
                    <CardHeader>
                      <CardTitle>All Branches</CardTitle>
                      <CardDescription>
                        Manage and monitor all company branches
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left p-3 font-medium">Branch Name</th>
                              <th className="text-left p-3 font-medium">Location</th>
                              <th className="text-left p-3 font-medium">Manager</th>
                              <th className="text-left p-3 font-medium">Status</th>
                              <th className="text-left p-3 font-medium">Staff</th>
                              <th className="text-left p-3 font-medium">Inventory</th>
                              <th className="text-left p-3 font-medium">Revenue</th>
                              <th className="text-left p-3 font-medium">Last Activity</th>
                              <th className="text-left p-3 font-medium">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredBranches.map((branch) => (
                              <tr key={branch.id} className="border-b hover:bg-muted/50">
                                <td className="p-3">
                                  <div>
                                    <div className="font-medium">{branch.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                      Created {formatDate(branch.createdAt)}
                                    </div>
                                  </div>
                                </td>
                                <td className="p-3 text-sm">{branch.location}</td>
                                <td className="p-3 text-sm">{branch.manager}</td>
                                <td className="p-3">
                                  <Badge className={getStatusColor(branch.status)}>
                                    {branch.status.charAt(0).toUpperCase() + branch.status.slice(1)}
                                  </Badge>
                                </td>
                                <td className="p-3 text-sm">{branch.totalStaff}</td>
                                <td className="p-3 text-sm">{branch.totalInventory.toLocaleString()}</td>
                                <td className="p-3 text-sm font-medium">{formatCurrency(branch.monthlyRevenue)}</td>
                                <td className="p-3 text-sm text-muted-foreground">
                                  {formatLastActivity(branch.lastActivity)}
                                </td>
                                <td className="p-3">
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleViewBranch(branch.id)}
                                      className="h-8 w-8 p-0"
                                    >
                                      <IconEye className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => router.push(`/owner/branch/${branch.id}/edit`)}
                                      className="h-8 w-8 p-0"
                                    >
                                      <IconEdit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleDeleteBranch(branch.id)}
                                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                    >
                                      <IconTrash className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Permissions Management */}
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>System Permissions</CardTitle>
                      <CardDescription>
                        Manage access permissions for all branches and staff members
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {/* Branch Permissions */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Branch Management</h3>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Create Branches</span>
                              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                Owner Only
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Edit Branches</span>
                              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                Owner Only
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Delete Branches</span>
                              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                Owner Only
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">View Branch Details</span>
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                Branch Managers
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Staff Permissions */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Staff Management</h3>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Hire Staff</span>
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                Branch Managers
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Set Salaries</span>
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                Branch Managers
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Manage Permissions</span>
                              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                Owner Only
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">View Staff History</span>
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                Branch Managers
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Financial Permissions */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Financial Access</h3>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm">View All Revenue</span>
                              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                Owner Only
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Branch Finances</span>
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                Branch Managers
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Payment Processing</span>
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                Cashiers
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm">Credit Management</span>
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                Branch Managers
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-medium mb-2">Permission Assignment</h4>
                        <p className="text-sm text-muted-foreground">
                          As the owner, you can assign specific permissions to branch managers and staff members. 
                          Use the branch detail view to manage individual staff permissions and access levels.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
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
    </RouteGuard>
  )
} 