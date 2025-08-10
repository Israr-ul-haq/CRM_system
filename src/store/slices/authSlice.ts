import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

// Types
export interface User {
  id: string
  name: string
  email: string
  role: string
  roleId?: string
  userType: 'staff' | 'regular' | 'owner'
  branchId?: string
  permissions?: string[]
}

export interface Owner {
  id: string
  name: string
  email: string
  companyName: string
  userType: 'owner'
}

export interface AuthState {
  user: User | Owner | null
  userType: 'staff' | 'regular' | 'owner' | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface LoginResponse {
  user: User | Owner
  userType: 'staff' | 'regular' | 'owner'
}

// Initial state
const initialState: AuthState = {
  user: null,
  userType: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

// Async thunks
export const loginUser = createAsyncThunk<LoginResponse, { email: string; password: string }, { rejectValue: string }>(
  'auth/loginUser',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock authentication logic
      if (credentials.email === 'owner@company.com' && credentials.password === 'owner123') {
        const owner: Owner = {
          id: '1',
          name: 'John Owner',
          email: 'owner@company.com',
          companyName: 'Multi-Branch Company',
          userType: 'owner'
        }
        return { user: owner, userType: 'owner' as const }
      } else if (credentials.email === 'staff@company.com' && credentials.password === 'staff123') {
        const staff: User = {
          id: '2',
          name: 'Jane Staff',
          email: 'staff@company.com',
          role: 'Manager',
          roleId: 'manager',
          userType: 'staff',
          branchId: '1',
          permissions: ['inventory', 'sales', 'customers']
        }
        return { user: staff, userType: 'staff' as const }
      } else if (credentials.email === 'admin@company.com' && credentials.password === 'admin123') {
        const admin: User = {
          id: '3',
          name: 'Admin User',
          email: 'admin@company.com',
          role: 'Admin',
          roleId: 'admin',
          userType: 'regular',
          permissions: ['all']
        }
        return { user: admin, userType: 'regular' as const }
      }
      
      throw new Error('Invalid credentials')
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Login failed')
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    return null
  }
)

export const checkAuthStatus = createAsyncThunk(
  'auth/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    try {
      // Check localStorage for existing auth
      const storedAuth = localStorage.getItem('auth')
      if (storedAuth) {
        const authData = JSON.parse(storedAuth)
        return authData
      }
      throw new Error('No stored authentication')
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Auth check failed')
    }
  }
)

// Slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setUser: (state, action: PayloadAction<User | Owner>) => {
      state.user = action.payload
      state.userType = action.payload.userType
      state.isAuthenticated = true
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.userType = action.payload.userType
        state.error = null
        
        // Store in localStorage
        localStorage.setItem('auth', JSON.stringify({
          user: action.payload.user,
          userType: action.payload.userType,
          isAuthenticated: true
        }))
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Logout
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.user = null
        state.userType = null
        state.error = null
        
        // Clear localStorage
        localStorage.removeItem('auth')
      })
      // Check auth status
      .addCase(checkAuthStatus.pending, (state) => {
        state.isLoading = true
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = action.payload.isAuthenticated
        state.user = action.payload.user
        state.userType = action.payload.userType
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.user = null
        state.userType = null
      })
  },
})

export const { clearError, setUser } = authSlice.actions
export default authSlice.reducer 