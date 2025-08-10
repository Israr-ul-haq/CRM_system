import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

export interface BillingItem {
  id: number
  customerId: string
  customerName: string
  amount: number
  dueDate: string
  status: "paid" | "pending" | "overdue"
  description: string
  branchId: string
}

export interface BillingState {
  bills: BillingItem[]
  filteredBills: BillingItem[]
  isLoading: boolean
  error: string | null
  searchQuery: string
  selectedStatus: string
}

const initialState: BillingState = {
  bills: [],
  filteredBills: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  selectedStatus: '',
}

const mockBills: BillingItem[] = [
  {
    id: 1,
    customerId: "CUST-001",
    customerName: "John Doe",
    amount: 150.00,
    dueDate: "2024-12-25",
    status: "pending",
    description: "December services",
    branchId: "1"
  },
  {
    id: 2,
    customerId: "CUST-002",
    customerName: "Jane Smith",
    amount: 275.50,
    dueDate: "2024-12-20",
    status: "overdue",
    description: "November services",
    branchId: "1"
  },
  {
    id: 3,
    customerId: "CUST-003",
    customerName: "Mike Johnson",
    amount: 89.99,
    dueDate: "2024-12-30",
    status: "paid",
    description: "December services",
    branchId: "2"
  },
  {
    id: 4,
    customerId: "CUST-004",
    customerName: "Sarah Wilson",
    amount: 320.00,
    dueDate: "2024-12-22",
    status: "pending",
    description: "December services",
    branchId: "1"
  },
  {
    id: 5,
    customerId: "CUST-005",
    customerName: "David Brown",
    amount: 145.75,
    dueDate: "2024-12-18",
    status: "overdue",
    description: "November services",
    branchId: "2"
  },
  {
    id: 6,
    customerId: "CUST-006",
    customerName: "Lisa Davis",
    amount: 199.99,
    dueDate: "2024-12-28",
    status: "pending",
    description: "December services",
    branchId: "1"
  },
  {
    id: 7,
    customerId: "CUST-007",
    customerName: "Robert Miller",
    amount: 450.00,
    dueDate: "2024-12-15",
    status: "overdue",
    description: "November services",
    branchId: "2"
  },
  {
    id: 8,
    customerId: "CUST-008",
    customerName: "Emily Garcia",
    amount: 75.50,
    dueDate: "2024-12-31",
    status: "pending",
    description: "December services",
    branchId: "1"
  }
]

export const fetchBills = createAsyncThunk(
  'billing/fetchBills',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return mockBills
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch bills')
    }
  }
)

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
      state.filteredBills = state.bills.filter(b => 
        b.customerName.toLowerCase().includes(action.payload.toLowerCase()) ||
        b.customerId.toLowerCase().includes(action.payload.toLowerCase())
      )
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBills.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchBills.fulfilled, (state, action) => {
        state.isLoading = false
        state.bills = action.payload
        state.filteredBills = action.payload
      })
      .addCase(fetchBills.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, setSearchQuery } = billingSlice.actions
export default billingSlice.reducer 