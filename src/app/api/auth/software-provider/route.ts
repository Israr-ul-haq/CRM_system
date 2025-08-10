import { NextRequest, NextResponse } from "next/server"
import { AppDataSource } from "@/backend/database"
import { SoftwareProvider } from "@/backend/models/SoftwareProvider"
import { withErrorHandler } from "@/backend/middleware/errorHandler"

export const POST = withErrorHandler(async (request: NextRequest) => {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: "Email and password are required"
      }, { status: 400 })
    }

    // Initialize database if not already initialized
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize()
    }
    
    // Find software provider by email
    const softwareProvider = await AppDataSource.getRepository(SoftwareProvider).findOne({
      where: { email: email }
    })
    
    if (!softwareProvider) {
      return NextResponse.json({
        success: false,
        error: "Software provider not found"
      }, { status: 404 })
    }

    // Check password (in production, this should be hashed)
    if (softwareProvider.password !== password) {
      return NextResponse.json({
        success: false,
        error: "Invalid password"
      }, { status: 401 })
    }

    // Check if user is active
    if (!softwareProvider.isActive) {
      return NextResponse.json({
        success: false,
        error: "Account is inactive"
      }, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      message: "Authentication successful",
      data: {
        id: softwareProvider.id,
        name: softwareProvider.name,
        email: softwareProvider.email,
        company: softwareProvider.techCompanyName,
        userType: "softwareProvider"
      }
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Authentication failed"
    }, { status: 500 })
  }
}) 