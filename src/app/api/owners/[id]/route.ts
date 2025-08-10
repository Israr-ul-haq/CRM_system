import { NextRequest } from "next/server"
import { OwnerController } from "@/backend/controllers/OwnerController"
import { withErrorHandler } from "@/backend/middleware/errorHandler"

const ownerController = new OwnerController()

export const GET = withErrorHandler(async (request: NextRequest, ...args: unknown[]) => {
  const params = args[0] as { params: { id: string } }
  const { id } = params.params
  const { searchParams } = new URL(request.url)
  const softwareProviderId = searchParams.get("softwareProviderId") || undefined
  return await ownerController.getOwnerById(id, softwareProviderId)
})

export const PUT = withErrorHandler(async (request: NextRequest, ...args: unknown[]) => {
  const params = args[0] as { params: { id: string } }
  const { id } = params.params
  const { searchParams } = new URL(request.url)
  const softwareProviderId = searchParams.get("softwareProviderId") || undefined
  return await ownerController.updateOwner(id, request, softwareProviderId)
})

export const DELETE = withErrorHandler(async (request: NextRequest, ...args: unknown[]) => {
  const params = args[0] as { params: { id: string } }
  const { id } = params.params
  const { searchParams } = new URL(request.url)
  const softwareProviderId = searchParams.get("softwareProviderId") || undefined
  return await ownerController.deleteOwner(id, softwareProviderId)
}) 