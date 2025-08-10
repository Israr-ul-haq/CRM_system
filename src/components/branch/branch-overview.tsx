"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/store"
import { fetchBranchById } from "@/store/slices/branchSlice"
import { fetchInventory } from "@/store/slices/inventorySlice"
import { fetchCustomers } from "@/store/slices/customerSlice"
import { fetchSuppliers } from "@/store/slices/supplierSlice"
import { fetchStaff } from "@/store/slices/staffSlice"
import { fetchSales } from "@/store/slices/salesSlice"
import { fetchPurchases } from "@/store/slices/purchaseSlice"
import { fetchBills } from "@/store/slices/billingSlice"
import { StatsCard } from "@/components/shared/stats-card"
import { ChartCard } from "@/components/shared/chart-card"
import { DataTable } from "@/components/shared/data-table"
import { SectionHeader } from "@/components/shared/section-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  IconBuilding, 
  IconUsers, 
  IconPackage, 
  IconShoppingCart,
  IconTruck,
  IconReceipt,
  IconChartBar,
  IconTrendingUp,
  IconTrendingDown
} from "@tabler/icons-react"

interface BranchOverviewProps {
  branchId: string
  className?: string
}

export function BranchOverview({ branchId, className }: BranchOverviewProps) {
  const dispatch = useAppDispatch()
  const { currentBranch, isLoading: branchLoading } = useAppSelector(state => state.branch)
  const { items: inventoryItems, isLoading: inventoryLoading } = useAppSelector(state => state.inventory)
  const { customers, isLoading: customersLoading } = useAppSelector(state => state.customer)
  const { suppliers, isLoading: suppliersLoading } = useAppSelector(state => state.supplier)
  const { staff, isLoading: staffLoading } = useAppSelector(state => state.staff)
  const { sales, isLoading: salesLoading } = useAppSelector(state => state.sales)
  const { purchases, isLoading: purchasesLoading } = useAppSelector(state => state.purchase)
  const { bills, isLoading: billsLoading } = useAppSelector(state => state.billing)

  useEffect(() => {
    if (branchId) {
      dispatch(fetchBranchById(branchId))
      dispatch(fetchInventory())
      dispatch(fetchCustomers())
      dispatch(fetchSuppliers())
      dispatch(fetchStaff())
      dispatch(fetchSales())
      dispatch(fetchPurchases())
      dispatch(fetchBills())
    }
  }, [dispatch, branchId])

  if (branchLoading || !currentBranch) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading branch information...</p>
        </div>
      </div>
    )
  }

  const isLoading = inventoryLoading || customersLoading || suppliersLoading || 
                   staffLoading || salesLoading || purchasesLoading || billsLoading

  return (
    <div className={className}>
      {/* Branch Header */}
      <SectionHeader
        title={currentBranch.name}
        description={`${currentBranch.location} • ${currentBranch.address}`}
        icon={IconBuilding}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant={currentBranch.status === 'active' ? 'default' : 'secondary'}>
              {currentBranch.status}
            </Badge>
            <Button variant="outline" size="sm">
              Edit Branch
            </Button>
          </div>
        }
      />

      {/* Key Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <StatsCard
          title="Monthly Revenue"
          value={`$${currentBranch.monthlyRevenue.toLocaleString()}`}
          icon={IconTrendingUp}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Monthly Sales"
          value={`$${currentBranch.monthlySales.toLocaleString()}`}
          icon={IconShoppingCart}
          trend={{ value: 8, isPositive: true }}
        />
        <StatsCard
          title="Total Staff"
          value={currentBranch.totalStaff}
          description={`${currentBranch.activeStaff} active`}
          icon={IconUsers}
        />
        <StatsCard
          title="Inventory Items"
          value={currentBranch.totalInventory}
          description={`${currentBranch.lowStockItems} low stock`}
          icon={IconPackage}
        />
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="staff">Staff</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="purchases">Purchases</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <ChartCard
              title="Financial Overview"
              description="Monthly revenue and expenses"
              icon={IconChartBar}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Revenue</span>
                  <span className="font-semibold text-green-600">
                    ${currentBranch.monthlyRevenue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Expenses</span>
                  <span className="font-semibold text-red-600">
                    ${currentBranch.monthlyExpenses.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t pt-2">
                  <span className="text-sm font-medium">Net Profit</span>
                  <span className="font-bold text-lg">
                    ${(currentBranch.monthlyRevenue - currentBranch.monthlyExpenses).toLocaleString()}
                  </span>
                </div>
              </div>
            </ChartCard>

            <ChartCard
              title="Activity Summary"
              description="Recent branch activity"
              icon={IconTrendingUp}
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Orders This Month</span>
                  <span className="font-semibold">{currentBranch.monthlyOrders}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Customer Count</span>
                  <span className="font-semibold">{currentBranch.customerCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Supplier Count</span>
                  <span className="font-semibold">{currentBranch.supplierCount}</span>
                </div>
                <div className="flex justify-between items-center border-t pt-2">
                  <span className="text-sm text-muted-foreground">Last Activity</span>
                  <span className="text-sm">
                    {new Date(currentBranch.lastActivity).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </ChartCard>
          </div>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory">
          <DataTable
            title="Inventory Items"
            columns={[
              { key: 'name', label: 'Name', sortable: true },
              { key: 'sku', label: 'SKU', sortable: true },
              { key: 'category', label: 'Category', sortable: true },
              { key: 'stock', label: 'Stock', sortable: true },
              { key: 'price', label: 'Price', sortable: true },
              { key: 'status', label: 'Status', sortable: true },
              { key: 'supplier', label: 'Supplier', sortable: true }
            ]}
            data={inventoryItems as unknown as Record<string, unknown>[]}
            searchKeys={['name', 'sku', 'category']}
            searchPlaceholder="Search inventory..."
            isLoading={inventoryLoading}
            onAdd={() => console.log('Add inventory item')}
            onRefresh={() => dispatch(fetchInventory())}
          />
        </TabsContent>

        {/* Customers Tab */}
        <TabsContent value="customers">
          <DataTable
            title="Customers"
            columns={[
              { key: 'customerId', label: 'Customer ID', sortable: true },
              { key: 'name', label: 'Name', sortable: true },
              { key: 'email', label: 'Email', sortable: true },
              { key: 'phone', label: 'Phone', sortable: true },
              { key: 'creditAvailable', label: 'Credit Available', sortable: true },
              { key: 'status', label: 'Status', sortable: true },
              { key: 'totalPurchases', label: 'Total Purchases', sortable: true }
            ]}
            data={customers as unknown as Record<string, unknown>[]}
            searchKeys={['name', 'email', 'customerId']}
            searchPlaceholder="Search customers..."
            isLoading={customersLoading}
            onAdd={() => console.log('Add customer')}
            onRefresh={() => dispatch(fetchCustomers())}
          />
        </TabsContent>

        {/* Suppliers Tab */}
        <TabsContent value="suppliers">
          <DataTable
            title="Suppliers"
            columns={[
              { key: 'supplierId', label: 'Supplier ID', sortable: true },
              { key: 'name', label: 'Name', sortable: true },
              { key: 'email', label: 'Email', sortable: true },
              { key: 'phone', label: 'Phone', sortable: true },
              { key: 'contactPerson', label: 'Contact Person', sortable: true },
              { key: 'status', label: 'Status', sortable: true },
              { key: 'totalOrders', label: 'Total Orders', sortable: true }
            ]}
            data={suppliers as unknown as Record<string, unknown>[]}
            searchKeys={['name', 'email', 'supplierId']}
            searchPlaceholder="Search suppliers..."
            isLoading={suppliersLoading}
            onAdd={() => console.log('Add supplier')}
            onRefresh={() => dispatch(fetchSuppliers())}
          />
        </TabsContent>

        {/* Staff Tab */}
        <TabsContent value="staff">
          <DataTable
            title="Staff Members"
            columns={[
              { key: 'staffId', label: 'Staff ID', sortable: true },
              { key: 'name', label: 'Name', sortable: true },
              { key: 'email', label: 'Email', sortable: true },
              { key: 'phone', label: 'Phone', sortable: true },
              { key: 'role', label: 'Role', sortable: true },
              { key: 'status', label: 'Status', sortable: true },
              { key: 'joinDate', label: 'Join Date', sortable: true }
            ]}
            data={staff as unknown as Record<string, unknown>[]}
            searchKeys={['name', 'email', 'staffId']}
            searchPlaceholder="Search staff..."
            isLoading={staffLoading}
            onAdd={() => console.log('Add staff member')}
            onRefresh={() => dispatch(fetchStaff())}
          />
        </TabsContent>

        {/* Sales Tab */}
        <TabsContent value="sales">
          <DataTable
            title="Sales"
            columns={[
              { key: 'saleId', label: 'Sale ID', sortable: true },
              { key: 'customerName', label: 'Customer', sortable: true },
              { key: 'total', label: 'Total', sortable: true, render: (value) => `$${value}` },
              { key: 'paymentMethod', label: 'Payment Method', sortable: true },
              { key: 'status', label: 'Status', sortable: true },
              { key: 'date', label: 'Date', sortable: true }
            ]}
            data={sales as unknown as Record<string, unknown>[]}
            searchKeys={['saleId', 'customerName']}
            searchPlaceholder="Search sales..."
            isLoading={salesLoading}
            onAdd={() => console.log('Add sale')}
            onRefresh={() => dispatch(fetchSales())}
          />
        </TabsContent>

        {/* Purchases Tab */}
        <TabsContent value="purchases">
          <DataTable
            title="Purchases"
            columns={[
              { key: 'purchaseId', label: 'Purchase ID', sortable: true },
              { key: 'supplierName', label: 'Supplier', sortable: true },
              { key: 'total', label: 'Total', sortable: true, render: (value) => `$${value}` },
              { key: 'status', label: 'Status', sortable: true },
              { key: 'date', label: 'Date', sortable: true }
            ]}
            data={purchases as unknown as Record<string, unknown>[]}
            searchKeys={['purchaseId', 'supplierName']}
            searchPlaceholder="Search purchases..."
            isLoading={purchasesLoading}
            onAdd={() => console.log('Add purchase')}
            onRefresh={() => dispatch(fetchPurchases())}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
} 