"use client"

import { useState } from "react"
import { IconFilter, IconUsers, IconCurrencyDollar, IconCreditCard, IconPlus, IconUserCheck } from "@tabler/icons-react"
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

interface CustomerManagementSearchProps {
  onFilterChange: (filters: {
    status: string
    creditStatus: string
  }) => void
  onAddCustomer: () => void
  totalCustomers: number
  totalCreditLimit: number
  totalCreditUsed: number
}

export function CustomerManagementSearch({ 
  onFilterChange, 
  onAddCustomer,
  totalCustomers, 
  totalCreditLimit, 
  totalCreditUsed 
}: CustomerManagementSearchProps) {
  const [filters, setFilters] = useState({
    status: "all",
    creditStatus: "all"
  })

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleResetFilters = () => {
    const resetFilters = {
      status: "all",
      creditStatus: "all"
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
            Filter Customers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Credit Status Filter */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <IconCreditCard className="h-4 w-4" />
                Credit Status
              </Label>
              <Select value={filters.creditStatus} onValueChange={(value) => handleFilterChange("creditStatus", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Credit Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Credit Status</SelectItem>
                  <SelectItem value="available">Credit Available</SelectItem>
                  <SelectItem value="used">Credit Used</SelectItem>
                  <SelectItem value="maxed">Credit Maxed</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-6">
            <Button onClick={onAddCustomer} className="flex items-center gap-2">
              <IconPlus className="h-4 w-4" />
              Add Customer
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
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <IconUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">Registered customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credit Limit</CardTitle>
            <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalCreditLimit.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Available credit limit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credit Used</CardTitle>
            <IconCreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">${totalCreditUsed.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total credit utilized</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Credit</CardTitle>
            <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">${(totalCreditLimit - totalCreditUsed).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Remaining credit</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 