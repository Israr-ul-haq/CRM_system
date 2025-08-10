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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AddInventoryModal } from "@/components/add-inventory-modal"

interface InventorySearchProps {
  onSearch?: (query: string) => void
  onFilterChange?: (filters: InventoryFilters) => void
  onAddItem?: (item: {
    name: string
    sku: string
    category: string
    price: string
    cost: string
    stock: string
    minStock: string
    supplierId: string
    location: string
    description?: string
  }) => void
}

export interface InventoryFilters {
  category: string
  status: string
  stockLevel: string
}

export function InventorySearch({ onSearch, onFilterChange, onAddItem }: InventorySearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState<InventoryFilters>({
    category: "all",
    status: "all",
    stockLevel: "all"
  })
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    onSearch?.(value)
  }

  const handleFilterChange = (key: keyof InventoryFilters, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const handleAddItem = (item: {
    name: string
    sku: string
    category: string
    price: string
    cost: string
    stock: string
    minStock: string
    supplierId: string
    location: string
    description?: string
  }) => {
    onAddItem?.(item)
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search inventory..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <IconFilter className="h-4 w-4" />
              <span className="sr-only">Filters</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuCheckboxItem
              checked={filters.category !== "all"}
              onCheckedChange={() => handleFilterChange("category", "all")}
            >
              All Categories
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.status !== "all"}
              onCheckedChange={() => handleFilterChange("status", "all")}
            >
              All Status
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={filters.stockLevel !== "all"}
              onCheckedChange={() => handleFilterChange("stockLevel", "all")}
            >
              All Stock Levels
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="flex items-center gap-2">
        <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="electronics">Electronics</SelectItem>
            <SelectItem value="clothing">Clothing</SelectItem>
            <SelectItem value="books">Books</SelectItem>
            <SelectItem value="home">Home & Garden</SelectItem>
            <SelectItem value="sports">Sports</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="discontinued">Discontinued</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={filters.stockLevel} onValueChange={(value) => handleFilterChange("stockLevel", value)}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Stock" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stock</SelectItem>
            <SelectItem value="in-stock">In Stock</SelectItem>
            <SelectItem value="low-stock">Low Stock</SelectItem>
            <SelectItem value="out-of-stock">Out of Stock</SelectItem>
          </SelectContent>
        </Select>
        
        <Button onClick={() => setIsModalOpen(true)}>
          <IconPlus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>
      
      <AddInventoryModal 
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAddItem={handleAddItem}
      />
    </div>
  )
} 