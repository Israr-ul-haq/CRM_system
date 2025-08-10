import { NextResponse } from "next/server"
import { AppDataSource } from "@/backend/database"
import { SoftwareProvider } from "@/backend/models/SoftwareProvider"
import { withErrorHandler } from "@/backend/middleware/errorHandler"

export const POST = withErrorHandler(async () => {
  try {
    await AppDataSource.initialize()
    
    // Get credentials from environment variables
    const name = process.env.SOFTWARE_PROVIDER_NAME || "Software Provider"
    const email = process.env.SOFTWARE_PROVIDER_EMAIL || "provider@possoftware.com"
    const password = process.env.SOFTWARE_PROVIDER_PASSWORD || "provider123"
    const companyName = process.env.SOFTWARE_PROVIDER_COMPANY || "POS Software Solutions Inc."
    
    // Check if software provider already exists
    const existingProvider = await AppDataSource.getRepository(SoftwareProvider).findOne({
      where: { email: email }
    })
    
    if (existingProvider) {
      return NextResponse.json({
        success: true,
        message: "Software Provider already exists",
        data: {
          name: existingProvider.name,
          email: existingProvider.email,
          company: existingProvider.techCompanyName
        }
      })
    }
    
    // Create the fixed software provider user
    const softwareProvider = AppDataSource.getRepository(SoftwareProvider).create({
      name: name,
      email: email,
      password: password, // In production, this should be hashed
      techCompanyName: companyName
    })
    
    const savedProvider = await AppDataSource.getRepository(SoftwareProvider).save(softwareProvider)
    
    return NextResponse.json({
      success: true,
      message: "Software Provider created successfully",
      data: {
        id: savedProvider.id,
        name: savedProvider.name,
        email: savedProvider.email,
        company: savedProvider.techCompanyName,
        createdAt: savedProvider.createdAt
      }
    }, { status: 201 })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}) 