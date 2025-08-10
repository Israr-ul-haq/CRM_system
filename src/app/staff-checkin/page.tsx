"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  IconUser, 
  IconLogin, 
  IconLogout, 
  IconClock, 
  IconClockHour4, 
  IconCurrencyDollar, 
  IconCalendar, 
  IconHistory, 
  IconWallet, 
  IconShoppingCart,
  IconSun,
  IconMoon
} from "@tabler/icons-react"

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

// Extended interface for local use with mock data
interface ExtendedStaffMember {
  id: string
  name: string
  position: string
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

export default function StaffCheckinPage() {
  const { staffMember: authStaffMember, logout } = useAuth()
  const router = useRouter()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isLoading, setIsLoading] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [staffMember, setStaffMember] = useState<ExtendedStaffMember | null>(null)

  useEffect(() => {
    if (!authStaffMember) {
      router.push("/login")
      return
    }

    // Convert auth staff member to extended format with mock data
    const extendedStaffMember: ExtendedStaffMember = {
      id: authStaffMember.id,
      name: authStaffMember.name,
      position: authStaffMember.position,
      employeeId: authStaffMember.id,
      hourlyRate: authStaffMember.salary / 160, // Calculate hourly rate from monthly salary
      shiftHours: authStaffMember.shiftHours,
      isCheckedIn: authStaffMember.isCheckedIn,
      lastCheckIn: authStaffMember.lastCheckIn || null,
      lastCheckOut: authStaffMember.lastCheckOut || null,
      totalHoursThisMonth: 0, // Mock data
      salary: authStaffMember.salary,
      advances: [], // Mock data
      purchases: [], // Mock data
      checkInHistory: [] // Mock data
    }
    setStaffMember(extendedStaffMember)

    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Check if user prefers dark mode
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDarkMode(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches)
    mediaQuery.addEventListener('change', handleChange)

    return () => {
      clearInterval(timer)
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [authStaffMember, router])

  const handleCheckIn = async () => {
    if (!staffMember) return
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update local state
      setStaffMember(prev => prev ? {
        ...prev,
        isCheckedIn: true,
        lastCheckIn: new Date().toISOString()
      } : null)
      
      // Add to history
      if (staffMember) {
        const newRecord: CheckInRecord = {
          id: Date.now().toString(),
          checkIn: new Date().toISOString(),
          checkOut: null,
          hours: 0,
          date: new Date().toISOString()
        }
        setStaffMember(prev => prev ? {
          ...prev,
          checkInHistory: [newRecord, ...prev.checkInHistory]
        } : null)
      }
      
    } catch (error) {
      console.error('Check-in failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckOut = async () => {
    if (!staffMember) return
    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Update local state
      setStaffMember(prev => prev ? {
        ...prev,
        isCheckedIn: false,
        lastCheckOut: new Date().toISOString()
      } : null)
      
      // Update the last history record
      if (staffMember && staffMember.checkInHistory.length > 0) {
        const lastRecord = staffMember.checkInHistory[0]
        if (lastRecord && !lastRecord.checkOut) {
          const checkInTime = new Date(lastRecord.checkIn)
          const checkOutTime = new Date()
          const hours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60)
          
          setStaffMember(prev => prev ? {
            ...prev,
            checkInHistory: prev.checkInHistory.map((record, index) => 
              index === 0 ? { ...record, checkOut: new Date().toISOString(), hours } : record
            ),
            totalHoursThisMonth: prev.totalHoursThisMonth + hours
          } : null)
        }
      }
      
    } catch (error) {
      console.error('Check-out failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  const formatTime = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const getCurrentStatus = () => {
    if (staffMember?.isCheckedIn) {
      return { 
        text: "Checked In", 
        color: "bg-green-500", 
        icon: IconLogin, 
        bgColor: "bg-green-50 dark:bg-green-950/20", 
        textColor: "text-green-900 dark:text-green-400" 
      }
    }
    return { 
      text: "Checked Out", 
      color: "bg-red-500", 
      icon: IconLogout, 
      bgColor: "bg-red-50 dark:bg-red-950/20", 
      textColor: "text-red-900 dark:text-red-400" 
    }
  }

  const status = getCurrentStatus()

  if (!staffMember) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <IconUser className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{staffMember.name}</h1>
                <p className="text-muted-foreground flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                  {staffMember.position} • ID: {staffMember.employeeId}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="w-9 h-9 p-0 rounded-full"
              >
                {isDarkMode ? <IconSun className="w-4 h-4" /> : <IconMoon className="w-4 h-4" />}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="flex items-center space-x-2"
              >
                <IconLogout className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Time Display */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-4 bg-card border rounded-full px-6 py-3">
            <IconClock className="h-5 w-5 text-muted-foreground" />
            <span className="text-2xl font-mono font-bold">
              {currentTime.toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Status Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Current Status */}
          <Card className={status.bgColor}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Current Status</CardTitle>
              <div className={`w-3 h-3 ${status.color} rounded-full`}></div>
            </CardHeader>
            <CardContent>
              <div className={`text-xl font-bold ${status.textColor}`}>{status.text}</div>
              <p className={`text-xs ${status.textColor} mt-1 opacity-75`}>
                {staffMember.isCheckedIn 
                  ? `Since ${formatTime(staffMember.lastCheckIn)}`
                  : `Last: ${formatTime(staffMember.lastCheckOut)}`
                }
              </p>
            </CardContent>
          </Card>

          {/* Hours This Month */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Hours This Month</CardTitle>
              <IconClockHour4 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{staffMember.totalHoursThisMonth.toFixed(1)}h</div>
              <p className="text-xs text-muted-foreground mt-1">
                Target: 160 hours
              </p>
            </CardContent>
          </Card>

          {/* Monthly Salary */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Salary</CardTitle>
              <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">${staffMember.salary}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Hourly: ${staffMember.hourlyRate}/h
              </p>
            </CardContent>
          </Card>

          {/* Shift Hours */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Shift Hours</CardTitle>
              <IconCalendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{staffMember.shiftHours}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Daily schedule
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Check In/Out Buttons */}
        <div className="flex justify-center space-x-6 mb-8">
          <Button
            onClick={handleCheckIn}
            disabled={staffMember.isCheckedIn || isLoading}
            className="px-8 py-3 text-lg font-semibold"
            size="lg"
          >
            <IconLogin className="mr-2 h-5 w-5" />
            {isLoading ? "Processing..." : "Check In"}
          </Button>
          <Button
            onClick={handleCheckOut}
            disabled={!staffMember.isCheckedIn || isLoading}
            variant="destructive"
            className="px-8 py-3 text-lg font-semibold"
            size="lg"
          >
            <IconLogout className="mr-2 h-5 w-5" />
            {isLoading ? "Processing..." : "Check Out"}
          </Button>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">
              <IconUser className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="history">
              <IconHistory className="w-4 h-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger value="advances">
              <IconWallet className="w-4 h-4 mr-2" />
              Advances
            </TabsTrigger>
            <TabsTrigger value="purchases">
              <IconShoppingCart className="w-4 h-4 mr-2" />
              Purchases
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Your basic details and current status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Employee ID</label>
                    <p className="text-sm">{staffMember.employeeId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Position</label>
                    <p className="text-sm">{staffMember.position}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Hourly Rate</label>
                    <p className="text-sm">${staffMember.hourlyRate}/hour</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Shift Hours</label>
                    <p className="text-sm">{staffMember.shiftHours}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Check-in/Check-out History</CardTitle>
                <CardDescription>Your attendance records for this month</CardDescription>
              </CardHeader>
              <CardContent>
                {staffMember.checkInHistory.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <IconHistory className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No check-in history available</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {staffMember.checkInHistory.map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">{formatDate(record.date)}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatTime(record.checkIn)} - {record.checkOut ? formatTime(record.checkOut) : 'Ongoing'}
                          </p>
                        </div>
                        <Badge variant={record.checkOut ? "default" : "secondary"}>
                          {record.checkOut ? `${record.hours.toFixed(1)}h` : 'Active'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advances" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Salary Advances</CardTitle>
                <CardDescription>Advances taken against your salary</CardDescription>
              </CardHeader>
              <CardContent>
                {staffMember.advances.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <IconWallet className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No advances taken</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {staffMember.advances.map((advance) => (
                      <div key={advance.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-bold text-lg">${advance.amount}</p>
                          <p className="text-sm text-muted-foreground">{advance.reason}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(advance.date)}</p>
                        </div>
                        <Badge variant={advance.status === 'Active' ? 'default' : 'secondary'}>
                          {advance.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="purchases" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Credit Purchases</CardTitle>
                <CardDescription>Items purchased on credit against your salary</CardDescription>
              </CardHeader>
              <CardContent>
                {staffMember.purchases.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <IconShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No credit purchases</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {staffMember.purchases.map((purchase) => (
                      <div key={purchase.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-bold text-lg">${purchase.amount}</p>
                          <p className="text-sm text-muted-foreground">{purchase.items}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(purchase.date)}</p>
                        </div>
                        <Badge variant={purchase.status === 'Pending' ? 'destructive' : 'secondary'}>
                          {purchase.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 