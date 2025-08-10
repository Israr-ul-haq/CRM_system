"use client"

import { useState, useRef, useEffect } from "react"
import { toast } from "sonner"
import { BillingSearch } from "@/components/billing-search"
import { BillingTable } from "@/components/billing-table"
import { InventoryModal } from "@/components/inventory-modal"
import { EnhancedPaymentModal } from "@/components/enhanced-payment-modal"
import { InvoiceHistoryModal } from "@/components/invoice-history-modal"
import { ReturnModal } from "@/components/return-modal"

import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { IconCalculator, IconReceipt, IconHistory, IconPlus } from "@tabler/icons-react"
import inventoryData from "@/app/inventory/data.json"
import { AuthGuard } from "@/components/auth-guard"

// Sample barcode data - in real app this would come from your inventory
const sampleBarcodes = [
  { barcode: "1234567890123", productId: 1 },
  { barcode: "1234567890124", productId: 2 },
  { barcode: "1234567890125", productId: 3 },
  { barcode: "1234567890126", productId: 4 },
  { barcode: "1234567890127", productId: 5 },
  { barcode: "1234567890128", productId: 6 },
  { barcode: "1234567890129", productId: 7 },
  { barcode: "1234567890130", productId: 8 },
]

interface CartItem {
  id: number
  name: string
  sku: string
  price: number
  quantity: number
  total: number
}

interface Customer {
  id: number
  customerId: string
  name: string
  email: string
  phone: string
  address: string
  creditLimit: number
  creditUsed: number
  creditAvailable: number
  status: "active" | "inactive" | "suspended"
  joinDate: string
  lastPurchase?: string
  totalPurchases: number
  totalSpent: number
  outstandingBalance: number
}

export default function BillingPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [discount, setDiscount] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false)
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [isInvoiceHistoryModalOpen, setIsInvoiceHistoryModalOpen] = useState(false)
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false)
  const [selectedInvoiceForReturn, setSelectedInvoiceForReturn] = useState<string>("")
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.total, 0)
  const discountAmount = (subtotal * discount) / 100
  const total = subtotal - discountAmount

  // Handle barcode scanning and manual search
  const handleSearch = (query: string) => {
    // Only process search when Enter is pressed
    if (!query.trim()) return
    
    // Simulate barcode scanning (if query looks like a barcode)
    if (query.length >= 10 && /^\d+$/.test(query)) {
      const barcodeEntry = sampleBarcodes.find(b => b.barcode === query)
      if (barcodeEntry) {
        // Find product in inventory data
        const product = inventoryData.find((p: { id: number }) => p.id === barcodeEntry.productId)
        if (product) {
          addToCart(product)
          setSearchQuery("")
          toast.success(`Scanned: ${product.name}`)
          // Auto focus back to search input
          setTimeout(() => searchInputRef.current?.focus(), 100)
          return
        }
      }
    }
    
    // Manual search
    const product = inventoryData.find((p: { name: string; sku: string }) => 
      p.name.toLowerCase().includes(query.toLowerCase()) || 
      p.sku.toLowerCase().includes(query.toLowerCase())
    )
    
    if (product) {
      addToCart(product)
      setSearchQuery("")
      toast.success(`Added: ${product.name}`)
      // Auto focus back to search input
      setTimeout(() => searchInputRef.current?.focus(), 100)
    } else {
      // If product not found, open inventory modal to let user browse
      setIsInventoryModalOpen(true)
      toast.info("Product not found. Opening inventory to browse available items.")
    }
  }

  const addToCart = (product: { id: number; name: string; sku: string; price: number }) => {
    const existingItem = cartItems.find(item => item.id === product.id)
    
    if (existingItem) {
      setCartItems(prev => prev.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1, total: (item.quantity + 1) * item.price }
          : item
      ))
    } else {
      setCartItems(prev => [...prev, {
        ...product,
        quantity: 1,
        total: product.price
      }])
    }
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    
    setCartItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, quantity, total: quantity * item.price }
        : item
    ))
  }

  const removeFromCart = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id))
  }

  // Focus search input on mount
  useEffect(() => {
    searchInputRef.current?.focus()
  }, [])

  // Handle F3 (Reset Cart) and F6 (Payment) keys globally
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "F3") {
        e.preventDefault()
        e.stopPropagation()
        handleResetCart()
      } else if (e.key === "F6") {
        e.preventDefault()
        e.stopPropagation()
        if (cartItems.length > 0) {
          setIsPaymentModalOpen(true)
        } else {
          toast.error("Cart is empty. Add items before proceeding to payment.")
        }
      }
    }

    // Use both keydown and keyup to ensure keys are captured
    document.addEventListener("keydown", handleKeyPress, true)
    document.addEventListener("keyup", handleKeyPress, true)
    
    return () => {
      document.removeEventListener("keydown", handleKeyPress, true)
      document.removeEventListener("keyup", handleKeyPress, true)
    }
  }, [cartItems.length])

  // Handle product selection from inventory modal
  const handleSelectProduct = (product: { id: number; name: string; sku: string; price: number }) => {
    addToCart(product)
    toast.success(`Added: ${product.name}`)
  }

  // Handle payment completion
  const handleCompletePayment = (paymentData: { 
    method: "cash" | "staff_credit" | "customer_credit", 
    staffId?: number, 
    customerId?: number 
  }) => {
    // Here you would typically save the invoice to your database
    console.log("Completing payment for:", { 
      cartItems, 
      total, 
      discount, 
      paymentMethod: paymentData.method,
      staffId: paymentData.staffId,
      customerId: paymentData.customerId
    })
    
    // Simulate API call
    setTimeout(() => {
      if (paymentData.method === "staff_credit") {
        toast.success(`Staff credit payment processed for staff ID: ${paymentData.staffId}`)
      } else if (paymentData.method === "customer_credit") {
        toast.success(`Customer credit payment processed for customer ID: ${paymentData.customerId}`)
      } else {
        toast.success("Cash payment completed successfully!")
      }
      setCartItems([])
      setDiscount(0)
      setSearchQuery("")
    }, 1000)
  }

  // Handle return invoice
  const handleReturnInvoice = (invoiceId: string) => {
    setSelectedInvoiceForReturn(invoiceId)
    setIsReturnModalOpen(true)
    setIsInvoiceHistoryModalOpen(false)
  }

  // Handle reset cart
  const handleResetCart = () => {
    if (cartItems.length === 0) {
      toast.error("Cart is already empty")
      return
    }
    
    setCartItems([])
    setDiscount(0)
    setSearchQuery("")
    toast.success("Cart cleared successfully!")
  }

  return (
    <AuthGuard>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="px-4 lg:px-6">
                  <div className="flex flex-col gap-4">
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight">Billing & POS</h1>
                      <p className="text-muted-foreground">
                        Process sales and manage customer transactions
                      </p>
                    </div>
                    
                    {/* Search and Add Item Section */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <BillingSearch
                        value={searchQuery}
                        onChange={setSearchQuery}
                        onSearch={handleSearch}
                        ref={searchInputRef}
                      />
                      <Button onClick={() => setIsInventoryModalOpen(true)} className="sm:w-auto">
                        <IconPlus className="mr-2 h-4 w-4" />
                        Add Item
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Cart Section */}
                <div className="px-4 lg:px-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Cart Table - Takes 2/3 of the width */}
                    <div className="lg:col-span-2">
                      <BillingTable
                        items={cartItems}
                        onUpdateQuantity={updateQuantity}
                        onRemoveItem={removeFromCart}
                        onResetCart={handleResetCart}
                      />
                    </div>
                    
                    {/* Order Summary - Takes 1/3 of the width on the right side */}
                    <div className="lg:col-span-1">
                      <Card className="sticky top-4">
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <span>Order Summary</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setIsInvoiceHistoryModalOpen(true)}
                            >
                              <IconHistory className="mr-2 h-4 w-4" />
                              History
                            </Button>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {/* Cart Items Count */}
                            <div className="text-sm text-muted-foreground">
                              Items: {cartItems.length}
                            </div>
                            
                            {/* Subtotal */}
                            <div className="flex justify-between items-center">
                              <span>Subtotal:</span>
                              <span>${subtotal.toFixed(2)}</span>
                            </div>
                            
                            {/* Discount Section */}
                            <div className="space-y-2">
                              <Label htmlFor="discount" className="text-sm">Discount:</Label>
                              <div className="flex items-center gap-2">
                                <Input
                                  id="discount"
                                  type="number"
                                  placeholder="0.00"
                                  value={discount}
                                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                                  className="flex-1"
                                  min="0"
                                  step="0.01"
                                />
                                <span className="text-muted-foreground text-sm">%</span>
                              </div>
                              {discount > 0 && (
                                <div className="text-sm text-muted-foreground">
                                  Discount Amount: -${discountAmount.toFixed(2)}
                                </div>
                              )}
                            </div>
                            
                            <Separator />
                            
                            {/* Total Section */}
                            <div className="flex justify-between items-center text-lg font-semibold">
                              <span>Total:</span>
                              <span className="text-2xl">${total.toFixed(2)}</span>
                            </div>
                            
                            {/* Payment Button */}
                            <Button
                              onClick={() => setIsPaymentModalOpen(true)}
                              size="lg"
                              className="w-full"
                              disabled={cartItems.length === 0}
                            >
                              <IconReceipt className="mr-2 h-4 w-4" />
                              Proceed to Payment (F6)
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>

      {/* Modals */}
      <InventoryModal
        open={isInventoryModalOpen}
        onOpenChange={setIsInventoryModalOpen}
        onSelectProduct={handleSelectProduct}
      />

      <EnhancedPaymentModal
        open={isPaymentModalOpen}
        onOpenChange={setIsPaymentModalOpen}
        total={total}
        discount={discount}
        onCompletePayment={handleCompletePayment}
      />

      <InvoiceHistoryModal
        open={isInvoiceHistoryModalOpen}
        onOpenChange={setIsInvoiceHistoryModalOpen}
        onReturnInvoice={handleReturnInvoice}
      />

      <ReturnModal
        open={isReturnModalOpen}
        onOpenChange={setIsReturnModalOpen}
        invoiceId={selectedInvoiceForReturn}
      />
    </AuthGuard>
  )
} 