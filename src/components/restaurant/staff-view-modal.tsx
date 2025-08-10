"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { IconUsers, IconMail, IconPhone, IconClock, IconMapPin, IconCheck, IconX } from "@tabler/icons-react"

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

interface StaffViewModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  staff: Staff | null
}

export default function StaffViewModal({ open, onOpenChange, staff }: StaffViewModalProps) {
  if (!staff) return null

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not specified"
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const calculateWeeklySalary = () => staff.hourlyRate * 40
  const calculateMonthlySalary = () => staff.hourlyRate * 40 * 4.33

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconUsers className="h-5 w-5" />
            Staff Member: {staff.name}
          </DialogTitle>
          <DialogDescription>
            View detailed information about this staff member
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Profile Header */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Profile Information</h3>
            
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <IconUsers className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h4 className="text-2xl font-semibold">{staff.name}</h4>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{staff.role}</Badge>
                  <Badge variant={staff.isActive ? "default" : "destructive"}>
                    {staff.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Contact Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <IconMail className="h-4 w-4" />
                  Email Address
                </div>
                <p className="font-medium">{staff.email}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <IconPhone className="h-4 w-4" />
                  Phone Number
                </div>
                <p className="font-medium">{staff.phone}</p>
              </div>
            </div>

            {staff.address && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <IconMapPin className="h-4 w-4" />
                  Address
                </div>
                <p className="font-medium">{staff.address}</p>
              </div>
            )}
          </div>

          {/* Employment Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Employment Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">Job Role</h4>
                <Badge variant="secondary">{staff.role}</Badge>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">Work Shift</h4>
                <div className="flex items-center gap-2">
                  <IconClock className="h-4 w-4 text-muted-foreground" />
                  <span>{staff.shift}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-sm text-muted-foreground">Start Date</h4>
              <p className="font-medium">{formatDate(staff.startDate)}</p>
            </div>
          </div>

          {/* Salary Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Salary Information</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Hourly Rate</div>
                <div className="text-xl font-bold text-green-600">${staff.hourlyRate.toFixed(2)}</div>
              </div>
              
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Weekly (40 hrs)</div>
                <div className="text-lg font-bold">${calculateWeeklySalary().toFixed(2)}</div>
              </div>
              
              <div className="text-center p-3 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Monthly</div>
                <div className="text-lg font-bold">${calculateMonthlySalary().toFixed(2)}</div>
              </div>
            </div>

            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-center">
                <div className="text-sm text-green-800">Annual Salary (Estimated)</div>
                <div className="text-xl font-bold text-green-600">
                  ${(calculateMonthlySalary() * 12).toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          {(staff.emergencyContact || staff.emergencyPhone) && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Emergency Contact</h3>
              
              <div className="grid grid-cols-2 gap-4">
                {staff.emergencyContact && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground">Emergency Contact Name</h4>
                    <p className="font-medium">{staff.emergencyContact}</p>
                  </div>
                )}
                
                {staff.emergencyPhone && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm text-muted-foreground">Emergency Contact Phone</h4>
                    <p className="font-medium">{staff.emergencyPhone}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Additional Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">Employee ID</h4>
                <p className="font-mono text-sm">{staff.id}</p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm text-muted-foreground">Employment Status</h4>
                <div className="flex items-center gap-2">
                  {staff.isActive ? (
                    <IconCheck className="h-4 w-4 text-green-600" />
                  ) : (
                    <IconX className="h-4 w-4 text-red-600" />
                  )}
                  <Badge variant={staff.isActive ? "default" : "destructive"}>
                    {staff.isActive ? "Active Employee" : "Inactive Employee"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Metrics (Placeholder) */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Performance Overview</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-sm text-blue-800">Days Worked</div>
                <div className="text-lg font-bold text-blue-600">--</div>
                <div className="text-xs text-blue-600">This month</div>
              </div>
              
              <div className="text-center p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="text-sm text-purple-800">Performance Rating</div>
                <div className="text-lg font-bold text-purple-600">--</div>
                <div className="text-xs text-purple-600">Out of 5</div>
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