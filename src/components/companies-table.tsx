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
  IconMail,
  IconPhone,
  IconWorld,
  IconBuilding,
  IconUsers,
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

import companiesData from "@/app/companies/data.json"
import { EditCompanyModal } from "@/components/edit-company-modal"
import { ViewCompanyModal } from "@/components/view-company-modal"

const schema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
  address: z.string(),
  website: z.string(),
  industry: z.string(),
  size: z.string(),
  status: z.string(),
  founded: z.string(),
  employees: z.number(),
  revenue: z.number(),
  lastContact: z.string(),
  notes: z.string(),
})

type Company = z.infer<typeof schema>

export function CompaniesTable() {
  const [data, setData] = React.useState(() => companiesData)
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = React.useState(false)
  const [selectedCompany, setSelectedCompany] = React.useState<Company | undefined>(undefined)

  // Action handlers
  const handleViewCompany = (company: Company) => {
    setSelectedCompany(company)
    setIsViewModalOpen(true)
  }

  const handleEditCompany = (company: Company) => {
    setSelectedCompany(company)
    setIsEditModalOpen(true)
  }

  const handleDeleteCompany = (company: Company) => {
    if (confirm(`Are you sure you want to delete "${company.name}"?`)) {
      setData(prev => prev.filter(c => c.id !== company.id))
      toast.success(`Deleted ${company.name} successfully`)
    }
  }

  const handleSaveEdit = (updatedData: {
    name: string
    email: string
    phone: string
    address: string
    website: string
    industry: string
    size: string
    status: string
    notes?: string
  }) => {
    setData(prev => prev.map(company => 
      company.id === selectedCompany?.id 
        ? { ...company, ...updatedData }
        : company
    ))
  }

  // Define columns inside component to access handlers
  const columns: ColumnDef<Company>[] = [
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
      header: "Company Name",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.name}</span>
          <span className="text-sm text-muted-foreground">{row.original.industry}</span>
        </div>
      ),
    },
    {
      accessorKey: "contact",
      header: "Contact Info",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-sm">
            <IconMail className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs">{row.original.email}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <IconPhone className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs">{row.original.phone}</span>
          </div>
          {row.original.website && (
            <div className="flex items-center gap-1 text-sm">
              <IconWorld className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs">{row.original.website}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      accessorKey: "size",
      header: "Size",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <IconUsers className="h-4 w-4 text-muted-foreground" />
          <Badge variant="outline" className="capitalize">
            {row.original.size} ({row.original.employees})
          </Badge>
        </div>
      ),
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
      accessorKey: "revenue",
      header: "Revenue",
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">${(row.original.revenue / 1000000).toFixed(1)}M</span>
        </div>
      ),
    },
    {
      accessorKey: "founded",
      header: "Founded",
      cell: ({ row }) => (
        <span className="font-medium">{row.original.founded}</span>
      ),
    },
    {
      accessorKey: "lastContact",
      header: "Last Contact",
      cell: ({ row }) => {
        const date = new Date(row.original.lastContact)
        return <div className="text-sm text-muted-foreground">{date.toLocaleDateString()}</div>
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
            <DropdownMenuItem onClick={() => handleViewCompany(row.original)}>
              <IconEye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEditCompany(row.original)}>
              <IconEdit className="mr-2 h-4 w-4" />
              Edit Company
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              variant="destructive"
              onClick={() => handleDeleteCompany(row.original)}
            >
              <IconTrash className="mr-2 h-4 w-4" />
              Delete Company
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
            placeholder="Filter companies..."
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
      <EditCompanyModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        company={selectedCompany}
        onSave={handleSaveEdit}
      />
      
      <ViewCompanyModal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        company={selectedCompany}
      />
    </div>
  )
} 