"use client"

import { IconEye, IconDownload, IconPrinter } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

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

interface SalesTableProps {
  sales: Sale[]
}

export function SalesTable({ sales }: SalesTableProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>
      case "Pending":
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "Cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const handleViewDetails = (sale: Sale) => {
    // Here you would implement view details functionality
    console.log("Viewing sale details:", sale)
  }

  const handlePrintInvoice = (sale: Sale) => {
    // Here you would implement print functionality
    console.log("Printing invoice:", sale.invoiceNumber)
  }

  const handleDownloadInvoice = (sale: Sale) => {
    // Here you would implement download functionality
    console.log("Downloading invoice:", sale.invoiceNumber)
  }

  return (
    <div className="px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Sales Records ({sales.length})</span>
            <div className="text-sm text-muted-foreground">
              Total Sales: {formatCurrency(sales.reduce((sum, sale) => sum + sale.totalAmount, 0))}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <div className="max-h-[calc(100vh-400px)] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead className="w-[120px]">Invoice</TableHead>
                    <TableHead className="w-[100px]">Date</TableHead>
                    <TableHead className="w-[150px]">Customer</TableHead>
                    <TableHead className="w-[120px]">Category</TableHead>
                    <TableHead className="w-[120px]">Company</TableHead>
                    <TableHead className="w-[200px]">Items</TableHead>
                    <TableHead className="text-right w-[100px]">Total</TableHead>
                    <TableHead className="w-[120px]">Payment</TableHead>
                    <TableHead className="w-[100px]">Status</TableHead>
                    <TableHead className="text-center w-[150px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                        No sales records found. Adjust your filters or add new sales.
                      </TableCell>
                    </TableRow>
                  ) : (
                    sales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell className="font-medium">
                          {sale.invoiceNumber}
                        </TableCell>
                        <TableCell>
                          {formatDate(sale.date)}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{sale.customerName}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{sale.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{sale.company}</div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {sale.items.map((item, index) => (
                              <div key={index} className="text-sm">
                                {item.quantity}x {item.name}
                              </div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(sale.totalAmount)}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{sale.paymentMethod}</div>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(sale.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(sale)}
                              className="h-8 w-8 p-0"
                              title="View Details"
                            >
                              <IconEye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePrintInvoice(sale)}
                              className="h-8 w-8 p-0"
                              title="Print Invoice"
                            >
                              <IconPrinter className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDownloadInvoice(sale)}
                              className="h-8 w-8 p-0"
                              title="Download Invoice"
                            >
                              <IconDownload className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 