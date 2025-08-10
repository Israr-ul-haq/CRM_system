"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { 
  IconBuilding, 
  IconUsers, 
  IconPackage, 
  IconCurrencyDollar,
  IconTrendingUp,
  IconTrendingDown,
  IconArrowLeft,
  IconEdit,
  IconSettings,
  IconChartBar,
  IconShoppingCart,
  IconReceipt,
  IconTruck,
  IconUserCheck,
  IconPackageOff,
  IconAlertTriangle,
  IconMapPin,
  IconPhone,
  IconMail,
  IconCalendar
} from "@tabler/icons-react"

interface Branch {
  id: string
  name: string
  location: string
  manager: string
  managerEmail: string
  managerPhone: string
  status: 'active' | 'inactive' | 'maintenance'
  totalStaff: number
  activeStaff: number
  totalInventory: number
  lowStockItems: number
  monthlyRevenue: number
  monthlyExpenses: number
  monthlySales: number
  monthlyOrders: number
  customerCount: number
  supplierCount: number
  createdAt: string
  lastActivity: string
  address: string
  phone: string
  email: string
}

const mockBranch: Branch = {
  id: "1",
  name: "Main Branch - Downtown",
  location: "Downtown",
  manager: "John Smith",
  managerEmail: "john.smith@company.com",
  managerPhone: "+1 (555) 123-4567",
  status: 'active',
  totalStaff: 25,
  activeStaff: 23,
  totalInventory: 1500,
  lowStockItems: 45,
  monthlyRevenue: 45000,
  monthlyExpenses: 28000,
  monthlySales: 42000,
  monthlyOrders: 156,
  customerCount: 89,
  supplierCount: 12,
  createdAt: "2024-01-15",
  lastActivity: "2024-12-19T10:30:00Z",
  address: "123 Main Street, Downtown, City, State 12345",
  phone: "+1 (555) 987-6543",
  email: "downtown@company.com"
}

export default function BranchDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [branch, setBranch] = useState<Branch | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch branch data
    setTimeout(() => {
      setBranch(mockBranch)
      setIsLoading(false)
    }, 500)
  }, [params.id])

  const handleBackToOwner = () => {
    router.push('/owner')
  }

  const handleEditBranch = () => {
    router.push(`/owner/branch/${params.id}/edit`)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return num.toLocaleString()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'inactive': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading branch details...</p>
        </div>
      </div>
    )
  }

  if (!branch) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">Branch not found</p>
          <Button onClick={handleBackToOwner} className="mt-4">Back to Owner Dashboard</Button>
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
                <div className="max-w-7xl mx-auto px-4 py-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleBackToOwner}
                        className="flex items-center gap-2"
                      >
                        <IconArrowLeft className="w-4 h-4" />
                        Back to Owner
                      </Button>
                      <div>
                        <h1 className="text-3xl font-bold">{branch.name}</h1>
                        <p className="text-muted-foreground mt-2">
                          Branch Details & Performance Overview
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(branch.status)}>
                        {branch.status.charAt(0).toUpperCase() + branch.status.slice(1)}
                      </Badge>
                      <Button onClick={handleEditBranch} variant="outline" className="flex items-center gap-2">
                        <IconEdit className="w-4 h-4" />
                        Edit Branch
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="px-4 lg:px-6">
        {/* Branch Info Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
              <IconTrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{formatCurrency(branch.monthlyRevenue)}</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Staff</CardTitle>
              <IconUsers className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(branch.totalStaff)}</div>
              <p className="text-xs text-muted-foreground">
                {branch.activeStaff} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Inventory</CardTitle>
              <IconPackage className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(branch.totalInventory)}</div>
              <p className="text-xs text-muted-foreground">
                {branch.lowStockItems} low stock
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Orders</CardTitle>
              <IconShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatNumber(branch.monthlyOrders)}</div>
              <p className="text-xs text-muted-foreground">
                This month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Branch Information */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconBuilding className="h-5 w-5" />
                Branch Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Location</label>
                  <p className="text-sm flex items-center gap-2 mt-1">
                    <IconMapPin className="w-4 h-4" />
                    {branch.location}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Status</label>
                  <p className="text-sm mt-1">
                    <Badge className={getStatusColor(branch.status)}>
                      {branch.status.charAt(0).toUpperCase() + branch.status.slice(1)}
                    </Badge>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created</label>
                  <p className="text-sm flex items-center gap-2 mt-1">
                    <IconCalendar className="w-4 h-4" />
                    {formatDate(branch.createdAt)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Last Activity</label>
                  <p className="text-sm mt-1">{formatLastActivity(branch.lastActivity)}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Address</label>
                <p className="text-sm mt-1">{branch.address}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Phone</label>
                  <p className="text-sm flex items-center gap-2 mt-1">
                    <IconPhone className="w-4 h-4" />
                    {branch.phone}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm flex items-center gap-2 mt-1">
                    <IconMail className="w-4 h-4" />
                    {branch.email}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IconUsers className="h-5 w-5" />
                Manager Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Manager Name</label>
                <p className="text-lg font-semibold mt-1">{branch.manager}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-sm flex items-center gap-2 mt-1">
                  <IconMail className="w-4 h-4" />
                  {branch.managerEmail}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                <p className="text-sm flex items-center gap-2 mt-1">
                  <IconPhone className="w-4 h-4" />
                  {branch.managerPhone}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">
              <IconChartBar className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="staff">
              <IconUsers className="w-4 h-4 mr-2" />
              Staff
            </TabsTrigger>
            <TabsTrigger value="inventory">
              <IconPackage className="w-4 h-4 mr-2" />
              Inventory
            </TabsTrigger>
            <TabsTrigger value="sales">
              <IconShoppingCart className="w-4 h-4 mr-2" />
              Sales
            </TabsTrigger>
            <TabsTrigger value="customers">
              <IconUserCheck className="w-4 h-4 mr-2" />
              Customers
            </TabsTrigger>
            <TabsTrigger value="suppliers">
              <IconTruck className="w-4 h-4 mr-2" />
              Suppliers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Financial Summary</CardTitle>
                  <CardDescription>Monthly financial performance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Revenue</span>
                    <span className="font-semibold text-green-600">{formatCurrency(branch.monthlyRevenue)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Expenses</span>
                    <span className="font-semibold text-red-600">{formatCurrency(branch.monthlyExpenses)}</span>
                  </div>
                  <div className="flex justify-between items-center border-t pt-2">
                    <span className="text-sm font-medium">Net Profit</span>
                    <span className={`font-bold ${(branch.monthlyRevenue - branch.monthlyExpenses) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatCurrency(branch.monthlyRevenue - branch.monthlyExpenses)}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Operational Metrics</CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Staff Utilization</span>
                    <span className="font-semibold">{((branch.activeStaff / branch.totalStaff) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Inventory Health</span>
                    <span className="font-semibold">{((branch.totalInventory - branch.lowStockItems) / branch.totalInventory * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Avg Order Value</span>
                    <span className="font-semibold">{formatCurrency(branch.monthlySales / branch.monthlyOrders)}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="staff" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Staff Management</CardTitle>
                <CardDescription>Manage branch staff members</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <IconUsers className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Staff management interface will be integrated here</p>
                  <p className="text-sm mt-2">View and manage {branch.totalStaff} staff members</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Management</CardTitle>
                <CardDescription>Manage branch inventory and stock</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <IconPackage className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Inventory management interface will be integrated here</p>
                  <p className="text-sm mt-2">Manage {formatNumber(branch.totalInventory)} inventory items</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sales" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales & Orders</CardTitle>
                <CardDescription>View sales performance and order history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <IconShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Sales dashboard will be integrated here</p>
                  <p className="text-sm mt-2">{formatNumber(branch.monthlyOrders)} orders this month</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Management</CardTitle>
                <CardDescription>Manage branch customers and relationships</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <IconUserCheck className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Customer management interface will be integrated here</p>
                  <p className="text-sm mt-2">{formatNumber(branch.customerCount)} registered customers</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suppliers" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Supplier Management</CardTitle>
                <CardDescription>Manage branch suppliers and partnerships</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <IconTruck className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Supplier management interface will be integrated here</p>
                  <p className="text-sm mt-2">{formatNumber(branch.supplierCount)} active suppliers</p>
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