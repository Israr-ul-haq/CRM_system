"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  IconCreditCard, 
  IconPlus, 
  IconEdit, 
  IconTrash,
  IconCheck,
  IconX,
  IconWorld,
  IconCurrency
} from "@tabler/icons-react"

interface PaymentMethod {
  id: string
  name: string
  description: string
  type: 'stripe' | 'paypal' | 'razorpay' | 'square' | 'custom'
  isActive: boolean
  config: {
    apiKey?: string
    secretKey?: string
    webhookUrl?: string
    supportedCurrencies: string[]
    supportedCountries: string[]
    processingFee?: number
    processingFeeType?: 'percentage' | 'fixed'
  }
}

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "1",
    name: "Stripe",
    description: "Popular payment processor with global reach",
    type: "stripe",
    isActive: true,
    config: {
      supportedCurrencies: ["USD", "EUR", "GBP", "CAD", "AUD"],
      supportedCountries: ["US", "CA", "GB", "AU", "DE", "FR"],
      processingFee: 2.9,
      processingFeeType: "percentage"
    }
  },
  {
    id: "2",
    name: "PayPal",
    description: "Trusted digital wallet and payment solution",
    type: "paypal",
    isActive: true,
    config: {
      supportedCurrencies: ["USD", "EUR", "GBP", "CAD", "AUD", "JPY"],
      supportedCountries: ["US", "CA", "GB", "AU", "DE", "FR", "JP"],
      processingFee: 2.9,
      processingFeeType: "percentage"
    }
  },
  {
    id: "3",
    name: "Razorpay",
    description: "Leading payment gateway for Indian businesses",
    type: "razorpay",
    isActive: false,
    config: {
      supportedCurrencies: ["INR", "USD"],
      supportedCountries: ["IN", "US"],
      processingFee: 2.0,
      processingFeeType: "percentage"
    }
  },
  {
    id: "4",
    name: "Square",
    description: "Point-of-sale and payment processing",
    type: "square",
    isActive: true,
    config: {
      supportedCurrencies: ["USD", "CAD", "AUD", "GBP"],
      supportedCountries: ["US", "CA", "AU", "GB"],
      processingFee: 2.6,
      processingFeeType: "percentage"
    }
  }
]

export function PaymentMethodManagement() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'stripe': return '💳'
      case 'paypal': return '🔵'
      case 'razorpay': return '🟡'
      case 'square': return '⬜'
      default: return '⚙️'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'stripe': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'paypal': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'razorpay': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'square': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const handleEditPaymentMethod = (paymentMethod: PaymentMethod) => {
    setSelectedPaymentMethod(paymentMethod)
    setIsEditModalOpen(true)
  }

  const handleDeletePaymentMethod = (paymentMethodId: string) => {
    if (confirm("Are you sure you want to delete this payment method? This action cannot be undone.")) {
      setPaymentMethods(prev => prev.filter(pm => pm.id !== paymentMethodId))
    }
  }

  const handleToggleActive = (paymentMethodId: string) => {
    setPaymentMethods(prev => prev.map(pm => 
      pm.id === paymentMethodId ? { ...pm, isActive: !pm.isActive } : pm
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Payment Method Management</h2>
          <p className="text-muted-foreground mt-1">
            Configure and manage your payment processing methods
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <IconPlus className="w-4 h-4" />
          Add Payment Method
        </Button>
      </div>

      {/* Payment Methods Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paymentMethods.map((paymentMethod) => (
          <Card key={paymentMethod.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{getTypeIcon(paymentMethod.type)}</span>
                    <CardTitle className="text-xl">{paymentMethod.name}</CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {paymentMethod.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={paymentMethod.isActive ? "default" : "secondary"}
                      className="capitalize"
                    >
                      {paymentMethod.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`capitalize ${getTypeColor(paymentMethod.type)}`}
                    >
                      {paymentMethod.type}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Processing Fees */}
              {paymentMethod.config.processingFee && (
                <div className="text-center py-3 border rounded-lg bg-muted/50">
                  <div className="text-lg font-semibold text-primary">
                    {paymentMethod.config.processingFee}
                    {paymentMethod.config.processingFeeType === 'percentage' ? '%' : '¢'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Processing Fee
                  </div>
                </div>
              )}

              {/* Supported Currencies */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <IconCurrency className="w-4 h-4" />
                  Supported Currencies:
                </h4>
                <div className="flex flex-wrap gap-1">
                  {paymentMethod.config.supportedCurrencies.map((currency, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {currency}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Supported Countries */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm flex items-center gap-2">
                  <IconWorld className="w-4 h-4" />
                  Supported Countries:
                </h4>
                <div className="flex flex-wrap gap-1">
                  {paymentMethod.config.supportedCountries.slice(0, 5).map((country, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {country}
                    </Badge>
                  ))}
                  {paymentMethod.config.supportedCountries.length > 5 && (
                    <div className="text-xs text-muted-foreground">
                      +{paymentMethod.config.supportedCountries.length - 5} more
                    </div>
                  )}
                </div>
              </div>

              {/* Configuration Status */}
              <div className="pt-2">
                <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  <p className="font-medium mb-2">Configuration:</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <IconCheck className="w-4 h-4 text-green-500" />
                      API Keys: {paymentMethod.config.apiKey ? 'Configured' : 'Not configured'}
                    </div>
                    <div className="flex items-center gap-2">
                      <IconCheck className="w-4 h-4 text-green-500" />
                      Webhooks: {paymentMethod.config.webhookUrl ? 'Configured' : 'Not configured'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditPaymentMethod(paymentMethod)}
                  className="flex-1"
                >
                  <IconEdit className="w-4 h-4 mr-2" />
                  Configure
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleActive(paymentMethod.id)}
                  className={paymentMethod.isActive ? "text-orange-600" : "text-green-600"}
                >
                  {paymentMethod.isActive ? (
                    <>
                      <IconX className="w-4 h-4 mr-2" />
                      Disable
                    </>
                  ) : (
                    <>
                      <IconCheck className="w-4 h-4 mr-2" />
                      Enable
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeletePaymentMethod(paymentMethod.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <IconTrash className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {paymentMethods.length === 0 && (
        <div className="text-center py-12">
          <IconCreditCard className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No payment methods</h3>
          <p className="text-muted-foreground mb-4">
            Get started by adding your first payment method
          </p>
          <Button>
            <IconPlus className="w-4 h-4 mr-2" />
            Add Payment Method
          </Button>
        </div>
      )}
    </div>
  )
} 