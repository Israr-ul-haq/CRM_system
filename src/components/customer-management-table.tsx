"use client"

import * as React from "react"
import { useState } from "react"
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
  IconEdit,
  IconCurrencyDollar,
  IconUser,
  IconMail,
  IconPhone,
  IconCreditCard,
  IconPlus,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Customer {
  id: number
  customerId: string
  name: string
  email: string
  phone: string
  address: string
  creditLimit: number
  creditUsed: number
  creditAvailable: number
  status: "active" | "inactive" | "suspended"
  joinDate: string
  lastPurchase?: string
  totalPurchases: number
  totalSpent: number
  outstandingBalance: number
}

interface CustomerManagementTableProps {
  data: Customer[]
  onEditCustomer: (customer: Customer) => void
  onViewHistory: (customer: Customer) => void
  onPayment: (customer: Customer) => void
}

export function CustomerManagementTable({ 
  data, 
  onEditCustomer, 
  onViewHistory, 
  onPayment 
}: CustomerManagementTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "inactive":
        return "secondary"
      case "suspended":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getCreditStatusVariant = (creditUsed: number, creditLimit: number) => {
    const percentage = (creditUsed / creditLimit) * 100
    if (percentage === 0) return "default"
    if (percentage < 50) return "secondary"
    if (percentage < 90) return "outline"
    return "destructive"
  }

  const getCreditStatusText = (creditUsed: number, creditLimit: number) => {
    const percentage = (creditUsed / creditLimit) * 100
    if (percentage === 0) return "No Credit Used"
    if (percentage < 50) return "Low Usage"
    if (percentage < 90) return "Moderate Usage"
    return "High Usage"
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "customerId",
      header: "Customer ID",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <IconUser className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.original.customerId}</span>
        </div>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.name}</span>
          <span className="text-sm text-muted-foreground">{row.original.email}</span>
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Contact",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <IconPhone className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{row.original.phone}</span>
        </div>
      ),
    },
    {
      accessorKey: "creditLimit",
      header: "Credit Limit",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <IconCurrencyDollar className="h-4 w-4 text-green-600" />
            <span className="font-medium text-green-600">${row.original.creditLimit.toLocaleString()}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            Available: ${row.original.creditAvailable.toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "creditUsed",
      header: "Credit Used",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <IconCreditCard className="h-4 w-4 text-orange-600" />
            <span className="font-medium text-orange-600">${row.original.creditUsed.toLocaleString()}</span>
          </div>
          <Badge variant={getCreditStatusVariant(row.original.creditUsed, row.original.creditLimit)} className="text-xs">
            {getCreditStatusText(row.original.creditUsed, row.original.creditLimit)}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "outstandingBalance",
      header: "Outstanding",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className={`font-medium ${row.original.outstandingBalance > 0 ? 'text-red-600' : 'text-green-600'}`}>
            ${row.original.outstandingBalance.toLocaleString()}
          </span>
          {row.original.outstandingBalance > 0 && (
            <span className="text-xs text-muted-foreground">Payment Due</span>
          )}
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
      accessorKey: "totalPurchases",
      header: "Activity",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{row.original.totalPurchases} purchases</span>
          <span className="text-xs text-muted-foreground">
            ${row.original.totalSpent.toLocaleString()} total spent
          </span>
          {row.original.lastPurchase && (
            <span className="text-xs text-muted-foreground">
              Last: {formatDate(row.original.lastPurchase)}
            </span>
          )}
        </div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <IconPlus className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onViewHistory(row.original)}>
              <IconEye className="mr-2 h-4 w-4" />
              View History
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEditCustomer(row.original)}>
              <IconEdit className="mr-2 h-4 w-4" />
              Edit Customer
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {row.original.outstandingBalance > 0 && (
              <DropdownMenuItem onClick={() => onPayment(row.original)}>
                <IconCurrencyDollar className="mr-2 h-4 w-4" />
                Process Payment
              </DropdownMenuItem>
            )}
            <DropdownMenuItem>
              <IconCreditCard className="mr-2 h-4 w-4" />
              Adjust Credit Limit
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
  const activeCustomers = data.filter(customer => customer.status === "active").length
  const customersWithCredit = data.filter(customer => customer.creditUsed > 0).length
  const overdueCustomers = data.filter(customer => customer.outstandingBalance > 0).length
  const totalOutstanding = data.reduce((sum, customer) => sum + customer.outstandingBalance, 0)

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Customers</CardTitle>
            <IconUser className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{activeCustomers}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Using Credit</CardTitle>
            <IconCreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{customersWithCredit}</div>
            <p className="text-xs text-muted-foreground">With credit balance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueCustomers}</div>
            <p className="text-xs text-muted-foreground">Payment pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
            <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">${totalOutstanding.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Amount due</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center py-4">
        <Input
          placeholder="Search customers..."
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
                  No customers found.
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