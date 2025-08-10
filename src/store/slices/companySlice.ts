import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Company, CreateCompanyForm, UpdateCompanyForm } from '@/backend/models/Company'

interface CompanyState {
  companies: Company[]
  currentCompany: Company | null
  loading: boolean
  error: string | null
  selectedCompany: Company | null
}

const initialState: CompanyState = {
  companies: [],
  currentCompany: null,
  loading: false,
  error: null,
  selectedCompany: null
}

// Mock data for development
const mockCompanies: Company[] = [
  {
    id: '1',
    name: 'TechCorp Solutions',
    logo: '/api/placeholder/150/150',
    email: 'info@techcorp.com',
    phone: '+1 (555) 123-4567',
    website: 'https://techcorp.com',
    address: '123 Business Ave',
    city: 'San Francisco',
    state: 'CA',
    country: 'US',
    postalCode: '94105',
    businessType: 'Technology Services',
    taxId: 'TAX123456789',
    currency: 'USD',
    timezone: 'America/Los_Angeles',
    subscriptionId: '2',
    subscriptionStatus: 'active',
    subscriptionStartDate: new Date('2024-01-01'),
    subscriptionEndDate: new Date('2024-12-31'),
    maxBranches: 10,
    currentBranches: 3,
    dataStorageUsed: 25,
    dataStorageLimit: 100,
    paymentMethodId: '1',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Global Retail Inc',
    logo: '/api/placeholder/150/150',
    email: 'contact@globalretail.com',
    phone: '+44 20 1234 5678',
    website: 'https://globalretail.com',
    address: '456 Commerce St',
    city: 'London',
    state: 'England',
    country: 'GB',
    postalCode: 'SW1A 1AA',
    businessType: 'Retail',
    taxId: 'GB123456789',
    currency: 'GBP',
    timezone: 'Europe/London',
    subscriptionId: '3',
    subscriptionStatus: 'active',
    subscriptionStartDate: new Date('2024-01-01'),
    subscriptionEndDate: new Date('2024-12-31'),
    maxBranches: 50,
    currentBranches: 15,
    dataStorageUsed: 150,
    dataStorageLimit: 500,
    paymentMethodId: '2',
    isActive: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
]

// Async thunks
export const fetchCompanies = createAsyncThunk(
  'companies/fetchCompanies',
  async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    return mockCompanies
  }
)

export const fetchCurrentCompany = createAsyncThunk(
  'companies/fetchCurrentCompany',
  async (companyId: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    const company = mockCompanies.find(c => c.id === companyId)
    if (!company) throw new Error('Company not found')
    return company
  }
)

export const createCompany = createAsyncThunk(
  'companies/createCompany',
  async (companyData: CreateCompanyForm) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    const newCompany: Company = {
      id: Date.now().toString(),
      ...companyData,
      subscriptionStatus: 'trial',
      subscriptionStartDate: new Date(),
      subscriptionEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days trial
      maxBranches: 1,
      currentBranches: 0,
      dataStorageUsed: 0,
      dataStorageLimit: 1,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    return newCompany
  }
)

export const updateCompany = createAsyncThunk(
  'companies/updateCompany',
  async ({ id, data }: { id: string; data: UpdateCompanyForm }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { id, data }
  }
)

export const deleteCompany = createAsyncThunk(
  'companies/deleteCompany',
  async (id: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    return id
  }
)

const companySlice = createSlice({
  name: 'companies',
  initialState,
  reducers: {
    setCurrentCompany: (state, action: PayloadAction<Company | null>) => {
      state.currentCompany = action.payload
    },
    setSelectedCompany: (state, action: PayloadAction<Company | null>) => {
      state.selectedCompany = action.payload
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch companies
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false
        state.companies = action.payload
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch companies'
      })
      // Fetch current company
      .addCase(fetchCurrentCompany.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCurrentCompany.fulfilled, (state, action) => {
        state.loading = false
        state.currentCompany = action.payload
      })
      .addCase(fetchCurrentCompany.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch current company'
      })
      // Create company
      .addCase(createCompany.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createCompany.fulfilled, (state, action) => {
        state.loading = false
        state.companies.push(action.payload)
        if (!state.currentCompany) {
          state.currentCompany = action.payload
        }
      })
      .addCase(createCompany.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to create company'
      })
      // Update company
      .addCase(updateCompany.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.loading = false
        const index = state.companies.findIndex(c => c.id === action.payload.id)
        if (index !== -1) {
          state.companies[index] = { ...state.companies[index], ...action.payload.data, updatedAt: new Date() }
        }
        // Update current company if it's the one being updated
        if (state.currentCompany?.id === action.payload.id) {
          state.currentCompany = { ...state.currentCompany, ...action.payload.data, updatedAt: new Date() }
        }
      })
      .addCase(updateCompany.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to update company'
      })
      // Delete company
      .addCase(deleteCompany.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteCompany.fulfilled, (state, action) => {
        state.loading = false
        state.companies = state.companies.filter(c => c.id !== action.payload)
        if (state.currentCompany?.id === action.payload) {
          state.currentCompany = null
        }
      })
      .addCase(deleteCompany.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to delete company'
      })
  }
})

export const { setCurrentCompany, setSelectedCompany, clearError } = companySlice.actions
export default companySlice.reducer 