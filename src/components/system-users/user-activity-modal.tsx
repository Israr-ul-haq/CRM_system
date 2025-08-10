"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { IconUsers, IconSearch, IconCalendar, IconActivity } from "@tabler/icons-react"

interface UserActivity {
  id: string
  userId: string
  userName: string
  action: string
  timestamp: string
  ipAddress: string
  userAgent: string
}

interface UserActivityModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const mockActivities: UserActivity[] = [
  {
    id: "1",
    userId: "1",
    userName: "John Admin",
    action: "User Login",
    timestamp: "2024-01-15T10:30:00Z",
    ipAddress: "192.168.1.100",
    userAgent: "Chrome 120.0.0.0"
  },
  {
    id: "2",
    userId: "1",
    userName: "John Admin",
    action: "Created User: Sarah Manager",
    timestamp: "2024-01-15T09:15:00Z",
    ipAddress: "192.168.1.100",
    userAgent: "Chrome 120.0.0.0"
  },
  {
    id: "3",
    userId: "2",
    userName: "Sarah Manager",
    action: "User Login",
    timestamp: "2024-01-15T09:00:00Z",
    ipAddress: "192.168.1.101",
    userAgent: "Firefox 121.0"
  },
  {
    id: "4",
    userId: "3",
    userName: "Mike Sales",
    action: "User Login",
    timestamp: "2024-01-15T08:45:00Z",
    ipAddress: "192.168.1.102",
    userAgent: "Safari 17.2"
  },
  {
    id: "5",
    userId: "1",
    userName: "John Admin",
    action: "Updated Role: Sales Staff",
    timestamp: "2024-01-15T08:30:00Z",
    ipAddress: "192.168.1.100",
    userAgent: "Chrome 120.0.0.0"
  }
]

export default function UserActivityModal({ open, onOpenChange }: UserActivityModalProps) {
  const [selectedUser, setSelectedUser] = useState<string>("all")
  const [selectedAction, setSelectedAction] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredActivities = mockActivities.filter(activity => {
    const userMatch = selectedUser === "all" || activity.userId === selectedUser
    const actionMatch = selectedAction === "all" || activity.action === selectedAction
    const searchMatch = activity.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       activity.action.toLowerCase().includes(searchTerm.toLowerCase())
    
    return userMatch && actionMatch && searchMatch
  })

  const uniqueUsers = Array.from(new Set(mockActivities.map(a => a.userId)))
  const uniqueActions = Array.from(new Set(mockActivities.map(a => a.action)))

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconActivity className="h-5 w-5" />
            User Activity Log
          </DialogTitle>
          <DialogDescription>
            Monitor user activities, login history, and system actions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Filters */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="user-filter">Filter by User</Label>
              <Select value={selectedUser} onValueChange={setSelectedUser}>
                <SelectTrigger>
                  <SelectValue placeholder="All Users" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  {uniqueUsers.map(userId => {
                    const user = mockActivities.find(a => a.userId === userId)
                    return (
                      <SelectItem key={userId} value={userId}>
                        {user?.userName}
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="action-filter">Filter by Action</Label>
              <Select value={selectedAction} onValueChange={setSelectedAction}>
                <SelectTrigger>
                  <SelectValue placeholder="All Actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {uniqueActions.map(action => (
                    <SelectItem key={action} value={action}>
                      {action}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search activities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Activity List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Showing {filteredActivities.length} activities</span>
              <span>Total: {mockActivities.length}</span>
            </div>

            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredActivities.map((activity) => (
                <div key={activity.id} className="p-4 border rounded-lg space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="font-medium">{activity.userName}</div>
                      <div className="text-sm text-muted-foreground">{activity.action}</div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div>{formatTimestamp(activity.timestamp)}</div>
                      <div className="text-xs">{activity.ipAddress}</div>
                    </div>
                  </div>
                  
                  <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
                    <div className="font-medium">User Agent:</div>
                    <div>{activity.userAgent}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button>
            <IconCalendar className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 