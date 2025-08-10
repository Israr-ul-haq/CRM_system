"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { IconUsers, IconLock } from "@tabler/icons-react"

interface User {
  id?: string
  name: string
  email: string
  phone?: string
  roleId: string
  isActive: boolean
  password?: string
}

interface Role {
  id: string
  name: string
}

interface UserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User | null
  roles: Role[]
  onSave: (user: User) => void
}

const mockRoles: Role[] = [
  { id: "1", name: "Super Admin" },
  { id: "2", name: "Branch Manager" },
  { id: "3", name: "Sales Staff" },
  { id: "4", name: "Inventory Manager" }
]

export default function UserModal({ open, onOpenChange, user, roles = mockRoles, onSave }: UserModalProps) {
  const [formData, setFormData] = useState<User>({
    name: "",
    email: "",
    phone: "",
    roleId: "",
    isActive: true,
    password: ""
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (user) {
      setFormData(user)
      setShowPassword(false)
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        roleId: "",
        isActive: true,
        password: ""
      })
      setShowPassword(true)
    }
    setErrors({})
  }, [user, open])

  const handleInputChange = (field: keyof User, value: string | boolean | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }
    
    if (!formData.roleId) {
      newErrors.roleId = "Role is required"
    }
    
    if (!user?.id && !formData.password) {
      newErrors.password = "Password is required for new users"
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

  const isEditMode = !!user?.id

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconUsers className="h-5 w-5" />
            {isEditMode ? "Edit User" : "Create New User"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? "Modify user details and role assignment" 
              : "Create a new user account and assign a role"
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter full name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="Enter email address"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select value={formData.roleId} onValueChange={(value) => handleInputChange("roleId", value)}>
              <SelectTrigger className={errors.roleId ? "border-red-500" : ""}>
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.roleId && (
              <p className="text-sm text-red-500">{errors.roleId}</p>
            )}
          </div>

          {/* Password Section */}
          {(!isEditMode || showPassword) && (
            <div className="space-y-2">
              <Label htmlFor="password">Password {!isEditMode && "*"}</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                placeholder={isEditMode ? "Enter new password" : "Enter password"}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password}</p>
              )}
            </div>
          )}

          {/* Status */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="status"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleInputChange("isActive", checked)}
              />
              <Label htmlFor="status">Active</Label>
            </div>
          </div>

          {/* Edit Mode Password Toggle */}
          {isEditMode && (
            <div className="pt-2 border-t">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
                className="flex items-center gap-2"
              >
                <IconLock className="h-4 w-4" />
                {showPassword ? "Hide Password Change" : "Change Password"}
              </Button>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {isEditMode ? "Update User" : "Create User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 