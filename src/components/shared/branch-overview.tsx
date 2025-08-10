"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  IconBuilding, 
  IconUsers, 
  IconPackage, 
  IconChartBar, 
  IconShoppingCart,
  IconEdit,
  IconTrash,
  IconReceipt
} from "@tabler/icons-react"
import { StatsCard } from "./stats-card"
import { DataTable } from "./data-table"
import { ChartCard } from "./chart-card"
import { SectionHeader } from "./section-header"

interface Branch {
  id: string
  name: string
  address: string
  phone: string
  email: string
  manager: string
  managerEmail: string
  managerPhone: string
  status: string
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
}

interface BranchOverviewProps {
  branchId: string
  onEdit?: (branch: Branch) => void
  onDelete?: (branchId: string) => void
}

export function BranchOverview({ branchId, onEdit, onDelete }: BranchOverviewProps) {
  const [branch, setBranch] = useState<Branch | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - in real app, this would come from Redux store
  const mockBranch: Branch = {
    id: branchId,
    name: "Downtown Branch",
    address: "123 Main St, Downtown, City",
    phone: "+1 (555) 123-4567",
    email: "downtown@company.com",
    manager: "John Smith",
    managerEmail: "john.smith@company.com",
    managerPhone: "+1 (555) 987-6543",
    status: "active",
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
    lastActivity: "2024-12-19T10:30:00Z"
  }

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setBranch(mockBranch)
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [branchId])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  if (!branch) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Branch not found</p>
      </div>
    )
  }

  const statsData = [
    {
      title: "Total Staff",
      value: branch.totalStaff,
      description: `${branch.activeStaff} active`,
      icon: IconUsers,
      trend: { value: 8, isPositive: true }
    },
    {
      title: "Monthly Revenue",
      value: `$${branch.monthlyRevenue.toLocaleString()}`,
      description: "This month",
      icon: IconChartBar,
      trend: { value: 12, isPositive: true }
    },
    {
      title: "Inventory Items",
      value: branch.totalInventory,
      description: `${branch.lowStockItems} low stock`,
      icon: IconPackage,
      trend: { value: -3, isPositive: false }
    },
    {
      title: "Monthly Orders",
      value: branch.monthlyOrders,
      description: `${branch.customerCount} customers`,
      icon: IconShoppingCart,
      trend: { value: 15, isPositive: true }
    }
  ]

  const inventoryColumns = [
    { key: "name", label: "Item Name", sortable: true },
    { key: "sku", label: "SKU", sortable: true },
    { key: "category", label: "Category", sortable: true },
    { key: "stock", label: "Stock", sortable: true },
    { key: "status", label: "Status", sortable: true },
    { key: "lastUpdated", label: "Last Updated", sortable: true }
  ]

  const mockInventoryData = [
    { id: 1, name: "Premium Coffee Beans", sku: "COF-001", category: "Beverages", stock: 150, status: "In Stock", lastUpdated: "2024-12-19" },
    { id: 2, name: "Organic Tea Leaves", sku: "TEA-001", category: "Beverages", stock: 200, status: "In Stock", lastUpdated: "2024-12-18" },
    { id: 3, name: "Artisan Bread", sku: "BRD-001", category: "Bakery", stock: 45, status: "Low Stock", lastUpdated: "2024-12-19" }
  ]

  return (
    <div className="space-y-6">
      {/* Branch Header */}
      <SectionHeader
        title={branch.name}
        description={`${branch.address} • ${branch.phone}`}
        icon={IconBuilding}
        actions={
          <div className="flex items-center gap-2">
            {onEdit && (
              <Button variant="outline" size="sm" onClick={() => onEdit(branch)}>
                <IconEdit className="h-4 w-4 mr-2" />
                Edit Branch
              </Button>
            )}
            {onDelete && (
              <Button variant="outline" size="sm" onClick={() => onDelete(branch.id)}>
                <IconTrash className="h-4 w-4 mr-2" />
                Delete Branch
              </Button>
            )}
          </div>
        }
      />

      {/* Branch Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconBuilding className="h-5 w-5" />
            Branch Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Contact Details</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Address:</span> {branch.address}</p>
                  <p><span className="font-medium">Phone:</span> {branch.phone}</p>
                  <p><span className="font-medium">Email:</span> {branch.email}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Manager</h4>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Name:</span> {branch.manager}</p>
                  <p><span className="font-medium">Email:</span> {branch.managerEmail}</p>
                  <p><span className="font-medium">Phone:</span> {branch.managerPhone}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Status & Dates</h4>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Status:</span> 
                    <Badge variant={branch.status === 'active' ? 'default' : 'secondary'} className="ml-2">
                      {branch.status}
                    </Badge>
                  </p>
                  <p><span className="font-medium">Created:</span> {branch.createdAt}</p>
                  <p><span className="font-medium">Last Activity:</span> {new Date(branch.lastActivity).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Tabs for different sections */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Monthly Performance" icon={IconChartBar}>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Chart placeholder - Monthly Revenue vs Expenses
              </div>
            </ChartCard>
            <ChartCard title="Staff Overview" icon={IconUsers}>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Chart placeholder - Staff Distribution
              </div>
            </ChartCard>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <DataTable
            title="Inventory Items"
            columns={inventoryColumns}
            data={mockInventoryData}
            searchKeys={["name", "sku", "category"]}
            searchPlaceholder="Search inventory..."
            onAdd={() => console.log("Add inventory item")}
            onRefresh={() => console.log("Refresh inventory")}
            onExport={() => console.log("Export inventory")}
          />
        </TabsContent>

        <TabsContent value="sales" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ChartCard title="Sales Trend" icon={IconShoppingCart}>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Chart placeholder - Sales Trend
              </div>
            </ChartCard>
            <ChartCard title="Order Distribution" icon={IconReceipt}>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Chart placeholder - Order Distribution
              </div>
            </ChartCard>
          </div>
        </TabsContent>

        <TabsContent value="staff" className="space-y-4">
          <ChartCard title="Staff Overview" icon={IconUsers}>
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              Chart placeholder - Staff Overview
            </div>
          </ChartCard>
        </TabsContent>
      </Tabs>
    </div>
  )
} 