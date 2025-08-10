"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  IconChefHat, 
  IconReceipt, 
  IconTable, 
  IconUsers, 
  IconPlus, 
  IconEdit, 
  IconTrash, 
  IconEye,
  IconClock,
  IconPhone,
  IconMapPin,
  IconShield
} from "@tabler/icons-react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { STAFF_PERMISSIONS } from "@/lib/staff-permissions"
import MenuItemModal from "@/components/restaurant/menu-item-modal"
import OrderModal from "@/components/restaurant/order-modal"
import TableModal from "@/components/restaurant/table-modal"
import StaffModal from "@/components/restaurant/staff-modal"
import MenuItemViewModal from "@/components/restaurant/menu-item-view-modal"
import OrderViewModal from "@/components/restaurant/order-view-modal"
import TableViewModal from "@/components/restaurant/table-view-modal"
import StaffViewModal from "@/components/restaurant/staff-view-modal"

// Mock data for demonstration
const mockMenuItems = [
  {
    id: "1",
    name: "Margherita Pizza",
    category: "Pizza",
    price: 18.99,
    cost: 8.50,
    description: "Classic tomato sauce with mozzarella and basil",
    isAvailable: true,
    preparationTime: 15,
    image: "/pizza.jpg"
  },
  {
    id: "2",
    name: "Caesar Salad",
    category: "Salads",
    price: 12.99,
    cost: 5.20,
    description: "Fresh romaine lettuce with Caesar dressing",
    isAvailable: true,
    preparationTime: 8,
    image: "/salad.jpg"
  },
  {
    id: "3",
    name: "Pasta Carbonara",
    category: "Pasta",
    price: 16.99,
    cost: 7.80,
    description: "Spaghetti with eggs, cheese, and pancetta",
    isAvailable: true,
    preparationTime: 12,
    image: "/pasta.jpg"
  }
]

const mockOrders = [
  {
    id: "1",
    tableNumber: "A1",
    items: [
      { id: "1", name: "Margherita Pizza", quantity: 2, price: 18.99 },
      { id: "2", name: "Caesar Salad", quantity: 1, price: 12.99 }
    ],
    total: 50.97,
    status: "preparing",
    orderTime: "2024-01-15T18:30:00Z",
    estimatedTime: "2024-01-15T18:45:00Z"
  },
  {
    id: "2",
    tableNumber: "B3",
    items: [
      { id: "3", name: "Pasta Carbonara", quantity: 1, price: 16.99 }
    ],
    total: 16.99,
    status: "ready",
    orderTime: "2024-01-15T18:25:00Z",
    estimatedTime: "2024-01-15T18:37:00Z"
  }
]

const mockTables = [
  {
    id: "1",
    number: "A1",
    capacity: 4,
    status: "occupied",
    currentOrder: "1",
    reservation: null
  },
  {
    id: "2",
    number: "A2",
    capacity: 2,
    status: "available",
    currentOrder: null,
    reservation: null
  },
  {
    id: "3",
    number: "B1",
    capacity: 6,
    status: "reserved",
    currentOrder: null,
    reservation: {
      time: "2024-01-15T19:00:00Z",
      customerName: "John Smith",
      partySize: 4
    }
  }
]

const mockStaff = [
  {
    id: "1",
    name: "Chef Maria",
    role: "Head Chef",
    email: "maria@restaurant.com",
    phone: "+1-555-0123",
    isActive: true,
    shift: "Evening (4PM-12AM)",
    hourlyRate: 25.00
  },
  {
    id: "2",
    name: "Server Alex",
    role: "Waiter",
    email: "alex@restaurant.com",
    phone: "+1-555-0124",
    isActive: true,
    shift: "Evening (4PM-12AM)",
    hourlyRate: 15.00
  }
]

const orderStatusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  preparing: "bg-blue-100 text-blue-800",
  ready: "bg-green-100 text-green-800",
  served: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800"
}

const tableStatusColors = {
  available: "bg-green-100 text-green-800",
  occupied: "bg-red-100 text-red-800",
  reserved: "bg-yellow-100 text-yellow-800",
  cleaning: "bg-blue-100 text-blue-800"
}

// Define proper interfaces for the data types
interface MenuItem {
  id?: string
  name: string
  category: string
  price: number
  cost: number
  description: string
  isAvailable: boolean
  preparationTime: number
  image?: string
}

interface OrderItem {
  id: string
  name: string
  quantity: number
  price: number
  notes?: string
}

interface Order {
  id?: string
  tableNumber: string
  items: OrderItem[]
  total: number
  status: string
  notes?: string
  customerName?: string
  customerPhone?: string
  orderTime?: string
  estimatedTime?: string
}

interface TableReservation {
  time: string
  customerName: string
  partySize: number
  phone?: string
  notes?: string
}

interface Table {
  id?: string
  number: string
  capacity: number
  status: string
  currentOrder?: string | null
  reservation?: TableReservation | null
}

interface Staff {
  id?: string
  name: string
  role: string
  email: string
  phone: string
  isActive: boolean
  shift: string
  hourlyRate: number
  startDate?: string
  address?: string
  emergencyContact?: string
  emergencyPhone?: string
}

export default function RestaurantPage() {
  const [activeTab, setActiveTab] = useState("menu")
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems)
  const [orders, setOrders] = useState<Order[]>(mockOrders)
  const [tables, setTables] = useState<Table[]>(mockTables)
  const [staff, setStaff] = useState<Staff[]>(mockStaff)

  // Modal states
  const [menuItemModalOpen, setMenuItemModalOpen] = useState(false)
  const [orderModalOpen, setOrderModalOpen] = useState(false)
  const [tableModalOpen, setTableModalOpen] = useState(false)
  const [staffModalOpen, setStaffModalOpen] = useState(false)

  // View modal states
  const [viewingMenuItem, setViewingMenuItem] = useState<MenuItem | null>(null)
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null)
  const [viewingTable, setViewingTable] = useState<Table | null>(null)
  const [viewingStaff, setViewingStaff] = useState<Staff | null>(null)

  // Edit states
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [editingTable, setEditingTable] = useState<Table | null>(null)
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null)

  const handleAddNew = () => {
    switch (activeTab) {
      case "menu":
        setEditingMenuItem(null)
        setMenuItemModalOpen(true)
        break
      case "orders":
        setEditingOrder(null)
        setOrderModalOpen(true)
        break
      case "tables":
        setEditingTable(null)
        setTableModalOpen(true)
        break
      case "staff":
        setEditingStaff(null)
        setStaffModalOpen(true)
        break
    }
  }

  const handleEdit = (item: MenuItem | Order | Table | Staff, type: string) => {
    switch (type) {
      case "menu":
        setEditingMenuItem(item as MenuItem)
        setMenuItemModalOpen(true)
        break
      case "order":
        setEditingOrder(item as Order)
        setOrderModalOpen(true)
        break
      case "table":
        setEditingTable(item as Table)
        setTableModalOpen(true)
        break
      case "staff":
        setEditingStaff(item as Staff)
        setStaffModalOpen(true)
        break
    }
  }

  const handleDelete = (id: string, type: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      switch (type) {
        case "menu":
          setMenuItems(prev => prev.filter(item => item.id !== id))
          break
        case "order":
          setOrders(prev => prev.filter(item => item.id !== id))
          break
        case "table":
          setTables(prev => prev.filter(item => item.id !== id))
          break
        case "staff":
          setStaff(prev => prev.filter(item => item.id !== id))
          break
      }
    }
  }

  const handleView = (item: MenuItem | Order | Table | Staff, type: string) => {
    switch (type) {
      case "menu":
        setViewingMenuItem(item as MenuItem)
        break
      case "order":
        setViewingOrder(item as Order)
        break
      case "table":
        setViewingTable(item as Table)
        break
      case "staff":
        setViewingStaff(item as Staff)
        break
    }
  }

  const handleSaveMenuItem = (itemData: MenuItem) => {
    if (editingMenuItem) {
      setMenuItems(prev => prev.map(item => 
        item.id === editingMenuItem.id ? { ...itemData, id: editingMenuItem.id } : item
      ))
    } else {
      const newItem = { ...itemData, id: Date.now().toString() }
      setMenuItems(prev => [...prev, newItem])
    }
    setMenuItemModalOpen(false)
    setEditingMenuItem(null)
  }

  const handleSaveOrder = (orderData: Order) => {
    if (editingOrder) {
      setOrders(prev => prev.map(item => 
        item.id === editingOrder.id ? { ...orderData, id: editingOrder.id } : item
      ))
    } else {
      const newOrder = { ...orderData, id: Date.now().toString() }
      setOrders(prev => [...prev, newOrder])
    }
    setOrderModalOpen(false)
    setEditingOrder(null)
  }

  const handleSaveTable = (tableData: Table) => {
    if (editingTable) {
      setTables(prev => prev.map(item => 
        item.id === editingTable.id ? { ...tableData, id: editingTable.id } : item
      ))
    } else {
      const newTable = { ...tableData, id: Date.now().toString() }
      setTables(prev => [...prev, newTable])
    }
    setTableModalOpen(false)
    setEditingTable(null)
  }

  const handleSaveStaff = (staffData: Staff) => {
    if (editingStaff) {
      setStaff(prev => prev.map(item => 
        item.id === editingStaff.id ? { ...staffData, id: editingStaff.id } : item
      ))
    } else {
      const newStaff = { ...staffData, id: Date.now().toString() }
      setStaff(prev => [...prev, newStaff])
    }
    setStaffModalOpen(false)
    setEditingStaff(null)
  }

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getOrderStatusBadge = (status: string) => {
    return (
      <Badge className={orderStatusColors[status as keyof typeof orderStatusColors]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const getTableStatusBadge = (status: string) => {
    return (
      <Badge className={tableStatusColors[status as keyof typeof tableStatusColors]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
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
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold tracking-tight">Restaurant Management</h1>
                    <p className="text-muted-foreground">
                      Manage menu, orders, tables, and staff operations
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddNew}>
                      <IconPlus className="mr-2 h-4 w-4" />
                      Add New
                    </Button>
                  </div>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger value="menu" className="flex items-center gap-2">
                      <IconChefHat className="h-4 w-4" />
                      Menu
                    </TabsTrigger>
                    <TabsTrigger value="orders" className="flex items-center gap-2">
                      <IconReceipt className="h-4 w-4" />
                      Orders
                    </TabsTrigger>
                    <TabsTrigger value="tables" className="flex items-center gap-2">
                      <IconTable className="h-4 w-4" />
                      Tables
                    </TabsTrigger>
                    <TabsTrigger value="staff" className="flex items-center gap-2">
                      <IconUsers className="h-4 w-4" />
                      Staff
                    </TabsTrigger>
                    <TabsTrigger value="permissions" className="flex items-center gap-2">
                      <IconShield className="h-4 w-4" />
                      Permissions
                    </TabsTrigger>
                  </TabsList>

                  {/* Menu Tab */}
                  <TabsContent value="menu" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {menuItems.map((item) => (
                        <Card key={item.id} className="relative">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <CardTitle className="text-lg">{item.name}</CardTitle>
                                <CardDescription className="text-sm">
                                  {item.description}
                                </CardDescription>
                              </div>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm" onClick={() => handleView(item, 'menu')}>
                                  <IconEye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleEdit(item, 'menu')}>
                                  <IconEdit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(item.id || "", 'menu')}>
                                  <IconTrash className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Badge variant="outline">{item.category}</Badge>
                              <div className="text-right">
                                <div className="font-bold text-lg">${item.price}</div>
                                <div className="text-xs text-muted-foreground">Cost: ${item.cost}</div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-1">
                                <IconClock className="h-4 w-4" />
                                {item.preparationTime} min
                              </div>
                              <Badge variant={item.isAvailable ? "default" : "destructive"}>
                                {item.isAvailable ? "Available" : "Unavailable"}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Orders Tab */}
                  <TabsContent value="orders" className="space-y-4">
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <Card key={order.id}>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="text-2xl font-bold">#{order.id}</div>
                                <div>
                                  <div className="font-medium">Table {order.tableNumber}</div>
                                  <div className="text-sm text-muted-foreground">
                                    Ordered at {formatTime(order.orderTime || "")}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {getOrderStatusBadge(order.status)}
                                <div className="text-right">
                                  <div className="font-bold text-lg">${order.total}</div>
                                  <div className="text-xs text-muted-foreground">
                                    Est: {formatTime(order.estimatedTime || "")}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {order.items.map((item, index) => (
                                <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{item.quantity}x</span>
                                    <span>{item.name}</span>
                                  </div>
                                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                              ))}
                            </div>
                            <div className="flex gap-2 mt-4">
                              <Button variant="outline" size="sm" onClick={() => handleView(order, 'order')}>
                                <IconEye className="mr-2 h-4 w-4" />
                                View Details
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleEdit(order, 'order')}>
                                <IconEdit className="mr-2 h-4 w-4" />
                                Edit Order
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Tables Tab */}
                  <TabsContent value="tables" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {tables.map((table) => (
                        <Card key={table.id} className="relative">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <CardTitle className="text-lg">Table {table.number}</CardTitle>
                                <CardDescription className="text-sm">
                                  Capacity: {table.capacity} people
                                </CardDescription>
                              </div>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm" onClick={() => handleView(table, 'table')}>
                                  <IconEye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleEdit(table, 'table')}>
                                  <IconEdit className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                              {getTableStatusBadge(table.status)}
                              {table.currentOrder && (
                                <Badge variant="outline">Order #{table.currentOrder}</Badge>
                              )}
                            </div>
                            {table.reservation && (
                              <div className="p-3 bg-muted rounded-lg">
                                <div className="text-sm font-medium">Reservation</div>
                                <div className="text-xs text-muted-foreground">
                                  {formatTime(table.reservation.time)} - {table.reservation.customerName}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Staff Tab */}
                  <TabsContent value="staff" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {staff.map((member) => (
                        <Card key={member.id}>
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                <CardTitle className="text-lg">{member.name}</CardTitle>
                                <CardDescription className="text-sm">
                                  {member.role}
                                </CardDescription>
                              </div>
                              <div className="flex gap-1">
                                <Button variant="ghost" size="sm" onClick={() => handleView(member, 'staff')}>
                                  <IconEye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleEdit(member, 'staff')}>
                                  <IconEdit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(member.id || "", 'staff')}>
                                  <IconTrash className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <IconMapPin className="h-4 w-4" />
                                {member.email}
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <IconPhone className="h-4 w-4" />
                                {member.phone}
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline">{member.shift}</Badge>
                              <div className="text-right">
                                <div className="text-sm font-medium">${member.hourlyRate}/hr</div>
                                <Badge variant={member.isActive ? "default" : "destructive"}>
                                  {member.isActive ? "Active" : "Inactive"}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  {/* Permissions Tab */}
                  <TabsContent value="permissions" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {Object.entries(
                        STAFF_PERMISSIONS.filter(p => p.category === "Restaurant" || p.category === "Staff")
                          .reduce((acc, permission) => {
                            if (!acc[permission.category]) {
                              acc[permission.category] = []
                            }
                            acc[permission.category].push(permission)
                            return acc
                          }, {} as Record<string, typeof STAFF_PERMISSIONS>)
                      ).map(([category, permissions]) => (
                        <Card key={category}>
                          <CardHeader>
                            <CardTitle className="text-lg">{category}</CardTitle>
                            <CardDescription>
                              {permissions.length} permission{permissions.length !== 1 ? 's' : ''}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            {permissions.map((permission) => (
                              <div key={permission.key} className="flex items-center justify-between">
                                <div>
                                  <p className="text-sm font-medium">{permission.label}</p>
                                  <p className="text-xs text-muted-foreground">{permission.description}</p>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                  {permission.key}
                                </Badge>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>

      {/* Modals */}
      <MenuItemModal
        open={menuItemModalOpen}
        onOpenChange={setMenuItemModalOpen}
        item={editingMenuItem}
        onSave={handleSaveMenuItem}
      />

      <OrderModal
        open={orderModalOpen}
        onOpenChange={setOrderModalOpen}
        order={editingOrder}
        menuItems={menuItems}
        tables={tables}
        onSave={handleSaveOrder}
      />

      <TableModal
        open={tableModalOpen}
        onOpenChange={setTableModalOpen}
        table={editingTable}
        onSave={handleSaveTable}
      />

      <StaffModal
        open={staffModalOpen}
        onOpenChange={setStaffModalOpen}
        staff={editingStaff}
        onSave={handleSaveStaff}
      />

      {/* View Modals */}
      <MenuItemViewModal
        open={!!viewingMenuItem}
        onOpenChange={(open) => !open && setViewingMenuItem(null)}
        item={viewingMenuItem}
      />

      <OrderViewModal
        open={!!viewingOrder}
        onOpenChange={(open) => !open && setViewingOrder(null)}
        order={viewingOrder}
      />

      <TableViewModal
        open={!!viewingTable}
        onOpenChange={(open) => !open && setViewingTable(null)}
        table={viewingTable}
      />

      <StaffViewModal
        open={!!viewingStaff}
        onOpenChange={(open) => !open && setViewingStaff(null)}
        staff={viewingStaff}
      />
    </SidebarProvider>
  )
} 