# API Integration Guide

This guide explains how the API works in the Next.js project with the organized backend structure.

## 🏗️ **How It Works**

### **1. Next.js API Routes** (`/app/api/`)
- **Entry Point**: Next.js API routes handle HTTP requests
- **Route Handlers**: Export GET, POST, PUT, DELETE functions
- **Error Handling**: Uses `withErrorHandler` wrapper for consistent error responses

### **2. Backend Integration** (`/backend/`)
- **Controllers**: Handle HTTP logic and call services
- **Services**: Contain business logic and database operations
- **Models**: TypeORM entities for database schema
- **Middleware**: Error handling and validation

## 📡 **API Flow**

```
HTTP Request → Next.js API Route → Controller → Service → Database
     ↑                                                           ↓
Response ← Next.js API Route ← Controller ← Service ← Database
```

## 🔗 **Available API Endpoints**

### **Users API**
```
GET    /api/users           - Get all users (with pagination)
POST   /api/users           - Create new user
GET    /api/users/[id]      - Get user by ID
PUT    /api/users/[id]      - Update user
DELETE /api/users/[id]      - Delete user
GET    /api/users/stats     - Get user statistics
```

### **System API**
```
GET    /api/test            - Test database connection
GET    /api/migrations      - Get migration status
POST   /api/migrations      - Run/revert migrations
```

## 📝 **Example Usage**

### **Frontend API Calls**

```typescript
// Get all users
const response = await fetch('/api/users')
const data = await response.json()

// Create user
const response = await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '1234567890',
    role: 'user'
  })
})

// Get user by ID
const response = await fetch('/api/users/123')
const data = await response.json()

// Update user
const response = await fetch('/api/users/123', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Jane Doe' })
})

// Delete user
const response = await fetch('/api/users/123', {
  method: 'DELETE'
})

// Get user statistics
const response = await fetch('/api/users/stats')
const data = await response.json()
```

### **Response Format**

```typescript
// Success Response
{
  success: true,
  data: { /* response data */ },
  pagination?: { /* pagination info */ }
}

// Error Response
{
  success: false,
  error: "Error message",
  code: "ERROR_CODE"
}
```

## 🔧 **Adding New API Endpoints**

### **1. Create Model** (`/backend/models/Product.ts`)
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

### **2. Create Service** (`/backend/services/ProductService.ts`)
```typescript
export class ProductService {
  async getAllProducts() {
    // Business logic here
  }
}
```

### **3. Create Controller** (`/backend/controllers/ProductController.ts`)
```typescript
export class ProductController {
  async getProducts(request: NextRequest) {
    // HTTP handling here
  }
}
```

### **4. Create API Route** (`/app/api/products/route.ts`)
```typescript
import { ProductController } from "@/backend/controllers/ProductController"
import { withErrorHandler } from "@/backend/middleware/errorHandler"

const productController = new ProductController()

export const GET = withErrorHandler(async (request: NextRequest) => {
  return await productController.getProducts(request)
})
```

## 🛡️ **Error Handling**

### **Automatic Error Handling**
All API routes use `withErrorHandler` wrapper:

```typescript
export const GET = withErrorHandler(async (request: NextRequest) => {
  // Your API logic here
  // Errors are automatically caught and formatted
})
```

### **Custom Error Classes**
```typescript
// In service
if (!user) {
  throw new NotFoundError("User not found")
}

// Automatically returns:
{
  success: false,
  error: "User not found",
  code: "NOT_FOUND"
}
```

## 📊 **Pagination Support**

### **Request**
```
GET /api/users?page=1&limit=10&search=john
```

### **Response**
```typescript
{
  success: true,
  data: [/* users array */],
  pagination: {
    page: 1,
    limit: 10,
    total: 25,
    totalPages: 3
  }
}
```

## 🔍 **Search & Filtering**

### **Search by Name/Email**
```
GET /api/users?search=john
```

### **Pagination**
```
GET /api/users?page=2&limit=5
```

## 🧪 **Testing APIs**

### **1. Web Interface**
Visit `/api-test` for interactive testing

### **2. Database Connection**
```bash
curl http://localhost:3000/api/test
```

### **3. User Operations**
```bash
# Get users
curl http://localhost:3000/api/users

# Create user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com"}'
```

## 🚀 **Benefits**

✅ **Clean Separation** - Backend logic separate from API routes  
✅ **Type Safety** - Full TypeScript support  
✅ **Error Handling** - Consistent error responses  
✅ **Validation** - Input validation with Zod  
✅ **Scalable** - Easy to add new endpoints  
✅ **Maintainable** - Clear structure and organization  
✅ **Testable** - Each layer can be tested independently  

## 🔄 **Development Workflow**

1. **Add Model** - Define database schema
2. **Create Service** - Add business logic
3. **Build Controller** - Handle HTTP concerns
4. **Create API Route** - Connect to Next.js
5. **Test** - Use `/api-test` or curl
6. **Deploy** - Ready for production

This structure provides a robust foundation for building scalable APIs within your Next.js application! 