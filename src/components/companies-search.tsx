"use client"

import { useState } from "react"
import { IconSearch, IconFilter, IconPlus } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AddCompanyModal } from "@/components/add-company-modal"

interface CompaniesSearchProps {
  onAddCompany: (company: {
    name: string
    email: string
    phone: string
    address: string
    website: string
    industry: string
    size: string
    status: string
    notes?: string
  }) => void
}

export function CompaniesSearch({ onAddCompany }: CompaniesSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [industryFilter, setIndustryFilter] = useState("all")
  const [sizeFilter, setSizeFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleAddCompany = (company: {
    name: string
    email: string
    phone: string
    address: string
    website: string
    industry: string
    size: string
    status: string
    notes?: string
  }) => {
    onAddCompany(company)
    setIsModalOpen(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search companies by name, email, or website..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Industry Filter */}
        <Select value={industryFilter} onValueChange={setIndustryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <IconFilter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Industry" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Industries</SelectItem>
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="manufacturing">Manufacturing</SelectItem>
            <SelectItem value="retail">Retail</SelectItem>
            <SelectItem value="sports">Sports</SelectItem>
            <SelectItem value="beauty">Beauty & Health</SelectItem>
            <SelectItem value="automotive">Automotive</SelectItem>
            <SelectItem value="publishing">Publishing</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>

        {/* Size Filter */}
        <Select value={sizeFilter} onValueChange={setSizeFilter}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sizes</SelectItem>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="large">Large</SelectItem>
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        {/* Add Company Button */}
        <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
          <IconPlus className="mr-2 h-4 w-4" />
          Add Company
        </Button>
      </div>

      {/* Active Filters Display */}
      {(industryFilter !== "all" || sizeFilter !== "all" || statusFilter !== "all") && (
        <div className="flex flex-wrap gap-2">
          {industryFilter !== "all" && (
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
              <span>Industry: {industryFilter}</span>
              <button
                onClick={() => setIndustryFilter("all")}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </div>
          )}
          {sizeFilter !== "all" && (
            <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-md text-sm">
              <span>Size: {sizeFilter}</span>
              <button
                onClick={() => setSizeFilter("all")}
                className="ml-1 text-purple-600 hover:text-purple-800"
              >
                ×
              </button>
            </div>
          )}
          {statusFilter !== "all" && (
            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm">
              <span>Status: {statusFilter}</span>
              <button
                onClick={() => setStatusFilter("all")}
                className="ml-1 text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add Company Modal */}
      <AddCompanyModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAddCompany={handleAddCompany}
      />
    </div>
  )
} 