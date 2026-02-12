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
 * Client-side login function
 * POST /api/v2/auth/login/
 * Must run in browser to set session cookies properly
 */
export async function loginFn(data: LoginInput): Promise<AuthResult> {
  try {
    // Step 1: Get CSRF token (browser calls via Vite proxy)
    const csrfRes = await fetch('/api/v2/auth/csrf/', {
      credentials: 'include',
    })

    if (!csrfRes.ok) {
      throw new Error(`Failed to get CSRF token (${csrfRes.status})`)
    }

    const csrfData = await csrfRes.json()
    const csrfToken = csrfData?.data?.csrf_token

    if (!csrfToken) {
      throw new Error('CSRF token not found in response')
    }

    // Step 2: Login (browser calls via Vite proxy)
    const res = await fetch('/api/v2/auth/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify(data),
    })

    let responseData: any = null
    const contentType = res.headers.get('content-type') || ''
    try {
      responseData = contentType.includes('application/json') ? await res.json() : null
    } catch { }

    if (!res.ok) {
      const bodyText = responseData ? '' : await res.text().catch(() => '')
      if (import.meta.env.MODE !== 'production') {
        console.error('[loginFn] HTTP error', {
          status: res.status,
          statusText: res.statusText,
          bodyPreview: bodyText.slice(0, 300),
        })
      }

      const result: AuthResult = {
        success: false,
        error: responseData?.message || bodyText || `Login failed (${res.status})`,
        errorCode: responseData?.error?.code,
      }

      // Handle specific error codes
      if (res.status === 429) {
        const retryAfterHeader = res.headers.get('Retry-After')
        result.retryAfter = retryAfterHeader ? parseInt(retryAfterHeader, 10) : 60
      } else if (res.status === 400 && responseData?.error?.details) {
        result.fieldErrors = responseData.error.details
      }

      return result
    }

    return {
      success: true,
      user: responseData?.data?.user,
    }
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Network error during login',
    }
  }
}

// Register input (matches V2 API contract)
export interface RegisterInput {
  email: string
  phone?: string
  password: string
  password_confirm: string
  first_name: string
  last_name: string
  terms_accepted: boolean
  marketing_opt_in?: boolean
}

/**
 * Client-side registration function
 * POST /api/v2/auth/register/
 * Must run in browser to set session cookies properly
 */
export async function registerFn(data: RegisterInput): Promise<AuthResult> {
  try {
    // Step 1: Get CSRF token (browser calls via Vite proxy)
    const csrfRes = await fetch('/api/v2/auth/csrf/', {
      credentials: 'include',
    })

    if (!csrfRes.ok) {
      throw new Error(`Failed to get CSRF token (${csrfRes.status})`)
    }

    const csrfData = await csrfRes.json()
    const csrfToken = csrfData?.data?.csrf_token

    if (!csrfToken) {
      throw new Error('CSRF token not found in response')
    }

    // Step 2: Register (browser calls via Vite proxy)
    const res = await fetch('/api/v2/auth/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      credentials: 'include',
      body: JSON.stringify(data),
    })

    let responseData: any = null
    const contentType = res.headers.get('content-type') || ''
    try {
      responseData = contentType.includes('application/json') ? await res.json() : null
    } catch { }

    if (!res.ok) {
      const bodyText = responseData ? '' : await res.text().catch(() => '')
      if (import.meta.env.MODE !== 'production') {
        console.error('[registerFn] HTTP error', {
          status: res.status,
          statusText: res.statusText,
          bodyPreview: bodyText?.slice(0, 300),
        })
      }

      const result: AuthResult = {
        success: false,
        error: responseData?.message || bodyText || `Registration failed (${res.status})`,
        errorCode: responseData?.error?.code,
      }

      // Handle specific error codes
      if (res.status === 429) {
        const retryAfterHeader = res.headers.get('Retry-After')
        result.retryAfter = retryAfterHeader ? parseInt(retryAfterHeader, 10) : 60
      } else if (res.status === 400 && responseData?.error?.details) {
        result.fieldErrors = responseData.error.details
      } else if (res.status === 409) {
        // Duplicate user - map to email field
        result.fieldErrors = {
          email: [responseData?.message || 'An account with this email already exists'],
        }
      }

      return result
    }

    return {
      success: true,
      user: responseData?.data?.user,
    }
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Network error during registration',
    }
  }
}

/**
 * Client-side logout function
 * POST /api/v2/auth/logout/
 * Must run in browser to clear session cookies properly
 */
export async function logoutFn(): Promise<{ success: boolean; error?: string }> {
  try {
    // Step 1: Get CSRF token (browser calls via Vite proxy)
    const csrfRes = await fetch('/api/v2/auth/csrf/', {
      credentials: 'include',
    })

    if (!csrfRes.ok) {
      throw new Error(`Failed to get CSRF token (${csrfRes.status})`)
    }

    const csrfData = await csrfRes.json()
    const csrfToken = csrfData?.data?.csrf_token

    if (!csrfToken) {
      throw new Error('CSRF token not found in response')
    }

    // Step 2: Logout (browser calls via Vite proxy)
    const res = await fetch('/api/v2/auth/logout/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },
      credentials: 'include',
    })

    if (!res.ok && import.meta.env.MODE !== 'production') {
      let body = ''
      try { body = await res.text() } catch { }
      console.error('[logoutFn] HTTP error', { status: res.status, bodyPreview: body.slice(0, 300) })
    }

    return { success: res.ok }
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Logout failed',
    }
  }
}

