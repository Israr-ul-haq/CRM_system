import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

export interface SalesRecord {
  id: number
  invoiceNumber: string
  date: string
  customerName: string
  category: string
  company: string
  items: Array<{
    name: string
    quantity: number
    price: number
    total: number
  }>
  totalAmount: number
  paymentMethod: string
  status: string
}

export interface SalesState {
  sales: SalesRecord[]
  filteredSales: SalesRecord[]
  isLoading: boolean
  error: string | null
  searchQuery: string
  selectedStatus: string
  selectedCategory: string
  selectedCompany: string
  startDate: string
  endDate: string
}

const initialState: SalesState = {
  sales: [],
  filteredSales: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  selectedStatus: '',
  selectedCategory: '',
  selectedCompany: '',
  startDate: '',
  endDate: '',
}

const mockSales: SalesRecord[] = [
  {
    id: 1,
    invoiceNumber: "INV-2024-001",
    date: "2024-12-23T10:30:00",
    customerName: "John Doe",
    category: "Electronics",
    company: "TechCorp Solutions Inc",
    items: [
      { name: "iPhone 15 Pro", quantity: 2, price: 999.99, total: 1999.98 },
      { name: "MacBook Air M2", quantity: 1, price: 1299.99, total: 1299.99 }
    ],
    totalAmount: 3299.97,
    paymentMethod: "Credit Card",
    status: "completed"
  },
  {
    id: 2,
    invoiceNumber: "INV-2024-002",
    date: "2024-12-23T14:15:00",
    customerName: "Jane Smith",
    category: "Clothing",
    company: "Global Textiles Ltd",
    items: [
      { name: "Nike Air Max 270", quantity: 1, price: 129.99, total: 129.99 },
      { name: "Levi's 501 Jeans", quantity: 2, price: 89.99, total: 179.98 }
    ],
    totalAmount: 309.97,
    paymentMethod: "Cash",
    status: "completed"
  },
  {
    id: 3,
    invoiceNumber: "INV-2024-003",
    date: "2024-12-23T16:45:00",
    customerName: "Mike Johnson",
    category: "Books",
    company: "Book Publishers Ltd",
    items: [
      { name: "The Great Gatsby", quantity: 1, price: 12.99, total: 12.99 },
      { name: "To Kill a Mockingbird", quantity: 1, price: 14.99, total: 14.99 }
    ],
    totalAmount: 27.98,
    paymentMethod: "Bank Transfer",
    status: "completed"
  },
  {
    id: 4,
    invoiceNumber: "INV-2024-004",
    date: "2024-12-22T11:20:00",
    customerName: "Sarah Wilson",
    category: "Home & Garden",
    company: "Home Improvement Co",
    items: [
      { name: "Garden Hose", quantity: 1, price: 45.99, total: 45.99 },
      { name: "Plant Pots", quantity: 5, price: 12.99, total: 64.95 }
    ],
    totalAmount: 110.94,
    paymentMethod: "Credit Card",
    status: "completed"
  },
  {
    id: 5,
    invoiceNumber: "INV-2024-005",
    date: "2024-12-22T15:30:00",
    customerName: "David Brown",
    category: "Sports",
    company: "Sports Equipment Ltd",
    items: [
      { name: "Basketball", quantity: 2, price: 29.99, total: 59.98 },
      { name: "Tennis Racket", quantity: 1, price: 89.99, total: 89.99 }
    ],
    totalAmount: 149.97,
    paymentMethod: "Cash",
    status: "pending"
  },
  {
    id: 6,
    invoiceNumber: "INV-2024-006",
    date: "2024-12-21T09:15:00",
    customerName: "Lisa Davis",
    category: "Beauty",
    company: "Beauty Products Inc",
    items: [
      { name: "Face Cream", quantity: 1, price: 34.99, total: 34.99 },
      { name: "Lipstick", quantity: 3, price: 19.99, total: 59.97 }
    ],
    totalAmount: 94.96,
    paymentMethod: "Credit Card",
    status: "completed"
  },
  {
    id: 7,
    invoiceNumber: "INV-2024-007",
    date: "2024-12-21T13:45:00",
    customerName: "Robert Miller",
    category: "Automotive",
    company: "Auto Parts Plus",
    items: [
      { name: "Motor Oil", quantity: 2, price: 24.99, total: 49.98 },
      { name: "Air Filter", quantity: 1, price: 18.99, total: 18.99 }
    ],
    totalAmount: 68.97,
    paymentMethod: "Bank Transfer",
    status: "completed"
  },
  {
    id: 8,
    invoiceNumber: "INV-2024-008",
    date: "2024-12-20T16:20:00",
    customerName: "Emily Garcia",
    category: "Jewelry",
    company: "Precious Metals Co",
    items: [
      { name: "Silver Necklace", quantity: 1, price: 199.99, total: 199.99 },
      { name: "Gold Ring", quantity: 1, price: 299.99, total: 299.99 }
    ],
    totalAmount: 499.98,
    paymentMethod: "Credit Card",
    status: "completed"
  }
]

export const fetchSales = createAsyncThunk(
  'sales/fetchSales',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return mockSales
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch sales')
    }
  }
)

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    clearError: (state) => { state.error = null },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
      state.filteredSales = filterSales(state.sales, state)
    },
    setSelectedStatus: (state, action: PayloadAction<string>) => {
      state.selectedStatus = action.payload
      state.filteredSales = filterSales(state.sales, state)
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload
      state.filteredSales = filterSales(state.sales, state)
    },
    setSelectedCompany: (state, action: PayloadAction<string>) => {
      state.selectedCompany = action.payload
      state.filteredSales = filterSales(state.sales, state)
    },
    setStartDate: (state, action: PayloadAction<string>) => {
      state.startDate = action.payload
      state.filteredSales = filterSales(state.sales, state)
    },
    setEndDate: (state, action: PayloadAction<string>) => {
      state.endDate = action.payload
      state.filteredSales = filterSales(state.sales, state)
    },
    clearFilters: (state) => {
      state.searchQuery = ''
      state.selectedStatus = ''
      state.selectedCategory = ''
      state.selectedCompany = ''
      state.startDate = ''
      state.endDate = ''
      state.filteredSales = state.sales
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSales.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchSales.fulfilled, (state, action) => {
        state.isLoading = false
        state.sales = action.payload
        state.filteredSales = action.payload
      })
      .addCase(fetchSales.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

// Helper function to filter sales
const filterSales = (sales: SalesRecord[], filters: SalesState) => {
  return sales.filter(sale => {
    const matchesSearch = !filters.searchQuery || 
      sale.invoiceNumber.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      sale.customerName.toLowerCase().includes(filters.searchQuery.toLowerCase())
    
    const matchesStatus = !filters.selectedStatus || sale.status === filters.selectedStatus
    const matchesCategory = !filters.selectedCategory || sale.category === filters.selectedCategory
    const matchesCompany = !filters.selectedCompany || sale.company === filters.selectedCompany
    
    const matchesDate = !filters.startDate || !filters.endDate || 
      (sale.date >= filters.startDate && sale.date <= filters.endDate)
    
    return matchesSearch && matchesStatus && matchesCategory && matchesCompany && matchesDate
  })
}

export const { 
  clearError, 
  setSearchQuery, 
  setSelectedStatus, 
  setSelectedCategory,
  setSelectedCompany,
  setStartDate,
  setEndDate,
  clearFilters 
} = salesSlice.actions

export default salesSlice.reducer 