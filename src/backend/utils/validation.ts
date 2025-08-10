import { z } from "zod"

// User validation schemas
export const createUserSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  role: z.string().optional(),
})

export const updateUserSchema = createUserSchema.partial()

export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
  search: z.string().optional(),
})

export const idSchema = z.object({
  id: z.string().min(1, "ID is required"),
})

// Export types
export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type PaginationInput = z.infer<typeof paginationSchema>

// Validation helper function
export const validateRequest = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  try {
    return schema.parse(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const zodError = error as z.ZodError
      const errorMessages = zodError.issues?.map(issue => issue.message) || []
      throw new Error(`Validation failed: ${errorMessages.join(", ")}`)
    }
    throw error
  }
} 