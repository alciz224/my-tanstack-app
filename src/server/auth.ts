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

      const cookieHeader = req?.headers?.get('cookie')
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

      return data?.success && data.data?.user ? data.data.user : null
    } catch {
      // Treat any network/backend errors as unauthenticated.
      return null
    }
  },
)

