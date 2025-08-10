"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table"
import {
  IconChevronLeft,
  IconChevronRight,
  IconEye,
  IconReceipt,
  IconUser,
  IconTag,
  IconBuilding,
  IconCalendar,
  IconCurrencyDollar,
  IconCreditCard,
  IconCheck,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SalesRecord {
  id: number
  invoiceNumber: string
  date: string
  customerName: string
  category: string
  company: string
  items: Array<{
    name: string
    quantity: number
    price: number
    total: number
  }>
  totalAmount: number
  paymentMethod: string
  status: string
}

interface SalesRegisterTableProps {
  data: SalesRecord[]
}

export function SalesRegisterTable({ data }: SalesRegisterTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")

  const getPaymentMethodDisplay = (method: string) => {
    switch (method) {
      case "credit_card":
        return "Credit Card"
      case "cash":
        return "Cash"
      case "bank_transfer":
        return "Bank Transfer"
      case "check":
        return "Check"
      default:
        return method
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "pending":
        return "secondary"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const columns: ColumnDef<SalesRecord>[] = [
    {
      accessorKey: "invoiceNumber",
      header: "Invoice",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <IconReceipt className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.original.invoiceNumber}</span>
        </div>
      ),
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <IconCalendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{formatDate(row.original.date)}</span>
        </div>
      ),
    },
    {
      accessorKey: "customerName",
      header: "Customer",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <IconUser className="h-4 w-4 text-muted-foreground" />
          <span>{row.original.customerName}</span>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <IconTag className="h-4 w-4 text-muted-foreground" />
          <Badge variant="outline">{row.original.category}</Badge>
        </div>
      ),
    },
    {
      accessorKey: "company",
      header: "Company",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <IconBuilding className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{row.original.company}</span>
        </div>
      ),
    },
    {
      accessorKey: "items",
      header: "Items",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.items.length} item{row.original.items.length !== 1 ? 's' : ''}
        </div>
      ),
    },
    {
      accessorKey: "totalAmount",
      header: "Total Amount",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <IconCurrencyDollar className="h-4 w-4 text-green-600" />
          <span className="font-semibold text-green-600">
            ${row.original.totalAmount.toFixed(2)}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "paymentMethod",
      header: "Payment Method",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <IconCreditCard className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{getPaymentMethodDisplay(row.original.paymentMethod)}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <Badge variant={getStatusVariant(row.original.status)} className="capitalize">
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: () => (
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <span className="sr-only">View details</span>
          <IconEye className="h-4 w-4" />
        </Button>
      ),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  // Calculate summary statistics
  const totalSales = data.reduce((sum, sale) => sum + sale.totalAmount, 0)
  const totalItems = data.reduce((sum, sale) => 
    sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
  )
  const averageOrderValue = data.length > 0 ? totalSales / data.length : 0

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalSales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <IconReceipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{data.length}</div>
            <p className="text-xs text-muted-foreground">Number of sales</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <IconCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{totalItems}</div>
            <p className="text-xs text-muted-foreground">Items sold</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order</CardTitle>
            <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">${averageOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Per order</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center py-4">
        <Input
          placeholder="Search sales records..."
          value={globalFilter ?? ""}
          onChange={(event) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No sales records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) displayed.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <IconChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <IconChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
} 