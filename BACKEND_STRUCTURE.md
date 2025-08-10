# Backend Structure Documentation

This project has a well-organized backend structure within the Next.js application, following clean architecture principles.

## 📁 Folder Structure

```
src/
├── backend/                    # Backend logic
│   ├── config/                 # Configuration files
│   │   └── constants.ts        # Application constants
│   ├── controllers/            # HTTP request handlers
│   │   └── UserController.ts   # User-related controllers
│   ├── middleware/             # Middleware functions
│   │   └── errorHandler.ts     # Error handling middleware
│   ├── migrations/             # Database migrations
│   │   └── 1703123456789-CreateInitialTables.ts
│   ├── models/                 # TypeORM entities
│   │   └── User.ts            # User entity
│   ├── services/               # Business logic layer
│   │   └── UserService.ts     # User business logic
│   ├── utils/                  # Utility functions
│   │   └── validation.ts      # Validation schemas
│   └── database.ts            # Database configuration
├── app/                        # Next.js app router
│   └── api/                    # API routes (Next.js handles routing)
│       ├── users/              # User API endpoints
│       ├── test/               # Test endpoints
│       └── migrations/         # Migration endpoints
└── components/                 # Frontend components
```

## 🏗️ Architecture Layers

### 1. **Models Layer** (`/models`)
- TypeORM entities
- Database schema definitions
- Data validation decorators

### 2. **Services Layer** (`/services`)
- Business logic implementation
- Data processing and manipulation
- External service integrations

### 3. **Controllers Layer** (`/controllers`)
- HTTP request/response handling
- Input validation
- Response formatting

### 4. **Middleware Layer** (`/middleware`)
- Error handling
- Authentication/Authorization
- Request/Response processing

### 5. **Utils Layer** (`/utils`)
- Validation schemas (Zod)
- Helper functions
- Common utilities

### 6. **Config Layer** (`/config`)
- Application constants
- Environment configurations
- Shared settings

## 🔄 Data Flow

```
Next.js API Route → Controller → Service → Model → Database
    ↑                                                      ↓
Response ← Controller ← Service ← Model ← Database
```

## 📝 Key Components

### **UserController** (`/controllers/UserController.ts`)
- Handles HTTP requests for user operations
- Input validation and error handling
- Response formatting

### **UserService** (`/services/UserService.ts`)
- Contains business logic for user operations
- Database operations through repositories
- Data processing and validation

### **User Model** (`/models/User.ts`)
- TypeORM entity definition
- Database schema mapping
- Validation decorators

### **Error Handler** (`/middleware/errorHandler.ts`)
- Centralized error handling
- Custom error classes
- Consistent error responses

### **Validation** (`/utils/validation.ts`)
- Zod validation schemas
- Type definitions
- Validation helper functions

## 🚀 Usage Examples

### Creating a New Entity

1. **Create Model** (`/models/Product.ts`)
```typescript
@Entity("products")
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id!: string

  @Column({ length: 200 })
  name!: string

  // ... other fields
}
```

2. **Create Service** (`/services/ProductService.ts`)
```typescript
export class ProductService {
  async getAllProducts() {
    // Business logic here
  }
}
```

3. **Create Controller** (`/controllers/ProductController.ts`)
```typescript
export class ProductController {
  async getProducts(request: NextRequest) {
    // HTTP handling here
  }
}
```

4. **Create API Route** (`/app/api/products/route.ts`)
```typescript
export const GET = withErrorHandler(async (request: NextRequest) => {
  return await productController.getProducts(request)
})
```

### Error Handling

```typescript
// In service
if (!user) {
  throw new NotFoundError("User not found")
}

// In controller (automatically handled by middleware)
return await userService.getUserById(id)
```

### Validation

```typescript
// In controller
const validatedData = validateRequest(createUserSchema, body)
const user = await userService.createUser(validatedData)
```

## 🔧 Configuration

### Environment Variables
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=pos_dashboard
NODE_ENV=development
USE_SYNC=false
```

### Constants (`/config/constants.ts`)
```typescript
export const API_CONFIG = {
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  },
}
```

## 📊 Benefits

✅ **Separation of Concerns** - Each layer has a specific responsibility  
✅ **Maintainability** - Easy to modify and extend  
✅ **Testability** - Each layer can be tested independently  
✅ **Scalability** - Easy to add new features and entities  
✅ **Type Safety** - Full TypeScript support throughout  
✅ **Error Handling** - Centralized and consistent error management  
✅ **Validation** - Robust input validation with Zod  
✅ **Documentation** - Clear structure and naming conventions  

## 🎯 Best Practices

1. **Keep controllers thin** - Only handle HTTP concerns
2. **Business logic in services** - All business rules in service layer
3. **Use TypeORM repositories** - For database operations
4. **Validate inputs** - Use Zod schemas for validation
5. **Handle errors properly** - Use custom error classes
6. **Follow naming conventions** - Consistent file and class names
7. **Document your code** - Add comments for complex logic
8. **Test each layer** - Unit tests for services, integration tests for controllers

## 🔄 Migration Commands

```bash
# Run migrations
npm run migration:run

# Generate new migration
npm run migration:generate AddNewTable

# Revert last migration
npm run migration:revert

# Show migration status
npm run migration:show
```

## 🎯 Why No Routes Folder?

The `/routes` folder was removed because:

1. **Next.js handles routing** - The `/app/api/` folder structure defines all API routes
2. **No duplication** - We don't need separate route definitions
3. **Cleaner architecture** - Controllers are called directly from Next.js API routes
4. **Simpler maintenance** - One place for route definitions

This structure provides a solid foundation for building scalable and maintainable backend APIs within your Next.js application. 