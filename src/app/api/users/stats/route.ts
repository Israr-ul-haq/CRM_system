import { NextRequest } from "next/server"
import { UserController } from "@/backend/controllers/UserController"
import { withErrorHandler } from "@/backend/middleware/errorHandler"

const userController = new UserController()

// GET /api/users/stats - Get user statistics
export const GET = withErrorHandler(async (request: NextRequest) => {
  return await userController.getUserStats()
}) 