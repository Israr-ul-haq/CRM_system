"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { RootState, AppDispatch } from "@/store"
import { fetchCurrentCompany } from "@/store/slices/companySlice"
import { fetchSubscriptions } from "@/store/slices/subscriptionSlice"
import { fetchPaymentMethods } from "@/store/slices/paymentMethodSlice"
import { SiteHeader } from "@/components/site-header"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  IconBuilding, 
  IconUsers,
  IconCurrencyDollar,
  IconChartBar,
  IconTrendingUp,
  IconTrendingDown,
  IconPackage,
  IconDatabase,
  IconGlobe,
  IconActivity
} from "@tabler/icons-react"
import { GlobalLoading } from "@/components/global-loading"
import { RouteGuard } from "@/components/route-guard"

export default function ProviderPortalPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { currentCompany, loading: companyLoading } = useSelector((state: RootState) => state.company)
  const { subscriptions, loading: subscriptionLoading } = useSelector((state: RootState) => state.subscription)
  const { paymentMethods, loading: paymentMethodLoading } = useSelector((state: RootState) => state.paymentMethod)
  
  const isLoading = companyLoading || subscriptionLoading || paymentMethodLoading

  useEffect(() => {
    // Fetch current company data
    if (!currentCompany) {
      dispatch(fetchCurrentCompany('1')) // Assuming company ID 1 for demo
    }
    
    // Fetch available subscriptions and payment methods
    dispatch(fetchSubscriptions())
    dispatch(fetchPaymentMethods())
  }, [dispatch, currentCompany])

  if (isLoading) {
    return (
      <GlobalLoading loadingText="Loading provider portal..." loadingDelay={500}>
        <div />
      </GlobalLoading>
    )
  }

  // Mock data for demonstration - in real app this would come from API
  const mockStats = {
    totalUsers: 1247,
    activeUsers: 1189,
    totalMonthlyRevenue: 45600,
    monthlyGrowth: 12.5,
    totalBranches: 89,
    activeBranches: 84,
    totalStorageUsed: 2.4, // TB
    storageGrowth: 8.2,
    subscriptionPlans: 4,
    paymentMethods: 6
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
    return new Intl.NumberFormat('en-US').format(num)
  }

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600'
  }

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? IconTrendingUp : IconTrendingDown
  }

  return (
    <RouteGuard>
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
                    <div className="flex items-center gap-4">
                      {currentCompany?.logo ? (
                        <img 
                          src={currentCompany.logo} 
                          alt={currentCompany.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                          <IconBuilding className="w-8 h-8 text-muted-foreground" />
                        </div>
                      )}
                      <div>
                        <h1 className="text-3xl font-bold">Provider Dashboard</h1>
                        <p className="text-muted-foreground mt-2">
                          Welcome back, {currentCompany?.name || 'Software Provider'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Key Metrics Grid */}
                  <div className="px-4 lg:px-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      {/* Total Users */}
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                          <IconUsers className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{formatNumber(mockStats.totalUsers)}</div>
                          <p className="text-xs text-muted-foreground">
                            <span className={getGrowthColor(mockStats.monthlyGrowth)}>
                              +{mockStats.monthlyGrowth}%
                            </span>{" "}
                            from last month
                          </p>
                        </CardContent>
                      </Card>

                      {/* Monthly Revenue */}
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                          <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{formatCurrency(mockStats.totalMonthlyRevenue)}</div>
                          <p className="text-xs text-muted-foreground">
                            <span className={getGrowthColor(mockStats.monthlyGrowth)}>
                              +{mockStats.monthlyGrowth}%
                            </span>{" "}
                            from last month
                          </p>
                        </CardContent>
                      </Card>

                      {/* Active Branches */}
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Active Branches</CardTitle>
                          <IconBuilding className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{mockStats.activeBranches}</div>
                          <p className="text-xs text-muted-foreground">
                            of {mockStats.totalBranches} total branches
                          </p>
                        </CardContent>
                      </Card>

                      {/* Storage Usage */}
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                          <IconDatabase className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{mockStats.totalStorageUsed} TB</div>
                          <p className="text-xs text-muted-foreground">
                            <span className={getGrowthColor(mockStats.storageGrowth)}>
                              +{mockStats.storageGrowth}%
                            </span>{" "}
                            from last month
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Detailed Stats Section */}
                  <div className="px-4 lg:px-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      {/* Subscription Plans Overview */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <IconPackage className="w-5 h-5" />
                            Subscription Plans
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Total Plans:</span>
                              <Badge variant="outline">{mockStats.subscriptionPlans}</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Active Plans:</span>
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                {mockStats.subscriptionPlans}
                              </Badge>
                            </div>
                            <div className="pt-2">
                              <h4 className="text-sm font-medium mb-2">Popular Plans:</h4>
                              <div className="space-y-2">
                                {subscriptions.slice(0, 3).map((plan, index) => (
                                  <div key={plan.id} className="flex items-center justify-between text-sm">
                                    <span>{plan.name}</span>
                                    <span className="text-muted-foreground">
                                      {formatCurrency(plan.price)}/{plan.billingCycle}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Payment Methods Overview */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <IconCurrencyDollar className="w-5 h-5" />
                            Payment Methods
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Total Methods:</span>
                              <Badge variant="outline">{mockStats.paymentMethods}</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">Active Methods:</span>
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                {mockStats.paymentMethods}
                              </Badge>
                            </div>
                            <div className="pt-2">
                              <h4 className="text-sm font-medium mb-2">Supported Types:</h4>
                              <div className="flex flex-wrap gap-1">
                                {paymentMethods.slice(0, 4).map((method, index) => (
                                  <Badge key={method.id} variant="secondary" className="text-xs">
                                    {method.type}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="px-4 lg:px-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <IconActivity className="w-5 h-5" />
                          Recent Activity
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 text-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>New subscription activated - Premium Plan</span>
                            <span className="text-muted-foreground ml-auto">2 hours ago</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span>Payment received - $299.00</span>
                            <span className="text-muted-foreground ml-auto">4 hours ago</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span>New branch added - Downtown Location</span>
                            <span className="text-muted-foreground ml-auto">1 day ago</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span>Storage limit warning - 85% used</span>
                            <span className="text-muted-foreground ml-auto">2 days ago</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
    </RouteGuard>
  )
} 