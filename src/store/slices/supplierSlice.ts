import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

export interface Supplier {
  id: string
  name: string
  email: string
  phone: string
  address: string
  contactPerson: string
  status: "active" | "inactive"
  category: string
  paymentTerms: string
  rating: number
  lastOrderDate: string
  totalOrders: number
  totalSpent: number
}

export interface CreateSupplier {
  name: string
  email: string
  phone: string
  address: string
  contactPerson: string
  category: string
  status: "active" | "inactive"
  paymentTerms: string
  rating: number
  lastOrderDate: string
  totalOrders: number
  totalSpent: number
}

export interface SupplierState {
  suppliers: Supplier[]
  filteredSuppliers: Supplier[]
  isLoading: boolean
  error: string | null
  searchQuery: string
  selectedStatus: string
}

const initialState: SupplierState = {
  suppliers: [],
  filteredSuppliers: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  selectedStatus: '',
}

const mockSuppliers: Supplier[] = [
  {
    id: "1",
    name: "Coffee Co.",
    email: "info@coffee.com",
    phone: "+1 (555) 111-1111",
    address: "123 Coffee St, City, State",
    contactPerson: "John Coffee",
    status: "active",
    category: "Beverages",
    paymentTerms: "Net 30",
    rating: 4,
    lastOrderDate: "2024-12-15",
    totalOrders: 25,
    totalSpent: 5000
  },
  {
    id: "2",
    name: "Tea Suppliers Ltd",
    email: "contact@teasuppliers.com",
    phone: "+1 (555) 222-2222",
    address: "456 Tea Ave, City, State",
    contactPerson: "Sarah Tea",
    status: "active",
    category: "Beverages",
    paymentTerms: "Net 15",
    rating: 5,
    lastOrderDate: "2024-12-18",
    totalOrders: 18,
    totalSpent: 3200
  },
  {
    id: "3",
    name: "Bakery Fresh",
    email: "orders@bakeryfresh.com",
    phone: "+1 (555) 333-3333",
    address: "789 Bread Blvd, City, State",
    contactPerson: "Mike Baker",
    status: "active",
    category: "Bakery",
    paymentTerms: "Net 30",
    rating: 4,
    lastOrderDate: "2024-12-20",
    totalOrders: 32,
    totalSpent: 7800
  },
  {
    id: "4",
    name: "Dairy Delights",
    email: "supply@dairydelights.com",
    phone: "+1 (555) 444-4444",
    address: "321 Milk Way, City, State",
    contactPerson: "Lisa Dairy",
    status: "active",
    category: "Dairy",
    paymentTerms: "Net 15",
    rating: 5,
    lastOrderDate: "2024-12-19",
    totalOrders: 45,
    totalSpent: 12000
  },
  {
    id: "5",
    name: "Fresh Fruits Co",
    email: "hello@freshfruits.com",
    phone: "+1 (555) 555-5555",
    address: "654 Apple St, City, State",
    contactPerson: "David Fruit",
    status: "active",
    category: "Produce",
    paymentTerms: "Net 7",
    rating: 4,
    lastOrderDate: "2024-12-21",
    totalOrders: 28,
    totalSpent: 6500
  },
  {
    id: "6",
    name: "Meat Masters",
    email: "supply@meatmasters.com",
    phone: "+1 (555) 666-6666",
    address: "987 Beef Rd, City, State",
    contactPerson: "Robert Meat",
    status: "active",
    category: "Meat",
    paymentTerms: "Net 30",
    rating: 4,
    lastOrderDate: "2024-12-17",
    totalOrders: 22,
    totalSpent: 8900
  },
  {
    id: "7",
    name: "Spice World",
    email: "orders@spiceworld.com",
    phone: "+1 (555) 777-7777",
    address: "147 Spice Ln, City, State",
    contactPerson: "Emily Spice",
    status: "inactive",
    category: "Spices",
    paymentTerms: "Net 30",
    rating: 3,
    lastOrderDate: "2024-11-15",
    totalOrders: 15,
    totalSpent: 3200
  },
  {
    id: "8",
    name: "Organic Valley",
    email: "supply@organicvalley.com",
    phone: "+1 (555) 888-8888",
    address: "258 Organic Dr, City, State",
    contactPerson: "Sarah Organic",
    status: "active",
    category: "Organic",
    paymentTerms: "Net 30",
    rating: 5,
    lastOrderDate: "2024-12-22",
    totalOrders: 38,
    totalSpent: 9500
  }
]

export const fetchSuppliers = createAsyncThunk(
  'supplier/fetchSuppliers',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return mockSuppliers
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch suppliers')
    }
  }
)

export const addSupplier = createAsyncThunk(
  'supplier/addSupplier',
  async (supplier: Supplier, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      return supplier
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to add supplier')
    }
  }
)

export const updateSupplier = createAsyncThunk(
  'supplier/updateSupplier',
  async (supplier: Supplier, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      return supplier
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update supplier')
    }
  }
)

export const deleteSupplier = createAsyncThunk(
  'supplier/deleteSupplier',
  async (supplierId: string, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      return supplierId
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete supplier')
    }
  }
)

const supplierSlice = createSlice({
  name: 'supplier',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
      state.filteredSuppliers = state.suppliers.filter(s => 
        s.name.toLowerCase().includes(action.payload.toLowerCase()) ||
        s.email.toLowerCase().includes(action.payload.toLowerCase())
      )
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuppliers.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.isLoading = false
        state.suppliers = action.payload
        state.filteredSuppliers = action.payload
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      .addCase(addSupplier.fulfilled, (state, action) => {
        state.suppliers.push(action.payload)
        state.filteredSuppliers = state.suppliers.filter(s => 
          s.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          s.email.toLowerCase().includes(state.searchQuery.toLowerCase())
        )
      })
      .addCase(updateSupplier.fulfilled, (state, action) => {
        const index = state.suppliers.findIndex(s => s.id === action.payload.id)
        if (index !== -1) {
          state.suppliers[index] = action.payload
          state.filteredSuppliers = state.suppliers.filter(s => 
            s.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
            s.email.toLowerCase().includes(state.searchQuery.toLowerCase())
          )
        }
      })
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.suppliers = state.suppliers.filter(s => s.id !== action.payload)
        state.filteredSuppliers = state.suppliers.filter(s => 
          s.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          s.email.toLowerCase().includes(state.searchQuery.toLowerCase())
        )
      })
  },
})

export const { clearError, setSearchQuery } = supplierSlice.actions
export default supplierSlice.reducer 