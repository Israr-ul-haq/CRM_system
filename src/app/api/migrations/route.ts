import { NextRequest, NextResponse } from "next/server"
import { runMigrations, AppDataSource } from "@/backend/database"
import { withErrorHandler } from "@/backend/middleware/errorHandler"

// GET /api/migrations - Get migration status
export const GET = withErrorHandler(async () => {
  await AppDataSource.initialize()
  
  const migrations = await AppDataSource.showMigrations()
  const pendingMigrations = await AppDataSource.driver.createSchemaBuilder().log()
  
  return NextResponse.json({
    success: true,
    data: {
      migrations,
      pendingMigrations: pendingMigrations.upQueries.length,
      isInitialized: AppDataSource.isInitialized
    }
  })
})

// POST /api/migrations - Run migrations
export const POST = withErrorHandler(async (request: NextRequest) => {
  const body = await request.json()
  const { action } = body

  if (action === "run") {
    await runMigrations()
    return NextResponse.json({
      success: true,
      message: "Migrations completed successfully"
    })
  } else if (action === "revert") {
    await AppDataSource.initialize()
    await AppDataSource.undoLastMigration()
    await AppDataSource.destroy()
    
    return NextResponse.json({
      success: true,
      message: "Last migration reverted successfully"
    })
  } else {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid action. Use 'run' or 'revert'"
      },
      { status: 400 }
    )
  }
}) 