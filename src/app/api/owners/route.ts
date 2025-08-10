import { NextRequest } from "next/server"
import { OwnerController } from "@/backend/controllers/OwnerController"
import { withErrorHandler } from "@/backend/middleware/errorHandler"

const ownerController = new OwnerController()

export const GET = withErrorHandler(async (request: NextRequest) => {
  return await ownerController.getAllOwners(request)
})

export const POST = withErrorHandler(async (request: NextRequest) => {
  return await ownerController.createOwner(request)
}) 