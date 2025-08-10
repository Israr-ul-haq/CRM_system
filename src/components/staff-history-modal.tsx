"use client"

import { useState } from "react"
import { IconX, IconUser, IconCurrencyDollar, IconReceipt, IconClock, IconCalendar, IconBuilding, IconBriefcase } from "@tabler/icons-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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
  status: "active" | "inactive" | "on_leave"
  joinDate: string
  totalWorkingHours: number
  overtimeHours: number
}

interface AdvancePayment {
  id: number
  date: string
  amount: number
  reason: string
  processedBy: string
}

interface PurchaseTransaction {
  id: number
  invoiceNumber: string
  date: string
  items: Array<{
    name: string
    quantity: number
    price: number
    total: number
  }>
  totalAmount: number
  discount: number
  finalAmount: number
}

interface AttendanceRecord {
  id: number
  date: string
  checkInTime: string
  checkOutTime?: string
  totalHours: number
  overtimeHours: number
  status: "present" | "absent" | "late" | "half-day"
}

interface StaffHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  staff: StaffMember | null
}

export function StaffHistoryModal({ isOpen, onClose, staff }: StaffHistoryModalProps) {
  const [activeTab, setActiveTab] = useState("overview")

  if (!staff) return null

  // Mock data - in real app this would come from your database
  const advancePayments: AdvancePayment[] = [
    {
      id: 1,
      date: "2024-12-20",
      amount: 500,
      reason: "Medical emergency",
      processedBy: "Manager"
    },
    {
      id: 2,
      date: "2024-12-15",
      amount: 200,
      reason: "Personal expenses",
      processedBy: "HR"
    }
  ]

  const purchaseTransactions: PurchaseTransaction[] = [
    {
      id: 1,
      invoiceNumber: "INV-2024-001",
      date: "2024-12-22",
      items: [
        { name: "Laptop Bag", quantity: 1, price: 45.00, total: 45.00 },
        { name: "Wireless Mouse", quantity: 1, price: 25.00, total: 25.00 }
      ],
      totalAmount: 70.00,
      discount: 5,
      finalAmount: 66.50
    },
    {
      id: 2,
      invoiceNumber: "INV-2024-002",
      date: "2024-12-21",
      items: [
        { name: "Office Chair", quantity: 1, price: 150.00, total: 150.00 }
      ],
      totalAmount: 150.00,
      discount: 10,
      finalAmount: 135.00
    }
  ]

  const attendanceRecords: AttendanceRecord[] = [
    {
      id: 1,
      date: "2024-12-23",
      checkInTime: "09:15",
      checkOutTime: "18:30",
      totalHours: 9.25,
      overtimeHours: 1.25,
      status: "present"
    },
    {
      id: 2,
      date: "2024-12-22",
      checkInTime: "08:45",
      checkOutTime: "17:15",
      totalHours: 8.5,
      overtimeHours: 0.5,
      status: "present"
    },
    {
      id: 3,
      date: "2024-12-21",
      checkInTime: "09:30",
      checkOutTime: "18:00",
      totalHours: 8.5,
      overtimeHours: 0,
      status: "late"
    }
  ]

  const totalPurchases = purchaseTransactions.reduce((sum, purchase) => sum + purchase.finalAmount, 0)
  const totalAdvances = advancePayments.reduce((sum, advance) => sum + advance.amount, 0)
  const currentBalance = staff.remainingSalary - totalPurchases

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active":
      case "present":
        return "default"
      case "inactive":
      case "absent":
        return "secondary"
      case "on_leave":
      case "late":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconUser className="h-5 w-5" />
            Staff History - {staff.name}
          </DialogTitle>
          <DialogDescription>
            Complete transaction history and financial overview for {staff.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Staff Information Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Staff Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <IconUser className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{staff.name}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ID: {staff.employeeId}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {staff.email}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {staff.phone}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <IconBriefcase className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{staff.position}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <IconBuilding className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{staff.department} - {staff.branch}</span>
                  </div>
                  <Badge variant={getStatusVariant(staff.status)} className="capitalize">
                    {staff.status.replace("_", " ")}
                  </Badge>
                  <div className="text-sm text-muted-foreground">
                    Joined: {formatDate(staff.joinDate)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Salary</CardTitle>
                <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">${staff.salary.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Base salary</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Advance Taken</CardTitle>
                <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">${totalAdvances.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Total advances</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Shop Purchases</CardTitle>
                <IconReceipt className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">${totalPurchases.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Total purchases</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
                <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${currentBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${currentBalance.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Available balance</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for Detailed Information */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="purchases">Purchases</TabsTrigger>
              <TabsTrigger value="advances">Advances</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Recent Purchases</h4>
                      <div className="space-y-2">
                        {purchaseTransactions.slice(0, 3).map(purchase => (
                          <div key={purchase.id} className="flex justify-between text-sm">
                            <span>{formatDate(purchase.date)}</span>
                            <span className="font-medium">${purchase.finalAmount.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Recent Advances</h4>
                      <div className="space-y-2">
                        {advancePayments.slice(0, 3).map(advance => (
                          <div key={advance.id} className="flex justify-between text-sm">
                            <span>{formatDate(advance.date)}</span>
                            <span className="font-medium text-orange-600">${advance.amount.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="purchases" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Purchase History</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Invoice</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Discount</TableHead>
                        <TableHead>Final Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {purchaseTransactions.map(purchase => (
                        <TableRow key={purchase.id}>
                          <TableCell>{formatDate(purchase.date)}</TableCell>
                          <TableCell className="font-medium">{purchase.invoiceNumber}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {purchase.items.map((item, index) => (
                                <div key={index} className="text-sm">
                                  {item.name} x{item.quantity}
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>${purchase.totalAmount.toFixed(2)}</TableCell>
                          <TableCell>{purchase.discount}%</TableCell>
                          <TableCell className="font-semibold">${purchase.finalAmount.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="advances" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Advance Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Reason</TableHead>
                        <TableHead>Processed By</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {advancePayments.map(advance => (
                        <TableRow key={advance.id}>
                          <TableCell>{formatDate(advance.date)}</TableCell>
                          <TableCell className="font-semibold text-orange-600">${advance.amount.toFixed(2)}</TableCell>
                          <TableCell>{advance.reason}</TableCell>
                          <TableCell>{advance.processedBy}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attendance" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Records</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Check In</TableHead>
                        <TableHead>Check Out</TableHead>
                        <TableHead>Total Hours</TableHead>
                        <TableHead>Overtime</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendanceRecords.map(record => (
                        <TableRow key={record.id}>
                          <TableCell>{formatDate(record.date)}</TableCell>
                          <TableCell>{record.checkInTime}</TableCell>
                          <TableCell>{record.checkOutTime || "-"}</TableCell>
                          <TableCell>{record.totalHours}h</TableCell>
                          <TableCell>{record.overtimeHours}h</TableCell>
                          <TableCell>
                            <Badge variant={getStatusVariant(record.status)} className="capitalize">
                              {record.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end">
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 