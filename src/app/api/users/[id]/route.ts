import { NextRequest } from "next/server"
import { UserController } from "@/backend/controllers/UserController"
import { withErrorHandler } from "@/backend/middleware/errorHandler"

const userController = new UserController()

// GET /api/users/[id] - Get user by ID
export const GET = withErrorHandler(async (
  request: NextRequest,
  ...args: unknown[]
) => {
  const { params } = args[0] as { params: { id: string } }
  return await userController.getUserById(params.id)
})

// PUT /api/users/[id] - Update user
export const PUT = withErrorHandler(async (
  request: NextRequest,
  ...args: unknown[]
) => {
  const { params } = args[0] as { params: { id: string } }
  return await userController.updateUser(params.id, request)
})

// DELETE /api/users/[id] - Delete user
export const DELETE = withErrorHandler(async (
  request: NextRequest,
  ...args: unknown[]
) => {
  const { params } = args[0] as { params: { id: string } }
  return await userController.deleteUser(params.id)
}) 