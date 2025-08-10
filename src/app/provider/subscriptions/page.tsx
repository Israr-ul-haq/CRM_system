"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  IconCreditCard, 
  IconUsers,
  IconPlus,
  IconSearch,
  IconEdit,
  IconTrash,
  IconEye,
  IconFilter,
  IconDownload
} from "@tabler/icons-react"
import { RouteGuard } from "@/components/route-guard"
import { CreateSubscriptionModal } from "@/components/provider/create-subscription-modal"

// Mock data for demonstration
const mockSubscriptions = [
  {
    id: "1",
    name: "Basic Plan",
    description: "Essential features for small businesses",
    price: 29.99,
    billingCycle: "monthly",
    maxUsers: 5,
    maxBranches: 2,
    storageLimit: "10GB",
    features: ["Basic POS", "Inventory Management", "Basic Reports"],
    status: "active",
    totalSubscribers: 45,
    monthlyRevenue: 1349.55,
    createdAt: "2024-01-15"
  },
  {
    id: "2",
    name: "Professional Plan",
    description: "Advanced features for growing businesses",
    price: 79.99,
    billingCycle: "monthly",
    maxUsers: 20,
    maxBranches: 10,
    storageLimit: "100GB",
    features: ["Advanced POS", "Full Inventory", "Advanced Reports", "Multi-location"],
    status: "active",
    totalSubscribers: 28,
    monthlyRevenue: 2239.72,
    createdAt: "2024-01-10"
  },
  {
    id: "3",
    name: "Enterprise Plan",
    description: "Complete solution for large enterprises",
    price: 199.99,
    billingCycle: "monthly",
    maxUsers: 100,
    maxBranches: 50,
    storageLimit: "1TB",
    features: ["Enterprise POS", "Full Suite", "Custom Reports", "API Access", "Priority Support"],
    status: "active",
    totalSubscribers: 12,
    monthlyRevenue: 2399.88,
    createdAt: "2024-01-05"
  },
  {
    id: "4",
    name: "Starter Plan",
    description: "Perfect for new businesses",
    price: 19.99,
    billingCycle: "monthly",
    maxUsers: 2,
    maxBranches: 1,
    storageLimit: "5GB",
    features: ["Basic POS", "Simple Inventory"],
    status: "draft",
    totalSubscribers: 0,
    monthlyRevenue: 0,
    createdAt: "2024-01-20"
  }
]

interface Subscription {
  id: string
  name: string
  description: string
  price: number
  billingCycle: string
  maxUsers: number
  maxBranches: number
  storageLimit: string
  features: string[]
  status: string
  totalSubscribers: number
  monthlyRevenue: number
  createdAt: string
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateModalOpen, setIsCreateModal] = useState(false)
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)

  const filteredSubscriptions = subscriptions.filter(subscription => {
    const matchesSearch = subscription.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         subscription.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || subscription.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalRevenue = subscriptions.reduce((sum, sub) => sum + sub.monthlyRevenue, 0)
  const totalSubscribers = subscriptions.reduce((sum, sub) => sum + sub.totalSubscribers, 0)
  const activeSubscriptions = subscriptions.filter(sub => sub.status === "active").length
  const draftSubscriptions = subscriptions.filter(sub => sub.status === "draft").length

  const handleDeleteSubscription = (id: string) => {
    if (confirm("Are you sure you want to delete this subscription?")) {
      setSubscriptions(subscriptions.filter(sub => sub.id !== id))
    }
  }

  const handleEditSubscription = (subscription: Subscription) => {
    setSelectedSubscription(subscription)
    // TODO: Open edit modal
  }

  const handleViewSubscription = (subscription: Subscription) => {
    setSelectedSubscription(subscription)
    // TODO: Open view modal
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "default"
      case "draft": return "secondary"
      case "archived": return "destructive"
      default: return "secondary"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  return (
    <>
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
                    <div className="flex items-center justify-between">
                      <div>
                        <h1 className="text-3xl font-bold tracking-tight">Subscriptions</h1>
                        <p className="text-muted-foreground">
                          Manage subscription plans and pricing
                        </p>
                      </div>
                      <Button onClick={() => setIsCreateModal(true)}>
                        <IconPlus className="w-4 h-4 mr-2" />
                        Create New Plan
                      </Button>
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="px-4 lg:px-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                          <IconCreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                          <p className="text-xs text-muted-foreground">Monthly recurring</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
                          <IconUsers className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{totalSubscribers}</div>
                          <p className="text-xs text-muted-foreground">Active subscriptions</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Active Plans</CardTitle>
                          <IconCreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{activeSubscriptions}</div>
                          <p className="text-xs text-muted-foreground">Published plans</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Draft Plans</CardTitle>
                          <IconCreditCard className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{draftSubscriptions}</div>
                          <p className="text-xs text-muted-foreground">In development</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Search and Filters */}
                  <div className="px-4 lg:px-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex flex-1 items-center space-x-2">
                        <div className="relative flex-1 max-w-sm">
                          <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Search subscriptions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                          />
                        </div>
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="px-3 py-2 border border-input rounded-md bg-background"
                        >
                          <option value="all">All Status</option>
                          <option value="active">Active</option>
                          <option value="draft">Draft</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <IconFilter className="w-4 h-4 mr-2" />
                          Filters
                        </Button>
                        <Button variant="outline" size="sm">
                          <IconDownload className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Subscriptions Table */}
                  <div className="px-4 lg:px-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>All Subscription Plans</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Plan Name</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Subscribers</TableHead>
                              <TableHead>Monthly Revenue</TableHead>
                              <TableHead>Created</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredSubscriptions.map((subscription) => (
                              <TableRow key={subscription.id}>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{subscription.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {subscription.description}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium">
                                    {formatCurrency(subscription.price)}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    per {subscription.billingCycle}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant={getStatusColor(subscription.status)}>
                                    {subscription.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium">{subscription.totalSubscribers}</div>
                                  <div className="text-sm text-muted-foreground">
                                    max {subscription.maxUsers} users
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium">
                                    {formatCurrency(subscription.monthlyRevenue)}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm text-muted-foreground">
                                    {new Date(subscription.createdAt).toLocaleDateString()}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => handleViewSubscription(subscription)}>
                                      <IconEye className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => handleEditSubscription(subscription)}>
                                      <IconEdit className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => handleDeleteSubscription(subscription.id)}>
                                      <IconTrash className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </RouteGuard>

      {/* Create Subscription Modal */}
      <CreateSubscriptionModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModal}
        onSubscriptionCreated={(newSubscription: Subscription) => {
          setSubscriptions([...subscriptions, { ...newSubscription, id: Date.now().toString() }])
          setIsCreateModal(false)
        }}
      />
    </>
  )
} 