"use client"

import { useState } from "react"
import { IconFilter, IconUsers, IconCurrencyDollar, IconBuilding, IconBriefcase, IconUserCheck, IconPlus } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

interface StaffManagementSearchProps {
  onFilterChange: (filters: {
    position: string
    department: string
    status: string
  }) => void
  onAddStaff: () => void
  totalStaff: number
  totalSalary: number
  totalAdvance: number
}

export function StaffManagementSearch({ 
  onFilterChange, 
  onAddStaff,
  totalStaff, 
  totalSalary, 
  totalAdvance 
}: StaffManagementSearchProps) {
  const [filters, setFilters] = useState({
    position: "all",
    department: "all",
    status: "all"
  })

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleResetFilters = () => {
    const resetFilters = {
      position: "all",
      department: "all",
      status: "all"
    }
    setFilters(resetFilters)
    onFilterChange(resetFilters)
  }

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconFilter className="h-5 w-5" />
            Filter Staff Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Position Filter */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <IconBriefcase className="h-4 w-4" />
                Position
              </Label>
              <Select value={filters.position} onValueChange={(value) => handleFilterChange("position", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Positions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Positions</SelectItem>
                  <SelectItem value="Branch Manager">Branch Manager</SelectItem>
                  <SelectItem value="Sales Manager">Sales Manager</SelectItem>
                  <SelectItem value="Sales Representative">Sales Representative</SelectItem>
                  <SelectItem value="Sweeper">Sweeper</SelectItem>
                  <SelectItem value="Security Guard">Security Guard</SelectItem>
                  <SelectItem value="Cashier">Cashier</SelectItem>
                  <SelectItem value="Accountant">Accountant</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Department Filter */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <IconBuilding className="h-4 w-4" />
                Department
              </Label>
              <Select value={filters.department} onValueChange={(value) => handleFilterChange("department", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Management">Management</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Security">Security</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <IconUserCheck className="h-4 w-4" />
                Status
              </Label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="on_leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-6">
            <Button onClick={onAddStaff} className="flex items-center gap-2">
              <IconPlus className="h-4 w-4" />
              Add Staff Member
            </Button>
            <Button variant="outline" onClick={handleResetFilters}>
              Reset Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalStaff}</div>
            <p className="text-xs text-muted-foreground">Active staff members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Salary</CardTitle>
            <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalSalary.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Monthly salary budget</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Advance</CardTitle>
            <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">${totalAdvance.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Advance payments taken</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Salary</CardTitle>
            <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">${(totalSalary - totalAdvance).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Remaining to be paid</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 