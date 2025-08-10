import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

// Types
export interface InventoryItem {
  id: number
  name: string
  sku: string
  category: string
  price: number
  cost: number
  stock: number
  minStock: number
  status: string
  supplier: string
  location: string
  lastUpdated: string
  description?: string
}

export interface CreateInventoryItem {
  name: string
  sku: string
  category: string
  price: string
  cost: string
  stock: string
  minStock: string
  supplierId: string
  location: string
  description?: string
}

export interface InventoryState {
  items: InventoryItem[]
  filteredItems: InventoryItem[]
  categories: string[]
  suppliers: string[]
  isLoading: boolean
  error: string | null
  searchQuery: string
  selectedCategory: string
  selectedSupplier: string
}

// Initial state
const initialState: InventoryState = {
  items: [],
  filteredItems: [],
  categories: [],
  suppliers: [],
  isLoading: false,
  error: null,
  searchQuery: '',
  selectedCategory: 'all',
  selectedSupplier: 'all',
}

// Mock data
const mockInventoryItems: InventoryItem[] = [
  {
    id: 1,
    name: "Premium Coffee Beans",
    sku: "COF-001",
    category: "Beverages",
    price: 12.99,
    cost: 8.50,
    stock: 150,
    minStock: 20,
    status: "In Stock",
    supplier: "Coffee Co.",
    location: "Warehouse A",
    lastUpdated: "2024-12-19",
    description: "High-quality Arabica coffee beans"
  },
  {
    id: 2,
    name: "Organic Tea Leaves",
    sku: "TEA-001",
    category: "Beverages",
    price: 9.99,
    cost: 6.00,
    stock: 200,
    minStock: 25,
    status: "In Stock",
    supplier: "Tea Masters",
    location: "Warehouse A",
    lastUpdated: "2024-12-18",
    description: "Premium organic tea selection"
  },
  {
    id: 3,
    name: "Artisan Bread",
    sku: "BRD-001",
    category: "Bakery",
    price: 4.99,
    cost: 2.50,
    stock: 45,
    minStock: 15,
    status: "Low Stock",
    supplier: "Bakery Fresh",
    location: "Warehouse B",
    lastUpdated: "2024-12-19",
    description: "Freshly baked artisan bread"
  }
]

// Async thunks
export const fetchInventory = createAsyncThunk(
  'inventory/fetchInventory',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      return mockInventoryItems
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch inventory')
    }
  }
)

export const addInventoryItem = createAsyncThunk(
  'inventory/addInventoryItem',
  async (itemData: CreateInventoryItem, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newItem: InventoryItem = {
        id: Date.now(),
        ...itemData,
        price: parseFloat(itemData.price),
        cost: parseFloat(itemData.cost),
        stock: parseInt(itemData.stock),
        minStock: parseInt(itemData.minStock),
        status: parseInt(itemData.stock) > parseInt(itemData.minStock) ? "In Stock" : "Low Stock",
        lastUpdated: new Date().toISOString().split('T')[0],
        supplier: itemData.supplierId // Use supplierId as supplier name for now
      }
      
      return newItem
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to add inventory item')
    }
  }
)

export const updateInventoryItem = createAsyncThunk(
  'inventory/updateInventoryItem',
  async ({ id, itemData }: { id: number; itemData: Partial<InventoryItem> }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return { id, itemData }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update inventory item')
    }
  }
)

export const deleteInventoryItem = createAsyncThunk(
  'inventory/deleteInventoryItem',
  async (id: number, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return id
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete inventory item')
    }
  }
)

// Slice
const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
      state.filteredItems = filterItems(state.items, action.payload, state.selectedCategory, state.selectedSupplier)
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload
      state.filteredItems = filterItems(state.items, state.searchQuery, action.payload, state.selectedSupplier)
    },
    setSelectedSupplier: (state, action: PayloadAction<string>) => {
      state.selectedSupplier = action.payload
      state.filteredItems = filterItems(state.items, state.searchQuery, state.selectedCategory, action.payload)
    },
    clearFilters: (state) => {
      state.searchQuery = ''
      state.selectedCategory = 'all'
      state.selectedSupplier = 'all'
      state.filteredItems = state.items
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch inventory
      .addCase(fetchInventory.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
        state.filteredItems = action.payload
        // Extract unique categories and suppliers
        state.categories = [...new Set(action.payload.map(item => item.category))]
        state.suppliers = [...new Set(action.payload.map(item => item.supplier))]
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Add inventory item
      .addCase(addInventoryItem.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(addInventoryItem.fulfilled, (state, action) => {
        state.isLoading = false
        state.items.push(action.payload)
        state.filteredItems = filterItems(state.items, state.searchQuery, state.selectedCategory, state.selectedSupplier)
        // Update categories and suppliers if new
        if (!state.categories.includes(action.payload.category)) {
          state.categories.push(action.payload.category)
        }
        if (!state.suppliers.includes(action.payload.supplier)) {
          state.suppliers.push(action.payload.supplier)
        }
      })
      .addCase(addInventoryItem.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update inventory item
      .addCase(updateInventoryItem.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateInventoryItem.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.items.findIndex(item => item.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = { ...state.items[index], ...action.payload.itemData }
        }
        state.filteredItems = filterItems(state.items, state.searchQuery, state.selectedCategory, state.selectedSupplier)
      })
      .addCase(updateInventoryItem.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Delete inventory item
      .addCase(deleteInventoryItem.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteInventoryItem.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = state.items.filter(item => item.id !== action.payload)
        state.filteredItems = filterItems(state.items, state.searchQuery, state.selectedCategory, state.selectedSupplier)
      })
      .addCase(deleteInventoryItem.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

// Helper function to filter items
const filterItems = (items: InventoryItem[], searchQuery: string, category: string, supplier: string) => {
  return items.filter(item => {
    const matchesSearch = !searchQuery || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !category || category === 'all' || item.category === category
    const matchesSupplier = !supplier || supplier === 'all' || item.supplier === supplier
    
    return matchesSearch && matchesCategory && matchesSupplier
  })
}

export const { 
  clearError, 
  setSearchQuery, 
  setSelectedCategory, 
  setSelectedSupplier, 
  clearFilters 
} = inventorySlice.actions

export default inventorySlice.reducer 