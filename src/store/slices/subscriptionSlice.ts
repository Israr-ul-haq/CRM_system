import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Subscription, CreateSubscriptionForm, UpdateSubscriptionForm } from '@/backend/models/Subscription'

interface SubscriptionState {
  subscriptions: Subscription[]
  loading: boolean
  error: string | null
  selectedSubscription: Subscription | null
}

const initialState: SubscriptionState = {
  subscriptions: [],
  loading: false,
  error: null,
  selectedSubscription: null
}

// Mock data for development
const mockSubscriptions: Subscription[] = [
  {
    id: '1',
    name: 'Starter Plan',
    description: 'Perfect for small businesses just getting started',
    price: 29.99,
    currency: 'USD',
    billingCycle: 'monthly',
    yearlyDiscount: 20,
    maxBranches: 2,
    dataStorageLimit: 10,
    features: ['Basic POS', 'Inventory Management', 'Basic Reports', 'Email Support'],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Professional Plan',
    description: 'Ideal for growing businesses with multiple locations',
    price: 79.99,
    currency: 'USD',
    billingCycle: 'monthly',
    yearlyDiscount: 25,
    maxBranches: 10,
    dataStorageLimit: 100,
    features: ['Advanced POS', 'Multi-branch Management', 'Advanced Analytics', 'Priority Support', 'API Access'],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '3',
    name: 'Enterprise Plan',
    description: 'For large enterprises with complex requirements',
    price: 199.99,
    currency: 'USD',
    billingCycle: 'monthly',
    yearlyDiscount: 30,
    maxBranches: 50,
    dataStorageLimit: 500,
    features: ['Enterprise POS', 'Unlimited Branches', 'Custom Analytics', '24/7 Support', 'Custom Integrations', 'White-label Options'],
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
]

// Async thunks
export const fetchSubscriptions = createAsyncThunk(
  'subscriptions/fetchSubscriptions',
  async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    return mockSubscriptions
  }
)

export const createSubscription = createAsyncThunk(
  'subscriptions/createSubscription',
  async (subscriptionData: CreateSubscriptionForm) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    const newSubscription: Subscription = {
      id: Date.now().toString(),
      ...subscriptionData,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    return newSubscription
  }
)

export const updateSubscription = createAsyncThunk(
  'subscriptions/updateSubscription',
  async ({ id, data }: { id: string; data: UpdateSubscriptionForm }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { id, data }
  }
)

export const deleteSubscription = createAsyncThunk(
  'subscriptions/deleteSubscription',
  async (id: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    return id
  }
)

const subscriptionSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {
    setSelectedSubscription: (state, action: PayloadAction<Subscription | null>) => {
      state.selectedSubscription = action.payload
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch subscriptions
      .addCase(fetchSubscriptions.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSubscriptions.fulfilled, (state, action) => {
        state.loading = false
        state.subscriptions = action.payload
      })
      .addCase(fetchSubscriptions.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch subscriptions'
      })
      // Create subscription
      .addCase(createSubscription.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createSubscription.fulfilled, (state, action) => {
        state.loading = false
        state.subscriptions.push(action.payload)
      })
      .addCase(createSubscription.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to create subscription'
      })
      // Update subscription
      .addCase(updateSubscription.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateSubscription.fulfilled, (state, action) => {
        state.loading = false
        const index = state.subscriptions.findIndex(s => s.id === action.payload.id)
        if (index !== -1) {
          state.subscriptions[index] = { ...state.subscriptions[index], ...action.payload.data, updatedAt: new Date() }
        }
      })
      .addCase(updateSubscription.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to update subscription'
      })
      // Delete subscription
      .addCase(deleteSubscription.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteSubscription.fulfilled, (state, action) => {
        state.loading = false
        state.subscriptions = state.subscriptions.filter(s => s.id !== action.payload)
      })
      .addCase(deleteSubscription.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to delete subscription'
      })
  }
})

export const { setSelectedSubscription, clearError } = subscriptionSlice.actions
export default subscriptionSlice.reducer 