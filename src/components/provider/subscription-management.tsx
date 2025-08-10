"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  IconPackage, 
  IconPlus, 
  IconEdit, 
  IconTrash,
  IconCheck,
  IconX
} from "@tabler/icons-react"

interface Subscription {
  id: string
  name: string
  description: string
  price: number
  currency: string
  billingCycle: 'monthly' | 'yearly'
  yearlyDiscount: number
  maxBranches: number
  dataStorageLimit: number
  features: string[]
  isActive: boolean
}

const mockSubscriptions: Subscription[] = [
  {
    id: "1",
    name: "Starter Plan",
    description: "Perfect for small businesses getting started",
    price: 29,
    currency: "USD",
    billingCycle: "monthly",
    yearlyDiscount: 20,
    maxBranches: 2,
    dataStorageLimit: 10,
    features: ["Basic POS", "Inventory Management", "Basic Reporting", "Email Support"],
    isActive: true
  },
  {
    id: "2",
    name: "Professional Plan",
    description: "Ideal for growing businesses with multiple locations",
    price: 79,
    currency: "USD",
    billingCycle: "monthly",
    yearlyDiscount: 25,
    maxBranches: 10,
    dataStorageLimit: 50,
    features: ["Advanced POS", "Multi-location Management", "Advanced Analytics", "Priority Support", "API Access"],
    isActive: true
  },
  {
    id: "3",
    name: "Enterprise Plan",
    description: "For large businesses with complex requirements",
    price: 199,
    currency: "USD",
    billingCycle: "monthly",
    yearlyDiscount: 30,
    maxBranches: 100,
    dataStorageLimit: 500,
    features: ["Enterprise POS", "Unlimited Locations", "Custom Analytics", "Dedicated Support", "Custom Integrations", "White-label Options"],
    isActive: true
  }
]

export function SubscriptionManagement() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions)
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount)
  }

  const handleEditSubscription = (subscription: Subscription) => {
    setSelectedSubscription(subscription)
    setIsEditModalOpen(true)
  }

  const handleDeleteSubscription = (subscriptionId: string) => {
    if (confirm("Are you sure you want to delete this subscription plan? This action cannot be undone.")) {
      setSubscriptions(prev => prev.filter(s => s.id !== subscriptionId))
    }
  }

  const handleToggleActive = (subscriptionId: string) => {
    setSubscriptions(prev => prev.map(s => 
      s.id === subscriptionId ? { ...s, isActive: !s.isActive } : s
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Subscription Management</h2>
          <p className="text-muted-foreground mt-1">
            Manage your subscription plans and pricing
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <IconPlus className="w-4 h-4" />
          Create New Plan
        </Button>
      </div>

      {/* Subscription Plans Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {subscriptions.map((subscription) => (
          <Card key={subscription.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{subscription.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mb-3">
                    {subscription.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={subscription.isActive ? "default" : "secondary"}
                      className="capitalize"
                    >
                      {subscription.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {subscription.billingCycle}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Pricing */}
              <div className="text-center py-4 border rounded-lg bg-muted/50">
                <div className="text-3xl font-bold text-primary">
                  {formatCurrency(subscription.price, subscription.currency)}
                </div>
                <div className="text-sm text-muted-foreground">
                  per {subscription.billingCycle}
                </div>
                {subscription.billingCycle === 'yearly' && (
                  <div className="text-xs text-green-600 mt-1">
                    Save {subscription.yearlyDiscount}% with yearly billing
                  </div>
                )}
              </div>

              {/* Limits */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold">{subscription.maxBranches}</div>
                  <div className="text-xs text-muted-foreground">Max Branches</div>
                </div>
                <div>
                  <div className="text-lg font-semibold">{subscription.dataStorageLimit} GB</div>
                  <div className="text-xs text-muted-foreground">Storage</div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Features:</h4>
                <div className="space-y-1">
                  {subscription.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <IconCheck className="w-4 h-4 text-green-500" />
                      {feature}
                    </div>
                  ))}
                  {subscription.features.length > 3 && (
                    <div className="text-xs text-muted-foreground">
                      +{subscription.features.length - 3} more features
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditSubscription(subscription)}
                  className="flex-1"
                >
                  <IconEdit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleActive(subscription.id)}
                  className={subscription.isActive ? "text-orange-600" : "text-green-600"}
                >
                  {subscription.isActive ? (
                    <>
                      <IconX className="w-4 h-4 mr-2" />
                      Deactivate
                    </>
                  ) : (
                    <>
                      <IconCheck className="w-4 h-4 mr-2" />
                      Activate
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteSubscription(subscription.id)}
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
      {subscriptions.length === 0 && (
        <div className="text-center py-12">
          <IconPackage className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No subscription plans</h3>
          <p className="text-muted-foreground mb-4">
            Get started by creating your first subscription plan
          </p>
          <Button>
            <IconPlus className="w-4 h-4 mr-2" />
            Create First Plan
          </Button>
        </div>
      )}
    </div>
  )
} 