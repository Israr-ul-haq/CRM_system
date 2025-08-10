import { DataSource } from "typeorm"
import { User } from "./models/User"
import { Owner } from "./models/Owner"
import { SoftwareProvider } from "./models/SoftwareProvider"

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME || "postgres",
  password: process.env.DB_PASSWORD || "@Dmin123",
  database: process.env.DB_NAME || "postgres",
  synchronize: true, // Enable auto-sync for automatic migration
  logging: process.env.NODE_ENV === "development",
  entities: [User, Owner, SoftwareProvider],
  // migrations: ["src/backend/migrations/*.ts"], // Temporarily disabled
  // migrationsTableName: "migrations", // Temporarily disabled
  subscribers: [],
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
})

// Initialize database connection
export const initializeDatabase = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize()
      console.log("✅ Database connection established successfully")
    }
  } catch (error) {
    console.error("❌ Database connection failed:", error)
    throw error
  }
}

// Get database connection
export const getDatabase = async () => {
  await initializeDatabase()
  return AppDataSource
}

// Run migrations
export const runMigrations = async () => {
  try {
    await initializeDatabase()
    await AppDataSource.runMigrations()
    console.log("✅ Migrations completed successfully")
  } catch (error) {
    console.error("❌ Migration failed:", error)
    throw error
  }
}

// Generate migration
export const generateMigration = async (name: string) => {
  try {
    await initializeDatabase()
    await AppDataSource.driver.createSchemaBuilder().log()
    console.log("✅ Migration generation completed")
  } catch (error) {
    console.error("❌ Migration generation failed:", error)
    throw error
  }
} 