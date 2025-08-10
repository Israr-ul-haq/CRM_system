"use client"

import { IconEye, IconBuilding, IconMail, IconPhone, IconMapPin, IconCalendar, IconCurrencyDollar, IconUsers, IconWorld } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface Company {
  id: number
  name: string
  email: string
  phone: string
  address: string
  website: string
  industry: string
  size: string
  status: string
  founded: string
  employees: number
  revenue: number
  lastContact: string
  notes: string
}

interface ViewCompanyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  company?: Company
}

export function ViewCompanyModal({ open, onOpenChange, company }: ViewCompanyModalProps) {
  if (!company) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString() + ' ' + new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    }
  }

  const getSizeColor = (size: string) => {
    switch (size) {
      case 'small':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'large':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconEye className="h-5 w-5" />
            View Company Details
          </DialogTitle>
          <DialogDescription>
            Detailed information for {company.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold">{company.name}</h3>
                <p className="text-sm text-muted-foreground capitalize">{company.industry} Industry</p>
              </div>
              <div className="flex flex-col gap-2">
                <Badge className={getStatusColor(company.status)}>
                  {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
                </Badge>
                <Badge className={getSizeColor(company.size)}>
                  {company.size.charAt(0).toUpperCase() + company.size.slice(1)}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <IconCalendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Founded</p>
                  <p className="text-sm text-muted-foreground">{company.founded}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <IconCalendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Last Contact</p>
                  <p className="text-sm text-muted-foreground">{formatDate(company.lastContact)}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <IconBuilding className="h-4 w-4" />
              Contact Information
            </h4>
            
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-2">
                <IconMail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">{company.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <IconPhone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{company.phone}</p>
                </div>
              </div>

              {company.website && (
                <div className="flex items-center gap-2">
                  <IconWorld className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Website</p>
                    <p className="text-sm text-muted-foreground">{company.website}</p>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-2">
                <IconMapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">{company.address}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Business Information */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <IconCurrencyDollar className="h-4 w-4" />
              Business Information
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Employees</p>
                <div className="flex items-center gap-1">
                  <IconUsers className="h-4 w-4 text-muted-foreground" />
                  <p className="text-lg font-semibold text-blue-600">{company.employees.toLocaleString()}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium">Annual Revenue</p>
                <div className="flex items-center gap-1">
                  <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
                  <p className="text-lg font-semibold text-green-600">${(company.revenue / 1000000).toFixed(1)}M</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium">Revenue per Employee</p>
                <p className="text-lg font-semibold text-purple-600">
                  ${company.employees > 0 ? (company.revenue / company.employees).toLocaleString() : '0'}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium">Years in Business</p>
                <p className="text-lg font-semibold text-orange-600">
                  {new Date().getFullYear() - parseInt(company.founded)}
                </p>
              </div>
            </div>
          </div>

          {company.notes && (
            <>
              <Separator />
              
              {/* Notes */}
              <div className="space-y-4">
                <h4 className="font-medium">Notes</h4>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">{company.notes}</p>
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 