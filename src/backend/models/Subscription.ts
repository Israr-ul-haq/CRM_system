export interface Subscription {
  id: string
  name: string
  description: string
  price: number
  currency: string
  billingCycle: 'monthly' | 'yearly'
  yearlyDiscount: number // Percentage discount for yearly billing
  maxBranches: number
  dataStorageLimit: number // In GB
  features: string[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateSubscriptionForm {
  name: string
  description: string
  price: number
  currency: string
  billingCycle: 'monthly' | 'yearly'
  yearlyDiscount: number
  maxBranches: number
  dataStorageLimit: number
  features: string[]
}

export interface UpdateSubscriptionForm extends Partial<CreateSubscriptionForm> {
  isActive?: boolean
} 