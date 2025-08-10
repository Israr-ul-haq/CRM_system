"use client"

import { useState } from "react"
import { IconFilter, IconDownload, IconCalendar, IconBuilding, IconTag, IconCurrencyDollar, IconPackage } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

interface SalesRegisterSearchProps {
  onFilterChange: (filters: {
    startDate: string
    endDate: string
    category: string
    company: string
  }) => void
  onGenerateReport: (filters: {
    startDate: string
    endDate: string
    category: string
    company: string
  }) => Promise<void>
  totalSales: number
  totalItems: number
}

export function SalesRegisterSearch({ 
  onFilterChange, 
  onGenerateReport, 
  totalSales, 
  totalItems 
}: SalesRegisterSearchProps) {
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    category: "all",
    company: "all"
  })
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true)
    try {
      await onGenerateReport(filters)
    } finally {
      setIsGeneratingReport(false)
    }
  }

  const handleResetFilters = () => {
    const resetFilters = {
      startDate: "",
      endDate: "",
      category: "all",
      company: "all"
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
            Filter Sales Data
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Date Range */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <IconCalendar className="h-4 w-4" />
                Start Date
              </Label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange("startDate", e.target.value)}
                placeholder="Select start date"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <IconCalendar className="h-4 w-4" />
                End Date
              </Label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
                placeholder="Select end date"
              />
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <IconTag className="h-4 w-4" />
                Category
              </Label>
              <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Clothing">Clothing</SelectItem>
                  <SelectItem value="Books">Books</SelectItem>
                  <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                  <SelectItem value="Sports">Sports</SelectItem>
                  <SelectItem value="Beauty">Beauty</SelectItem>
                  <SelectItem value="Automotive">Automotive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Company Filter */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <IconBuilding className="h-4 w-4" />
                Company
              </Label>
              <Select value={filters.company} onValueChange={(value) => handleFilterChange("company", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Companies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Companies</SelectItem>
                  <SelectItem value="TechCorp Solutions Inc">TechCorp Solutions Inc</SelectItem>
                  <SelectItem value="Global Textiles Ltd">Global Textiles Ltd</SelectItem>
                  <SelectItem value="Office Supplies Plus">Office Supplies Plus</SelectItem>
                  <SelectItem value="Home & Garden Co">Home & Garden Co</SelectItem>
                  <SelectItem value="Sports Equipment Pro">Sports Equipment Pro</SelectItem>
                  <SelectItem value="Beauty Supplies Inc">Beauty Supplies Inc</SelectItem>
                  <SelectItem value="Automotive Parts Co">Automotive Parts Co</SelectItem>
                  <SelectItem value="Book Publishers Ltd">Book Publishers Ltd</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-6">
            <Button variant="outline" onClick={handleResetFilters}>
              Reset Filters
            </Button>
            <Button 
              onClick={handleGenerateReport} 
              disabled={isGeneratingReport}
              className="flex items-center gap-2"
            >
              <IconDownload className="h-4 w-4" />
              {isGeneratingReport ? "Generating..." : "Generate PDF Report"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${totalSales.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total revenue from filtered sales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items Sold</CardTitle>
            <IconPackage className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalItems.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total quantity of items sold</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            <IconCurrencyDollar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              ${totalItems > 0 ? (totalSales / totalItems).toFixed(2) : "0.00"}
            </div>
            <p className="text-xs text-muted-foreground">Average amount per item sold</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 