# TypeORM Automated Migrations Guide

This project includes a complete automated migration system using TypeORM with PostgreSQL.

## 🚀 Quick Start

### 1. Run Initial Migration
```bash
npm run migration:run
```

### 2. Check Migration Status
```bash
npm run migration:show
```

### 3. Generate New Migration
```bash
npm run migration:generate AddNewTable
```

## 📋 Available Commands

| Command | Description |
|---------|-------------|
| `npm run migration:run` | Run all pending migrations |
| `npm run migration:generate <name>` | Generate a new migration file |
| `npm run migration:revert` | Revert the last migration |
| `npm run migration:show` | Show migration status |
| `npm run db:sync` | Development mode with auto-sync |
| `npm run db:migrate` | Alias for migration:run |

## 🌐 Web Interface

Visit `/migrations` to manage migrations through the web interface:
- View migration status
- Run migrations
- Revert last migration
- See applied and pending migrations

## 📁 Migration Files

Migrations are stored in `src/migrations/` with the format:
```
{timestamp}-{migration-name}.ts
```

Example: `1703123456789-CreateInitialTables.ts`

## 🔧 Configuration

### Environment Variables
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=pos_dashboard

# Development
NODE_ENV=development
USE_SYNC=false  # Set to "true" for auto-sync in development
```

### Database Configuration
- **Development**: `synchronize: false` (use migrations)
- **Production**: `synchronize: false` (always use migrations)
- **Auto-sync**: Set `USE_SYNC=true` for development auto-sync

## 📝 Creating Migrations

### 1. Automatic Generation
```bash
npm run migration:generate AddUserTable
```

### 2. Manual Creation
Create a file in `src/migrations/` with the template:

```typescript
import { MigrationInterface, QueryRunner, Table } from "typeorm"

export class AddUserTable1703123456789 implements MigrationInterface {
    name = 'AddUserTable1703123456789'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "name",
                        type: "character varying",
                        length: "100",
                    },
                    // ... more columns
                ],
            }),
            true
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("users")
    }
}
```

## 🔄 Migration Workflow

### Development Workflow
1. **Make changes** to entities
2. **Generate migration**: `npm run migration:generate DescriptiveName`
3. **Review** the generated migration file
4. **Run migration**: `npm run migration:run`
5. **Test** your changes

### Production Workflow
1. **Deploy** your code
2. **Run migrations**: `npm run migration:run`
3. **Verify** database schema

## 🛠️ API Endpoints

### Migration Management API
- **GET** `/api/migrations` - Get migration status
- **POST** `/api/migrations` - Run or revert migrations

```javascript
// Check status
const response = await fetch('/api/migrations')
const status = await response.json()

// Run migrations
const response = await fetch('/api/migrations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ action: 'run' })
})

// Revert last migration
const response = await fetch('/api/migrations', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ action: 'revert' })
})
```

## ⚠️ Important Notes

### 1. Never Use Synchronize in Production
```typescript
// ❌ Bad for production
synchronize: true

// ✅ Good for production
synchronize: false
```

### 2. Always Test Migrations
- Test `up()` and `down()` methods
- Use staging environment first
- Backup database before running migrations

### 3. Migration Naming
- Use descriptive names: `AddUserTable`, `UpdateProductSchema`
- Avoid generic names: `Migration1`, `Update1`

### 4. Rollback Strategy
- Always implement `down()` method
- Test rollback functionality
- Keep backups before major migrations

## 🐛 Troubleshooting

### Common Issues

1. **Migration already exists**
   ```bash
   # Check applied migrations
   npm run migration:show
   ```

2. **Database connection failed**
   ```bash
   # Check environment variables
   echo $DB_HOST $DB_PORT $DB_NAME
   ```

3. **Migration fails**
   ```bash
   # Check logs
   npm run migration:run 2>&1 | grep -i error
   ```

### Reset Database (Development Only)
```bash
# Drop and recreate database
DROP DATABASE pos_dashboard;
CREATE DATABASE pos_dashboard;

# Run all migrations
npm run migration:run
```

## 📊 Migration Status

The system tracks:
- ✅ Applied migrations
- ⏳ Pending migrations
- 🔄 Migration history
- 📊 Database connection status

## 🔐 Security

- Migrations run with database credentials
- API endpoints should be protected in production
- Use environment variables for sensitive data
- Never commit database passwords to version control

## 🚀 Best Practices

1. **One change per migration** - Keep migrations focused
2. **Test both directions** - Up and down migrations
3. **Use transactions** - Wrap migrations in transactions
4. **Version control** - Commit migration files
5. **Documentation** - Add comments to complex migrations
6. **Backup** - Always backup before running migrations
7. **Staging** - Test migrations in staging first 