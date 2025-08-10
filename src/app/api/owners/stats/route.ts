import { NextRequest } from "next/server"
import { OwnerController } from "@/backend/controllers/OwnerController"
import { withErrorHandler } from "@/backend/middleware/errorHandler"

const ownerController = new OwnerController()

export const GET = withErrorHandler(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url)
  const softwareProviderId = searchParams.get("softwareProviderId") || undefined
  return await ownerController.getOwnerStats(softwareProviderId)
}) 