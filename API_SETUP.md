# TypeORM PostgreSQL API Setup

This project includes a simple API setup using TypeORM, PostgreSQL, and TypeScript.

## Prerequisites

1. PostgreSQL database installed and running
2. Node.js and npm installed

## Setup Instructions

### 1. Install Dependencies

```bash
npm install typeorm pg reflect-metadata class-validator class-transformer bcryptjs @types/bcryptjs
```

### 2. Database Configuration

Create a `.env.local` file in the root directory with your database credentials:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=pos_dashboard

# Node Environment
NODE_ENV=development
```

### 3. Create Database

Create a PostgreSQL database named `pos_dashboard`:

```sql
CREATE DATABASE pos_dashboard;
```

### 4. TypeScript Configuration

The `tsconfig.json` has been updated to include:
- `experimentalDecorators: true`
- `emitDecoratorMetadata: true`

## API Endpoints

### Test Database Connection
- **GET** `/api/test` - Test database connection

### Users API
- **GET** `/api/users` - Get all users
- **POST** `/api/users` - Create a new user
- **GET** `/api/users/[id]` - Get user by ID
- **PUT** `/api/users/[id]` - Update user
- **DELETE** `/api/users/[id]` - Delete user

## Test the API

1. Start the development server:
```bash
npm run dev
```

2. Visit `/api-test` to test the API functionality

3. Or use curl to test the endpoints:

```bash
# Test database connection
curl http://localhost:3000/api/test

# Get all users
curl http://localhost:3000/api/users

# Create a new user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","phone":"1234567890","role":"user"}'
```

## Database Schema

The API automatically creates the following table:

### Users Table
- `id` (UUID, Primary Key)
- `name` (VARCHAR(100))
- `email` (VARCHAR, Unique)
- `phone` (VARCHAR(20), Optional)
- `role` (VARCHAR(100), Optional)
- `isActive` (BOOLEAN, Default: true)
- `createdAt` (TIMESTAMP)
- `updatedAt` (TIMESTAMP)

## Features

- ✅ TypeORM with PostgreSQL
- ✅ TypeScript support
- ✅ Automatic table creation (synchronize: true)
- ✅ UUID primary keys
- ✅ Timestamps (createdAt, updatedAt)
- ✅ Full CRUD operations
- ✅ Error handling
- ✅ JSON responses

## Next Steps

1. Add more entities (Inventory, Customers, Staff, etc.)
2. Implement authentication and authorization
3. Add input validation with Zod
4. Create database migrations
5. Add more complex queries and relationships 