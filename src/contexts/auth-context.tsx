"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { getStaffRole, hasPermission, canAccessCheckin } from '@/lib/staff-permissions'

interface StaffMember {
  id: string
  name: string
  email: string
  roleId: string
  position: string
  department: string
  salary: number
  shiftHours: string
  isCheckedIn: boolean
  lastCheckIn?: string
  lastCheckOut?: string
}

interface RegularUser {
  id: string
  name: string
  email: string
  role: string
  department: string
}

interface Owner {
  id: string
  name: string
  email: string
  role: string
  companyName: string
}

interface SoftwareProvider {
  id: string
  name: string
  email: string
  role: string
  companyName: string
  subscriptionPlan: string
}

interface AuthContextType {
  staffMember: StaffMember | null
  regularUser: RegularUser | null
  owner: Owner | null
  softwareProvider: SoftwareProvider | null
  isAuthenticated: boolean
  userType: 'staff' | 'regular' | 'owner' | 'softwareProvider' | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  hasPermission: (permission: string) => boolean
  canAccessCheckin: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock staff data - in real app this would come from database
const mockStaffMembers: StaffMember[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@company.com",
    roleId: "1", // Branch Manager
    position: "Branch Manager",
    department: "Management",
    salary: 4500,
    shiftHours: "9:00 AM - 6:00 PM",
    isCheckedIn: false
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    roleId: "2", // Restaurant Manager
    position: "Restaurant Manager",
    department: "Restaurant",
    salary: 3800,
    shiftHours: "8:00 AM - 5:00 PM",
    isCheckedIn: false
  },
  {
    id: "3",
    name: "Mike Wilson",
    email: "mike.wilson@company.com",
    roleId: "3", // Sales Staff
    position: "Sales Representative",
    department: "Sales",
    salary: 2800,
    shiftHours: "9:00 AM - 6:00 PM",
    isCheckedIn: false
  },
  {
    id: "4",
    name: "Lisa Brown",
    email: "lisa.brown@company.com",
    roleId: "4", // Kitchen Staff
    position: "Kitchen Staff",
    department: "Kitchen",
    salary: 2200,
    shiftHours: "7:00 AM - 4:00 PM",
    isCheckedIn: false
  }
]

// Mock regular users (admin, managers, etc.)
const mockRegularUsers: RegularUser[] = [
  {
    id: "admin1",
    name: "Admin User",
    email: "admin@company.com",
    role: "Super Admin",
    department: "IT"
  },
  {
    id: "manager1",
    name: "Business Manager",
    email: "manager@company.com",
    role: "Business Manager",
    department: "Management"
  },
  {
    id: "accountant1",
    name: "Accountant",
    email: "accountant@company.com",
    role: "Accountant",
    department: "Finance"
  }
]

// Mock owner data
const mockOwners: Owner[] = [
  {
    id: "owner1",
    name: "Company Owner",
    email: "owner@company.com",
    role: "Company Owner",
    companyName: "Multi-Branch Company"
  }
]

// Mock software provider data
const mockSoftwareProviders: SoftwareProvider[] = [
  {
    id: "provider1",
    name: "Software Provider Admin",
    email: "provider@possoftware.com",
    role: "Software Provider",
    companyName: "POS Software Solutions Inc.",
    subscriptionPlan: "Enterprise"
  }
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [staffMember, setStaffMember] = useState<StaffMember | null>(null)
  const [regularUser, setRegularUser] = useState<RegularUser | null>(null)
  const [owner, setOwner] = useState<Owner | null>(null)
  const [softwareProvider, setSoftwareProvider] = useState<SoftwareProvider | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userType, setUserType] = useState<'staff' | 'regular' | 'owner' | 'softwareProvider' | null>(null)

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const savedStaff = localStorage.getItem('staffMember')
    const savedUser = localStorage.getItem('regularUser')
    const savedOwner = localStorage.getItem('owner')
    const savedProvider = localStorage.getItem('softwareProvider')
    
    if (savedStaff) {
      const staff = JSON.parse(savedStaff)
      setStaffMember(staff)
      setIsAuthenticated(true)
      setUserType('staff')
    } else if (savedUser) {
      const user = JSON.parse(savedUser)
      setRegularUser(user)
      setIsAuthenticated(true)
      setUserType('regular')
    } else if (savedOwner) {
      const ownerData = JSON.parse(savedOwner)
      setOwner(ownerData)
      setIsAuthenticated(true)
      setUserType('owner')
    } else if (savedProvider) {
      const providerData = JSON.parse(savedProvider)
      setSoftwareProvider(providerData)
      setIsAuthenticated(true)
      setUserType('softwareProvider')
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // In real app, this would be an API call
    // For demo, we'll just check against mock data
    
    // First check if it's a software provider
    const providerData = mockSoftwareProviders.find(p => p.email === email)
    if (providerData) {
      // In real app, verify password here
      setSoftwareProvider(providerData)
      setStaffMember(null)
      setRegularUser(null)
      setOwner(null)
      setIsAuthenticated(true)
      setUserType('softwareProvider')
      localStorage.setItem('softwareProvider', JSON.stringify(providerData))
      localStorage.removeItem('staffMember')
      localStorage.removeItem('regularUser')
      localStorage.removeItem('owner')
      return true
    }
    
    // Then check if it's an owner
    const ownerData = mockOwners.find(o => o.email === email)
    if (ownerData) {
      // In real app, verify password here
      setOwner(ownerData)
      setStaffMember(null)
      setRegularUser(null)
      setSoftwareProvider(null)
      setIsAuthenticated(true)
      setUserType('owner')
      localStorage.setItem('owner', JSON.stringify(ownerData))
      localStorage.removeItem('staffMember')
      localStorage.removeItem('regularUser')
      localStorage.removeItem('softwareProvider')
      return true
    }
    
    // Then check if it's a staff member
    const staff = mockStaffMembers.find(s => s.email === email)
    if (staff) {
      // In real app, verify password here
      setStaffMember(staff)
      setRegularUser(null)
      setOwner(null)
      setSoftwareProvider(null)
      setIsAuthenticated(true)
      setUserType('staff')
      localStorage.setItem('staffMember', JSON.stringify(staff))
      localStorage.removeItem('regularUser')
      localStorage.removeItem('owner')
      localStorage.removeItem('softwareProvider')
      return true
    }
    
    // Finally check if it's a regular user
    const user = mockRegularUsers.find(u => u.email === email)
    if (user) {
      // In real app, verify password here
      setRegularUser(user)
      setStaffMember(null)
      setOwner(null)
      setSoftwareProvider(null)
      setIsAuthenticated(true)
      setUserType('regular')
      localStorage.setItem('regularUser', JSON.stringify(user))
      localStorage.removeItem('staffMember')
      localStorage.removeItem('owner')
      localStorage.removeItem('softwareProvider')
      return true
    }
    
    return false
  }

  const logout = () => {
    setStaffMember(null)
    setRegularUser(null)
    setOwner(null)
    setSoftwareProvider(null)
    setIsAuthenticated(false)
    setUserType(null)
    localStorage.removeItem('staffMember')
    localStorage.removeItem('regularUser')
    localStorage.removeItem('owner')
    localStorage.removeItem('softwareProvider')
  }

  const checkPermission = (permission: string): boolean => {
    if (!staffMember) return false
    return hasPermission(staffMember.roleId, permission)
  }

  const checkCanAccessCheckin = (): boolean => {
    if (!staffMember) return false
    return canAccessCheckin(staffMember.roleId)
  }

  const value: AuthContextType = {
    staffMember,
    regularUser,
    owner,
    softwareProvider,
    isAuthenticated,
    userType,
    login,
    logout,
    hasPermission: checkPermission,
    canAccessCheckin: checkCanAccessCheckin
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 