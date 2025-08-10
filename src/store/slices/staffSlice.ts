import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

export interface StaffMember {
  id: number
  staffId: string
  name: string
  email: string
  phone: string
  role: string
  branchId: string
  status: "active" | "inactive"
  joinDate: string
  permissions: string[]
  salary: number
  advance: number
}

export interface StaffState {
  staff: StaffMember[]
  filteredStaff: StaffMember[]
  isLoading: boolean
  error: string | null
  searchQuery: string
  selectedRole: string
}

const initialState: StaffState = {
  staff: [],
  filteredStaff: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  selectedRole: '',
}

const mockStaff: StaffMember[] = [
  {
    id: 1,
    staffId: "STAFF-001",
    name: "Jane Manager",
    email: "jane@company.com",
    phone: "+1 (555) 222-2222",
    role: "Manager",
    branchId: "1",
    status: "active",
    joinDate: "2024-01-01",
    permissions: ["inventory", "sales", "customers", "staff", "reports"],
    salary: 65000,
    advance: 2000
  },
  {
    id: 2,
    staffId: "STAFF-002",
    name: "John Cashier",
    email: "john@company.com",
    phone: "+1 (555) 333-3333",
    role: "Cashier",
    branchId: "1",
    status: "active",
    joinDate: "2024-02-15",
    permissions: ["sales", "customers"],
    salary: 42000,
    advance: 1500
  },
  {
    id: 3,
    staffId: "STAFF-003",
    name: "Mike Inventory",
    email: "mike@company.com",
    phone: "+1 (555) 444-4444",
    role: "Inventory Specialist",
    branchId: "1",
    status: "active",
    joinDate: "2024-03-01",
    permissions: ["inventory", "suppliers"],
    salary: 48000,
    advance: 1000
  },
  {
    id: 4,
    staffId: "STAFF-004",
    name: "Sarah Sales",
    email: "sarah@company.com",
    phone: "+1 (555) 555-5555",
    role: "Sales Representative",
    branchId: "2",
    status: "active",
    joinDate: "2024-01-20",
    permissions: ["sales", "customers", "reports"],
    salary: 52000,
    advance: 1800
  },
  {
    id: 5,
    staffId: "STAFF-005",
    name: "David Supervisor",
    email: "david@company.com",
    phone: "+1 (555) 666-6666",
    role: "Supervisor",
    branchId: "2",
    status: "active",
    joinDate: "2024-02-01",
    permissions: ["inventory", "sales", "customers", "staff"],
    salary: 58000,
    advance: 2500
  },
  {
    id: 6,
    staffId: "STAFF-006",
    name: "Lisa Admin",
    email: "lisa@company.com",
    phone: "+1 (555) 777-7777",
    role: "Administrator",
    branchId: "1",
    status: "active",
    joinDate: "2024-01-10",
    permissions: ["inventory", "sales", "customers", "staff", "reports", "system"],
    salary: 72000,
    advance: 3000
  },
  {
    id: 7,
    staffId: "STAFF-007",
    name: "Robert Helper",
    email: "robert@company.com",
    phone: "+1 (555) 888-8888",
    role: "Helper",
    branchId: "1",
    status: "inactive",
    joinDate: "2024-04-01",
    permissions: ["inventory"],
    salary: 38000,
    advance: 800
  },
  {
    id: 8,
    staffId: "STAFF-008",
    name: "Emily Trainee",
    email: "emily@company.com",
    phone: "+1 (555) 999-9999",
    role: "Trainee",
    branchId: "2",
    status: "active",
    joinDate: "2024-05-01",
    permissions: ["sales"],
    salary: 35000,
    advance: 500
  }
]

export const fetchStaff = createAsyncThunk(
  'staff/fetchStaff',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return mockStaff
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch staff')
    }
  }
)

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
      state.filteredStaff = state.staff.filter(s => 
        s.name.toLowerCase().includes(action.payload.toLowerCase()) ||
        s.email.toLowerCase().includes(action.payload.toLowerCase())
      )
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaff.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchStaff.fulfilled, (state, action) => {
        state.isLoading = false
        state.staff = action.payload
        state.filteredStaff = action.payload
      })
      .addCase(fetchStaff.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, setSearchQuery } = staffSlice.actions
export default staffSlice.reducer 