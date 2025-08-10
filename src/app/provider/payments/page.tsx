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
  IconReceipt, 
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
import { CreatePaymentMethodModal } from "@/components/provider/create-payment-method-modal"

// Mock data for demonstration
const mockPaymentMethods = [
  {
    id: "1",
    name: "Credit Card",
    description: "Visa, Mastercard, American Express",
    type: "card",
    status: "active",
    processingFee: 2.9,
    transactionFee: 0.30,
    supportedCurrencies: ["USD", "EUR", "GBP"],
    totalTransactions: 1247,
    monthlyVolume: 45678.90,
    createdAt: "2024-01-15"
  },
  {
    id: "2",
    name: "Bank Transfer",
    description: "Direct bank transfers and ACH",
    type: "bank",
    status: "active",
    processingFee: 0.5,
    transactionFee: 0.25,
    supportedCurrencies: ["USD"],
    totalTransactions: 89,
    monthlyVolume: 12345.67,
    createdAt: "2024-01-10"
  },
  {
    id: "3",
    name: "PayPal",
    description: "PayPal digital wallet integration",
    type: "digital",
    status: "active",
    processingFee: 3.5,
    transactionFee: 0.49,
    supportedCurrencies: ["USD", "EUR", "GBP", "CAD"],
    totalTransactions: 567,
    monthlyVolume: 23456.78,
    createdAt: "2024-01-05"
  },
  {
    id: "4",
    name: "Cryptocurrency",
    description: "Bitcoin, Ethereum, and other crypto payments",
    type: "crypto",
    status: "draft",
    processingFee: 1.0,
    transactionFee: 0.00,
    supportedCurrencies: ["BTC", "ETH", "USDC"],
    totalTransactions: 0,
    monthlyVolume: 0,
    createdAt: "2024-01-20"
  }
]

interface PaymentMethod {
  id: string
  name: string
  description: string
  type: string
  status: string
  processingFee: number
  transactionFee: number
  supportedCurrencies: string[]
  totalTransactions: number
  monthlyVolume: number
  createdAt: string
}

export default function PaymentsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isCreateModalOpen, setIsCreateModal] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null)

  const filteredPaymentMethods = paymentMethods.filter(method => {
    const matchesSearch = method.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         method.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || method.status === statusFilter
    const matchesType = typeFilter === "all" || method.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const totalVolume = paymentMethods.reduce((sum, method) => sum + method.monthlyVolume, 0)
  const totalTransactions = paymentMethods.reduce((sum, method) => sum + method.totalTransactions, 0)
  const activeMethods = paymentMethods.filter(method => method.status === "active").length
  const draftMethods = paymentMethods.filter(method => method.status === "draft").length

  const handleDeletePaymentMethod = (id: string) => {
    if (confirm("Are you sure you want to delete this payment method?")) {
      setPaymentMethods(paymentMethods.filter(method => method.id !== id))
    }
  }

  const handleEditPaymentMethod = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method)
    // TODO: Open edit modal
  }

  const handleViewPaymentMethod = (method: PaymentMethod) => {
    setSelectedPaymentMethod(method)
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case "card": return "default"
      case "bank": return "secondary"
      case "digital": return "outline"
      case "crypto": return "destructive"
      default: return "secondary"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatPercentage = (amount: number) => {
    return `${amount}%`
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
                        <h1 className="text-3xl font-bold tracking-tight">Payment Methods</h1>
                        <p className="text-muted-foreground">
                          Manage payment processing and methods
                        </p>
                      </div>
                      <Button onClick={() => setIsCreateModal(true)}>
                        <IconPlus className="w-4 h-4 mr-2" />
                        Add Payment Method
                      </Button>
                    </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="px-4 lg:px-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
                          <IconReceipt className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{formatCurrency(totalVolume)}</div>
                          <p className="text-xs text-muted-foreground">Monthly processing</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                          <IconUsers className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{totalTransactions}</div>
                          <p className="text-xs text-muted-foreground">All time</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Active Methods</CardTitle>
                          <IconReceipt className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{activeMethods}</div>
                          <p className="text-xs text-muted-foreground">Available for use</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-sm font-medium">Draft Methods</CardTitle>
                          <IconReceipt className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">{draftMethods}</div>
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
                            placeholder="Search payment methods..."
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
                        <select
                          value={typeFilter}
                          onChange={(e) => setTypeFilter(e.target.value)}
                          className="px-3 py-2 border border-input rounded-md bg-background"
                        >
                          <option value="all">All Types</option>
                          <option value="card">Card</option>
                          <option value="bank">Bank</option>
                          <option value="digital">Digital</option>
                          <option value="crypto">Crypto</option>
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

                  {/* Payment Methods Table */}
                  <div className="px-4 lg:px-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>All Payment Methods</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Method Name</TableHead>
                              <TableHead>Type</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Fees</TableHead>
                              <TableHead>Transactions</TableHead>
                              <TableHead>Monthly Volume</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredPaymentMethods.map((method) => (
                              <TableRow key={method.id}>
                                <TableCell>
                                  <div>
                                    <div className="font-medium">{method.name}</div>
                                    <div className="text-sm text-muted-foreground">
                                      {method.description}
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant={getTypeColor(method.type)}>
                                    {method.type}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge variant={getStatusColor(method.status)}>
                                    {method.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium">
                                    {formatPercentage(method.processingFee)} + {formatCurrency(method.transactionFee)}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    per transaction
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium">{method.totalTransactions}</div>
                                  <div className="text-sm text-muted-foreground">
                                    all time
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium">
                                    {formatCurrency(method.monthlyVolume)}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => handleViewPaymentMethod(method)}>
                                      <IconEye className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => handleEditPaymentMethod(method)}>
                                      <IconEdit className="w-4 h-4" />
                                    </Button>
                                    <Button variant="outline" size="sm" onClick={() => handleDeletePaymentMethod(method.id)}>
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

      {/* Create Payment Method Modal */}
      <CreatePaymentMethodModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModal}
        onPaymentMethodCreated={(newMethod: PaymentMethod) => {
          setPaymentMethods([...paymentMethods, { ...newMethod, id: Date.now().toString() }])
          setIsCreateModal(false)
        }}
      />
    </>
  )
} 