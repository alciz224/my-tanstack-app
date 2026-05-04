/**
 * Authentication Module
 * 
 * This module handles all authentication operations for the EduVault application.
 * It contains both SERVER FUNCTIONS (SSR) and CLIENT FUNCTIONS (browser-only).
 * 
 * CRITICAL DISTINCTION:
 * - Server functions (createServerFn): Run on the server during SSR, forward cookies
 * - Client functions (async function): Run in the browser, manage session cookies
 * 
 * WHY THIS MATTERS:
 * - Login/logout MUST run in browser to set/clear httpOnly cookies
 * - User fetching MUST run on server (SSR) to forward cookies to Django
 * - Server-side code cannot modify browser cookies
 * 
 * @see docs/ARCHITECTURE.md for detailed explanation
 */

import { createServerFn } from '@tanstack/react-start'
import type { ApiResponse } from '@/types/api'
import type { UserRole } from '@/types/roles'
import { isValidRole } from '@/types/roles'

/**
 * Backend base URL (server-side only)
 * Used by server functions to call Django directly
 */
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

// (No client-side user cache: we rely on real API responses only)

/**
 * User type matching the V2 API contract
 * Represents an authenticated user from the backend
 */
export interface User {
  id: string
  email: string | null
  email_masked: string | null
  phone: string | null
  phone_masked: string | null
  first_name: string
  last_name: string
  full_name: string
  backup_phone: string | null
  backup_phone_owner: string | null
  role: UserRole | null  // Currently selected role (null = must select)
  available_roles: UserRole[]  // Roles user can switch between
  verification?: {
    is_verified: boolean
    email_verified: boolean
    email_verified_at: string | null
    phone_verified: boolean
    phone_verified_at: string | null
  }
  security?: {
    score: number
    level: 'low' | 'medium' | 'high'
    has_security_questions: boolean
    security_questions_count: number
    has_backup_phone: boolean
    suggestions: string[]
  }
  profiles?: {
    has_student: boolean
    has_teacher: boolean
    has_school_admin: boolean
  }
  date_joined: string
  last_login: string | null
  is_active: boolean
}

/**
 * Server function to get the current authenticated user
 * Calls Django's /api/v2/auth/status/ endpoint
 * 
 * This runs on the server (SSR) and forwards cookies from the browser request
 * to the Django backend, ensuring proper session handling during SSR.
 * 
 * @returns User object if authenticated, null otherwise
 */
/**
 * Get the current authenticated user.
 * GET /api/v2/auth/status/
 *
 * IMPORTANT: This is a SERVER FUNCTION that runs during SSR and forwards cookies
 * from the browser request to the Django backend. This ensures auth state is
 * available on initial page load and hard refresh.
 *
 * Called from __root.tsx beforeLoad on every navigation.
 */
export const getCurrentUserFn = createServerFn({ method: 'GET' }).handler(
  async (ctx) => {
    try {
      // Access the incoming request to get cookies (SSR context)
      const req = (ctx as any)?.request
      const cookieHeader = req?.headers.get('cookie') || ''

      if (import.meta.env.DEV) {
        console.debug('[getCurrentUserFn] SSR cookie forwarding:', cookieHeader ? 'yes' : 'no cookies')
      }

      // Forward cookies to Django backend
      const headers: HeadersInit = {}
      if (cookieHeader) {
        headers['Cookie'] = cookieHeader
      }

      const res = await fetch(`${BACKEND_URL}/api/v2/auth/status/`, {
        headers,
        credentials: 'include',
      })

      if (import.meta.env.DEV) {
        console.debug('[getCurrentUserFn] status response:', res.status)
      }

      if (!res.ok) {
        if (import.meta.env.DEV && res.status !== 401) {
          console.warn('[getCurrentUserFn] Unexpected status:', res.status)
        }
        return null
      }

      const contentType = res.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) {
        if (import.meta.env.DEV) {
          console.warn('[getCurrentUserFn] Non-JSON response:', contentType)
        }
        return null
      }

      const data: ApiResponse<{ user: User; authenticated: boolean }> = await res.json()
      const rawUser = data.data?.user
      if (!data.success || !rawUser) return null

      // The API may return the currently-active role as `active_role` instead of `role`.
      // Normalise here so the rest of the app always reads `user.role`.
      const user: User = {
        ...rawUser,
        role: (rawUser as any).active_role ?? rawUser.role ?? null,
      }

      if (import.meta.env.DEV) {
        console.debug('[getCurrentUserFn] normalised user.role:', user.role)
      }

      return user
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('[getCurrentUserFn] Error:', err)
      }
      return null
    }
  }
)

// ============================================================================
// Auth mutation functions (client-side)
// ============================================================================
// Note: These functions run in the BROWSER, not on the server.
// They must run client-side to ensure session cookies are set/cleared properly.
// Server-side functions cannot modify httpOnly cookies.
// ============================================================================

/**
 * Get CSRF token from Django
 * Helper used by login/register/logout
 * 
 * @deprecated This server-side version is not used. Client-side functions fetch CSRF directly.
 */
// @ts-ignore - Unused function kept for reference
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getCsrfToken(_cookieHeader?: string): Promise<string> {
  const headers: HeadersInit = {}
  if (_cookieHeader) {
    headers['Cookie'] = _cookieHeader
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

/**
 * Login input data
 */
export interface LoginInput {
  identifier: string  // Email or phone number
  password: string
  remember_me?: boolean
}

/**
 * Auth operation result with detailed error information
 * Used for login, register, and other auth mutations
 */
export interface AuthResult {
  success: boolean
  user?: User
  error?: string  // Human-readable error message
  errorCode?: string  // Machine-readable error code
  fieldErrors?: Record<string, string[]>  // Field-specific validation errors
  retryAfter?: number  // Seconds to wait before retry (for rate limiting)
}

/**
 * Client-side login function
 * POST /api/v2/auth/login/
 * 
 * IMPORTANT: This MUST run in the browser (not server-side) to ensure
 * session cookies are properly set by the browser.
 * 
 * @param data - Login credentials
 * @returns AuthResult with user data on success, or detailed error information
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

/**
 * Registration input data (matches V2 API contract)
 */
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
 * 
 * IMPORTANT: This MUST run in the browser (not server-side) to ensure
 * session cookies are properly set by the browser.
 * 
 * @param data - Registration information
 * @returns AuthResult with user data on success, or detailed error information
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
 * Role selection input data
 */
export interface SelectRoleInput {
  role: string
}

/**
 * Role selection result
 */
export interface SelectRoleResult {
  success: boolean
  user?: User
  error?: string
  errorCode?: string
}

/**
 * Client-side role selection function
 * POST /api/v2/auth/select-role/
 * 
 * IMPORTANT: This MUST run in the browser (not server-side) to ensure
 * session cookies are properly sent to the backend.
 * 
 * @param data - Role selection data
 * @returns SelectRoleResult with updated user data on success
 */
export async function selectRoleFn(data: SelectRoleInput): Promise<SelectRoleResult> {
  try {
    // Validate role before sending
    if (!isValidRole(data.role)) {
      return {
        success: false,
        error: `Invalid role: ${data.role}`,
        errorCode: 'INVALID_ROLE',
      }
    }

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

    // Step 2: Select role (browser calls via Vite proxy)
    const res = await fetch('/api/v2/auth/select-role/', {
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
        console.error('[selectRoleFn] HTTP error', {
          status: res.status,
          statusText: res.statusText,
          bodyPreview: bodyText.slice(0, 300),
        })
      }

      return {
        success: false,
        error: responseData?.message || bodyText || `Role selection failed (${res.status})`,
        errorCode: responseData?.error?.code,
      }
    }

    const selectedUser: User = responseData?.data?.user

    return {
      success: true,
      user: selectedUser,
    }
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Network error during role selection',
      errorCode: 'NETWORK_ERROR',
    }
  }
}

/**
 * Logout function - clears session cookies
 * POST /api/v2/auth/logout/
 * 
 * IMPORTANT: This must be called from the browser (client-side) to ensure
 * cookies are properly cleared. Server-side logout cannot clear httpOnly cookies.
 */
export async function logoutFn(): Promise<{ success: boolean; error?: string }> {
  try {
    // Step 1: Get CSRF token (browser calls via Vite proxy)
    const csrfRes = await fetch('/api/v2/auth/csrf/', {
      credentials: 'include',
    })

    if (!csrfRes.ok) {
      // If we can't get CSRF, try logout anyway (might still work)
      console.warn('[logoutFn] Failed to get CSRF token, attempting logout anyway')
    }

    let csrfToken = ''
    if (csrfRes.ok) {
      try {
        const csrfData = await csrfRes.json()
        csrfToken = csrfData?.data?.csrf_token || ''
      } catch {
        console.warn('[logoutFn] Failed to parse CSRF response')
      }
    }

    // Step 2: Logout (browser calls via Vite proxy)
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken
    }

    const res = await fetch('/api/v2/auth/logout/', {
      method: 'POST',
      headers,
      credentials: 'include',
    })

    // Parse response for better error handling
    let responseData: any = null
    const contentType = res.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      try {
        responseData = await res.json()
      } catch { }
    }

    if (!res.ok) {
      const errorMsg = responseData?.message || `Logout failed (${res.status})`

      if (import.meta.env.MODE !== 'production') {
        console.error('[logoutFn] HTTP error', {
          status: res.status,
          statusText: res.statusText,
          error: errorMsg,
        })
      }

      return {
        success: false,
        error: errorMsg,
      }
    }

    // Nothing extra to clear on client besides session cookies handled by backend

    return { success: true }
  } catch (err: any) {
    if (import.meta.env.MODE !== 'production') {
      console.error('[logoutFn] Network error', err)
    }

    return {
      success: false,
      error: err?.message || 'Network error during logout',
    }
  }
}

