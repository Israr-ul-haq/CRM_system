import { AppDataSource } from "../database.js"
import { SoftwareProvider } from "../models/SoftwareProvider.js"
import { config } from "dotenv"

// Load environment variables
config()

async function createSoftwareProvider() {
  try {
    console.log("🔄 Creating Software Provider user...")
    
    // Initialize database connection
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
      console.log("✅ Software Provider already exists in database")
      console.log(`📧 Email: ${email}`)
      console.log(`🔑 Password: ${password}`)
      console.log(`🏢 Company: ${companyName}`)
      await AppDataSource.destroy()
      return
    }
    
    // Create the fixed software provider user
    const softwareProvider = AppDataSource.getRepository(SoftwareProvider).create({
      name: name,
      email: email,
      password: password, // In production, this should be hashed
      techCompanyName: companyName
    })
    
    await AppDataSource.getRepository(SoftwareProvider).save(softwareProvider)
    
    console.log("✅ Software Provider created successfully!")
    console.log(`📧 Email: ${email}`)
    console.log(`🔑 Password: ${password}`)
    console.log(`🏢 Company: ${companyName}`)
    
    await AppDataSource.destroy()
  } catch (error) {
    console.error("❌ Failed to create Software Provider:", error)
    process.exit(1)
  }
}

createSoftwareProvider() 