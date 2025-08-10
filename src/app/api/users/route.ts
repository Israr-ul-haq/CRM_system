import { NextRequest } from "next/server"
import { UserController } from "@/backend/controllers/UserController"
import { withErrorHandler } from "@/backend/middleware/errorHandler"

const userController = new UserController()

// GET /api/users - Get all users
export const GET = withErrorHandler(async (request: NextRequest) => {
  return await userController.getUsers(request)
})

// POST /api/users - Create new user
export const POST = withErrorHandler(async (request: NextRequest) => {
  return await userController.createUser(request)
}) 