export interface PaymentMethod {
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
  createdAt: Date
  updatedAt: Date
}

export interface CreatePaymentMethodForm {
  name: string
  description: string
  type: 'stripe' | 'paypal' | 'razorpay' | 'square' | 'custom'
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

export interface UpdatePaymentMethodForm extends Partial<CreatePaymentMethodForm> {
  isActive?: boolean
} 