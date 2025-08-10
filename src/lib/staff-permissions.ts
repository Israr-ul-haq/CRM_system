export interface StaffPermission {
  key: string
  label: string
  description: string
  category: string
}

export interface StaffRole {
  id: string
  name: string
  description: string
  permissions: string[]
  canAccessCheckin: boolean
  canViewOwnDetails: boolean
  canManageRestaurant: boolean
}

export const STAFF_PERMISSIONS: StaffPermission[] = [
  // Staff Management
  { key: "staff.view", label: "View Staff", description: "View staff member details", category: "Staff" },
  { key: "staff.create", label: "Create Staff", description: "Add new staff members", category: "Staff" },
  { key: "staff.edit", label: "Edit Staff", description: "Modify staff information", category: "Staff" },
  { key: "staff.delete", label: "Delete Staff", description: "Remove staff members", category: "Staff" },
  { key: "staff.schedule", label: "Manage Schedules", description: "Set work schedules and shifts", category: "Staff" },
  { key: "staff.salary", label: "Manage Salaries", description: "Handle salary and advance payments", category: "Staff" },
  { key: "staff.checkin", label: "Check-in/Check-out", description: "Staff can check in and out", category: "Staff" },
  { key: "staff.own.view", label: "View Own Details", description: "View own salary and history", category: "Staff" },

  // Restaurant Management
  { key: "restaurant.view", label: "View Restaurant", description: "Access restaurant management", category: "Restaurant" },
  { key: "restaurant.menu", label: "Manage Menu", description: "Create and edit menu items", category: "Restaurant" },
  { key: "restaurant.orders", label: "Manage Orders", description: "Handle food orders and status", category: "Restaurant" },
  { key: "restaurant.tables", label: "Manage Tables", description: "Manage table reservations and status", category: "Restaurant" },
  { key: "restaurant.staff", label: "Manage Restaurant Staff", description: "Manage restaurant employees", category: "Restaurant" },
  { key: "restaurant.stats", label: "View Statistics", description: "View restaurant performance metrics", category: "Restaurant" },
  { key: "restaurant.sales", label: "View Sales", description: "View restaurant sales data", category: "Restaurant" },

  // Inventory Management
  { key: "inventory.view", label: "View Inventory", description: "View stock levels and items", category: "Inventory" },
  { key: "inventory.create", label: "Create Items", description: "Add new inventory items", category: "Inventory" },
  { key: "inventory.edit", label: "Edit Items", description: "Modify inventory information", category: "Inventory" },
  { key: "inventory.delete", label: "Delete Items", description: "Remove inventory items", category: "Inventory" },
  { key: "inventory.stock", label: "Manage Stock", description: "Update stock levels", category: "Inventory" },

  // Billing
  { key: "billing.view", label: "View Billing", description: "View billing information", category: "Billing" },
  { key: "billing.create", label: "Create Bills", description: "Generate new bills", category: "Billing" },
  { key: "billing.edit", label: "Edit Bills", description: "Modify existing bills", category: "Billing" },
  { key: "billing.delete", label: "Delete Bills", description: "Remove bills", category: "Billing" },

  // Reports
  { key: "reports.view", label: "View Reports", description: "Access reporting system", category: "Reports" },
  { key: "reports.sales", label: "Sales Reports", description: "Generate sales reports", category: "Reports" },
  { key: "reports.inventory", label: "Inventory Reports", description: "Generate inventory reports", category: "Reports" },
  { key: "reports.restaurant", label: "Restaurant Reports", description: "Generate restaurant reports", category: "Reports" }
]

export const STAFF_ROLES: StaffRole[] = [
  {
    id: "1",
    name: "Branch Manager",
    description: "Manages branch operations and staff",
    permissions: [
      "staff.view", "staff.create", "staff.edit", "staff.schedule", "staff.salary",
      "restaurant.view", "restaurant.menu", "restaurant.orders", "restaurant.tables", "restaurant.staff",
      "inventory.view", "inventory.create", "inventory.edit", "inventory.stock",
      "billing.view", "billing.create", "billing.edit",
      "reports.view", "reports.sales", "reports.inventory", "reports.restaurant"
    ],
    canAccessCheckin: true,
    canViewOwnDetails: true,
    canManageRestaurant: true
  },
  {
    id: "2",
    name: "Restaurant Manager",
    description: "Manages restaurant operations",
    permissions: [
      "restaurant.view", "restaurant.menu", "restaurant.orders", "restaurant.tables", "restaurant.staff", "restaurant.stats",
      "inventory.view", "inventory.create", "inventory.edit", "inventory.stock",
      "billing.view", "billing.create", "billing.edit",
      "reports.view", "reports.restaurant"
    ],
    canAccessCheckin: true,
    canViewOwnDetails: true,
    canManageRestaurant: true
  },
  {
    id: "3",
    name: "Sales Staff",
    description: "Handles sales and customer interactions",
    permissions: [
      "billing.view", "billing.create", "billing.edit",
      "inventory.view"
    ],
    canAccessCheckin: true,
    canViewOwnDetails: true,
    canManageRestaurant: false
  },
  {
    id: "4",
    name: "Kitchen Staff",
    description: "Prepares food and manages kitchen",
    permissions: [
      "restaurant.view", "restaurant.orders",
      "inventory.view", "inventory.stock"
    ],
    canAccessCheckin: true,
    canViewOwnDetails: true,
    canManageRestaurant: false
  },
  {
    id: "5",
    name: "Waiter/Waitress",
    description: "Serves customers and manages tables",
    permissions: [
      "restaurant.view", "restaurant.orders", "restaurant.tables",
      "billing.view", "billing.create"
    ],
    canAccessCheckin: true,
    canViewOwnDetails: true,
    canManageRestaurant: false
  },
  {
    id: "6",
    name: "Inventory Staff",
    description: "Manages stock and suppliers",
    permissions: [
      "inventory.view", "inventory.create", "inventory.edit", "inventory.stock"
    ],
    canAccessCheckin: true,
    canViewOwnDetails: true,
    canManageRestaurant: false
  }
]

export function getStaffRole(roleId: string): StaffRole | undefined {
  return STAFF_ROLES.find(role => role.id === roleId)
}

export function hasPermission(roleId: string, permission: string): boolean {
  const role = getStaffRole(roleId)
  return role ? role.permissions.includes(permission) : false
}

export function canAccessCheckin(roleId: string): boolean {
  const role = getStaffRole(roleId)
  return role ? role.canAccessCheckin : false
}

export function canViewOwnDetails(roleId: string): boolean {
  const role = getStaffRole(roleId)
  return role ? role.canViewOwnDetails : false
}

export function canManageRestaurant(roleId: string): boolean {
  const role = getStaffRole(roleId)
  return role ? role.canManageRestaurant : false
} 