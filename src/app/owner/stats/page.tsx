"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { RouteGuard } from "@/components/route-guard"
import { 
  IconBuilding, 
  IconUsers, 
  IconPackage, 
  IconCurrencyDollar,
  IconChartBar,
  IconTrendingUp,
  IconTrendingDown,
  IconActivity
} from "@tabler/icons-react"
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface BranchStats {
  id: string
  name: string
  location: string
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
}

const mockBranchStats: BranchStats[] = [
  {
    id: "1",
    name: "Main Branch - Downtown",
    location: "Downtown",
    totalStaff: 25,
    activeStaff: 23,
    totalInventory: 1500,
    lowStockItems: 45,
    monthlyRevenue: 45000,
    monthlyExpenses: 28000,
    monthlySales: 520,
    monthlyOrders: 180,
    customerCount: 1200,
    supplierCount: 45
  },
  {
    id: "2",
    name: "North Branch - Shopping Mall",
    location: "North District",
    totalStaff: 18,
    activeStaff: 17,
    totalInventory: 1200,
    lowStockItems: 32,
    monthlyRevenue: 38000,
    monthlyExpenses: 22000,
    monthlySales: 420,
    monthlyOrders: 150,
    customerCount: 950,
    supplierCount: 38
  },
  {
    id: "3",
    name: "South Branch - Industrial Area",
    location: "South Zone",
    totalStaff: 15,
    activeStaff: 14,
    totalInventory: 800,
    lowStockItems: 28,
    monthlyRevenue: 32000,
    monthlyExpenses: 18000,
    monthlySales: 380,
    monthlyOrders: 120,
    customerCount: 780,
    supplierCount: 32
  },
  {
    id: "4",
    name: "East Branch - University",
    location: "East District",
    totalStaff: 12,
    activeStaff: 10,
    totalInventory: 600,
    lowStockItems: 35,
    monthlyRevenue: 28000,
    monthlyExpenses: 15000,
    monthlySales: 320,
    monthlyOrders: 95,
    customerCount: 650,
    supplierCount: 28
  }
]

export default function OwnerStatsPage() {
  // Calculate totals
  const totalBranches = mockBranchStats.length
  const totalStaff = mockBranchStats.reduce((sum, branch) => sum + branch.totalStaff, 0)
  const activeStaff = mockBranchStats.reduce((sum, branch) => sum + branch.activeStaff, 0)
  const totalInventory = mockBranchStats.reduce((sum, branch) => sum + branch.totalInventory, 0)
  const lowStockItems = mockBranchStats.reduce((sum, branch) => sum + branch.lowStockItems, 0)
  const totalRevenue = mockBranchStats.reduce((sum, branch) => sum + branch.monthlyRevenue, 0)
  const totalExpenses = mockBranchStats.reduce((sum, branch) => sum + branch.monthlyExpenses, 0)
  const totalSales = mockBranchStats.reduce((sum, branch) => sum + branch.monthlySales, 0)
  const totalOrders = mockBranchStats.reduce((sum, branch) => sum + branch.monthlyOrders, 0)
  const totalCustomers = mockBranchStats.reduce((sum, branch) => sum + branch.customerCount, 0)
  const totalSuppliers = mockBranchStats.reduce((sum, branch) => sum + branch.supplierCount, 0)
  const totalProfit = totalRevenue - totalExpenses

  // Chart data
  const revenueData = mockBranchStats.map(branch => ({
    name: branch.name.split(' - ')[1] || branch.name,
    revenue: branch.monthlyRevenue,
    expenses: branch.monthlyExpenses
  }))

  const staffData = mockBranchStats.map(branch => ({
    name: branch.name.split(' - ')[1] || branch.name,
    total: branch.totalStaff,
    active: branch.activeStaff
  }))

  const inventoryData = mockBranchStats.map(branch => ({
    name: branch.name.split(' - ')[1] || branch.name,
    inventory: branch.totalInventory,
    lowStock: branch.lowStockItems
  }))

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
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
                  <div>
                    <h1 className="text-3xl font-bold">Owner Statistics</h1>
                    <p className="text-muted-foreground mt-2">
                      Comprehensive overview of all branches performance and metrics
                    </p>
                  </div>
                </div>

                {/* Summary Cards */}
                <div className="px-4 lg:px-6">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Branches</CardTitle>
                        <IconBuilding className="h-4 w-4 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{totalBranches}</div>
                        <p className="text-xs text-muted-foreground">
                          Company locations
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
                          {activeStaff} active
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
                          {lowStockItems} low stock items
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

                  {/* Additional Stats */}
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
                        <IconTrendingUp className="h-4 w-4 text-green-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</div>
                        <p className="text-xs text-muted-foreground">
                          All branches
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Sales</CardTitle>
                        <IconActivity className="h-4 w-4 text-blue-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-blue-600">{totalSales}</div>
                        <p className="text-xs text-muted-foreground">
                          Transactions
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Customers</CardTitle>
                        <IconUsers className="h-4 w-4 text-purple-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-purple-600">{totalCustomers.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                          Across all branches
                        </p>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Suppliers</CardTitle>
                        <IconPackage className="h-4 w-4 text-orange-600" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{totalSuppliers}</div>
                        <p className="text-xs text-muted-foreground">
                          Vendor network
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Charts */}
                  <div className="grid gap-6 md:grid-cols-2">
                    {/* Revenue vs Expenses Chart */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Revenue vs Expenses by Branch</CardTitle>
                        <CardDescription>Monthly financial performance comparison</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                            <Legend />
                            <Bar dataKey="revenue" fill="#10B981" name="Revenue" />
                            <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    {/* Staff Distribution Chart */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Staff Distribution by Branch</CardTitle>
                        <CardDescription>Total and active staff count</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={staffData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="total" fill="#3B82F6" name="Total Staff" />
                            <Bar dataKey="active" fill="#10B981" name="Active Staff" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    {/* Inventory Chart */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Inventory Levels by Branch</CardTitle>
                        <CardDescription>Stock levels and low stock items</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={inventoryData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="inventory" fill="#8B5CF6" name="Total Inventory" />
                            <Bar dataKey="lowStock" fill="#F59E0B" name="Low Stock Items" />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>

                    {/* Branch Performance Pie Chart */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Revenue Distribution</CardTitle>
                        <CardDescription>Revenue share by branch</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={mockBranchStats}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={({ name, percent }) => `${name.split(' - ')[1] || name} ${(percent * 100).toFixed(0)}%`}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="monthlyRevenue"
                            >
                              {mockBranchStats.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                          </PieChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </RouteGuard>
  )
} 