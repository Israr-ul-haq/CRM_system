"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

interface User {
  id: string
  name: string
  email: string
  phone?: string
  role?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface UserStats {
  totalUsers: number
  activeUsers: number
  inactiveUsers: number
}

export default function ApiTestPage() {
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    phone: "",
    role: "user"
  })

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/users")
      const data = await response.json()
      
      if (data.success) {
        setUsers(data.data)
        toast.success(`Fetched ${data.data.length} users`)
      } else {
        toast.error(data.error || "Failed to fetch users")
      }
    } catch (error) {
      toast.error("Error fetching users")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch user statistics
  const fetchStats = async () => {
    try {
      const response = await fetch("/api/users/stats")
      const data = await response.json()
      
      if (data.success) {
        setStats(data.data)
        toast.success("User statistics updated")
      } else {
        toast.error(data.error || "Failed to fetch statistics")
      }
    } catch (error) {
      toast.error("Error fetching statistics")
      console.error(error)
    }
  }

  // Create new user
  const createUser = async () => {
    if (!newUser.name || !newUser.email) {
      toast.error("Name and email are required")
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success("User created successfully")
        setNewUser({ name: "", email: "", phone: "", role: "user" })
        fetchUsers() // Refresh the list
        fetchStats() // Refresh stats
      } else {
        toast.error(data.error || "Failed to create user")
      }
    } catch (error) {
      toast.error("Error creating user")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  // Delete user
  const deleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return

    setLoading(true)
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success("User deleted successfully")
        fetchUsers() // Refresh the list
        fetchStats() // Refresh stats
      } else {
        toast.error(data.error || "Failed to delete user")
      }
    } catch (error) {
      toast.error("Error deleting user")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
    fetchStats()
  }, [])

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Backend API Test Page</h1>
      
      {/* Test Database Connection */}
      <Card>
        <CardHeader>
          <CardTitle>Database Connection Test</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={async () => {
              try {
                const response = await fetch("/api/test")
                const data = await response.json()
                if (data.success) {
                  toast.success("Database connection successful")
                  console.log("Database info:", data.database)
                } else {
                  toast.error("Database connection failed")
                }
              } catch (error) {
                toast.error("Error testing database connection")
              }
            }}
            disabled={loading}
          >
            Test Database Connection
          </Button>
        </CardContent>
      </Card>

      {/* User Statistics */}
      {stats && (
        <Card>
          <CardHeader>
            <CardTitle>User Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
                <p className="text-sm text-gray-600">Total Users</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.activeUsers}</div>
                <p className="text-sm text-gray-600">Active Users</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.inactiveUsers}</div>
                <p className="text-sm text-gray-600">Inactive Users</p>
              </div>
            </div>
            <Button onClick={fetchStats} className="mt-4" disabled={loading}>
              Refresh Stats
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create New User */}
      <Card>
        <CardHeader>
          <CardTitle>Create New User</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            />
            <Input
              placeholder="Email"
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <Input
              placeholder="Phone (optional)"
              value={newUser.phone}
              onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
            />
            <Input
              placeholder="Role (optional)"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            />
          </div>
          <Button onClick={createUser} disabled={loading}>
            Create User
          </Button>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Button onClick={fetchUsers} disabled={loading}>
              Refresh Users
            </Button>
            
            {loading && <p>Loading...</p>}
            
            {users.length === 0 && !loading && (
              <p className="text-gray-500">No users found</p>
            )}
            
            <div className="grid gap-4">
              {users.map((user) => (
                <Card key={user.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      {user.phone && <p className="text-sm text-gray-600">{user.phone}</p>}
                      {user.role && <p className="text-sm text-gray-600">Role: {user.role}</p>}
                      <p className="text-xs text-gray-500">
                        Created: {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                      <span className={`inline-block px-2 py-1 text-xs rounded ${
                        user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteUser(user.id)}
                      disabled={loading}
                    >
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 