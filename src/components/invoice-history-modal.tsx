"use client"

import { useState, useEffect } from "react"
import { IconCalendar, IconSearch, IconFilter, IconReceipt, IconCurrencyDollar, IconArrowBack } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Sample invoice data - in real app this would come from your database
const generateSampleInvoices = () => {
  const today = new Date()
  const invoices = []
  
  // Generate today's invoices
  for (let i = 1; i <= 8; i++) {
    const time = new Date(today)
    time.setHours(9 + Math.floor(Math.random() * 10))
    time.setMinutes(Math.floor(Math.random() * 60))
    
    invoices.push({
      id: `INV-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-${String(i).padStart(3, '0')}`,
      date: time.toISOString(),
      items: Math.floor(Math.random() * 5) + 1,
      total: Math.floor(Math.random() * 500) + 50,
      discount: Math.floor(Math.random() * 20),
      cashReceived: Math.floor(Math.random() * 100) + 50,
      change: Math.floor(Math.random() * 50),
      status: "completed"
    })
  }
  
  // Generate some past invoices
  for (let day = 1; day <= 7; day++) {
    const pastDate = new Date(today)
    pastDate.setDate(today.getDate() - day)
    
    for (let i = 1; i <= Math.floor(Math.random() * 5) + 2; i++) {
      const time = new Date(pastDate)
      time.setHours(9 + Math.floor(Math.random() * 10))
      time.setMinutes(Math.floor(Math.random() * 60))
      
      invoices.push({
        id: `INV-${pastDate.getFullYear()}${String(pastDate.getMonth() + 1).padStart(2, '0')}${String(pastDate.getDate()).padStart(2, '0')}-${String(i).padStart(3, '0')}`,
        date: time.toISOString(),
        items: Math.floor(Math.random() * 5) + 1,
        total: Math.floor(Math.random() * 500) + 50,
        discount: Math.floor(Math.random() * 20),
        cashReceived: Math.floor(Math.random() * 100) + 50,
        change: Math.floor(Math.random() * 50),
        status: "completed"
      })
    }
  }
  
  return invoices.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

interface Invoice {
  id: string
  date: string
  items: number
  total: number
  discount: number
  cashReceived: number
  change: number
  status: string
}

interface InvoiceHistoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onReturnInvoice?: (invoiceId: string) => void
}

export function InvoiceHistoryModal({ open, onOpenChange, onReturnInvoice }: InvoiceHistoryModalProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([])
  const [dateFilter, setDateFilter] = useState("today")
  const [customDate, setCustomDate] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  // Load sample data on mount
  useEffect(() => {
    const sampleInvoices = generateSampleInvoices()
    setInvoices(sampleInvoices)
  }, [])

  // Filter invoices based on date and search
  useEffect(() => {
    let filtered = [...invoices]

    // Apply date filter
    const today = new Date()
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    const todayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59)

    switch (dateFilter) {
      case "today":
        filtered = filtered.filter(invoice => {
          const invoiceDate = new Date(invoice.date)
          return invoiceDate >= todayStart && invoiceDate <= todayEnd
        })
        break
      case "yesterday":
        const yesterdayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)
        const yesterdayEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 23, 59, 59)
        filtered = filtered.filter(invoice => {
          const invoiceDate = new Date(invoice.date)
          return invoiceDate >= yesterdayStart && invoiceDate <= yesterdayEnd
        })
        break
      case "week":
        const weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7)
        filtered = filtered.filter(invoice => {
          const invoiceDate = new Date(invoice.date)
          return invoiceDate >= weekStart
        })
        break
      case "month":
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
        filtered = filtered.filter(invoice => {
          const invoiceDate = new Date(invoice.date)
          return invoiceDate >= monthStart
        })
        break
      case "custom":
        if (customDate) {
          const customDateStart = new Date(customDate)
          const customDateEnd = new Date(customDate)
          customDateEnd.setHours(23, 59, 59)
          filtered = filtered.filter(invoice => {
            const invoiceDate = new Date(invoice.date)
            return invoiceDate >= customDateStart && invoiceDate <= customDateEnd
          })
        }
        break
      default:
        break
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(invoice =>
        invoice.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredInvoices(filtered)
  }, [invoices, dateFilter, customDate, searchQuery])

  // Calculate totals
  const totalSales = filteredInvoices.reduce((sum, invoice) => sum + invoice.total, 0)
  const totalDiscounts = filteredInvoices.reduce((sum, invoice) => sum + invoice.discount, 0)
  const totalItems = filteredInvoices.reduce((sum, invoice) => sum + invoice.items, 0)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const isToday = (dateString: string) => {
    const today = new Date()
    const invoiceDate = new Date(dateString)
    return today.toDateString() === invoiceDate.toDateString()
  }

  const handleReturn = (invoiceId: string) => {
    onReturnInvoice?.(invoiceId)
  }

  const handleEdit = (invoiceId: string) => {
    onReturnInvoice?.(invoiceId)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconReceipt className="h-5 w-5" />
            Invoice History
          </DialogTitle>
          <DialogDescription>
            View and filter invoice history with sales totals
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Date Filter */}
            <div className="flex items-center gap-2">
              <IconCalendar className="h-4 w-4 text-muted-foreground" />
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="custom">Custom Date</SelectItem>
                </SelectContent>
              </Select>
              
              {dateFilter === "custom" && (
                <Input
                  type="date"
                  value={customDate}
                  onChange={(e) => setCustomDate(e.target.value)}
                  className="w-[140px]"
                />
              )}
            </div>

            {/* Search */}
            <div className="relative flex-1">
              <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by invoice ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                             <div className="flex items-center gap-2">
                 <IconCurrencyDollar className="h-4 w-4 text-blue-600" />
                 <span className="text-sm font-medium text-blue-600">Total Sales</span>
               </div>
              <div className="text-2xl font-bold text-blue-600">${totalSales.toFixed(2)}</div>
            </div>
            
            <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2">
                <IconReceipt className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">Total Invoices</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{filteredInvoices.length}</div>
            </div>
            
            <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-2">
                <IconFilter className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-600">Total Items</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">{totalItems}</div>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="border rounded-lg overflow-hidden">
            <div className="max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                                         <TableHead>Date & Time</TableHead>
                     <TableHead className="text-center">Items</TableHead>
                     <TableHead className="text-right">Total</TableHead>
                     <TableHead className="text-right">Discount</TableHead>
                     <TableHead className="text-right">Cash Received</TableHead>
                     <TableHead className="text-right">Change</TableHead>
                     <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                                     {filteredInvoices.length === 0 ? (
                     <TableRow>
                       <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                         No invoices found for the selected criteria.
                       </TableCell>
                     </TableRow>
                   ) : (
                    filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-medium">{invoice.id}</TableCell>
                        <TableCell>{formatDate(invoice.date)}</TableCell>
                        <TableCell className="text-center">{invoice.items}</TableCell>
                        <TableCell className="text-right font-medium">
                          ${invoice.total.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          ${invoice.discount.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          ${invoice.cashReceived.toFixed(2)}
                        </TableCell>
                                                 <TableCell className="text-right text-green-600">
                           ${invoice.change.toFixed(2)}
                         </TableCell>
                         <TableCell className="text-center">
                           {isToday(invoice.date) ? (
                             <Button
                               variant="outline"
                               size="sm"
                               onClick={() => handleEdit(invoice.id)}
                               className="text-blue-600 hover:text-blue-700"
                             >
                               Edit
                             </Button>
                           ) : (
                             <Button
                               variant="outline"
                               size="sm"
                               onClick={() => handleReturn(invoice.id)}
                               className="text-red-600 hover:text-red-700"
                             >
                               <IconArrowBack className="mr-1 h-3 w-3" />
                               Return
                             </Button>
                           )}
                         </TableCell>
                       </TableRow>
                     ))
                   )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>{filteredInvoices.length} invoice{filteredInvoices.length !== 1 ? 's' : ''} found</span>
            <span>Total Discounts: ${totalDiscounts.toFixed(2)}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 