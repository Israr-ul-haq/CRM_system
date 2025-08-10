export interface Permission {
  key: string
  label: string
  description: string
  category: string
  actions: PermissionAction[]
}

export interface PermissionAction {
  key: string
  label: string
  description: string
}

export const SYSTEM_PERMISSIONS: Permission[] = [
  {
    key: "users",
    label: "User Management",
    description: "Manage system users and their accounts",
    category: "System",
    actions: [
      { key: "users.view", label: "View Users", description: "View list of all users" },
      { key: "users.create", label: "Create Users", description: "Create new user accounts" },
      { key: "users.edit", label: "Edit Users", description: "Modify existing user details" },
      { key: "users.delete", label: "Delete Users", description: "Remove user accounts" },
      { key: "users.activate", label: "Activate/Deactivate", description: "Enable or disable user accounts" }
    ]
  },
  {
    key: "roles",
    label: "Role Management",
    description: "Manage user roles and permissions",
    category: "System",
    actions: [
      { key: "roles.view", label: "View Roles", description: "View list of all roles" },
      { key: "roles.create", label: "Create Roles", description: "Create new roles" },
      { key: "roles.edit", label: "Edit Roles", description: "Modify role permissions" },
      { key: "roles.delete", label: "Delete Roles", description: "Remove unused roles" }
    ]
  },
  {
    key: "inventory",
    label: "Inventory Management",
    description: "Manage products, stock, and inventory",
    category: "Operations",
    actions: [
      { key: "inventory.view", label: "View Inventory", description: "View product list and stock levels" },
      { key: "inventory.create", label: "Add Products", description: "Create new product entries" },
      { key: "inventory.edit", label: "Edit Products", description: "Modify product details" },
      { key: "inventory.delete", label: "Delete Products", description: "Remove products from inventory" },
      { key: "inventory.stock", label: "Manage Stock", description: "Update stock levels and quantities" },
      { key: "inventory.categories", label: "Manage Categories", description: "Create and edit product categories" }
    ]
  },
  {
    key: "billing",
    label: "Billing & Sales",
    description: "Process sales, invoices, and payments",
    category: "Operations",
    actions: [
      { key: "billing.view", label: "View Sales", description: "View sales history and invoices" },
      { key: "billing.create", label: "Create Sales", description: "Process new sales transactions" },
      { key: "billing.edit", label: "Edit Sales", description: "Modify sales records" },
      { key: "billing.delete", label: "Delete Sales", description: "Remove sales records" },
      { key: "billing.refunds", label: "Process Refunds", description: "Handle customer refunds" },
      { key: "billing.discounts", label: "Apply Discounts", description: "Give discounts on sales" }
    ]
  },
  {
    key: "purchases",
    label: "Purchase Management",
    description: "Manage supplier purchases and orders",
    category: "Operations",
    actions: [
      { key: "purchases.view", label: "View Purchases", description: "View purchase orders and history" },
      { key: "purchases.create", label: "Create Purchases", description: "Create new purchase orders" },
      { key: "purchases.edit", label: "Edit Purchases", description: "Modify purchase orders" },
      { key: "purchases.delete", label: "Delete Purchases", description: "Remove purchase records" },
      { key: "purchases.approve", label: "Approve Orders", description: "Approve purchase orders" }
    ]
  },
  {
    key: "suppliers",
    label: "Supplier Management",
    description: "Manage supplier relationships and information",
    category: "Operations",
    actions: [
      { key: "suppliers.view", label: "View Suppliers", description: "View supplier list and details" },
      { key: "suppliers.create", label: "Add Suppliers", description: "Create new supplier accounts" },
      { key: "suppliers.edit", label: "Edit Suppliers", description: "Modify supplier information" },
      { key: "suppliers.delete", label: "Delete Suppliers", description: "Remove supplier accounts" },
      { key: "suppliers.payments", label: "Manage Payments", description: "Process supplier payments" }
    ]
  },
  {
    key: "customers",
    label: "Customer Management",
    description: "Manage customer accounts and relationships",
    category: "Operations",
    actions: [
      { key: "customers.view", label: "View Customers", description: "View customer list and details" },
      { key: "customers.create", label: "Add Customers", description: "Create new customer accounts" },
      { key: "customers.edit", label: "Edit Customers", description: "Modify customer information" },
      { key: "customers.delete", label: "Delete Customers", description: "Remove customer accounts" },
      { key: "customers.credit", label: "Manage Credit", description: "Handle customer credit accounts" }
    ]
  },
  {
    key: "staff",
    label: "Staff Management",
    description: "Manage employee information and schedules",
    category: "Operations",
    actions: [
      { key: "staff.view", label: "View Staff", description: "View employee list and details" },
      { key: "staff.create", label: "Add Staff", description: "Create new employee records" },
      { key: "staff.edit", label: "Edit Staff", description: "Modify employee information" },
      { key: "staff.delete", label: "Delete Staff", description: "Remove employee records" },
      { key: "staff.schedule", label: "Manage Schedules", description: "Set work schedules and shifts" },
      { key: "staff.salary", label: "Manage Salaries", description: "Handle salary and advance payments" },
      { key: "staff.checkin", label: "Check-in/Check-out", description: "Staff can check in and out" },
      { key: "staff.own.view", label: "View Own Details", description: "View own salary and history" }
    ]
  },
  {
    key: "restaurant",
    label: "Restaurant Management",
    description: "Manage restaurant operations, menu, and orders",
    category: "Operations",
    actions: [
      { key: "restaurant.view", label: "View Restaurant", description: "Access restaurant management" },
      { key: "restaurant.menu", label: "Manage Menu", description: "Create and edit menu items" },
      { key: "restaurant.orders", label: "Manage Orders", description: "Handle food orders and status" },
      { key: "restaurant.tables", label: "Manage Tables", description: "Manage table reservations and status" },
      { key: "restaurant.staff", label: "Manage Restaurant Staff", description: "Manage restaurant employees" },
      { key: "restaurant.stats", label: "View Statistics", description: "View restaurant performance metrics" },
      { key: "restaurant.sales", label: "View Sales", description: "View restaurant sales data" }
    ]
  },
  {
    key: "reports",
    label: "Reports & Analytics",
    description: "Generate and view business reports",
    category: "Analytics",
    actions: [
      { key: "reports.view", label: "View Reports", description: "Access to view reports" },
      { key: "reports.sales", label: "Sales Reports", description: "Generate sales performance reports" },
      { key: "reports.inventory", label: "Inventory Reports", description: "Generate stock and inventory reports" },
      { key: "reports.financial", label: "Financial Reports", description: "Generate financial statements" },
      { key: "reports.export", label: "Export Reports", description: "Export reports to various formats" },
      { key: "reports.restaurant", label: "Restaurant Reports", description: "Generate restaurant performance reports" }
    ]
  },
  {
    key: "settings",
    label: "System Settings",
    description: "Configure system preferences and settings",
    category: "System",
    actions: [
      { key: "settings.view", label: "View Settings", description: "Access system settings" },
      { key: "settings.general", label: "General Settings", description: "Modify general system preferences" },
      { key: "settings.business", label: "Business Settings", description: "Configure business information" },
      { key: "settings.backup", label: "Backup & Restore", description: "Manage system backups" },
      { key: "settings.security", label: "Security Settings", description: "Configure security parameters" }
    ]
  }
]

export const getPermissionByKey = (key: string): Permission | undefined => {
  return SYSTEM_PERMISSIONS.find(p => p.key === key)
}

export const getPermissionActionByKey = (permissionKey: string, actionKey: string): PermissionAction | undefined => {
  const permission = getPermissionByKey(permissionKey)
  return permission?.actions.find(a => a.key === actionKey)
}

export const formatPermissionKey = (permissionKey: string): string => {
  const permission = getPermissionByKey(permissionKey)
  return permission?.label || permissionKey
}

export const formatActionKey = (actionKey: string): string => {
  const [permissionKey, action] = actionKey.split('.')
  const permissionAction = getPermissionActionByKey(permissionKey, action)
  return permissionAction?.label || actionKey
} 