"use client"

import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { StaffManagementTable } from "@/components/staff-management-table"
import { StaffManagementSearch } from "@/components/staff-management-search"
import { AddStaffModal } from "@/components/add-staff-modal"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { AuthGuard } from "@/components/auth-guard"
import { RootState, AppDispatch } from "@/store"
import { fetchStaff } from "@/store/slices/staffSlice"

export default function StaffManagementPage() {
  const dispatch = useDispatch<AppDispatch>()
  const staff = useSelector((state: RootState) => state.staff.staff)
  
  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  
  // Fetch staff data on component mount
  useEffect(() => {
    dispatch(fetchStaff())
  }, [dispatch])
  
  // Calculate summary statistics
  const totalStaff = staff.length
  const totalSalary = staff.reduce((sum, member) => sum + member.salary, 0)
  const totalAdvance = staff.reduce((sum, member) => sum + member.advance, 0)

  // Map staff data to the format expected by the table
  const mappedStaff = staff.map(member => ({
    id: member.id,
    employeeId: member.staffId,
    name: member.name,
    email: member.email,
    phone: member.phone,
    position: member.role,
    department: "General", // Default department since staff slice doesn't have it
    branch: member.branchId,
    salary: member.salary,
    advanceTaken: member.advance,
    remainingSalary: member.salary - member.advance,
    shiftHours: "9:00 AM - 6:00 PM", // Default shift hours
    isCheckedIn: false, // Default check-in status
    status: member.status,
    joinDate: member.joinDate,
    totalWorkingHours: 0, // Default values
    overtimeHours: 0
  }))

  const handleAddStaff = () => {
    setIsAddModalOpen(true)
  }

  const handleFilterChange = (filters: {
    position: string
    department: string
    status: string
  }) => {
    // Handle filter changes
    console.log("Filters changed:", filters)
  }

  const handleAddStaffSubmit = async (data: {
    employeeId: string
    name: string
    email: string
    phone: string
    position: string
    department: string
    branch: string
    salary: string
    shiftHours: string
    joinDate: string
    status: "active" | "inactive" | "on_leave"
  }) => {
    try {
      // Here you would typically dispatch an action to add the staff member
      console.log("Adding staff member:", data)
      // For now, just close the modal
      setIsAddModalOpen(false)
    } catch (error) {
      console.error("Failed to add staff member:", error)
    }
  }

  return (
    <AuthGuard>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <div className="px-4 lg:px-6">
                  <div className="flex flex-col gap-4">
                    <div>
                      <h1 className="text-2xl font-bold tracking-tight">Staff Management</h1>
                      <p className="text-muted-foreground">
                        Manage your staff members, roles, and permissions
                      </p>
                    </div>
                    <StaffManagementSearch 
                      onAddStaff={handleAddStaff}
                      onFilterChange={handleFilterChange}
                      totalStaff={totalStaff}
                      totalSalary={totalSalary}
                      totalAdvance={totalAdvance}
                    />
                  </div>
                </div>
                <StaffManagementTable 
                  data={mappedStaff}
                  onCheckIn={async (staffId) => console.log("Check in:", staffId)}
                  onCheckOut={async (staffId) => console.log("Check out:", staffId)}
                  onAdvancePayment={async (staffId, amount) => console.log("Advance payment:", staffId, amount)}
                />
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>

      {/* Add Staff Modal */}
      <AddStaffModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddStaffSubmit}
      />
    </AuthGuard>
  )
} 