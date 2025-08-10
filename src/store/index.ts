import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import authReducer from './slices/authSlice'
import branchReducer from './slices/branchSlice'
import inventoryReducer from './slices/inventorySlice'
import customerReducer from './slices/customerSlice'
import supplierReducer from './slices/supplierSlice'
import staffReducer from './slices/staffSlice'
import salesReducer from './slices/salesSlice'
import purchaseReducer from './slices/purchaseSlice'
import billingReducer from './slices/billingSlice'
import subscriptionReducer from './slices/subscriptionSlice'
import paymentMethodReducer from './slices/paymentMethodSlice'
import companyReducer from './slices/companySlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    branch: branchReducer,
    inventory: inventoryReducer,
    customer: customerReducer,
    supplier: supplierReducer,
    staff: staffReducer,
    sales: salesReducer,
    purchase: purchaseReducer,
    billing: billingReducer,
    subscription: subscriptionReducer,
    paymentMethod: paymentMethodReducer,
    company: companyReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector 