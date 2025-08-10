"use client"

import { useState } from "react"
import { IconSearch } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import inventoryData from "@/app/inventory/data.json"

interface InventoryItem {
  id: number
  name: string
  sku: string
  category: string
  price: number
  cost: number
  stock: number
  minStock: number
  status: string
  supplierId?: number
  supplier?: string
  location: string
  lastUpdated: string
}

interface InventoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectProduct: (product: InventoryItem) => void
}

export function InventoryModal({ open, onOpenChange, onSelectProduct }: InventoryModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredData, setFilteredData] = useState<InventoryItem[]>(inventoryData)

  // Filter data based on search query
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setFilteredData(inventoryData)
      return
    }

    const filtered = inventoryData.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase()) ||
      item.sku.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredData(filtered)
  }

  // Handle product selection
  const handleSelectProduct = (product: InventoryItem) => {
    onSelectProduct(product)
    onOpenChange(false)
    setSearchQuery("")
    setFilteredData(inventoryData)
  }

  // Handle modal close
  const handleClose = () => {
    onOpenChange(false)
    setSearchQuery("")
    setFilteredData(inventoryData)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Select Product from Inventory</DialogTitle>
          <DialogDescription>
            Search and select a product to add to your cart
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products by name, SKU, or category..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9"
              autoFocus
            />
          </div>

          {/* Products Table */}
          <div className="border rounded-lg overflow-hidden">
            <div className="max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Stock</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        {searchQuery ? "No products found matching your search." : "No products available."}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredData.map((item) => (
                      <TableRow 
                        key={item.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleSelectProduct(item)}
                      >
                        <TableCell>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground">{item.sku}</div>
                          </div>
                        </TableCell>
                        <TableCell className="capitalize">{item.category}</TableCell>
                        <TableCell className="text-right font-medium">
                          ${item.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className={item.stock <= item.minStock ? 'text-orange-600' : 'text-green-600'}>
                            {item.stock}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSelectProduct(item)
                            }}
                          >
                            Add to Cart
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>{filteredData.length} product{filteredData.length !== 1 ? 's' : ''} found</span>
            <span>Click on a product or use &quot;Add to Cart&quot; button to select</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 