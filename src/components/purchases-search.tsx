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
import { AddPurchaseModal } from "@/components/add-purchase-modal"

interface PurchasesSearchProps {
  onAddPurchase: (purchase: {
    supplierId: string
    companyId: string
    items: Array<{
      inventoryId: string
      quantity: number
      unitCost: number
    }>
    totalAmount: number
    paymentStatus: string
    paymentMethod: string
    expectedDelivery: string
    notes?: string
  }) => void
}

export function PurchasesSearch({ onAddPurchase }: PurchasesSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [supplierFilter, setSupplierFilter] = useState("all")
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all")
  const [orderStatusFilter, setOrderStatusFilter] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleAddPurchase = (purchase: {
    supplierId: string
    companyId: string
    items: Array<{
      inventoryId: string
      quantity: number
      unitCost: number
    }>
    totalAmount: number
    paymentStatus: string
    paymentMethod: string
    expectedDelivery: string
    notes?: string
  }) => {
    onAddPurchase(purchase)
    setIsModalOpen(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search purchases by order number, supplier, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Supplier Filter */}
        <Select value={supplierFilter} onValueChange={setSupplierFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <IconFilter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Supplier" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Suppliers</SelectItem>
            <SelectItem value="1">TechCorp Solutions</SelectItem>
            <SelectItem value="2">Global Textiles Ltd</SelectItem>
            <SelectItem value="3">Office Supplies Plus</SelectItem>
            <SelectItem value="4">Home & Garden Co</SelectItem>
            <SelectItem value="5">Sports Equipment Pro</SelectItem>
            <SelectItem value="6">Beauty Supplies Inc</SelectItem>
            <SelectItem value="7">Automotive Parts Co</SelectItem>
            <SelectItem value="8">Book Publishers Ltd</SelectItem>
          </SelectContent>
        </Select>

        {/* Payment Status Filter */}
        <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Payment Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Payment Status</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="partial">Partial</SelectItem>
          </SelectContent>
        </Select>

        {/* Order Status Filter */}
        <Select value={orderStatusFilter} onValueChange={setOrderStatusFilter}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Order Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Order Status</SelectItem>
            <SelectItem value="ordered">Ordered</SelectItem>
            <SelectItem value="in_transit">In Transit</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        {/* Add Purchase Button */}
        <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
          <IconPlus className="mr-2 h-4 w-4" />
          New Purchase
        </Button>
      </div>

      {/* Active Filters Display */}
      {(supplierFilter !== "all" || paymentStatusFilter !== "all" || orderStatusFilter !== "all") && (
        <div className="flex flex-wrap gap-2">
          {supplierFilter !== "all" && (
            <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
              <span>Supplier: {supplierFilter}</span>
              <button
                onClick={() => setSupplierFilter("all")}
                className="ml-1 text-blue-600 hover:text-blue-800"
              >
                ×
              </button>
            </div>
          )}
          {paymentStatusFilter !== "all" && (
            <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-md text-sm">
              <span>Payment: {paymentStatusFilter}</span>
              <button
                onClick={() => setPaymentStatusFilter("all")}
                className="ml-1 text-green-600 hover:text-green-800"
              >
                ×
              </button>
            </div>
          )}
          {orderStatusFilter !== "all" && (
            <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-md text-sm">
              <span>Order: {orderStatusFilter}</span>
              <button
                onClick={() => setOrderStatusFilter("all")}
                className="ml-1 text-purple-600 hover:text-purple-800"
              >
                ×
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add Purchase Modal */}
      <AddPurchaseModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAddPurchase={handleAddPurchase}
      />
    </div>
  )
} 