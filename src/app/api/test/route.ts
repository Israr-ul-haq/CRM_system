import { NextResponse } from "next/server"
import { getDatabase } from "@/backend/database"
import { withErrorHandler } from "@/backend/middleware/errorHandler"

export const GET = withErrorHandler(async () => {
  const dataSource = await getDatabase()
  
  return NextResponse.json({
    success: true,
    message: "Database connection successful",
    timestamp: new Date().toISOString(),
    database: {
      isInitialized: dataSource.isInitialized,
      type: "postgresql"
    }
  })
}) 