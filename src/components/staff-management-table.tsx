"use client"

import * as React from "react"
import { useState } from "react"
import { StaffHistoryModal } from "@/components/staff-history-modal"
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
  IconLogin,
  IconLogout,
  IconCurrencyDollar,
  IconUser,
  IconBriefcase,
  IconBuilding,
  IconClock,
  IconUserCheck,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"


interface StaffMember {
  id: number
  employeeId: string
  name: string
  email: string
  phone: string
  position: string
  department: string
  branch: string
  salary: number
  advanceTaken: number
  remainingSalary: number
  shiftHours: string
  checkInTime?: string
  checkOutTime?: string
  isCheckedIn: boolean
  status: "active" | "inactive" | "on_leave"
  joinDate: string
  lastCheckIn?: string
  totalWorkingHours: number
  overtimeHours: number
}

interface StaffManagementTableProps {
  data: StaffMember[]
  onCheckIn: (staffId: number) => Promise<void>
  onCheckOut: (staffId: number) => Promise<void>
  onAdvancePayment: (staffId: number, amount: number) => Promise<void>
}

const advancePaymentSchema = z.object({
  amount: z.string().min(1, "Amount is required").refine((val) => !isNaN(Number(val)) && Number(val) > 0, { 
    message: "Amount must be a positive number" 
  }),
})

type AdvancePaymentFormData = z.infer<typeof advancePaymentSchema>

export function StaffManagementTable({ 
  data, 
  onCheckIn, 
  onCheckOut, 
  onAdvancePayment 
}: StaffManagementTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [isAdvanceModalOpen, setIsAdvanceModalOpen] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false)
  const [selectedStaffForHistory, setSelectedStaffForHistory] = useState<StaffMember | null>(null)

  const form = useForm<AdvancePaymentFormData>({
    resolver: zodResolver(advancePaymentSchema),
    defaultValues: {
      amount: "",
    },
  })

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "inactive":
        return "secondary"
      case "on_leave":
        return "outline"
      default:
        return "outline"
    }
  }

  const getCheckInStatusVariant = (isCheckedIn: boolean) => {
    return isCheckedIn ? "default" : "secondary"
  }



  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleAdvancePayment = async (data: AdvancePaymentFormData) => {
    if (!selectedStaff) return

    setIsProcessing(true)
    try {
      await onAdvancePayment(selectedStaff.id, Number(data.amount))
      setIsAdvanceModalOpen(false)
      form.reset()
      setSelectedStaff(null)
    } finally {
      setIsProcessing(false)
    }
  }

  const columns: ColumnDef<StaffMember>[] = [
    {
      accessorKey: "employeeId",
      header: "Employee ID",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <IconUser className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.original.employeeId}</span>
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
      accessorKey: "position",
      header: "Position",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <IconBriefcase className="h-4 w-4 text-muted-foreground" />
          <Badge variant="outline">{row.original.position}</Badge>
        </div>
      ),
    },
    {
      accessorKey: "department",
      header: "Department",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <IconBuilding className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{row.original.department}</span>
        </div>
      ),
    },
    {
      accessorKey: "branch",
      header: "Branch",
      cell: ({ row }) => (
        <div className="text-sm">{row.original.branch}</div>
      ),
    },
    {
      accessorKey: "shiftHours",
      header: "Shift Hours",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <IconClock className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">{row.original.shiftHours}</span>
        </div>
      ),
    },
    {
      accessorKey: "isCheckedIn",
      header: "Status",
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <Badge variant={getCheckInStatusVariant(row.original.isCheckedIn)}>
            {row.original.isCheckedIn ? "Checked In" : "Checked Out"}
          </Badge>
          {row.original.checkInTime && (
            <span className="text-xs text-muted-foreground">
              {formatTime(row.original.checkInTime)}
            </span>
          )}
        </div>
      ),
    },
    {
      accessorKey: "salary",
      header: "Salary",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <IconCurrencyDollar className="h-4 w-4 text-green-600" />
            <span className="font-medium text-green-600">${row.original.salary.toLocaleString()}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            Advance: ${row.original.advanceTaken.toLocaleString()}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Employment Status",
      cell: ({ row }) => (
        <Badge variant={getStatusVariant(row.original.status)} className="capitalize">
          {row.original.status.replace("_", " ")}
        </Badge>
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
            <DropdownMenuItem onClick={() => onCheckIn(row.original.id)}>
              <IconLogin className="mr-2 h-4 w-4" />
              Check In
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onCheckOut(row.original.id)}>
              <IconLogout className="mr-2 h-4 w-4" />
              Check Out
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {
              setSelectedStaff(row.original)
              setIsAdvanceModalOpen(true)
            }}>
              <IconCurrencyDollar className="mr-2 h-4 w-4" />
              Process Advance
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              setSelectedStaffForHistory(row.original)
              setIsHistoryModalOpen(true)
            }}>
              <IconEye className="mr-2 h-4 w-4" />
              View History
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconEdit className="mr-2 h-4 w-4" />
              Edit Staff
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
  const checkedInStaff = data.filter(staff => staff.isCheckedIn).length
  const totalWorkingHours = data.reduce((sum, staff) => sum + staff.totalWorkingHours, 0)
  const totalOvertimeHours = data.reduce((sum, staff) => sum + staff.overtimeHours, 0)

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <IconUser className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{data.length}</div>
            <p className="text-xs text-muted-foreground">Total staff members</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Checked In</CardTitle>
            <IconUserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{checkedInStaff}</div>
            <p className="text-xs text-muted-foreground">Currently working</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <IconClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{totalWorkingHours}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overtime Hours</CardTitle>
            <IconClock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{totalOvertimeHours}</div>
            <p className="text-xs text-muted-foreground">Extra hours worked</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center py-4">
        <Input
          placeholder="Search staff members..."
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
                  No staff members found.
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

      {/* Advance Payment Modal */}
      <Dialog open={isAdvanceModalOpen} onOpenChange={setIsAdvanceModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Advance Payment</DialogTitle>
            <DialogDescription>
              Process advance payment for {selectedStaff?.name}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAdvancePayment)} className="space-y-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Advance Amount ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="0.00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAdvanceModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isProcessing}>
                  {isProcessing ? "Processing..." : "Process Advance"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Staff History Modal */}
      <StaffHistoryModal 
        isOpen={isHistoryModalOpen}
        onClose={() => {
          setIsHistoryModalOpen(false)
          setSelectedStaffForHistory(null)
        }}
        staff={selectedStaffForHistory}
      />
    </div>
  )
} 