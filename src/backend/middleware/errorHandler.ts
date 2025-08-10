import { NextRequest, NextResponse } from "next/server"

export interface ApiError extends Error {
  statusCode?: number
  code?: string
}

export class ValidationError extends Error {
  statusCode = 400
  code = "VALIDATION_ERROR"
}

export class NotFoundError extends Error {
  statusCode = 404
  code = "NOT_FOUND"
}

export class ConflictError extends Error {
  statusCode = 409
  code = "CONFLICT"
}

export class UnauthorizedError extends Error {
  statusCode = 401
  code = "UNAUTHORIZED"
}

export class ForbiddenError extends Error {
  statusCode = 403
  code = "FORBIDDEN"
}

export function handleApiError(error: unknown): NextResponse {
  console.error("API Error:", error)

  // Handle known error types
  if (error instanceof ValidationError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    )
  }

  if (error instanceof NotFoundError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    )
  }

  if (error instanceof ConflictError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    )
  }

  if (error instanceof UnauthorizedError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    )
  }

  if (error instanceof ForbiddenError) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    )
  }

  // Handle unknown errors
  const errorMessage = error instanceof Error ? error.message : "Internal server error"
  
  return NextResponse.json(
    {
      success: false,
      error: errorMessage,
      code: "INTERNAL_ERROR",
    },
    { status: 500 }
  )
}

// Wrapper function for API handlers
export function withErrorHandler<T extends (request: NextRequest, ...args: unknown[]) => Promise<NextResponse>>(
  handler: T
) {
  return async (request: NextRequest, ...args: unknown[]): Promise<NextResponse> => {
    try {
      return await handler(request, ...args)
    } catch (error) {
      return handleApiError(error)
    }
  }
} 