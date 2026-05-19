/**
 * API Types for backend communication
 * Defines structured error responses and common API patterns
 */

import type { User } from '@/server/auth'

/**
 * Standard API response structure from backend
 */
export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data?: T
  error?: ApiError
}

/**
 * Structured error response from API
 */
export interface ApiError {
  code: string
  details?: Record<string, Array<string>> | string
  message?: string
}

/**
 * Auth operation result with detailed error information
 */
export interface AuthResult {
  success: boolean
  user?: User
  error?: string
  errorCode?: string
  fieldErrors?: Record<string, Array<string>>
  retryAfter?: number // seconds for rate limit
}

/**
 * Server function result wrapper for type-safe error handling
 */
export type ServerFnResult<T> =
  | { success: true; data: T }
  | {
      success: false
      error: string
      errorCode?: string
      fieldErrors?: Record<string, Array<string>>
    }

/**
 * Helper to create success result
 */
export function createSuccessResult<T>(data: T): ServerFnResult<T> {
  return { success: true, data }
}

/**
 * Helper to create error result
 */
export function createErrorResult(
  error: string,
  errorCode?: string,
  fieldErrors?: Record<string, Array<string>>,
): ServerFnResult<never> {
  return { success: false, error, errorCode, fieldErrors }
}
