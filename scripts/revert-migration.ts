#!/usr/bin/env ts-node

import { AppDataSource } from "../src/backend/database"
import { config } from "dotenv"

// Load environment variables
config()

async function revertMigration() {
  try {
    console.log("🔄 Reverting last migration...")
    
    // Initialize database connection
    await AppDataSource.initialize()
    
    // Revert the last migration
    await AppDataSource.undoLastMigration()
    
    console.log("✅ Last migration reverted successfully!")
    
    await AppDataSource.destroy()
    process.exit(0)
  } catch (error) {
    console.error("❌ Failed to revert migration:", error)
    process.exit(1)
  }
}

revertMigration() 