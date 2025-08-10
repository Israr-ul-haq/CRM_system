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
import { AddSupplierModal } from "@/components/add-supplier-modal"

interface SuppliersSearchProps {
  onAddSupplier: (supplier: {
    name: string
    email: string
    phone: string
    address: string
    contactPerson: string
    category: string
    status: string
    companyId: string
    notes?: string
  }) => void
}

export function SuppliersSearch({ onAddSupplier }: SuppliersSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleAddSupplier = (supplier: {
    name: string
    email: string
    phone: string
    address: string
    contactPerson: string
    category: string
    status: string
    companyId: string
    notes?: string
  }) => {
    onAddSupplier(supplier)
    setIsModalOpen(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search suppliers by name, email, or contact person..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Category Filter */}
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <IconFilter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="electronics">Electronics</SelectItem>
            <SelectItem value="clothing">Clothing</SelectItem>
            <SelectItem value="office">Office</SelectItem>
            <SelectItem value="home">Home & Garden</SelectItem>
            <SelectItem value="sports">Sports</SelectItem>
            <SelectItem value="beauty">Beauty & Health</SelectItem>
            <SelectItem value="automotive">Automotive</SelectItem>
            <SelectItem value="books">Books</SelectItem>
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

        {/* Add Supplier Button */}
        <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
          <IconPlus className="mr-2 h-4 w-4" />
          Add Supplier
        </Button>
      </div>

      {/* Active Filters Display */}
      {(categoryFilter !== "all" || statusFilter !== "all") && (
        <div className="flex flex-wrap gap-2">
          {categoryFilter !== "all" && (
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
              <span>Category: {categoryFilter}</span>
              <button
                onClick={() => setCategoryFilter("all")}
                className="ml-1 text-blue-600 hover:text-blue-800"
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

      {/* Add Supplier Modal */}
      <AddSupplierModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAddSupplier={handleAddSupplier}
      />
    </div>
  )
} 