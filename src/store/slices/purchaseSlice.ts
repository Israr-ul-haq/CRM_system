import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

export interface Purchase {
  id: number
  purchaseId: string
  supplierId: string
  supplierName: string
  items: PurchaseItem[]
  total: number
  status: "pending" | "received" | "cancelled"
  date: string
  branchId: string
}

export interface PurchaseItem {
  id: number
  name: string
  quantity: number
  cost: number
  total: number
}

export interface PurchaseState {
  purchases: Purchase[]
  filteredPurchases: Purchase[]
  isLoading: boolean
  error: string | null
  searchQuery: string
  selectedStatus: string
}

const initialState: PurchaseState = {
  purchases: [],
  filteredPurchases: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  selectedStatus: '',
}

const mockPurchases: Purchase[] = [
  {
    id: 1,
    purchaseId: "PUR-001",
    supplierId: "1",
    supplierName: "Coffee Co.",
    items: [
      { id: 1, name: "Coffee Beans", quantity: 100, cost: 8.50, total: 850 }
    ],
    total: 850,
    status: "received",
    date: "2024-12-18",
    branchId: "1"
  },
  {
    id: 2,
    purchaseId: "PUR-002",
    supplierId: "2",
    supplierName: "Tea Suppliers Ltd",
    items: [
      { id: 2, name: "Tea Leaves", quantity: 50, cost: 6.00, total: 300 },
      { id: 3, name: "Green Tea", quantity: 30, cost: 7.50, total: 225 }
    ],
    total: 525,
    status: "pending",
    date: "2024-12-20",
    branchId: "1"
  },
  {
    id: 3,
    purchaseId: "PUR-003",
    supplierId: "3",
    supplierName: "Bakery Fresh",
    items: [
      { id: 4, name: "Flour", quantity: 200, cost: 2.50, total: 500 },
      { id: 5, name: "Yeast", quantity: 20, cost: 3.00, total: 60 }
    ],
    total: 560,
    status: "received",
    date: "2024-12-19",
    branchId: "2"
  },
  {
    id: 4,
    purchaseId: "PUR-004",
    supplierId: "4",
    supplierName: "Dairy Delights",
    items: [
      { id: 6, name: "Milk", quantity: 100, cost: 3.50, total: 350 },
      { id: 7, name: "Cheese", quantity: 25, cost: 8.00, total: 200 }
    ],
    total: 550,
    status: "pending",
    date: "2024-12-21",
    branchId: "1"
  },
  {
    id: 5,
    purchaseId: "PUR-005",
    supplierId: "5",
    supplierName: "Fresh Fruits Co",
    items: [
      { id: 8, name: "Apples", quantity: 150, cost: 1.50, total: 225 },
      { id: 9, name: "Bananas", quantity: 200, cost: 0.75, total: 150 }
    ],
    total: 375,
    status: "received",
    date: "2024-12-17",
    branchId: "2"
  },
  {
    id: 6,
    purchaseId: "PUR-006",
    supplierId: "6",
    supplierName: "Meat Masters",
    items: [
      { id: 10, name: "Beef", quantity: 50, cost: 12.00, total: 600 },
      { id: 11, name: "Chicken", quantity: 40, cost: 8.50, total: 340 }
    ],
    total: 940,
    status: "pending",
    date: "2024-12-22",
    branchId: "1"
  },
  {
    id: 7,
    purchaseId: "PUR-007",
    supplierId: "7",
    supplierName: "Spice World",
    items: [
      { id: 12, name: "Black Pepper", quantity: 30, cost: 5.00, total: 150 },
      { id: 13, name: "Cinnamon", quantity: 25, cost: 4.50, total: 112.50 }
    ],
    total: 262.50,
    status: "cancelled",
    date: "2024-12-16",
    branchId: "2"
  },
  {
    id: 8,
    purchaseId: "PUR-008",
    supplierId: "8",
    supplierName: "Organic Valley",
    items: [
      { id: 14, name: "Organic Eggs", quantity: 120, cost: 4.00, total: 480 },
      { id: 15, name: "Organic Milk", quantity: 80, cost: 4.50, total: 360 }
    ],
    total: 840,
    status: "received",
    date: "2024-12-20",
    branchId: "1"
  }
]

export const fetchPurchases = createAsyncThunk(
  'purchase/fetchPurchases',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return mockPurchases
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch purchases')
    }
  }
)

const purchaseSlice = createSlice({
  name: 'purchase',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
      state.filteredPurchases = state.purchases.filter(p => 
        p.purchaseId.toLowerCase().includes(action.payload.toLowerCase()) ||
        p.supplierName.toLowerCase().includes(action.payload.toLowerCase())
      )
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPurchases.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchPurchases.fulfilled, (state, action) => {
        state.isLoading = false
        state.purchases = action.payload
        state.filteredPurchases = action.payload
      })
      .addCase(fetchPurchases.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, setSearchQuery } = purchaseSlice.actions
export default purchaseSlice.reducer 