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
  IconBuilding, 
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
import { CreateOwnerModal } from "@/components/provider/create-owner-modal"

// Mock data for demonstration
const mockOwners = [
  {
    id: "1",
    logo: null,
    name: "Acme Restaurant Group",
    email: "admin@acmerestaurant.com",
    subscriptionPlan: "Premium Plan",
    paymentMethod: "Credit Card",
    status: "active",
    branches: 3,
    maxBranches: 5,
    storageUsed: "2.4 GB",
    storageLimit: "10 GB",
    subscriptionEndDate: "2024-12-31",
    monthlyRevenue: 299,
    createdAt: "2024-01-15"
  },
  {
    id: "2",
    logo: null,
    name: "Downtown Coffee Co.",
    email: "manager@downtowncoffee.com",
    subscriptionPlan: "Standard Plan",
    paymentMethod: "PayPal",
    status: "active",
    branches: 1,
    maxBranches: 2,
    storageUsed: "0.8 GB",
    storageLimit: "5 GB",
    subscriptionEndDate: "2024-11-30",
    monthlyRevenue: 99,
    createdAt: "2024-02-01"
  },
  {
    id: "3",
    logo: null,
    name: "Green Grocery Store",
    email: "owner@greengrocery.com",
    subscriptionPlan: "Basic Plan",
    paymentMethod: "Bank Transfer",
    status: "trial",
    branches: 1,
    maxBranches: 1,
    storageUsed: "0.3 GB",
    storageLimit: "2 GB",
    subscriptionEndDate: "2024-04-15",
    monthlyRevenue: 0,
    createdAt: "2024-03-01"
  },
  {
    id: "4",
    logo: null,
    name: "Tech Startup Inc.",
    email: "ceo@techstartup.com",
    subscriptionPlan: "Enterprise Plan",
    paymentMethod: "Credit Card",
    status: "active",
    branches: 8,
    maxBranches: 10,
    storageUsed: "15.2 GB",
    storageLimit: "50 GB",
    subscriptionEndDate: "2025-01-31",
    monthlyRevenue: 599,
    createdAt: "2023-11-01"
  }
]

interface Owner {
  id: string
  logo: string | null
  name: string
  email: string
  subscriptionPlan: string
  paymentMethod: string
  status: string
  branches: number
  maxBranches: number
  storageUsed: string
  storageLimit: string
  subscriptionEndDate: string
  monthlyRevenue: number
  createdAt: string
}

export default function OwnersPage() {
  const [owners, setOwners] = useState<Owner[]>(mockOwners)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null)

  const filteredOwners = owners.filter(owner => {
    const matchesSearch = owner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         owner.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || owner.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalRevenue = owners.reduce((sum, owner) => sum + owner.monthlyRevenue, 0)
  const totalBranches = owners.reduce((sum, owner) => sum + owner.branches, 0)
  const activeOwners = owners.filter(owner => owner.status === "active").length
  const trialOwners = owners.filter(owner => owner.status === "trial").length

  const handleDeleteOwner = (id: string) => {
    if (confirm("Are you sure you want to delete this owner?")) {
      setOwners(owners.filter(owner => owner.id !== id))
    }
  }

  const handleEditOwner = (owner: Owner) => {
    setSelectedOwner(owner)
    // In real app, this would open an edit modal
    console.log("Edit owner:", owner)
  }

  const handleViewOwner = (owner: Owner) => {
    // In real app, this would navigate to owner details page
    console.log("View owner:", owner)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'trial': return 'bg-blue-100 text-blue-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
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
                        <h1 className="text-3xl font-bold">Owners</h1>
                        <p className="text-muted-foreground mt-2">
                          Manage your software users and their subscriptions
                        </p>
                      </div>
                      <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2">
                        <IconPlus className="w-4 h-4" />
                        Create New Owner
                      </Button>
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="px-4 lg:px-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Total Owners</CardTitle>
                          <IconUsers className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{owners.length}</div>
                          <p className="text-xs text-muted-foreground">
                            {activeOwners} active, {trialOwners} trial
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                          <IconBuilding className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{formatCurrency(totalRevenue)}</div>
                          <p className="text-xs text-muted-foreground">
                            From {activeOwners} active subscriptions
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Total Branches</CardTitle>
                          <IconBuilding className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{totalBranches}</div>
                          <p className="text-xs text-muted-foreground">
                            Across all owner accounts
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                          <IconUsers className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">
                            {Math.round((activeOwners / owners.length) * 100)}%
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Trial to active conversion
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Search and Filters */}
                  <div className="px-4 lg:px-6">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                          <div className="flex flex-1 items-center space-x-2">
                            <div className="relative flex-1 max-w-sm">
                              <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="Search owners..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                              />
                            </div>
                            <select
                              value={statusFilter}
                              onChange={(e) => setStatusFilter(e.target.value)}
                              className="px-3 py-2 border rounded-md"
                            >
                              <option value="all">All Status</option>
                              <option value="active">Active</option>
                              <option value="trial">Trial</option>
                              <option value="suspended">Suspended</option>
                            </select>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <IconFilter className="w-4 h-4 mr-2" />
                              More Filters
                            </Button>
                            <Button variant="outline" size="sm">
                              <IconDownload className="w-4 h-4 mr-2" />
                              Export
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Owners Table */}
                  <div className="px-4 lg:px-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>All Owners</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Company</TableHead>
                              <TableHead>Subscription</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Branches</TableHead>
                              <TableHead>Storage</TableHead>
                              <TableHead>Monthly Revenue</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredOwners.map((owner) => (
                              <TableRow key={owner.id}>
                                <TableCell>
                                  <div className="flex items-center gap-3">
                                    {owner.logo ? (
                                      <img 
                                        src={owner.logo} 
                                        alt={owner.name}
                                        className="w-10 h-10 rounded-lg object-cover"
                                      />
                                    ) : (
                                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                                        <IconBuilding className="w-5 h-5 text-muted-foreground" />
                                      </div>
                                    )}
                                    <div>
                                      <div className="font-medium">{owner.name}</div>
                                      <div className="text-sm text-muted-foreground">{owner.email}</div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{owner.subscriptionPlan}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {owner.paymentMethod}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge className={getStatusColor(owner.status)}>
                                    {owner.status.charAt(0).toUpperCase() + owner.status.slice(1)}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{owner.branches}</div>
                                    <div className="text-sm text-muted-foreground">
                                      of {owner.maxBranches}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{owner.storageUsed}</div>
                                    <div className="text-sm text-muted-foreground">
                                      of {owner.storageLimit}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium">
                                    {owner.status === 'trial' ? 'Trial' : formatCurrency(owner.monthlyRevenue)}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleViewOwner(owner)}
                                    >
                                      <IconEye className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleEditOwner(owner)}
                                    >
                                      <IconEdit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDeleteOwner(owner.id)}
                                    >
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

      {/* Create Owner Modal */}
      <CreateOwnerModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onOwnerCreated={(newOwner: Owner) => {
          setOwners([...owners, { ...newOwner, id: Date.now().toString() }])
          setIsCreateModalOpen(false)
        }}
      />
    </>
  )
} 