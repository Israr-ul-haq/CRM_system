"use client"

import { useState, useEffect } from "react"
import { ColumnDef, ColumnFiltersState, SortingState, VisibilityState, useReactTable, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, flexRender } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { IconDots, IconPlus, IconEye, IconEdit, IconTrash } from "@tabler/icons-react"
import { AddSupplierModal } from "./add-supplier-modal"
import { EditSupplierModal } from "./edit-supplier-modal"
import { ViewSupplierModal } from "./view-supplier-modal"
import { useAppDispatch, useAppSelector } from "@/store"
import { fetchSuppliers, addSupplier, updateSupplier, deleteSupplier, setSearchQuery, type Supplier } from "@/store/slices/supplierSlice"

// Type for modal components that expect different Supplier interface
interface ModalSupplier {
  id: number
  name: string
  email: string
  phone: string
  address: string
  contactPerson: string
  category: string
  status: string
  lastContact: string
  totalOrders: number
  totalSpent: number
  notes: string
}

export function SuppliersTable() {
  const dispatch = useAppDispatch()
  const {
    suppliers,
    filteredSuppliers,
    isLoading,
    error,
    searchQuery
  } = useAppSelector(state => state.supplier)

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedSupplier, setSelectedSupplier] = useState<ModalSupplier | undefined>(undefined)

  useEffect(() => {
    dispatch(fetchSuppliers())
  }, [dispatch])

  const handleViewSupplier = (supplier: Supplier) => {
    // Convert Redux Supplier to modal Supplier format
    const modalSupplier: ModalSupplier = {
      id: parseInt(supplier.id),
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      contactPerson: supplier.contactPerson,
      category: supplier.category,
      status: supplier.status,
      lastContact: supplier.lastOrderDate,
      totalOrders: supplier.totalOrders,
      totalSpent: supplier.totalSpent,
      notes: "" // Default empty notes since Redux Supplier doesn't have this
    }
    setSelectedSupplier(modalSupplier)
    setIsViewModalOpen(true)
  }

  const handleEditSupplier = (supplier: Supplier) => {
    // Convert Redux Supplier to modal Supplier format
    const modalSupplier: ModalSupplier = {
      id: parseInt(supplier.id),
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      contactPerson: supplier.contactPerson,
      category: supplier.category,
      status: supplier.status,
      lastContact: supplier.lastOrderDate,
      totalOrders: supplier.totalOrders,
      totalSpent: supplier.totalSpent,
      notes: "" // Default empty notes since Redux Supplier doesn't have this
    }
    setSelectedSupplier(modalSupplier)
    setIsEditModalOpen(true)
  }

  const handleDeleteSupplier = (supplier: Supplier) => {
    if (confirm(`Are you sure you want to delete ${supplier.name}?`)) {
      dispatch(deleteSupplier(supplier.id))
    }
  }

  const handleSaveEdit = (updatedData: {
    name: string
    email: string
    phone: string
    address: string
    contactPerson: string
    category: string
    status: string
    notes?: string
  }) => {
    if (!selectedSupplier) return
    
    const updatedSupplier: Supplier = {
      id: selectedSupplier.id.toString(),
      name: updatedData.name,
      email: updatedData.email,
      phone: updatedData.phone,
      address: updatedData.address,
      contactPerson: updatedData.contactPerson,
      status: updatedData.status as "active" | "inactive",
      category: updatedData.category,
      paymentTerms: "Net 30", // Default value
      rating: 0, // Default value
      lastOrderDate: selectedSupplier.lastContact,
      totalOrders: selectedSupplier.totalOrders,
      totalSpent: selectedSupplier.totalSpent
    }
    
    dispatch(updateSupplier(updatedSupplier))
    setIsEditModalOpen(false)
    setSelectedSupplier(undefined)
  }

  const handleAddSupplier = (supplierData: {
    name: string
    email: string
    phone: string
    address: string
    contactPerson: string
    category: string
    status: string
    companyId: string
    notes?: string
  }) => {
    const newSupplier: Supplier = {
      id: Date.now().toString(),
      name: supplierData.name,
      email: supplierData.email,
      phone: supplierData.phone,
      address: supplierData.address,
      contactPerson: supplierData.contactPerson,
      status: supplierData.status as "active" | "inactive",
      category: supplierData.category,
      paymentTerms: "Net 30",
      rating: 0,
      lastOrderDate: new Date().toISOString().split('T')[0],
      totalOrders: 0,
      totalSpent: 0
    }
    
    dispatch(addSupplier(newSupplier))
    setIsAddModalOpen(false)
  }

  const handleSearchChange = (value: string) => {
    dispatch(setSearchQuery(value))
  }

  const columns: ColumnDef<Supplier>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "phone",
      header: "Phone",
      cell: ({ row }) => <div>{row.getValue("phone")}</div>,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <div>{row.getValue("category")}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}>
            {status}
          </div>
        )
      },
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => <div>{row.getValue("rating")}/5</div>,
    },
    {
      accessorKey: "totalOrders",
      header: "Orders",
      cell: ({ row }) => <div>{row.getValue("totalOrders")}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const supplier = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <IconDots className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleViewSupplier(supplier)}>
                <IconEye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEditSupplier(supplier)}>
                <IconEdit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDeleteSupplier(supplier)}>
                <IconTrash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: filteredSuppliers,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter: searchQuery,
    },
  })

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">Loading suppliers...</div>
  }

  if (error) {
    return <div className="flex items-center justify-center p-8 text-red-600">Error: {error}</div>
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4 px-4 lg:px-6">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Filter suppliers..."
            value={searchQuery}
            onChange={(event) => handleSearchChange(event.target.value)}
            className="h-8 w-[150px] lg:w-[250px]"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="h-8"
          >
            <IconPlus className="mr-2 h-4 w-4" />
            Add Supplier
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
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
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
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Modals */}
      <AddSupplierModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onAddSupplier={handleAddSupplier}
      />
      <EditSupplierModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        supplier={selectedSupplier}
        onSave={handleSaveEdit}
      />
      <ViewSupplierModal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        supplier={selectedSupplier}
      />
    </div>
  )
} 