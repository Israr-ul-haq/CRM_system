"use client"

import { useState, useEffect } from "react"
import { SalesTable } from "@/components/sales-table"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IconPlus, IconSearch, IconFilter, IconDownload } from "@tabler/icons-react"
import { AuthGuard } from "@/components/auth-guard"

interface SaleItem {
  name: string
  quantity: number
  price: number
  total: number
}

interface Sale {
  id: number
  invoiceNumber: string
  date: string
  customerName: string
  category: string
  company: string
  items: SaleItem[]
  totalAmount: number
  paymentMethod: string
  status: "Completed" | "Pending" | "Cancelled"
}

// Sample sales data - in real app this would come from your database
const sampleSalesData: Sale[] = [
  {
    id: 1,
    invoiceNumber: "INV-001",
    date: "2024-01-15",
    customerName: "John Doe",
    category: "Electronics",
    company: "Tech Corp",
    items: [
      { name: "Laptop", quantity: 1, price: 999.99, total: 999.99 },
      { name: "Mouse", quantity: 2, price: 25.99, total: 51.98 }
    ],
    totalAmount: 1051.97,
    paymentMethod: "Credit Card",
    status: "Completed"
  },
  {
    id: 2,
    invoiceNumber: "INV-002",
    date: "2024-01-14",
    customerName: "Jane Smith",
    category: "Clothing",
    company: "Fashion Inc",
    items: [
      { name: "T-Shirt", quantity: 3, price: 19.99, total: 59.97 },
      { name: "Jeans", quantity: 1, price: 79.99, total: 79.99 }
    ],
    totalAmount: 139.96,
    paymentMethod: "Cash",
    status: "Completed"
  },
  {
    id: 3,
    invoiceNumber: "INV-003",
    date: "2024-01-13",
    customerName: "Bob Johnson",
    category: "Home & Garden",
    company: "Home Depot",
    items: [
      { name: "Garden Tool Set", quantity: 1, price: 149.99, total: 149.99 }
    ],
    totalAmount: 149.99,
    paymentMethod: "Debit Card",
    status: "Pending"
  }
]

export default function SalesRegisterPage() {
  const [salesData, setSalesData] = useState(sampleSalesData)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedCompany, setSelectedCompany] = useState("all")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  // Filter sales data based on search and filters
  const filteredSales = salesData.filter(sale => {
    const matchesSearch = sale.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sale.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || sale.category === selectedCategory
    const matchesCompany = selectedCompany === "all" || sale.company === selectedCompany
    const matchesDateRange = (!startDate || sale.date >= startDate) && (!endDate || sale.date <= endDate)
    
    return matchesSearch && matchesCategory && matchesCompany && matchesDateRange
  })

  // Get unique categories and companies for filter dropdowns
  const categories = [...new Set(salesData.map(sale => sale.category))]
  const companies = [...new Set(salesData.map(sale => sale.company))]

  const handleExport = () => {
    // Here you would implement CSV/Excel export functionality
    console.log("Exporting sales data...")
  }

  const handleClearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSelectedCompany("all")
    setStartDate("")
    setEndDate("")
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
                        <h1 className="text-2xl font-bold tracking-tight">Sales Register</h1>
                        <p className="text-muted-foreground">
                          View and manage your sales records and transactions
                        </p>
                      </div>
                      <Button onClick={handleExport}>
                        <IconDownload className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                    </div>

                    {/* Filters */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <IconFilter className="h-4 w-4" />
                          Filters
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="search">Search</Label>
                            <Input
                              id="search"
                              placeholder="Customer or Invoice..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                              <SelectTrigger>
                                <SelectValue placeholder="All Categories" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {categories.map(category => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="company">Company</Label>
                            <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                              <SelectTrigger>
                                <SelectValue placeholder="All Companies" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Companies</SelectItem>
                                {companies.map(company => (
                                  <SelectItem key={company} value={company}>
                                    {company}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input
                              id="startDate"
                              type="date"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="endDate">End Date</Label>
                            <Input
                              id="endDate"
                              type="date"
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="flex justify-end mt-4">
                          <Button variant="outline" onClick={handleClearFilters}>
                            Clear Filters
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Sales Table */}
                <SalesTable sales={filteredSales} />
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  )
} 