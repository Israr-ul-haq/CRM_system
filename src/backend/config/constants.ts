// Database configuration
export const DATABASE_CONFIG = {
  HOST: process.env.DB_HOST || "localhost",
  PORT: parseInt(process.env.DB_PORT || "5432"),
  USERNAME: process.env.DB_USERNAME || "postgres",
  PASSWORD: process.env.DB_PASSWORD || "password",
  NAME: process.env.DB_NAME || "pos_dashboard",
} as const

// API configuration
export const API_CONFIG = {
  PAGINATION: {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
  },
  RESPONSE: {
    SUCCESS_MESSAGE: "Operation completed successfully",
    ERROR_MESSAGE: "An error occurred",
  },
} as const

// User roles
export const USER_ROLES = {
  ADMIN: "admin",
  MANAGER: "manager",
  CASHIER: "cashier",
  STAFF: "staff",
} as const

// User status
export const USER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
} as const

// Error codes
export const ERROR_CODES = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const 