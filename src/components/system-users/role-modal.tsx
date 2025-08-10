"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { IconShield, IconX, IconCheck } from "@tabler/icons-react"
import { SYSTEM_PERMISSIONS, Permission, PermissionAction } from "./permissions-config"

interface Role {
  id?: string
  name: string
  description: string
  permissions: string[]
  isActive: boolean
}

interface RoleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  role?: Role | null
  onSave: (role: Role) => void
}

export default function RoleModal({ open, onOpenChange, role, onSave }: RoleModalProps) {
  const [formData, setFormData] = useState<Role>({
    name: "",
    description: "",
    permissions: [],
    isActive: true
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [expandedPermissions, setExpandedPermissions] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (role) {
      setFormData(role)
    } else {
      setFormData({
        name: "",
        description: "",
        permissions: [],
        isActive: true
      })
    }
    setErrors({})
  }, [role, open])

  const handleInputChange = (field: keyof Role, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handlePermissionChange = (permissionKey: string, actionKey: string, checked: boolean) => {
    const fullKey = `${permissionKey}.${actionKey}`
    
    if (checked) {
      setFormData(prev => ({
        ...prev,
        permissions: [...prev.permissions, fullKey]
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        permissions: prev.permissions.filter(p => p !== fullKey)
      }))
    }
  }

  const handlePermissionCategoryChange = (permissionKey: string, checked: boolean) => {
    const permission = SYSTEM_PERMISSIONS.find(p => p.key === permissionKey)
    if (!permission) return

    const allActionKeys = permission.actions.map(a => `${permissionKey}.${a.key}`)
    
    if (checked) {
      // Add all actions for this permission
      setFormData(prev => ({
        ...prev,
        permissions: [...new Set([...prev.permissions, ...allActionKeys])]
      }))
    } else {
      // Remove all actions for this permission
      setFormData(prev => ({
        ...prev,
        permissions: prev.permissions.filter(p => !allActionKeys.includes(p))
      }))
    }
  }

  const isPermissionFullySelected = (permissionKey: string): boolean => {
    const permission = SYSTEM_PERMISSIONS.find(p => p.key === permissionKey)
    if (!permission) return false
    
    const allActionKeys = permission.actions.map(a => `${permissionKey}.${a.key}`)
    return allActionKeys.every(key => formData.permissions.includes(key))
  }

  const isPermissionPartiallySelected = (permissionKey: string): boolean => {
    const permission = SYSTEM_PERMISSIONS.find(p => p.key === permissionKey)
    if (!permission) return false
    
    const allActionKeys = permission.actions.map(a => `${permissionKey}.${a.key}`)
    const selectedCount = allActionKeys.filter(key => formData.permissions.includes(key)).length
    
    return selectedCount > 0 && selectedCount < allActionKeys.length
  }

  const togglePermissionExpansion = (permissionKey: string) => {
    setExpandedPermissions(prev => {
      const newSet = new Set(prev)
      if (newSet.has(permissionKey)) {
        newSet.delete(permissionKey)
      } else {
        newSet.add(permissionKey)
      }
      return newSet
    })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = "Role name is required"
    }
    
    if (formData.permissions.length === 0) {
      newErrors.permissions = "At least one permission is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData)
      onOpenChange(false)
    }
  }

  const isEditMode = !!role?.id

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconShield className="h-5 w-5" />
            {isEditMode ? "Edit Role" : "Create New Role"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? "Modify role details and permissions" 
              : "Create a new role and assign granular permissions"
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Role Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter role name"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="status"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => handleInputChange("isActive", checked as boolean)}
                  />
                  <Label htmlFor="status">Active</Label>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe the role's purpose and responsibilities"
                rows={3}
              />
            </div>
          </div>

          {/* Permissions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Permissions *</Label>
              {errors.permissions && (
                <p className="text-sm text-red-500">{errors.permissions}</p>
              )}
            </div>
            
            <div className="space-y-4">
              {SYSTEM_PERMISSIONS.map((permission) => {
                const isExpanded = expandedPermissions.has(permission.key)
                const isFullySelected = isPermissionFullySelected(permission.key)
                const isPartiallySelected = isPermissionPartiallySelected(permission.key)
                
                return (
                  <div key={permission.key} className="border rounded-lg">
                    <div className="p-4 bg-muted/30">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id={`permission-${permission.key}`}
                            checked={isFullySelected}
                            ref={(ref) => {
                              if (ref) {
                                (ref as HTMLInputElement).indeterminate = isPartiallySelected && !isFullySelected
                              }
                            }}
                            onCheckedChange={(checked) => handlePermissionCategoryChange(permission.key, checked as boolean)}
                          />
                          <div>
                            <Label 
                              htmlFor={`permission-${permission.key}`} 
                              className="font-medium cursor-pointer"
                            >
                              {permission.label}
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              {permission.description}
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePermissionExpansion(permission.key)}
                          className="ml-2"
                        >
                          {isExpanded ? "Hide" : "Show"} Details
                        </Button>
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <div className="p-4 border-t bg-background">
                        <div className="grid gap-3 md:grid-cols-2">
                          {permission.actions.map((action) => {
                            const actionKey = `${permission.key}.${action.key}`
                            const isSelected = formData.permissions.includes(actionKey)
                            
                            return (
                              <div key={actionKey} className="flex items-start space-x-3 p-3 border rounded-lg">
                                <Checkbox
                                  id={actionKey}
                                  checked={isSelected}
                                  onCheckedChange={(checked) => handlePermissionChange(permission.key, action.key, checked as boolean)}
                                />
                                <div className="space-y-1">
                                  <Label htmlFor={actionKey} className="font-medium cursor-pointer">
                                    {action.label}
                                  </Label>
                                  <p className="text-sm text-muted-foreground">
                                    {action.description}
                                  </p>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {isEditMode ? "Update Role" : "Create Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 