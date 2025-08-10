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
  VisibilityState,
} from "@tanstack/react-table"
import {
  IconChevronLeft,
  IconChevronRight,
  IconDotsVertical,
  IconEdit,
  IconEye,
  IconTrash,
  IconReceipt,
  IconTruck,
  IconCreditCard,
  IconBuilding,
  IconCalendar,
  IconCurrencyDollar,
} from "@tabler/icons-react"
import { toast } from "sonner"
import { z } from "zod"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import purchasesData from "@/app/purchases/data.json"
import { EditPurchaseModal } from "@/components/edit-purchase-modal"
import { ViewPurchaseModal } from "@/components/view-purchase-modal"

const schema = z.object({
  id: z.number(),
  orderNumber: z.string(),
  supplierId: z.number(),
  companyId: z.number(),
  purchaseDate: z.string(),
  expectedDelivery: z.string(),
  totalAmount: z.number(),
  paymentStatus: z.string(),
  paymentMethod: z.string(),
  orderStatus: z.string(),
  items: z.array(z.object({
    inventoryId: z.number(),
    quantity: z.number(),
    unitCost: z.number(),
    totalCost: z.number(),
  })),
  notes: z.string(),
})

type Purchase = z.infer<typeof schema>

export function PurchasesTable() {
  const [data, setData] = React.useState(() => purchasesData)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = React.useState(false)
  const [selectedPurchase, setSelectedPurchase] = React.useState<Purchase | undefined>(undefined)

  // Action handlers
  const handleViewPurchase = (purchase: Purchase) => {
    setSelectedPurchase(purchase)
    setIsViewModalOpen(true)
  }

  const handleEditPurchase = (purchase: Purchase) => {
    setSelectedPurchase(purchase)
    setIsEditModalOpen(true)
  }

  const handleDeletePurchase = (purchase: Purchase) => {
    if (confirm(`Are you sure you want to delete purchase order "${purchase.orderNumber}"?`)) {
      setData(prev => prev.filter(p => p.id !== purchase.id))
      toast.success(`Deleted ${purchase.orderNumber} successfully`)
    }
  }

  const handleSaveEdit = (updatedData: {
    supplierId: string
    companyId: string
    items: Array<{
      inventoryId: string
      quantity: string
      unitCost: string
    }>
    paymentStatus: string
    paymentMethod: string
    expectedDelivery: string
    notes?: string
  }) => {
    // Convert string values to numbers for the data structure
    const convertedData = {
      supplierId: parseInt(updatedData.supplierId),
      companyId: parseInt(updatedData.companyId),
      items: updatedData.items.map(item => ({
        inventoryId: parseInt(item.inventoryId),
        quantity: parseInt(item.quantity),
        unitCost: parseFloat(item.unitCost),
        totalCost: parseInt(item.quantity) * parseFloat(item.unitCost)
      })),
      totalAmount: updatedData.items.reduce((sum, item) => sum + (parseInt(item.quantity) * parseFloat(item.unitCost)), 0),
      paymentStatus: updatedData.paymentStatus,
      paymentMethod: updatedData.paymentMethod,
      expectedDelivery: updatedData.expectedDelivery,
      notes: updatedData.notes || ""
    }
    
    setData(prev => prev.map(purchase => 
      purchase.id === selectedPurchase?.id 
        ? { ...purchase, ...convertedData }
        : purchase
    ))
  }

  // Define columns inside component to access handlers
  const columns: ColumnDef<Purchase>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "orderNumber",
      header: "Order Number",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <IconReceipt className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.original.orderNumber}</span>
        </div>
      ),
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
      accessorKey: "purchaseDate",
      header: "Purchase Date",
      cell: ({ row }) => {
        const date = new Date(row.original.purchaseDate)
        return (
          <div className="flex items-center gap-2">
            <IconCalendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{date.toLocaleDateString()}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "expectedDelivery",
      header: "Expected Delivery",
      cell: ({ row }) => {
        const date = new Date(row.original.expectedDelivery)
        return (
          <div className="flex items-center gap-2">
            <IconTruck className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{date.toLocaleDateString()}</span>
          </div>
        )
      },
    },
    {
      accessorKey: "totalAmount",
      header: "Total Amount",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">${row.original.totalAmount.toLocaleString()}</span>
        </div>
      ),
    },
    {
      accessorKey: "paymentStatus",
      header: "Payment Status",
      cell: ({ row }) => {
        const status = row.original.paymentStatus
        const getStatusVariant = (status: string) => {
          switch (status) {
            case "paid":
              return "default"
            case "pending":
              return "secondary"
            case "partial":
              return "outline"
            default:
              return "outline"
          }
        }

        return (
          <Badge variant={getStatusVariant(status)} className="capitalize">
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: "paymentMethod",
      header: "Payment Method",
      cell: ({ row }) => {
        const method = row.original.paymentMethod
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
      accessorKey: "orderStatus",
      header: "Order Status",
      cell: ({ row }) => {
        const status = row.original.orderStatus
        const getStatusVariant = (status: string) => {
          switch (status) {
            case "delivered":
              return "default"
            case "in_transit":
              return "secondary"
            case "ordered":
              return "outline"
            case "cancelled":
              return "destructive"
            default:
              return "outline"
          }
        }

        return (
          <Badge variant={getStatusVariant(status)} className="capitalize">
            {status.replace("_", " ")}
          </Badge>
        )
      },
    },
    {
      accessorKey: "items",
      header: "Items Count",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.items.length} items
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <IconDotsVertical className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleViewPurchase(row.original)}>
              <IconEye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEditPurchase(row.original)}>
              <IconEdit className="mr-2 h-4 w-4" />
              Edit Purchase
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              variant="destructive"
              onClick={() => handleDeletePurchase(row.original)}
            >
              <IconTrash className="mr-2 h-4 w-4" />
              Delete Purchase
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4 px-4 lg:px-6">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Filter purchases..."
            value={globalFilter ?? ""}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="h-8 w-[150px] lg:w-[250px]"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="rounded-md border px-4 lg:px-6">
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
      <div className="flex items-center justify-end space-x-2 py-4 px-4 lg:px-6">
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

      {/* Modals */}
      <EditPurchaseModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        purchase={selectedPurchase}
        onSave={handleSaveEdit}
      />
      
      <ViewPurchaseModal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        purchase={selectedPurchase}
      />
    </div>
  )
} 