import { NextRequest, NextResponse } from "next/server"
import { UserService } from "../services/UserService"

export class UserController {
  private userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  // GET /api/users - Get all users
  async getUsers(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url)
      const page = parseInt(searchParams.get("page") || "1")
      const limit = parseInt(searchParams.get("limit") || "10")
      const search = searchParams.get("search") || undefined

      const result = await this.userService.getAllUsers(page, limit, search)

      return NextResponse.json({
        success: true,
        data: result.users,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: result.totalPages
        }
      })
    } catch (error) {
      console.error("Error fetching users:", error)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch users"
        },
        { status: 500 }
      )
    }
  }

  // GET /api/users/[id] - Get user by ID
  async getUserById(id: string) {
    try {
      const user = await this.userService.getUserById(id)

      if (!user) {
        return NextResponse.json(
          {
            success: false,
            error: "User not found"
          },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: user
      })
    } catch (error) {
      console.error("Error fetching user:", error)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch user"
        },
        { status: 500 }
      )
    }
  }

  // POST /api/users - Create new user
  async createUser(request: NextRequest) {
    try {
      const body = await request.json()
      const { name, email, phone, role } = body

      // Basic validation
      if (!name || !email) {
        return NextResponse.json(
          {
            success: false,
            error: "Name and email are required"
          },
          { status: 400 }
        )
      }

      const user = await this.userService.createUser({
        name,
        email,
        phone,
        role: role || "user"
      })

      return NextResponse.json({
        success: true,
        data: user
      }, { status: 201 })
    } catch (error) {
      console.error("Error creating user:", error)
      
      if (error instanceof Error && error.message.includes("already exists")) {
        return NextResponse.json(
          {
            success: false,
            error: error.message
          },
          { status: 400 }
        )
      }

      return NextResponse.json(
        {
          success: false,
          error: "Failed to create user"
        },
        { status: 500 }
      )
    }
  }

  // PUT /api/users/[id] - Update user
  async updateUser(id: string, request: NextRequest) {
    try {
      const body = await request.json()
      
      const user = await this.userService.updateUser(id, body)

      return NextResponse.json({
        success: true,
        data: user
      })
    } catch (error) {
      console.error("Error updating user:", error)
      
      if (error instanceof Error && error.message.includes("not found")) {
        return NextResponse.json(
          {
            success: false,
            error: error.message
          },
          { status: 404 }
        )
      }

      if (error instanceof Error && error.message.includes("already exists")) {
        return NextResponse.json(
          {
            success: false,
            error: error.message
          },
          { status: 400 }
        )
      }

      return NextResponse.json(
        {
          success: false,
          error: "Failed to update user"
        },
        { status: 500 }
      )
    }
  }

  // DELETE /api/users/[id] - Delete user
  async deleteUser(id: string) {
    try {
      await this.userService.deleteUser(id)

      return NextResponse.json({
        success: true,
        message: "User deleted successfully"
      })
    } catch (error) {
      console.error("Error deleting user:", error)
      
      if (error instanceof Error && error.message.includes("not found")) {
        return NextResponse.json(
          {
            success: false,
            error: error.message
          },
          { status: 404 }
        )
      }

      return NextResponse.json(
        {
          success: false,
          error: "Failed to delete user"
        },
        { status: 500 }
      )
    }
  }

  // GET /api/users/stats - Get user statistics
  async getUserStats() {
    try {
      const [totalUsers, activeUsers] = await Promise.all([
        this.userService.getUsersCount(),
        this.userService.getActiveUsersCount()
      ])

      return NextResponse.json({
        success: true,
        data: {
          totalUsers,
          activeUsers,
          inactiveUsers: totalUsers - activeUsers
        }
      })
    } catch (error) {
      console.error("Error fetching user stats:", error)
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch user statistics"
        },
        { status: 500 }
      )
    }
  }
} 