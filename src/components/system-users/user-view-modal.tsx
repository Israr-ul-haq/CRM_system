"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { IconUsers, IconMail, IconPhone, IconShield, IconClock, IconCheck, IconX } from "@tabler/icons-react"

interface User {
  id: string
  name: string
  email: string
  phone?: string
  roleId: string
  role: string
  isActive: boolean
  lastLogin: string
}

interface Role {
  id: string
  name: string
}

interface UserViewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  roles: Role[]
}

export default function UserViewModal({ open, onOpenChange, user, roles }: UserViewModalProps) {
  if (!user) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRoleDescription = (roleId: string) => {
    const role = roles.find(r => r.id === roleId)
    return role?.name || 'Unknown Role'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconUsers className="h-5 w-5" />
            User Details: {user.name}
          </DialogTitle>
          <DialogDescription>
            View detailed information about this user account
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Profile Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Profile Information</h3>
            
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <IconUsers className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-semibold">{user.name}</h4>
                <div className="flex items-center gap-2">
                  {user.isActive ? (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <IconCheck className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <IconX className="h-3 w-3 mr-1" />
                      Inactive
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <IconMail className="h-4 w-4" />
                  Email Address
                </div>
                <p className="font-medium">{user.email}</p>
              </div>

              {user.phone && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <IconPhone className="h-4 w-4" />
                    Phone Number
                  </div>
                  <p className="font-medium">{user.phone}</p>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <IconShield className="h-4 w-4" />
                  Assigned Role
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{getRoleDescription(user.roleId)}</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <IconClock className="h-4 w-4" />
                  Last Login
                </div>
                <p className="font-medium">{formatDate(user.lastLogin)}</p>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Account Status</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">Account Status</h4>
                <div className="flex items-center gap-2">
                  {user.isActive ? (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <IconCheck className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <IconX className="h-3 w-3 mr-1" />
                      Inactive
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">User ID</h4>
                <p className="text-sm font-mono bg-muted p-2 rounded">{user.id}</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Recent Activity</h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="font-medium">Last Login</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(user.lastLogin)}
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  Login
                </Badge>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="font-medium">Account Created</div>
                  <div className="text-sm text-muted-foreground">
                    Account has been set up and is operational
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  Setup
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 