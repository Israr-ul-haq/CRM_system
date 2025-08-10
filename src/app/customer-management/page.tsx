"use client"

import { useState, useEffect } from "react"
import { CustomerManagementTable } from "@/components/customer-management-table"
import { AddCustomerModal } from "@/components/add-customer-modal"
import { EditCustomerModal } from "@/components/edit-customer-modal"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { IconPlus, IconUsers, IconCreditCard, IconCurrencyDollar } from "@tabler/icons-react"
import { useAppDispatch, useAppSelector } from "@/store"
import { fetchCustomers, addCustomer, updateCustomer, deleteCustomer, type Customer } from "@/store/slices/customerSlice"
import { AuthGuard } from "@/components/auth-guard"

export default function CustomerManagementPage() {
  const dispatch = useAppDispatch()
  const {
    customers,
    filteredCustomers,
    isLoading,
    error
  } = useAppSelector(state => state.customer)

  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  useEffect(() => {
    dispatch(fetchCustomers())
  }, [dispatch])

  // Calculate totals from Redux state
  const totalCustomers = customers.length
  const totalCreditLimit = customers.reduce((sum, customer) => sum + customer.creditLimit, 0)
  const totalCreditUsed = customers.reduce((sum, customer) => sum + customer.creditUsed, 0)

  const handleFilterChange = (filters: {
    status: string
    creditStatus: string
  }) => {
    // Filtering is handled by Redux slice
    console.log("Applying filters:", filters)
  }

  const handleAddCustomer = () => {
    setIsAddModalOpen(true)
  }

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsEditModalOpen(true)
  }

  const handleAddCustomerSubmit = async (customerData: {
    customerId: string
    name: string
    email: string
    phone: string
    address: string
    creditLimit: string
    status: "active" | "inactive" | "suspended"
  }) => {
    try {
      await dispatch(addCustomer({
        ...customerData,
        creditLimit: parseFloat(customerData.creditLimit)
      })).unwrap()
      setIsAddModalOpen(false)
    } catch (error) {
      console.error("Failed to add customer:", error)
    }
  }

  const handleEditCustomerSubmit = async (customerData: {
    customerId: string
    name: string
    email: string
    phone: string
    address: string
    creditLimit: string
    status: "active" | "inactive" | "suspended"
  }) => {
    if (!selectedCustomer) return
    
    try {
      await dispatch(updateCustomer({
        id: selectedCustomer.id,
        customerData: {
          ...customerData,
          creditLimit: parseFloat(customerData.creditLimit)
        }
      })).unwrap()
      setIsEditModalOpen(false)
      setSelectedCustomer(null)
    } catch (error) {
      console.error("Failed to update customer:", error)
    }
  }

  const handleDeleteCustomer = async (customerId: number) => {
    try {
      await dispatch(deleteCustomer(customerId)).unwrap()
    } catch (error) {
      console.error("Failed to delete customer:", error)
    }
  }

  return (
    <AuthGuard>
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
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h1 className="text-2xl font-bold tracking-tight">Customer Management</h1>
                        <p className="text-muted-foreground">
                          Manage customer accounts, credit limits, and relationships
                        </p>
                      </div>
                      <Button onClick={handleAddCustomer}>
                        <IconPlus className="mr-2 h-4 w-4" />
                        Add Customer
                      </Button>
                    </div>

                    {/* Summary Cards */}
                    <div className="grid gap-4 md:grid-cols-3">
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                          <IconUsers className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{totalCustomers}</div>
                          <p className="text-xs text-muted-foreground">
                            Active customer accounts
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Total Credit Limit</CardTitle>
                          <IconCreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">${totalCreditLimit.toLocaleString()}</div>
                          <p className="text-xs text-muted-foreground">
                            Combined credit limits
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Credit Used</CardTitle>
                          <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">${totalCreditUsed.toLocaleString()}</div>
                          <p className="text-xs text-muted-foreground">
                            Total credit utilized
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>

                {/* Customer Table */}
                <CustomerManagementTable
                  data={filteredCustomers}
                  onEditCustomer={handleEditCustomer}
                  onViewHistory={(customer) => console.log("View history for:", customer)}
                  onPayment={(customer) => console.log("Payment for:", customer)}
                />
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>

      {/* Modals */}
      <AddCustomerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddCustomerSubmit}
      />

      <EditCustomerModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        customer={selectedCustomer}
        onSubmit={handleEditCustomerSubmit}
      />
    </AuthGuard>
  )
} 