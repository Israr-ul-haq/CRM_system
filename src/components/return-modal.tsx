"use client"

import { useState, useEffect } from "react"
import { IconSearch, IconReceipt, IconArrowBack, IconAlertTriangle, IconCheck } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"

// Sample invoice items data
const generateInvoiceItems = (invoiceId: string) => {
  const items = [
    { id: 1, name: "iPhone 15 Pro", sku: "IPH15PRO-128", price: 999.99, quantity: 1, total: 999.99 },
    { id: 2, name: "Nike Air Max 270", sku: "NIKE-AM270-10", price: 150.00, quantity: 2, total: 300.00 },
    { id: 3, name: "Coffee Maker Deluxe", sku: "HOME-COFFEE-001", price: 89.99, quantity: 1, total: 89.99 },
    { id: 4, name: "The Great Gatsby", sku: "BOOK-GATSBY-001", price: 12.99, quantity: 1, total: 12.99 },
  ]
  return items
}

interface InvoiceItem {
  id: number
  name: string
  sku: string
  price: number
  quantity: number
  total: number
}

interface ReturnItem {
  itemId: number
  name: string
  sku: string
  price: number
  originalQuantity: number
  returnQuantity: number
  reason: string
}

interface Invoice {
  id: string
  date: string
  total: number
  items: number
  status: string
}

interface ReturnModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoiceId?: string
}

export function ReturnModal({ open, onOpenChange, invoiceId }: ReturnModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [foundInvoice, setFoundInvoice] = useState<Invoice | null>(null)
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([])
  const [returnItems, setReturnItems] = useState<ReturnItem[]>([])
  const [returnReason, setReturnReason] = useState("")
  const [refundMethod, setRefundMethod] = useState("cash")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSearchMode, setIsSearchMode] = useState(true)

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      setSearchQuery("")
      setFoundInvoice(null)
      setInvoiceItems([])
      setReturnItems([])
      setReturnReason("")
      setRefundMethod("cash")
      setIsProcessing(false)
      
      // If invoiceId is provided, load that invoice directly
      if (invoiceId) {
        setIsSearchMode(false)
        loadInvoiceDirectly(invoiceId)
      } else {
        setIsSearchMode(true)
      }
    }
  }, [open, invoiceId])

  // Load invoice directly (for edit mode)
  const loadInvoiceDirectly = (id: string) => {
    // Simulate finding invoice (in real app, this would query your database)
    const mockInvoice = {
      id: id,
      date: new Date().toISOString(),
      total: 1402.97,
      items: 4,
      status: "completed"
    }

    setFoundInvoice(mockInvoice)
    setInvoiceItems(generateInvoiceItems(id))
    toast.success(`Loaded invoice: ${id}`)
  }

  // Handle invoice search
  const handleSearchInvoice = () => {
    if (!searchQuery.trim()) return

    // Simulate finding invoice (in real app, this would query your database)
    const mockInvoice = {
      id: searchQuery,
      date: new Date().toISOString(),
      total: 1402.97,
      items: 4,
      status: "completed"
    }

    setFoundInvoice(mockInvoice)
    setInvoiceItems(generateInvoiceItems(searchQuery))
    toast.success(`Found invoice: ${searchQuery}`)
  }

  // Handle item selection for return
  const handleItemSelection = (item: InvoiceItem, selected: boolean) => {
    if (selected) {
      const returnItem: ReturnItem = {
        itemId: item.id,
        name: item.name,
        sku: item.sku,
        price: item.price,
        originalQuantity: item.quantity,
        returnQuantity: item.quantity, // Default to full quantity
        reason: returnReason
      }
      setReturnItems(prev => [...prev, returnItem])
    } else {
      setReturnItems(prev => prev.filter(ri => ri.itemId !== item.id))
    }
  }

  // Handle return quantity change
  const handleReturnQuantityChange = (itemId: number, quantity: number) => {
    setReturnItems(prev => 
      prev.map(item => 
        item.itemId === itemId 
          ? { ...item, returnQuantity: Math.min(quantity, item.originalQuantity) }
          : item
      )
    )
  }

  // Handle return reason change
  const handleReturnReasonChange = (itemId: number, reason: string) => {
    setReturnItems(prev => 
      prev.map(item => 
        item.itemId === itemId 
          ? { ...item, reason }
          : item
      )
    )
  }

  // Calculate return totals
  const returnTotal = returnItems.reduce((sum, item) => sum + (item.price * item.returnQuantity), 0)
  const returnItemsCount = returnItems.reduce((sum, item) => sum + item.returnQuantity, 0)

  // Process return
  const handleProcessReturn = () => {
    if (returnItems.length === 0) {
      toast.error("Please select items to return")
      return
    }

    if (!returnReason) {
      toast.error("Please select a return reason")
      return
    }

    setIsProcessing(true)

    // Simulate processing
    setTimeout(() => {
      const returnInvoiceId = `RET-${foundInvoice?.id}-${Date.now()}`
      toast.success(`Return processed! Return ID: ${returnInvoiceId}`)
      
      // In real app, you would:
      // 1. Create return invoice in database
      // 2. Update inventory stock
      // 3. Process refund
      // 4. Send confirmation
      
      onOpenChange(false)
      setIsProcessing(false)
    }, 2000)
  }

  const isItemSelected = (itemId: number) => {
    return returnItems.some(ri => ri.itemId === itemId)
  }

  const getSelectedItem = (itemId: number) => {
    return returnItems.find(ri => ri.itemId === itemId)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconArrowBack className="h-5 w-5" />
            Process Return
          </DialogTitle>
          <DialogDescription>
            Search for invoice and select items to return
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4">
          {/* Invoice Search - Only show in search mode */}
          {isSearchMode && !foundInvoice && (
            <div className="space-y-4">
              <div className="relative">
                <IconSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Enter invoice ID to search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-20"
                  onKeyPress={(e) => e.key === "Enter" && handleSearchInvoice()}
                />
                <Button 
                  onClick={handleSearchInvoice}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-2"
                  disabled={!searchQuery.trim()}
                >
                  Search
                </Button>
              </div>
            </div>
          )}

          {/* Invoice Details */}
          {foundInvoice && (
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">
                      {isSearchMode ? "Invoice" : "Editing Invoice"}: {foundInvoice.id}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Date: {new Date(foundInvoice.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">Original Total: ${foundInvoice.total.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">{foundInvoice.items} items</p>
                  </div>
                </div>
              </div>

              {/* Return Settings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Return Reason</Label>
                  <Select value={returnReason} onValueChange={setReturnReason}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="damaged">Damaged Product</SelectItem>
                      <SelectItem value="wrong_item">Wrong Item</SelectItem>
                      <SelectItem value="defective">Defective</SelectItem>
                      <SelectItem value="customer_change">Customer Change of Mind</SelectItem>
                      <SelectItem value="size_issue">Size/Size Issue</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Refund Method</Label>
                  <Select value={refundMethod} onValueChange={setRefundMethod}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash Refund</SelectItem>
                      <SelectItem value="store_credit">Store Credit</SelectItem>
                      <SelectItem value="exchange">Exchange</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Items Table */}
              <div className="border rounded-lg overflow-hidden">
                <div className="max-h-[300px] overflow-y-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-background z-10">
                      <TableRow>
                        <TableHead className="w-[50px]">Return</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-center">Original Qty</TableHead>
                        <TableHead className="text-center">Return Qty</TableHead>
                        <TableHead className="text-right">Return Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {invoiceItems.map((item) => {
                        const isSelected = isItemSelected(item.id)
                        const selectedItem = getSelectedItem(item.id)
                        
                        return (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={(checked) => handleItemSelection(item, checked as boolean)}
                              />
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">{item.name}</div>
                                <div className="text-sm text-muted-foreground">{item.sku}</div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                            <TableCell className="text-center">{item.quantity}</TableCell>
                            <TableCell className="text-center">
                              {isSelected && (
                                <Input
                                  type="number"
                                  min="1"
                                  max={item.quantity}
                                  value={selectedItem?.returnQuantity || 1}
                                  onChange={(e) => handleReturnQuantityChange(item.id, parseInt(e.target.value) || 1)}
                                  className="w-16 text-center"
                                />
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {isSelected && (
                                <span className="font-medium text-red-600">
                                  -${((selectedItem?.returnQuantity || 1) * item.price).toFixed(2)}
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Return Summary */}
              {returnItems.length > 0 && (
                <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-medium text-red-600">Return Summary:</span>
                      <span className="ml-2 text-sm text-muted-foreground">
                        {returnItemsCount} items selected
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-red-600">
                        -${returnTotal.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Refund Amount
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleProcessReturn}
            disabled={returnItems.length === 0 || !returnReason || isProcessing}
            className="min-w-[120px]"
          >
            {isProcessing ? (
              <>
                <IconCheck className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <IconArrowBack className="mr-2 h-4 w-4" />
                Process Return
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 