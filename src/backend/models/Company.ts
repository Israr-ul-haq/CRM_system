export interface Company {
  id: string
  name: string
  logo?: string
  email: string
  phone: string
  website?: string
  address: string
  city: string
  state: string
  country: string
  postalCode: string
  businessType: string
  taxId?: string
  currency: string
  timezone: string
  subscriptionId: string
  subscriptionStatus: 'active' | 'expired' | 'cancelled' | 'trial'
  subscriptionStartDate: Date
  subscriptionEndDate: Date
  maxBranches: number
  currentBranches: number
  dataStorageUsed: number // In GB
  dataStorageLimit: number // In GB
  paymentMethodId?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateCompanyForm {
  name: string
  logo?: string
  email: string
  phone: string
  website?: string
  address: string
  city: string
  state: string
  country: string
  postalCode: string
  businessType: string
  taxId?: string
  currency: string
  timezone: string
  subscriptionId: string
  paymentMethodId?: string
}

export interface UpdateCompanyForm extends Partial<CreateCompanyForm> {
  subscriptionStatus?: 'active' | 'expired' | 'cancelled' | 'trial'
  subscriptionStartDate?: Date
  subscriptionEndDate?: Date
  maxBranches?: number
  currentBranches?: number
  dataStorageUsed?: number
  dataStorageLimit?: number
  isActive?: boolean
} 