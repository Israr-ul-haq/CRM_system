"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  IconClock, 
  IconCurrencyDollar, 
  IconLogin,
  IconLogout,
  IconCalendar,
  IconClockHour4,
  IconUser,
  IconHistory
} from "@tabler/icons-react"

// Interfaces for type safety
interface Advance {
  id: string
  amount: number
  date: string
  reason: string
  status: string
}

interface Purchase {
  id: string
  amount: number
  date: string
  items: string
  status: string
}

interface CheckInRecord {
  id: string
  checkIn: string
  checkOut: string | null
  hours: number
  date: string
}

interface StaffMember {
  id: string
  name: string
  role: string
  employeeId: string
  hourlyRate: number
  shiftHours: string
  isCheckedIn: boolean
  lastCheckIn: string | null
  lastCheckOut: string | null
  totalHoursThisMonth: number
  salary: number
  advances: Advance[]
  purchases: Purchase[]
  checkInHistory: CheckInRecord[]
}

// Mock data for demonstration
const mockStaffMember: StaffMember = {
  id: "1",
  name: "John Doe",
  role: "Sales Staff",
  employeeId: "EMP001",
  hourlyRate: 15.00,
  shiftHours: "9:00 AM - 5:00 PM",
  isCheckedIn: false,
  lastCheckIn: null,
  lastCheckOut: null,
  totalHoursThisMonth: 0,
  salary: 2400.00,
  advances: [
    {
      id: "1",
      amount: 200.00,
      date: "2024-01-10",
      reason: "Emergency expense",
      status: "Active"
    }
  ],
  purchases: [
    {
      id: "1",
      amount: 150.00,
      date: "2024-01-12",
      items: "Groceries and supplies",
      status: "Pending"
    }
  ],
  checkInHistory: [
    {
      id: "1",
      checkIn: "2024-01-15T09:00:00Z",
      checkOut: "2024-01-15T17:00:00Z",
      hours: 8,
      date: "2024-01-15"
    }
  ]
}

export default function StaffCheckinMobilePage() {
  const [staffMember, setStaffMember] = useState<StaffMember>(mockStaffMember)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleCheckIn = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setStaffMember(prev => ({
      ...prev,
      isCheckedIn: true,
      lastCheckIn: new Date().toISOString(),
      checkInHistory: [
        {
          id: Date.now().toString(),
          checkIn: new Date().toISOString(),
          checkOut: null,
          hours: 0,
          date: new Date().toISOString().split('T')[0]
        },
        ...prev.checkInHistory
      ]
    }))
    setIsLoading(false)
  }

  const handleCheckOut = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const now = new Date()
    const lastCheckIn = new Date(staffMember.lastCheckIn!)
    const hoursWorked = (now.getTime() - lastCheckIn.getTime()) / (1000 * 60 * 60)
    
    setStaffMember(prev => ({
      ...prev,
      isCheckedIn: false,
      lastCheckOut: now.toISOString(),
      totalHoursThisMonth: prev.totalHoursThisMonth + hoursWorked,
      checkInHistory: prev.checkInHistory.map((record, index) => 
        index === 0 ? { ...record, checkOut: now.toISOString(), hours: hoursWorked } : record
      )
    }))
    setIsLoading(false)
  }

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "Not available"
    return new Date(dateString).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric'
    })
  }

  const getCurrentStatus = () => {
    if (staffMember.isCheckedIn) {
      return { text: "Checked In", color: "bg-green-500", icon: IconLogin }
    }
    return { text: "Checked Out", color: "bg-red-500", icon: IconLogout }
  }

  const status = getCurrentStatus()
  const StatusIcon = status.icon

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-6 text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <IconUser className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Staff Portal</h1>
        </div>
        <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
          <IconClock className="h-4 w-4" />
          <span>{currentTime.toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Status Card */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Current Status</CardTitle>
            <StatusIcon className={`h-6 w-6 ${staffMember.isCheckedIn ? 'text-green-600' : 'text-red-600'}`} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className={`text-3xl font-bold mb-2 ${staffMember.isCheckedIn ? 'text-green-600' : 'text-red-600'}`}>
              {status.text}
            </div>
            <p className="text-sm text-gray-600">
              {staffMember.isCheckedIn 
                ? `Since ${formatTime(staffMember.lastCheckIn)}`
                : `Last: ${formatTime(staffMember.lastCheckOut)}`
              }
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <IconClockHour4 className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-xl font-bold">{staffMember.totalHoursThisMonth.toFixed(1)}h</div>
            <p className="text-xs text-gray-600">This Month</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <IconCurrencyDollar className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-xl font-bold">${staffMember.salary}</div>
            <p className="text-xs text-gray-600">Monthly Salary</p>
          </CardContent>
        </Card>
      </div>

      {/* Check In/Out Buttons */}
      <div className="flex space-x-3 mb-6">
        <Button
          onClick={handleCheckIn}
          disabled={staffMember.isCheckedIn || isLoading}
          className="flex-1 bg-green-600 hover:bg-green-700 h-12 text-lg"
        >
          <IconLogin className="mr-2 h-5 w-5" />
          Check In
        </Button>
        <Button
          onClick={handleCheckOut}
          disabled={!staffMember.isCheckedIn || isLoading}
          variant="destructive"
          className="flex-1 h-12 text-lg"
        >
          <IconLogout className="mr-2 h-5 w-5" />
          Check Out
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Personal Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">{staffMember.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ID:</span>
                <span className="font-medium">{staffMember.employeeId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Role:</span>
                <span className="font-medium">{staffMember.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shift:</span>
                <span className="font-medium">{staffMember.shiftHours}</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Recent Check-ins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {staffMember.checkInHistory.slice(0, 5).map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{formatDate(record.date)}</p>
                      <p className="text-sm text-gray-600">
                        {formatTime(record.checkIn)} - {record.checkOut ? formatTime(record.checkOut) : 'Ongoing'}
                      </p>
                    </div>
                    <Badge variant={record.checkOut ? "default" : "secondary"}>
                      {record.checkOut ? `${record.hours.toFixed(1)}h` : 'Active'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Advances & Purchases</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Salary Advances</h4>
                <div className="space-y-2">
                  {staffMember.advances.map((advance) => (
                    <div key={advance.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">${advance.amount}</p>
                        <p className="text-xs text-gray-600">{advance.reason}</p>
                      </div>
                      <Badge variant={advance.status === 'Active' ? 'default' : 'secondary'}>
                        {advance.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Credit Purchases</h4>
                <div className="space-y-2">
                  {staffMember.purchases.map((purchase) => (
                    <div key={purchase.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <div>
                        <p className="font-medium">${purchase.amount}</p>
                        <p className="text-xs text-gray-600">{purchase.items}</p>
                      </div>
                      <Badge variant={purchase.status === 'Pending' ? 'destructive' : 'secondary'}>
                        {purchase.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 