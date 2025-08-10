"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { IconUsers } from "@tabler/icons-react"

interface Staff {
  id?: string
  name: string
  role: string
  email: string
  phone: string
  isActive: boolean
  shift: string
  hourlyRate: number
  startDate?: string
  address?: string
  emergencyContact?: string
  emergencyPhone?: string
}

interface StaffModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  staff?: Staff | null
  onSave: (staff: Staff) => void
}

const staffRoles = [
  "Head Chef",
  "Sous Chef",
  "Line Cook",
  "Prep Cook",
  "Pastry Chef",
  "Server",
  "Host/Hostess",
  "Bartender",
  "Barista",
  "Busser",
  "Dishwasher",
  "Manager",
  "Assistant Manager",
  "Cashier",
  "Delivery Driver"
]

const shifts = [
  "Morning (6AM-2PM)",
  "Afternoon (2PM-10PM)",
  "Evening (4PM-12AM)",
  "Night (10PM-6AM)",
  "Split Shift",
  "Flexible"
]

export default function StaffModal({ open, onOpenChange, staff, onSave }: StaffModalProps) {
  const [formData, setFormData] = useState<Staff>({
    name: "",
    role: "",
    email: "",
    phone: "",
    isActive: true,
    shift: "",
    hourlyRate: 0
  })

  useEffect(() => {
    if (staff) {
      setFormData(staff)
    } else {
      setFormData({
        name: "",
        role: "",
        email: "",
        phone: "",
        isActive: true,
        shift: "",
        hourlyRate: 0
      })
    }
  }, [staff])

  const handleInputChange = (field: keyof Staff, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconUsers className="h-5 w-5" />
            {staff ? "Edit Staff Member" : "Add New Staff Member"}
          </DialogTitle>
          <DialogDescription>
            {staff ? "Update the staff member information" : "Add a new staff member to your restaurant"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Basic Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., John Smith"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Job Role *</Label>
                <Select value={formData.role} onValueChange={(value) => handleInputChange('role', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {staffRoles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="email@restaurant.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="+1-555-0123"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address || ""}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Full address"
              />
            </div>
          </div>

          {/* Employment Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Employment Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="shift">Work Shift *</Label>
                <Select value={formData.shift} onValueChange={(value) => handleInputChange('shift', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select shift" />
                  </SelectTrigger>
                  <SelectContent>
                    {shifts.map((shift) => (
                      <SelectItem key={shift} value={shift}>
                        {shift}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="hourlyRate">Hourly Rate ($) *</Label>
                <Input
                  id="hourlyRate"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.hourlyRate}
                  onChange={(e) => handleInputChange('hourlyRate', parseFloat(e.target.value) || 0)}
                  placeholder="15.00"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate || ""}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => handleInputChange('isActive', checked)}
              />
              <Label htmlFor="isActive">Active Employee</Label>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Emergency Contact</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact || ""}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  placeholder="Emergency contact name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                <Input
                  id="emergencyPhone"
                  type="tel"
                  value={formData.emergencyPhone || ""}
                  onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                  placeholder="+1-555-0123"
                />
              </div>
            </div>
          </div>

          {/* Salary Preview */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Salary Information</h3>
            
            <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Hourly Rate</div>
                <div className="text-lg font-bold">${formData.hourlyRate.toFixed(2)}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Daily (8 hours)</div>
                <div className="text-lg font-bold">${(formData.hourlyRate * 8).toFixed(2)}</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Weekly (40 hours)</div>
                <div className="text-lg font-bold">${(formData.hourlyRate * 40).toFixed(2)}</div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {staff ? "Update Staff Member" : "Add Staff Member"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 