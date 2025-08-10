#!/usr/bin/env ts-node

import { AppDataSource } from "../src/backend/database";
import { config } from "dotenv";
import * as fs from "fs";
import * as path from "path";

// Load environment variables
config();

async function generateMigration() {
  const migrationName = process.argv[2];

  if (!migrationName) {
    console.error("❌ Please provide a migration name");
    console.log("Usage: npm run migration:generate <migration-name>");
    process.exit(1);
  }

  try {
    console.log("🔄 Generating migration...");

    // Initialize database connection
    await AppDataSource.initialize();

    // Generate migration using TypeORM
    const timestamp = Date.now();
    const migrationFileName = `${timestamp}-${migrationName}.ts`;
    const migrationPath = path.join(
      __dirname,
      "../src/backend/migrations",
      migrationFileName
    );

    // Create migrations directory if it doesn't exist
    const migrationsDir = path.dirname(migrationPath);
    if (!fs.existsSync(migrationsDir)) {
      fs.mkdirSync(migrationsDir, { recursive: true });
    }

    // Get pending migrations
    const pendingMigrations = await AppDataSource.driver
      .createSchemaBuilder()
      .log();

    if (pendingMigrations.upQueries.length === 0) {
      console.log("📝 No pending migrations to generate");
      await AppDataSource.destroy();
      process.exit(0);
    }

    // Create migration file with actual SQL
    const upQueries = pendingMigrations.upQueries
      .map((query) => `        await queryRunner.query(\`${query.query}\`)`)
      .join("\n");
    const downQueries = pendingMigrations.downQueries
      .map((query) => `        await queryRunner.query(\`${query.query}\`)`)
      .join("\n");

    const migrationTemplate = `import { MigrationInterface, QueryRunner } from "typeorm"

export class ${migrationName}${timestamp} implements MigrationInterface {
    name = '${migrationName}${timestamp}'

    public async up(queryRunner: QueryRunner): Promise<void> {
${upQueries}
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
${downQueries}
    }
}
`;

    fs.writeFileSync(migrationPath, migrationTemplate);

    console.log(`✅ Migration file created: ${migrationFileName}`);
    console.log(`📁 Location: ${migrationPath}`);

    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to generate migration:", error);
    process.exit(1);
  }
}

generateMigration();
