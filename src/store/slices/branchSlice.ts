import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

// Types
export interface Branch {
  id: string
  name: string
  location: string
  address: string
  phone: string
  email: string
  manager: string
  managerEmail: string
  managerPhone: string
  status: 'active' | 'inactive' | 'maintenance'
  totalStaff: number
  activeStaff: number
  totalInventory: number
  lowStockItems: number
  monthlyRevenue: number
  monthlyExpenses: number
  monthlySales: number
  monthlyOrders: number
  customerCount: number
  supplierCount: number
  createdAt: string
  lastActivity: string
}

export interface CreateBranchForm {
  name: string
  location: string
  address: string
  phone: string
  email: string
  manager: string
  managerEmail: string
  managerPhone: string
  status: 'active' | 'inactive' | 'maintenance'
}

export interface BranchState {
  branches: Branch[]
  currentBranch: Branch | null
  isLoading: boolean
  error: string | null
}

// Initial state
const initialState: BranchState = {
  branches: [],
  currentBranch: null,
  isLoading: false,
  error: null,
}

// Mock data
const mockBranches: Branch[] = [
  {
    id: "1",
    name: "Main Branch - Downtown",
    location: "Downtown",
    address: "123 Main Street, Downtown, City, State 12345",
    phone: "+1 (555) 987-6543",
    email: "downtown@company.com",
    manager: "John Smith",
    managerEmail: "john.smith@company.com",
    managerPhone: "+1 (555) 123-4567",
    status: 'active',
    totalStaff: 25,
    activeStaff: 23,
    totalInventory: 1500,
    lowStockItems: 45,
    monthlyRevenue: 45000,
    monthlyExpenses: 28000,
    monthlySales: 42000,
    monthlyOrders: 156,
    customerCount: 89,
    supplierCount: 12,
    createdAt: "2024-01-15",
    lastActivity: "2024-12-19T10:30:00Z"
  },
  {
    id: "2",
    name: "North Branch",
    location: "North District",
    address: "456 North Ave, North District, City, State 12345",
    phone: "+1 (555) 987-6544",
    email: "north@company.com",
    manager: "Sarah Johnson",
    managerEmail: "sarah.johnson@company.com",
    managerPhone: "+1 (555) 123-4568",
    status: 'active',
    totalStaff: 18,
    activeStaff: 17,
    totalInventory: 1200,
    lowStockItems: 32,
    monthlyRevenue: 32000,
    monthlyExpenses: 21000,
    monthlySales: 30000,
    monthlyOrders: 98,
    customerCount: 67,
    supplierCount: 8,
    createdAt: "2024-03-20",
    lastActivity: "2024-12-19T09:15:00Z"
  },
  {
    id: "3",
    name: "South Branch",
    location: "South District",
    address: "789 South Blvd, South District, City, State 12345",
    phone: "+1 (555) 987-6545",
    email: "south@company.com",
    manager: "Mike Wilson",
    managerEmail: "mike.wilson@company.com",
    managerPhone: "+1 (555) 123-4569",
    status: 'active',
    totalStaff: 15,
    activeStaff: 14,
    totalInventory: 900,
    lowStockItems: 28,
    monthlyRevenue: 28000,
    monthlyExpenses: 18000,
    monthlySales: 26000,
    monthlyOrders: 75,
    customerCount: 52,
    supplierCount: 6,
    createdAt: "2024-05-10",
    lastActivity: "2024-12-19T08:45:00Z"
  },
  {
    id: "4",
    name: "East Branch",
    location: "East District",
    address: "321 East St, East District, City, State 12345",
    phone: "+1 (555) 987-6546",
    email: "east@company.com",
    manager: "Lisa Davis",
    managerEmail: "lisa.davis@company.com",
    managerPhone: "+1 (555) 123-4570",
    status: 'maintenance',
    totalStaff: 12,
    activeStaff: 8,
    totalInventory: 600,
    lowStockItems: 15,
    monthlyRevenue: 18000,
    monthlyExpenses: 12000,
    monthlySales: 16000,
    monthlyOrders: 45,
    customerCount: 38,
    supplierCount: 4,
    createdAt: "2024-06-15",
    lastActivity: "2024-12-18T16:20:00Z"
  }
]

// Async thunks
export const fetchBranches = createAsyncThunk(
  'branch/fetchBranches',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      return mockBranches
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch branches')
    }
  }
)

export const fetchBranchById = createAsyncThunk(
  'branch/fetchBranchById',
  async (branchId: string, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      const branch = mockBranches.find(b => b.id === branchId)
      if (!branch) {
        throw new Error('Branch not found')
      }
      return branch
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch branch')
    }
  }
)

export const createBranch = createAsyncThunk(
  'branch/createBranch',
  async (branchData: CreateBranchForm, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newBranch: Branch = {
        id: Date.now().toString(),
        ...branchData,
        totalStaff: 0,
        activeStaff: 0,
        totalInventory: 0,
        lowStockItems: 0,
        monthlyRevenue: 0,
        monthlyExpenses: 0,
        monthlySales: 0,
        monthlyOrders: 0,
        customerCount: 0,
        supplierCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        lastActivity: new Date().toISOString()
      }
      
      return newBranch
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create branch')
    }
  }
)

export const updateBranch = createAsyncThunk(
  'branch/updateBranch',
  async ({ branchId, branchData }: { branchId: string; branchData: Partial<Branch> }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return { branchId, branchData }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update branch')
    }
  }
)

export const deleteBranch = createAsyncThunk(
  'branch/deleteBranch',
  async (branchId: string, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return branchId
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete branch')
    }
  }
)

// Slice
const branchSlice = createSlice({
  name: 'branch',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCurrentBranch: (state, action: PayloadAction<Branch | null>) => {
      state.currentBranch = action.payload
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch branches
      .addCase(fetchBranches.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchBranches.fulfilled, (state, action) => {
        state.isLoading = false
        state.branches = action.payload
      })
      .addCase(fetchBranches.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Fetch branch by ID
      .addCase(fetchBranchById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchBranchById.fulfilled, (state, action) => {
        state.isLoading = false
        state.currentBranch = action.payload
      })
      .addCase(fetchBranchById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Create branch
      .addCase(createBranch.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createBranch.fulfilled, (state, action) => {
        state.isLoading = false
        state.branches.push(action.payload)
      })
      .addCase(createBranch.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update branch
      .addCase(updateBranch.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateBranch.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.branches.findIndex(b => b.id === action.payload.branchId)
        if (index !== -1) {
          state.branches[index] = { ...state.branches[index], ...action.payload.branchData }
        }
        if (state.currentBranch?.id === action.payload.branchId) {
          state.currentBranch = { ...state.currentBranch, ...action.payload.branchData }
        }
      })
      .addCase(updateBranch.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Delete branch
      .addCase(deleteBranch.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteBranch.fulfilled, (state, action) => {
        state.isLoading = false
        state.branches = state.branches.filter(b => b.id !== action.payload)
        if (state.currentBranch?.id === action.payload) {
          state.currentBranch = null
        }
      })
      .addCase(deleteBranch.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, setCurrentBranch } = branchSlice.actions
export default branchSlice.reducer 