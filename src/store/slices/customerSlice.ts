import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

// Types
export interface Customer {
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

export interface CreateCustomer {
  name: string
  email: string
  phone: string
  address: string
  creditLimit: number
}

export interface CustomerState {
  customers: Customer[]
  filteredCustomers: Customer[]
  isLoading: boolean
  error: string | null
  searchQuery: string
  selectedStatus: string
}

// Initial state
const initialState: CustomerState = {
  customers: [],
  filteredCustomers: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  selectedStatus: '',
}

// Mock data
const mockCustomers: Customer[] = [
  {
    id: 1,
    customerId: "CUST-001",
    name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, City, State 12345",
    creditLimit: 1000,
    creditUsed: 250,
    creditAvailable: 750,
    status: "active",
    joinDate: "2024-01-15",
    lastPurchase: "2024-12-18",
    totalPurchases: 15,
    totalSpent: 1250,
    outstandingBalance: 0
  },
  {
    id: 2,
    customerId: "CUST-002",
    name: "Jane Smith",
    email: "jane.smith@email.com",
    phone: "+1 (555) 987-6543",
    address: "456 Oak Ave, City, State 12345",
    creditLimit: 500,
    creditUsed: 500,
    creditAvailable: 0,
    status: "active",
    joinDate: "2024-02-20",
    lastPurchase: "2024-12-19",
    totalPurchases: 8,
    totalSpent: 800,
    outstandingBalance: 150
  },
  {
    id: 3,
    customerId: "CUST-003",
    name: "Mike Johnson",
    email: "mike.johnson@email.com",
    phone: "+1 (555) 456-7890",
    address: "789 Pine Rd, City, State 12345",
    creditLimit: 2000,
    creditUsed: 1200,
    creditAvailable: 800,
    status: "active",
    joinDate: "2024-03-10",
    lastPurchase: "2024-12-17",
    totalPurchases: 22,
    totalSpent: 3200,
    outstandingBalance: 0
  },
  {
    id: 4,
    customerId: "CUST-004",
    name: "Sarah Wilson",
    email: "sarah.wilson@email.com",
    phone: "+1 (555) 321-6540",
    address: "321 Elm St, City, State 12345",
    creditLimit: 750,
    creditUsed: 0,
    creditAvailable: 750,
    status: "active",
    joinDate: "2024-04-05",
    lastPurchase: "2024-12-15",
    totalPurchases: 5,
    totalSpent: 450,
    outstandingBalance: 0
  },
  {
    id: 5,
    customerId: "CUST-005",
    name: "David Brown",
    email: "david.brown@email.com",
    phone: "+1 (555) 654-3210",
    address: "654 Maple Dr, City, State 12345",
    creditLimit: 1500,
    creditUsed: 1500,
    creditAvailable: 0,
    status: "suspended",
    joinDate: "2024-01-30",
    lastPurchase: "2024-12-10",
    totalPurchases: 12,
    totalSpent: 1800,
    outstandingBalance: 300
  },
  {
    id: 6,
    customerId: "CUST-006",
    name: "Lisa Davis",
    email: "lisa.davis@email.com",
    phone: "+1 (555) 789-0123",
    address: "987 Cedar Ln, City, State 12345",
    creditLimit: 800,
    creditUsed: 400,
    creditAvailable: 400,
    status: "active",
    joinDate: "2024-02-15",
    lastPurchase: "2024-12-20",
    totalPurchases: 9,
    totalSpent: 950,
    outstandingBalance: 0
  },
  {
    id: 7,
    customerId: "CUST-007",
    name: "Robert Miller",
    email: "robert.miller@email.com",
    phone: "+1 (555) 012-3456",
    address: "147 Birch Way, City, State 12345",
    creditLimit: 3000,
    creditUsed: 2100,
    creditAvailable: 900,
    status: "active",
    joinDate: "2024-01-01",
    lastPurchase: "2024-12-19",
    totalPurchases: 28,
    totalSpent: 4200,
    outstandingBalance: 0
  },
  {
    id: 8,
    customerId: "CUST-008",
    name: "Emily Garcia",
    email: "emily.garcia@email.com",
    phone: "+1 (555) 234-5678",
    address: "258 Spruce Ct, City, State 12345",
    creditLimit: 600,
    creditUsed: 600,
    creditAvailable: 0,
    status: "inactive",
    joinDate: "2024-03-20",
    lastPurchase: "2024-12-05",
    totalPurchases: 6,
    totalSpent: 720,
    outstandingBalance: 120
  }
]

// Async thunks
export const fetchCustomers = createAsyncThunk(
  'customer/fetchCustomers',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      return mockCustomers
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch customers')
    }
  }
)

export const addCustomer = createAsyncThunk(
  'customer/addCustomer',
  async (customerData: CreateCustomer, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newCustomer: Customer = {
        id: Date.now(),
        customerId: `CUST-${String(Date.now()).slice(-3)}`,
        ...customerData,
        creditUsed: 0,
        creditAvailable: customerData.creditLimit,
        status: "active",
        joinDate: new Date().toISOString().split('T')[0],
        totalPurchases: 0,
        totalSpent: 0,
        outstandingBalance: 0
      }
      
      return newCustomer
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to add customer')
    }
  }
)

export const updateCustomer = createAsyncThunk(
  'customer/updateCustomer',
  async ({ id, customerData }: { id: number; customerData: Partial<Customer> }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return { id, customerData }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update customer')
    }
  }
)

export const deleteCustomer = createAsyncThunk(
  'customer/deleteCustomer',
  async (id: number, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return id
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete customer')
    }
  }
)

// Slice
const customerSlice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
      state.filteredCustomers = filterCustomers(state.customers, action.payload, state.selectedStatus)
    },
    setSelectedStatus: (state, action: PayloadAction<string>) => {
      state.selectedStatus = action.payload
      state.filteredCustomers = filterCustomers(state.customers, state.searchQuery, action.payload)
    },
    clearFilters: (state) => {
      state.searchQuery = ''
      state.selectedStatus = ''
      state.filteredCustomers = state.customers
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch customers
      .addCase(fetchCustomers.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.isLoading = false
        state.customers = action.payload
        state.filteredCustomers = action.payload
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Add customer
      .addCase(addCustomer.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.isLoading = false
        state.customers.push(action.payload)
        state.filteredCustomers = filterCustomers(state.customers, state.searchQuery, state.selectedStatus)
      })
      .addCase(addCustomer.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update customer
      .addCase(updateCustomer.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.customers.findIndex(customer => customer.id === action.payload.id)
        if (index !== -1) {
          state.customers[index] = { ...state.customers[index], ...action.payload.customerData }
        }
        state.filteredCustomers = filterCustomers(state.customers, state.searchQuery, state.selectedStatus)
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Delete customer
      .addCase(deleteCustomer.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.isLoading = false
        state.customers = state.customers.filter(customer => customer.id !== action.payload)
        state.filteredCustomers = filterCustomers(state.customers, state.searchQuery, state.selectedStatus)
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

// Helper function to filter customers
const filterCustomers = (customers: Customer[], searchQuery: string, status: string) => {
  return customers.filter(customer => {
    const matchesSearch = !searchQuery || 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.customerId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !status || customer.status === status
    
    return matchesSearch && matchesStatus
  })
}

export const { 
  clearError, 
  setSearchQuery, 
  setSelectedStatus, 
  clearFilters 
} = customerSlice.actions

export default customerSlice.reducer 