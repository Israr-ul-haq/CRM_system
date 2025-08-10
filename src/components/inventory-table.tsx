"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
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
import { IconEdit, IconEye, IconTrash, IconPlus, IconChevronLeft, IconDotsVertical, IconCircleX, IconAlertTriangle, IconCircleCheck, IconChevronRight } from "@tabler/icons-react"
import { toast } from "sonner"
import { EditInventoryModal } from "./edit-inventory-modal"
import { ViewInventoryModal } from "./view-inventory-modal"
import { AddInventoryModal } from "./add-inventory-modal"
import { useAppDispatch, useAppSelector } from "@/store"
import { 
  fetchInventory, 
  addInventoryItem, 
  updateInventoryItem, 
  deleteInventoryItem,
  setSearchQuery,
  setSelectedCategory,
  setSelectedSupplier,
  clearFilters
} from "@/store/slices/inventorySlice"
import { useEffect } from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { z } from "zod"
import { Checkbox } from "@radix-ui/react-checkbox"

const schema = z.object({
  id: z.number(),
  name: z.string(),
  sku: z.string(),
  category: z.string(),
  price: z.number(),
  cost: z.number(),
  stock: z.number(),
  minStock: z.number(),
  status: z.string(),
  supplier: z.string(),
  location: z.string(),
  lastUpdated: z.string(),
})

type InventoryItem = z.infer<typeof schema>

export function InventoryTable() {
  const dispatch = useAppDispatch()
  const { 
    items, 
    filteredItems, 
    isLoading, 
    error, 
    searchQuery, 
    selectedCategory, 
    selectedSupplier,
    categories,
    suppliers 
  } = useAppSelector(state => state.inventory)

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = React.useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false)
  const [selectedItem, setSelectedItem] = React.useState<InventoryItem | undefined>(undefined)

  // Load inventory data on component mount
  useEffect(() => {
    dispatch(fetchInventory())
  }, [dispatch])



  // Action handlers
  const handleViewItem = (item: InventoryItem) => {
    setSelectedItem(item)
    setIsViewModalOpen(true)
  }

  const handleEditItem = (item: InventoryItem) => {
    setSelectedItem(item)
    setIsEditModalOpen(true)
  }

  const handleDeleteItem = async (item: InventoryItem) => {
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      try {
        await dispatch(deleteInventoryItem(item.id)).unwrap()
        toast.success(`Deleted ${item.name} successfully`)
      } catch (error) {
        toast.error("Failed to delete item")
      }
    }
  }

  const handleSaveEdit = async (updatedData: {
    name: string
    sku: string
    category: string
    price: string
    cost: string
    stock: string
    minStock: string
    supplier: string
    location: string
    description?: string
  }) => {
    if (!selectedItem) return

    try {
      await dispatch(updateInventoryItem({
        id: selectedItem.id,
        itemData: {
          ...updatedData,
          price: Number(updatedData.price),
          cost: Number(updatedData.cost),
          stock: Number(updatedData.stock),
          minStock: Number(updatedData.minStock),
          status: Number(updatedData.stock) > Number(updatedData.minStock) ? "In Stock" : "Low Stock",
          lastUpdated: new Date().toISOString().split('T')[0]
        }
      })).unwrap()
      
      toast.success(`Updated ${updatedData.name} successfully`)
      setIsEditModalOpen(false)
    } catch (error) {
      toast.error("Failed to update item")
    }
  }

  const handleAddItem = async (itemData: {
    name: string
    sku: string
    category: string
    price: string
    cost: string
    stock: string
    minStock: string
    supplierId: string
    location: string
    description?: string
  }) => {
    try {
      await dispatch(addInventoryItem(itemData)).unwrap()
      toast.success(`Added ${itemData.name} successfully`)
      setIsAddModalOpen(false)
    } catch (error) {
      toast.error("Failed to add item")
    }
  }

  const handleSearchChange = (value: string) => {
    dispatch(setSearchQuery(value))
  }

  const handleCategoryChange = (value: string) => {
    dispatch(setSelectedCategory(value === "all" ? "" : value))
  }

  const handleSupplierChange = (value: string) => {
    dispatch(setSelectedSupplier(value === "all" ? "" : value))
  }

  const handleClearFilters = () => {
    dispatch(clearFilters())
  }

  // Define columns inside component to access handlers
  const columns: ColumnDef<InventoryItem>[] = [
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
      accessorKey: "name",
      header: "Product Name",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.name}</span>
          <span className="text-sm text-muted-foreground">{row.original.sku}</span>
        </div>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.original.category}
        </Badge>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <span className="font-medium">${row.original.price.toFixed(2)}</span>
      ),
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => {
        const stock = row.original.stock
        const minStock = row.original.minStock
        const isLowStock = stock <= minStock
        const isOutOfStock = stock === 0

        return (
          <div className="flex items-center gap-2">
            <span className={`font-medium ${isOutOfStock ? 'text-destructive' : isLowStock ? 'text-orange-600' : 'text-green-600'}`}>
              {stock}
            </span>
            {isOutOfStock && <IconCircleX className="h-4 w-4 text-destructive" />}
            {isLowStock && !isOutOfStock && <IconAlertTriangle className="h-4 w-4 text-orange-600" />}
            {!isLowStock && !isOutOfStock && <IconCircleCheck className="h-4 w-4 text-green-600" />}
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        const getStatusVariant = (status: string) => {
          switch (status) {
            case "active":
              return "default"
            case "inactive":
              return "secondary"
            case "discontinued":
              return "destructive"
            case "low-stock":
              return "outline"
            case "out-of-stock":
              return "destructive"
            default:
              return "outline"
          }
        }

        return (
          <Badge variant={getStatusVariant(status)} className="capitalize">
            {status.replace("-", " ")}
          </Badge>
        )
      },
    },
    {
      accessorKey: "supplier",
      header: "Supplier",
      cell: ({ row }) => row.original.supplier,
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => row.original.location,
    },
    {
      accessorKey: "lastUpdated",
      header: "Last Updated",
      cell: ({ row }) => {
        const date = new Date(row.original.lastUpdated)
        return date.toLocaleDateString()
      },
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
            <DropdownMenuItem onClick={() => handleViewItem(row.original)}>
              <IconEye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEditItem(row.original)}>
              <IconEdit className="mr-2 h-4 w-4" />
              Edit Item
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              variant="destructive"
              onClick={() => handleDeleteItem(row.original)}
            >
              <IconTrash className="mr-2 h-4 w-4" />
              Delete Item
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const table = useReactTable({
    data: filteredItems,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: handleSearchChange,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter: searchQuery,
    },
  })

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4 px-4 lg:px-6">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Filter inventory..."
            value={searchQuery}
            onChange={(event) => handleSearchChange(event.target.value)}
            className="h-8 w-[150px] lg:w-[250px]"
          />
          <Select
            value={selectedCategory || "all"}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="h-8 w-[150px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={selectedSupplier || "all"}
            onValueChange={handleSupplierChange}
          >
            <SelectTrigger className="h-8 w-[150px]">
              <SelectValue placeholder="All Suppliers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Suppliers</SelectItem>
              {suppliers.map((supplier) => (
                <SelectItem key={supplier} value={supplier}>
                  {supplier}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            className="h-8"
          >
            Clear Filters
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="h-8"
          >
            <IconPlus className="mr-2 h-4 w-4" />
            Add Item
          </Button>
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
      <AddInventoryModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onAddItem={handleAddItem}
      />
      
      <EditInventoryModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        item={selectedItem}
        onSave={handleSaveEdit}
      />
      
      <ViewInventoryModal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        item={selectedItem}
      />
    </div>
  )
} 