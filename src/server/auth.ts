import { createServerFn } from "@tanstack/react-start"

// Backend base URL (server-side). In TanStack Start, server functions run on the server,
// so we should call Django directly and forward cookies.
// This matches the V2 contract's SSR pattern.
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'
// User type matching the V2 API contract
export interface User {
  id: string
  email: string | null
  phone: string | null
  first_name: string
  last_name: string
  full_name: string
  is_verified: boolean
  is_active: boolean
  role?: string  // For role-based authorization
  security: {
    score: number
    level: 'low' | 'medium' | 'high'
  }
}

// API response structure from V2 endpoints
interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
  error?: {
    code: string
    details: any
  }
}

/**
 * Server function to get the current authenticated user
 * Calls Django's /api/v2/auth/status/ endpoint
 */
export const getCurrentUserFn = createServerFn({ method: 'GET' }).handler(
  async (ctx) => {
    try {
      // Forward cookies from the incoming request to Django.
      // Depending on TanStack Start version, the incoming Request may be on
      // `ctx.request` or `ctx.context.request`.
      const req: Request | undefined = (ctx as any)?.request || (ctx as any)?.context?.request

      const cookieHeader = req?.headers.get('cookie')
      const headers: HeadersInit = {}

      if (cookieHeader) {
        headers['Cookie'] = cookieHeader
      }

      // Call Django directly (SSR pattern): forward the browser's cookies.
      const res = await fetch(`${BACKEND_URL}/api/v2/auth/status/`, {
        headers,
        credentials: 'include',
      })

      if (!res.ok) return null

      const contentType = res.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) return null

      const data: ApiResponse<{ user: User; authenticated: boolean }> = await res.json()

      return data.success && data.data?.user ? data.data.user : null
    } catch {
      // Treat any network/backend errors as unauthenticated.
      return null
    }
  },
)

// ============================================================================
// Auth mutation server functions
// ============================================================================

/**
 * Get CSRF token from Django
 * Helper used by login/register/logout
 */
async function getCsrfToken(cookieHeader?: string): Promise<string> {
  const headers: HeadersInit = {}
  if (cookieHeader) {
    headers['Cookie'] = cookieHeader
  }

  const res = await fetch(`${BACKEND_URL}/api/v2/auth/csrf/`, {
    headers,
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error(`Failed to get CSRF token (${res.status})`)
  }

  const data = await res.json()
  const token = data?.data?.csrf_token

  if (!token) {
    throw new Error('CSRF token not found in response')
  }

  return token
}

// Login input
export interface LoginInput {
  identifier: string
  password: string
  remember_me?: boolean
}

// Login result
export interface AuthResult {
  success: boolean
  user?: User
  error?: string
  errorCode?: string
  fieldErrors?: Record<string, Array<string>>
  retryAfter?: number // seconds for rate limit
}

/**
 * Server function for login
 * POST /api/v2/auth/login/
 */
export const loginFn = createServerFn({ method: 'POST' })
  .validator((input: LoginInput) => input)
  .handler(async ({ data, context }) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const req: Request | undefined = (context as any)?.request || (context as any)?.context?.request
      const cookieHeader = req?.headers.get('cookie')

      // Get CSRF token
      const csrfToken = await getCsrfToken(cookieHeader)

      // Call login endpoint
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      }
      if (cookieHeader) {
        headers['Cookie'] = cookieHeader
      }

      const res = await fetch(`${BACKEND_URL}/api/v2/auth/login/`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(data),
      })

      const responseData: ApiResponse<{ user: User }> = await res.json()

      if (!res.ok) {
        const result: AuthResult = {
          success: false,
          error: responseData.message || 'Login failed',
          errorCode: responseData.error?.code,
        }

        // Handle specific error codes
        if (res.status === 429) {
          // Rate limited - extract retry-after if available
          const retryAfterHeader = res.headers.get('Retry-After')
          result.retryAfter = retryAfterHeader ? parseInt(retryAfterHeader, 10) : 60
        } else if (res.status === 400 && responseData.error?.details) {
          // Field validation errors
          result.fieldErrors = responseData.error.details
        }

        return result
      }

      return {
        success: true,
        user: responseData.data?.user,
      } as AuthResult
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Network error during login',
      } as AuthResult
    }
  })

// Register input
export interface RegisterInput {
  email: string
  password: string
  first_name: string
  last_name: string
  phone?: string
  terms_accepted: boolean
  marketing_opt_in?: boolean
}

/**
 * Server function for registration
 * POST /api/v2/auth/register/
 */
export const registerFn = createServerFn({ method: 'POST' })
  .validator((input: RegisterInput) => input)
  .handler(async ({ data, context }) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const req: Request | undefined = (context as any)?.request || (context as any)?.context?.request
      const cookieHeader = req?.headers.get('cookie')

      // Get CSRF token
      const csrfToken = await getCsrfToken(cookieHeader)

      // Call register endpoint
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      }
      if (cookieHeader) {
        headers['Cookie'] = cookieHeader
      }

      const res = await fetch(`${BACKEND_URL}/api/v2/auth/register/`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(data),
      })

      const responseData: ApiResponse<{ user: User }> = await res.json()

      if (!res.ok) {
        const result: AuthResult = {
          success: false,
          error: responseData.message || 'Registration failed',
          errorCode: responseData.error?.code,
        }

        // Handle specific error codes
        if (res.status === 429) {
          const retryAfterHeader = res.headers.get('Retry-After')
          result.retryAfter = retryAfterHeader ? parseInt(retryAfterHeader, 10) : 60
        } else if (res.status === 400 && responseData.error?.details) {
          // Field validation errors
          result.fieldErrors = responseData.error.details
        } else if (res.status === 409) {
          // Duplicate user - map to email field
          result.fieldErrors = {
            email: [responseData.message || 'An account with this email already exists'],
          }
        }

        return result
      }

      return {
        success: true,
        user: responseData.data?.user,
      } as AuthResult
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Network error during registration',
      } as AuthResult
    }
  })

/**
 * Server function for logout
 * POST /api/v2/auth/logout/
 */
export const logoutFn = createServerFn({ method: 'POST' }).handler(
  async ({ context }) => {
    try {
      const req: Request | undefined = (context as any)?.request || (context as any)?.context?.request
      const cookieHeader = req?.headers.get('cookie')

      // Get CSRF token
      const csrfToken = await getCsrfToken(cookieHeader)

      // Call logout endpoint
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      }
      if (cookieHeader) {
        headers['Cookie'] = cookieHeader
      }

      await fetch(`${BACKEND_URL}/api/v2/auth/logout/`, {
        method: 'POST',
        headers,
        credentials: 'include',
      })

      return { success: true }
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Logout failed',
      }
    }
  },
)

