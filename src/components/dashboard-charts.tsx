"use client"

import * as React from "react"
import { 
  Area, 
  AreaChart, 
  Bar, 
  BarChart, 
  CartesianGrid, 
  Cell, 
  Line, 
  LineChart, 
  Pie, 
  PieChart, 
  ResponsiveContainer, 
  XAxis, 
  YAxis,
  Tooltip,
  Legend
} from "recharts"
import { 
  IconPackage, 
  IconReceipt, 
  IconUsers, 
  IconUserCheck,
  IconCurrencyDollar,
  IconShoppingCart,
  IconBuilding,
  IconCreditCard,
  IconTrendingUp,
  IconTrendingDown
} from "@tabler/icons-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

// Sales data for the last 30 days
const salesData = [
  { date: "Dec 01", sales: 8500, transactions: 32, customers: 28 },
  { date: "Dec 02", sales: 9200, transactions: 35, customers: 31 },
  { date: "Dec 03", sales: 7800, transactions: 29, customers: 25 },
  { date: "Dec 04", sales: 10500, transactions: 38, customers: 34 },
  { date: "Dec 05", sales: 11200, transactions: 42, customers: 38 },
  { date: "Dec 06", sales: 9800, transactions: 36, customers: 32 },
  { date: "Dec 07", sales: 12450, transactions: 45, customers: 41 },
  { date: "Dec 08", sales: 11800, transactions: 43, customers: 39 },
  { date: "Dec 09", sales: 13200, transactions: 48, customers: 44 },
  { date: "Dec 10", sales: 14500, transactions: 52, customers: 47 },
  { date: "Dec 11", sales: 12800, transactions: 46, customers: 42 },
  { date: "Dec 12", sales: 15600, transactions: 55, customers: 50 },
  { date: "Dec 13", sales: 14200, transactions: 51, customers: 46 },
  { date: "Dec 14", sales: 16800, transactions: 58, customers: 53 },
  { date: "Dec 15", sales: 15200, transactions: 54, customers: 49 },
  { date: "Dec 16", sales: 17800, transactions: 61, customers: 56 },
  { date: "Dec 17", sales: 16500, transactions: 58, customers: 53 },
  { date: "Dec 18", sales: 19200, transactions: 65, customers: 60 },
  { date: "Dec 19", sales: 17500, transactions: 62, customers: 57 },
  { date: "Dec 20", sales: 20800, transactions: 68, customers: 63 },
  { date: "Dec 21", sales: 18900, transactions: 64, customers: 59 },
  { date: "Dec 22", sales: 22400, transactions: 72, customers: 67 },
  { date: "Dec 23", sales: 20100, transactions: 69, customers: 64 },
  { date: "Dec 24", sales: 23800, transactions: 75, customers: 70 },
  { date: "Dec 25", sales: 21500, transactions: 71, customers: 66 },
  { date: "Dec 26", sales: 25200, transactions: 78, customers: 73 },
  { date: "Dec 27", sales: 22800, transactions: 74, customers: 69 },
  { date: "Dec 28", sales: 26600, transactions: 81, customers: 76 },
  { date: "Dec 29", sales: 24100, transactions: 77, customers: 72 },
  { date: "Dec 30", sales: 28000, transactions: 84, customers: 79 },
]

// Payment method distribution
const paymentMethodData = [
  { name: "Cash", value: 65, color: "#10b981" },
  { name: "Customer Credit", value: 20, color: "#3b82f6" },
  { name: "Staff Credit", value: 15, color: "#8b5cf6" },
]

// Top selling categories
const categoryData = [
  { name: "Electronics", sales: 45000, items: 1250 },
  { name: "Clothing", sales: 32000, items: 890 },
  { name: "Home & Garden", sales: 28000, items: 750 },
  { name: "Sports", sales: 22000, items: 620 },
  { name: "Books", sales: 18000, items: 450 },
  { name: "Toys", sales: 15000, items: 380 },
]

// Customer credit status
const customerCreditData = [
  { name: "Available Credit", value: 26450, color: "#10b981" },
  { name: "Used Credit", value: 18750, color: "#f59e0b" },
  { name: "Overdue", value: 3200, color: "#ef4444" },
]

// Staff attendance data
const staffAttendanceData = [
  { name: "Present", value: 21, color: "#10b981" },
  { name: "On Leave", value: 2, color: "#3b82f6" },
  { name: "Absent", value: 1, color: "#ef4444" },
]

// Inventory status
const inventoryStatusData = [
  { name: "In Stock", value: 1180, color: "#10b981" },
  { name: "Low Stock", value: 45, color: "#f59e0b" },
  { name: "Out of Stock", value: 22, color: "#ef4444" },
]

// Supplier payment status
const supplierPaymentData = [
  { name: "Paid", value: 45200, color: "#10b981" },
  { name: "Pending", value: 15600, color: "#f59e0b" },
  { name: "Overdue", value: 7000, color: "#ef4444" },
]

export function DashboardCharts() {
  const [timeRange, setTimeRange] = React.useState("30")

  return (
    <div className="space-y-6">
      {/* Sales Overview Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <IconReceipt className="h-5 w-5" />
                Sales Overview
              </CardTitle>
              <CardDescription>
                Daily sales performance and transaction trends
              </CardDescription>
            </div>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="sales" 
                stackId="1" 
                stroke="#10b981" 
                fill="#10b981" 
                fillOpacity={0.3}
                name="Sales ($)"
              />
              <Area 
                type="monotone" 
                dataKey="transactions" 
                stackId="2" 
                stroke="#3b82f6" 
                fill="#3b82f6" 
                fillOpacity={0.3}
                name="Transactions"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconCreditCard className="h-5 w-5" />
              Payment Methods
            </CardTitle>
            <CardDescription>
              Distribution of payment methods used
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Customer Credit Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconUserCheck className="h-5 w-5" />
              Customer Credit Status
            </CardTitle>
            <CardDescription>
              Current credit utilization and status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={customerCreditData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {customerCreditData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Selling Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconPackage className="h-5 w-5" />
              Top Selling Categories
            </CardTitle>
            <CardDescription>
              Sales performance by product category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Sales']} />
                <Bar dataKey="sales" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Staff Attendance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconUsers className="h-5 w-5" />
              Staff Attendance Today
            </CardTitle>
            <CardDescription>
              Current staff attendance status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={staffAttendanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {staffAttendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Inventory Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconPackage className="h-5 w-5" />
              Inventory Status
            </CardTitle>
            <CardDescription>
              Current inventory levels and alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={inventoryStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {inventoryStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Supplier Payment Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconBuilding className="h-5 w-5" />
              Supplier Payment Status
            </CardTitle>
            <CardDescription>
              Outstanding payments to suppliers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={supplierPaymentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {supplierPaymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconCurrencyDollar className="h-5 w-5" />
            Detailed Analytics
          </CardTitle>
          <CardDescription>
            Comprehensive business metrics and trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sales" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="customers">Customers</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="staff">Staff</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sales" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <IconTrendingUp className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-600">Total Sales</span>
                  </div>
                  <p className="text-2xl font-bold">$280,000</p>
                  <p className="text-sm text-muted-foreground">This month</p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <IconShoppingCart className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-blue-600">Transactions</span>
                  </div>
                  <p className="text-2xl font-bold">1,247</p>
                  <p className="text-sm text-muted-foreground">This month</p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <IconUserCheck className="h-5 w-5 text-purple-600" />
                    <span className="font-semibold text-purple-600">Customers</span>
                  </div>
                  <p className="text-2xl font-bold">892</p>
                  <p className="text-sm text-muted-foreground">This month</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="customers" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <IconUserCheck className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-blue-600">Active Customers</span>
                  </div>
                  <p className="text-2xl font-bold">156</p>
                  <p className="text-sm text-muted-foreground">With credit accounts</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <IconCreditCard className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-600">Credit Limit</span>
                  </div>
                  <p className="text-2xl font-bold">$45,200</p>
                  <p className="text-sm text-muted-foreground">Total available</p>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <IconTrendingUp className="h-5 w-5 text-orange-600" />
                    <span className="font-semibold text-orange-600">Credit Used</span>
                  </div>
                  <p className="text-2xl font-bold">$18,750</p>
                  <p className="text-sm text-muted-foreground">42% utilization</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="inventory" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <IconPackage className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-600">Total Items</span>
                  </div>
                  <p className="text-2xl font-bold">1,247</p>
                  <p className="text-sm text-muted-foreground">In inventory</p>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <IconTrendingDown className="h-5 w-5 text-orange-600" />
                    <span className="font-semibold text-orange-600">Low Stock</span>
                  </div>
                  <p className="text-2xl font-bold">12</p>
                  <p className="text-sm text-muted-foreground">Items need restocking</p>
                </div>
                <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <IconTrendingDown className="h-5 w-5 text-red-600" />
                    <span className="font-semibold text-red-600">Out of Stock</span>
                  </div>
                  <p className="text-2xl font-bold">22</p>
                  <p className="text-sm text-muted-foreground">Items unavailable</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="staff" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <IconUsers className="h-5 w-5 text-purple-600" />
                    <span className="font-semibold text-purple-600">Total Staff</span>
                  </div>
                  <p className="text-2xl font-bold">24</p>
                  <p className="text-sm text-muted-foreground">Active employees</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <IconTrendingUp className="h-5 w-5 text-green-600" />
                    <span className="font-semibold text-green-600">Present Today</span>
                  </div>
                  <p className="text-2xl font-bold">21</p>
                  <p className="text-sm text-muted-foreground">87.5% attendance</p>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <IconCurrencyDollar className="h-5 w-5 text-blue-600" />
                    <span className="font-semibold text-blue-600">Salary Budget</span>
                  </div>
                  <p className="text-2xl font-bold">$125K</p>
                  <p className="text-sm text-muted-foreground">Monthly budget</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
} 