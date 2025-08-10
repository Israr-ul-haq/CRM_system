"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { IconShield, IconUsers, IconCheck, IconX } from "@tabler/icons-react"
import { SYSTEM_PERMISSIONS } from "./permissions-config"

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  isActive: boolean
  isSystem: boolean
  userCount: number
}

interface RoleViewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role: Role | null
}

export default function RoleViewModal({ open, onOpenChange, role }: RoleViewModalProps) {
  if (!role) return null

  const formatPermissionKey = (permissionKey: string) => {
    const permission = SYSTEM_PERMISSIONS.find(p => p.key === permissionKey)
    return permission?.label || permissionKey
  }

  const getPermissionActions = (permissionKey: string) => {
    const permission = SYSTEM_PERMISSIONS.find(p => p.key === permissionKey)
    return permission?.actions || []
  }

  const hasPermission = (permissionKey: string, actionKey: string) => {
    const fullKey = `${permissionKey}.${actionKey}`
    return role.permissions.includes(fullKey)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconShield className="h-5 w-5" />
            Role Details: {role.name}
          </DialogTitle>
          <DialogDescription>
            View detailed information about this role and its permissions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-medium text-sm text-muted-foreground">Role Name</h3>
                <p className="text-lg font-medium">{role.name}</p>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-sm text-muted-foreground">Status</h3>
                <div className="flex items-center gap-2">
                  {role.isActive ? (
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
                  {role.isSystem && (
                    <Badge variant="secondary">System Role</Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground">Description</h3>
              <p className="text-sm text-muted-foreground">{role.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h3 className="font-medium text-sm text-muted-foreground">Users Assigned</h3>
                <div className="flex items-center gap-2">
                  <IconUsers className="h-4 w-4 text-muted-foreground" />
                  <span className="text-lg font-medium">{role.userCount}</span>
                  <span className="text-sm text-muted-foreground">users</span>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium text-sm text-muted-foreground">Total Permissions</h3>
                <span className="text-lg font-medium">{role.permissions.length}</span>
              </div>
            </div>
          </div>

          {/* Permissions Breakdown */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Permissions Breakdown</h3>
            <div className="space-y-4">
              {SYSTEM_PERMISSIONS.map((permission) => {
                const hasAnyPermission = permission.actions.some(action => 
                  role.permissions.includes(`${permission.key}.${action.key}`)
                )

                if (!hasAnyPermission) return null

                return (
                  <div key={permission.key} className="border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <h4 className="font-medium">{permission.label}</h4>
                      <Badge variant="outline" className="text-xs">
                        {permission.category}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {permission.description}
                    </p>
                    <div className="grid gap-2 md:grid-cols-2">
                      {permission.actions.map((action) => {
                        const isGranted = hasPermission(permission.key, action.key)
                        return (
                          <div key={action.key} className="flex items-center gap-3 p-2 border rounded">
                            {isGranted ? (
                              <IconCheck className="h-4 w-4 text-green-600" />
                            ) : (
                              <IconX className="h-4 w-4 text-gray-400" />
                            )}
                            <div className="flex-1">
                              <div className={`font-medium ${isGranted ? 'text-green-700' : 'text-gray-500'}`}>
                                {action.label}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {action.description}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
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