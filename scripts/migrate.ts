#!/usr/bin/env ts-node

import { runMigrations } from "../src/backend/database"
import { config } from "dotenv"

// Load environment variables
config()

async function migrate() {
  try {
    console.log("🔄 Starting database migrations...")
    await runMigrations()
    console.log("✅ All migrations completed successfully!")
    process.exit(0)
  } catch (error) {
    console.error("❌ Migration failed:", error)
    process.exit(1)
  }
}

migrate() 