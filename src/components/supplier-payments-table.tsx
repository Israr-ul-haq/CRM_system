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
  IconChevronDown,
  IconChevronUp,
  IconChevronLeft,
  IconChevronRight,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconTrash,
  IconMail,
  IconPhone,
  IconWorld,
  IconUsers,
  IconCurrencyDollar,
  IconReceipt,
  IconTruck,
  IconCreditCard,
  IconBuilding,
  IconCalendar,
  IconPackage,
} from "@tabler/icons-react"
import { toast } from "sonner"
import { z } from "zod"
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
import supplierPaymentsData from "@/app/supplier-payments/data.json"
import { ViewPaymentModal } from "@/components/view-payment-modal"

const schema = z.object({
  id: z.number(),
  supplierId: z.number(),
  purchaseOrderId: z.string(),
  type: z.enum(["credit", "debit"]),
  amount: z.number(),
  reference: z.string(),
  description: z.string(),
  date: z.string(),
  paymentMethod: z.string().nullable(),
  balance: z.number(),
  outstandingAmount: z.number(),
})

type SupplierPayment = z.infer<typeof schema>

export function SupplierPaymentsTable() {
  const [data, setData] = React.useState<SupplierPayment[]>(supplierPaymentsData as SupplierPayment[])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [isViewModalOpen, setIsViewModalOpen] = React.useState(false)
  const [selectedPayment, setSelectedPayment] = React.useState<SupplierPayment | undefined>(undefined)

  // Action handlers
  const handleViewPayment = (payment: SupplierPayment) => {
    setSelectedPayment(payment)
    setIsViewModalOpen(true)
  }

  const handleDeletePayment = (payment: SupplierPayment) => {
    if (confirm(`Are you sure you want to delete payment "${payment.reference}"?`)) {
      setData(prev => prev.filter(p => p.id !== payment.id))
      toast.success(`Deleted ${payment.reference} successfully`)
    }
  }

  // Define columns inside component to access handlers
  const columns: ColumnDef<SupplierPayment>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllPageRowsSelected()}
          onChange={(value) => table.toggleAllPageRowsSelected(!!value.target.checked)}
          className="rounded border-gray-300"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={(value) => row.toggleSelected(!!value.target.checked)}
          className="rounded border-gray-300"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const date = new Date(row.original.date)
        return (
          <div className="flex items-center gap-2">
            <IconCalendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{date.toLocaleDateString()}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "supplierId",
      header: "Supplier",
      cell: ({ row }) => {
        const supplierNames: { [key: number]: string } = {
          1: "TechCorp Solutions",
          2: "Global Textiles Ltd",
          3: "Office Supplies Plus",
          4: "Home & Garden Co",
          5: "Sports Equipment Pro",
          6: "Beauty Supplies Inc",
          7: "Automotive Parts Co",
          8: "Book Publishers Ltd",
        }
        return (
          <div className="flex items-center gap-2">
            <IconBuilding className="h-4 w-4 text-muted-foreground" />
            <span>{supplierNames[row.original.supplierId] || "Unknown"}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "purchaseOrderId",
      header: "Purchase Order",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <IconReceipt className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.original.purchaseOrderId}</span>
        </div>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.original.type
        const getTypeVariant = (type: string) => {
          switch (type) {
            case "credit":
              return "default"
            case "debit":
              return "secondary"
            default:
              return "outline"
          }
        }

        return (
          <Badge variant={getTypeVariant(type)} className="capitalize">
            {type}
          </Badge>
        )
      },
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">${row.original.amount.toLocaleString()}</span>
        </div>
      ),
    },
    {
      accessorKey: "paymentMethod",
      header: "Payment Method",
      cell: ({ row }) => {
        const method = row.original.paymentMethod
        if (!method) return <span className="text-muted-foreground">-</span>
        
        const getMethodDisplay = (method: string) => {
          switch (method) {
            case "bank_transfer":
              return "Bank Transfer"
            case "credit_card":
              return "Credit Card"
            case "check":
              return "Check"
            case "cash":
              return "Cash"
            default:
              return method
          }
        }

        return (
          <div className="flex items-center gap-2">
            <IconCreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{getMethodDisplay(method)}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "balance",
      header: "Balance",
      cell: ({ row }) => (
        <div className="font-medium">${row.original.balance.toLocaleString()}</div>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <IconDotsVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleViewPayment(row.original)}>
              <IconEye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDeletePayment(row.original)}>
              <IconTrash className="mr-2 h-4 w-4" />
              Delete Payment
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
      rowSelection,
      globalFilter,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  // Calculate summary statistics
  const totalCredits = data.filter(payment => payment.type === "credit").reduce((sum, payment) => sum + payment.amount, 0)
  const totalDebits = data.filter(payment => payment.type === "debit").reduce((sum, payment) => sum + payment.amount, 0)
  const netBalance = totalCredits - totalDebits
  const outstandingSuppliers = new Set(data.filter(payment => payment.outstandingAmount > 0).map(payment => payment.supplierId)).size

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalCredits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total purchase amounts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <IconReceipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">${totalDebits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total payments made</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Balance</CardTitle>
            <IconBuilding className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${Math.abs(netBalance).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {netBalance >= 0 ? 'Outstanding to suppliers' : 'Overpaid to suppliers'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Suppliers</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{outstandingSuppliers}</div>
            <p className="text-xs text-muted-foreground">Suppliers with outstanding balances</p>
          </CardContent>
        </Card>
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
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

      {/* View Payment Modal */}
      <ViewPaymentModal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        payment={selectedPayment ? {
          id: selectedPayment.id,
          supplierId: selectedPayment.supplierId,
          purchaseOrders: [{
            purchaseOrderId: selectedPayment.purchaseOrderId,
            amount: selectedPayment.amount
          }],
          totalAmount: selectedPayment.amount,
          paymentMethod: selectedPayment.paymentMethod || "",
          paymentDate: selectedPayment.date,
          reference: selectedPayment.reference,
          notes: selectedPayment.description,
          type: selectedPayment.type,
          balance: selectedPayment.balance,
          outstandingAmount: selectedPayment.outstandingAmount
        } : null}
      />
    </div>
  )
} 