import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { PaymentMethod, CreatePaymentMethodForm, UpdatePaymentMethodForm } from '@/backend/models/PaymentMethod'

interface PaymentMethodState {
  paymentMethods: PaymentMethod[]
  loading: boolean
  error: string | null
  selectedPaymentMethod: PaymentMethod | null
}

const initialState: PaymentMethodState = {
  paymentMethods: [],
  loading: false,
  error: null,
  selectedPaymentMethod: null
}

// Mock data for development
const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    name: 'Stripe',
    description: 'Global payment processing platform',
    type: 'stripe',
    isActive: true,
    config: {
      apiKey: 'pk_test_...',
      secretKey: 'sk_test_...',
      webhookUrl: 'https://your-domain.com/webhooks/stripe',
      supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
      supportedCountries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR'],
      processingFee: 2.9,
      processingFeeType: 'percentage'
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'PayPal',
    description: 'Secure online payment solution',
    type: 'paypal',
    isActive: true,
    config: {
      apiKey: 'client_id_...',
      secretKey: 'client_secret_...',
      webhookUrl: 'https://your-domain.com/webhooks/paypal',
      supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY'],
      supportedCountries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'JP'],
      processingFee: 3.49,
      processingFeeType: 'percentage'
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '3',
    name: 'Razorpay',
    description: 'Indian payment gateway',
    type: 'razorpay',
    isActive: true,
    config: {
      apiKey: 'rzp_test_...',
      secretKey: 'secret_key_...',
      webhookUrl: 'https://your-domain.com/webhooks/razorpay',
      supportedCurrencies: ['INR', 'USD'],
      supportedCountries: ['IN', 'US'],
      processingFee: 2.0,
      processingFeeType: 'percentage'
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '4',
    name: 'Square',
    description: 'Point of sale and payment processing',
    type: 'square',
    isActive: true,
    config: {
      apiKey: 'sq0idp_...',
      secretKey: 'sq0csp_...',
      webhookUrl: 'https://your-domain.com/webhooks/square',
      supportedCurrencies: ['USD', 'CAD', 'GBP', 'AUD'],
      supportedCountries: ['US', 'CA', 'GB', 'AU'],
      processingFee: 2.6,
      processingFeeType: 'percentage'
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
]

// Async thunks
export const fetchPaymentMethods = createAsyncThunk(
  'paymentMethods/fetchPaymentMethods',
  async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    return mockPaymentMethods
  }
)

export const createPaymentMethod = createAsyncThunk(
  'paymentMethods/createPaymentMethod',
  async (paymentMethodData: CreatePaymentMethodForm) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    const newPaymentMethod: PaymentMethod = {
      id: Date.now().toString(),
      ...paymentMethodData,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    return newPaymentMethod
  }
)

export const updatePaymentMethod = createAsyncThunk(
  'paymentMethods/updatePaymentMethod',
  async ({ id, data }: { id: string; data: UpdatePaymentMethodForm }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { id, data }
  }
)

export const deletePaymentMethod = createAsyncThunk(
  'paymentMethods/deletePaymentMethod',
  async (id: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    return id
  }
)

const paymentMethodSlice = createSlice({
  name: 'paymentMethods',
  initialState,
  reducers: {
    setSelectedPaymentMethod: (state, action: PayloadAction<PaymentMethod | null>) => {
      state.selectedPaymentMethod = action.payload
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch payment methods
      .addCase(fetchPaymentMethods.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPaymentMethods.fulfilled, (state, action) => {
        state.loading = false
        state.paymentMethods = action.payload
      })
      .addCase(fetchPaymentMethods.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch payment methods'
      })
      // Create payment method
      .addCase(createPaymentMethod.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createPaymentMethod.fulfilled, (state, action) => {
        state.loading = false
        state.paymentMethods.push(action.payload)
      })
      .addCase(createPaymentMethod.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to create payment method'
      })
      // Update payment method
      .addCase(updatePaymentMethod.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updatePaymentMethod.fulfilled, (state, action) => {
        state.loading = false
        const index = state.paymentMethods.findIndex(pm => pm.id === action.payload.id)
        if (index !== -1) {
          state.paymentMethods[index] = { ...state.paymentMethods[index], ...action.payload.data, updatedAt: new Date() }
        }
      })
      .addCase(updatePaymentMethod.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to update payment method'
      })
      // Delete payment method
      .addCase(deletePaymentMethod.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deletePaymentMethod.fulfilled, (state, action) => {
        state.loading = false
        state.paymentMethods = state.paymentMethods.filter(pm => pm.id !== action.payload)
      })
      .addCase(deletePaymentMethod.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to delete payment method'
      })
  }
})

export const { setSelectedPaymentMethod, clearError } = paymentMethodSlice.actions
export default paymentMethodSlice.reducer 