"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { IconX, IconPlus } from "@tabler/icons-react"
import { toast } from "sonner"

interface PaymentMethod {
  id: string
  name: string
  description: string
  type: string
  status: string
  processingFee: number
  transactionFee: number
  supportedCurrencies: string[]
  totalTransactions: number
  monthlyVolume: number
  createdAt: string
}

interface CreatePaymentMethodModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onPaymentMethodCreated: (paymentMethod: PaymentMethod) => void
}

export function CreatePaymentMethodModal({
  open,
  onOpenChange,
  onPaymentMethodCreated
}: CreatePaymentMethodModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "card",
    status: "draft",
    processingFee: "",
    transactionFee: ""
  })
  const [supportedCurrencies, setSupportedCurrencies] = useState<string[]>(["USD"])
  const [newCurrency, setNewCurrency] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addCurrency = () => {
    if (newCurrency.trim() && !supportedCurrencies.includes(newCurrency.trim().toUpperCase())) {
      setSupportedCurrencies([...supportedCurrencies, newCurrency.trim().toUpperCase()])
      setNewCurrency("")
    }
  }

  const removeCurrency = (currencyToRemove: string) => {
    setSupportedCurrencies(supportedCurrencies.filter(currency => currency !== currencyToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const newPaymentMethod: PaymentMethod = {
        id: "",
        name: formData.name,
        description: formData.description,
        type: formData.type,
        status: formData.status,
        processingFee: parseFloat(formData.processingFee) || 0,
        transactionFee: parseFloat(formData.transactionFee) || 0,
        supportedCurrencies: supportedCurrencies,
        totalTransactions: 0,
        monthlyVolume: 0,
        createdAt: new Date().toISOString().split('T')[0]
      }

      onPaymentMethodCreated(newPaymentMethod)
      toast.success("Payment method created successfully!")
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        type: "card",
        status: "draft",
        processingFee: "",
        transactionFee: ""
      })
      setSupportedCurrencies(["USD"])
      setNewCurrency("")
    } catch (error) {
      toast.error("Failed to create payment method")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Payment Method</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Method Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., Credit Card"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Payment Type *</Label>
                <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="card">Credit/Debit Card</SelectItem>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="digital">Digital Wallet</SelectItem>
                    <SelectItem value="crypto">Cryptocurrency</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe this payment method..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Fee Structure */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Fee Structure</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="processingFee">Processing Fee (%)</Label>
                <Input
                  id="processingFee"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={formData.processingFee}
                  onChange={(e) => handleInputChange("processingFee", e.target.value)}
                  placeholder="2.9"
                />
                <p className="text-xs text-muted-foreground">
                  Percentage fee charged per transaction
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="transactionFee">Transaction Fee ($)</Label>
                <Input
                  id="transactionFee"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.transactionFee}
                  onChange={(e) => handleInputChange("transactionFee", e.target.value)}
                  placeholder="0.30"
                />
                <p className="text-xs text-muted-foreground">
                  Fixed fee charged per transaction
                </p>
              </div>
            </div>
          </div>

          {/* Supported Currencies */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Supported Currencies</h3>
            
            <div className="space-y-2">
              <Label>Currencies</Label>
              <div className="flex gap-2">
                <Input
                  value={newCurrency}
                  onChange={(e) => setNewCurrency(e.target.value)}
                  placeholder="Add currency code (e.g., EUR)"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCurrency())}
                />
                <Button type="button" onClick={addCurrency} variant="outline" size="sm">
                  <IconPlus className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Enter 3-letter currency codes (e.g., USD, EUR, GBP)
              </p>
            </div>

            {supportedCurrencies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {supportedCurrencies.map((currency, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    {currency}
                    {currency !== "USD" && (
                      <button
                        type="button"
                        onClick={() => removeCurrency(currency)}
                        className="ml-1 hover:text-destructive"
                      >
                        <IconX className="w-3 h-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Payment Method"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 