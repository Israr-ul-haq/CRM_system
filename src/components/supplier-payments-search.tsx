"use client"

import { useState } from "react"
import { IconSearch, IconPlus, IconFilter } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AddPaymentModal } from "@/components/add-payment-modal"

interface SupplierPaymentsSearchProps {
  onAddPayment: (payment: {
    supplierId: string
    purchaseOrders: Array<{
      purchaseOrderId: string
      amount: number
    }>
    totalAmount: number
    paymentMethod: string
    paymentDate: string
    reference: string
    notes?: string
  }) => void
}

export function SupplierPaymentsSearch({ onAddPayment }: SupplierPaymentsSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [supplierFilter, setSupplierFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search payments by reference, description, or supplier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Supplier Filter */}
        <Select value={supplierFilter} onValueChange={setSupplierFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="All Suppliers" />
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

        {/* Type Filter */}
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="credit">Credits (Purchases)</SelectItem>
            <SelectItem value="debit">Debits (Payments)</SelectItem>
          </SelectContent>
        </Select>

        {/* Add Payment Button */}
        <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto">
          <IconPlus className="mr-2 h-4 w-4" />
          Add Payment
        </Button>
      </div>

      {/* Active Filters Display */}
      {(supplierFilter !== "all" || typeFilter !== "all") && (
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
          {typeFilter !== "all" && (
            <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-md text-sm">
              <span>Type: {typeFilter}</span>
              <button
                onClick={() => setTypeFilter("all")}
                className="ml-1 text-purple-600 hover:text-purple-800"
              >
                ×
              </button>
            </div>
          )}
        </div>
      )}

      {/* Add Payment Modal */}
      <AddPaymentModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onAddPayment={onAddPayment}
      />
    </div>
  )
} 