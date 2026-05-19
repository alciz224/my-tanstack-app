/**
 * API Auth Adapter — real backend authentication
 *
 * Delegates every operation to the Django backend.
 * Server-side functions (getCurrentUser) forward cookies via getCookies().
 * Client-side functions (login, register, selectRole, logout) call via
 * the Vite proxy (browser → /api/v2/...) so httpOnly cookies flow naturally.
 *
 * NOTE: This adapter is structured so that:
 *  - getCurrentUser() is called from a server function (SSR) and uses getCookies()
 *  - login/register/selectRole/logout are called from the browser and use fetch()
 */

import type {
  AuthResult,
  LoginInput,
  RegisterInput,
  SelectRoleInput,
  SelectRoleResult,
  User,
} from '@/server/auth'
import type { ApiResponse } from '@/types/api'
import type { AuthDataAdapter } from './types'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export class ApiAuthAdapter implements AuthDataAdapter {
  // ── getCurrentUser (runs server-side in SSR) ────────────────────────
  async getCurrentUser(cookieHeader?: string): Promise<User | null> {
    try {
      if (import.meta.env.DEV) {
        console.debug(
          '[ApiAuthAdapter.getCurrentUser] SSR cookie forwarding:',
          cookieHeader ? 'yes' : 'no cookies',
        )
      }

      const headers: HeadersInit = {}
      if (cookieHeader) {
        headers['Cookie'] = cookieHeader
      }

      const res = await fetch(`${BACKEND_URL}/api/v2/auth/status/`, {
        headers,
        credentials: 'include',
      })

      if (import.meta.env.DEV) {
        console.debug(
          '[ApiAuthAdapter.getCurrentUser] status response:',
          res.status,
        )
      }

      if (!res.ok) {
        if (import.meta.env.DEV && res.status !== 401) {
          console.warn(
            '[ApiAuthAdapter.getCurrentUser] Unexpected status:',
            res.status,
          )
        }
        return null
      }

      const contentType = res.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) {
        if (import.meta.env.DEV) {
          console.warn(
            '[ApiAuthAdapter.getCurrentUser] Non-JSON response:',
            contentType,
          )
        }
        return null
      }

      const data: ApiResponse<{ user: User; authenticated: boolean }> =
        await res.json()
      const rawUser = data.data?.user
      if (!data.success || !rawUser) return null

      // Normalise: API may return `active_role` instead of `role`
      const user: User = {
        ...rawUser,
        role: (rawUser as any).active_role ?? rawUser.role ?? null,
      }

      if (import.meta.env.DEV) {
        console.debug(
          '[ApiAuthAdapter.getCurrentUser] normalised user.role:',
          user.role,
        )
      }

      return user
    } catch (err) {
      if (import.meta.env.DEV) {
        console.error('[ApiAuthAdapter.getCurrentUser] Error:', err)
      }
      return null
    }
  }

  // ── login (runs client-side in browser) ─────────────────────────────
  async login(data: LoginInput): Promise<AuthResult> {
    try {
      // Step 1: Get CSRF token
      const csrfRes = await fetch('/api/v2/auth/csrf/', {
        credentials: 'include',
      })
      if (!csrfRes.ok)
        throw new Error(`Failed to get CSRF token (${csrfRes.status})`)

      const csrfData = await csrfRes.json()
      const csrfToken = csrfData?.data?.csrf_token
      if (!csrfToken) throw new Error('CSRF token not found in response')

      // Step 2: Login
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
        responseData = contentType.includes('application/json')
          ? await res.json()
          : null
      } catch {}

      if (!res.ok) {
        const bodyText = responseData ? '' : await res.text().catch(() => '')

        const result: AuthResult = {
          success: false,
          error:
            responseData?.message || bodyText || `Login failed (${res.status})`,
          errorCode: responseData?.error?.code,
        }

        if (res.status === 429) {
          const retryAfterHeader = res.headers.get('Retry-After')
          result.retryAfter = retryAfterHeader
            ? parseInt(retryAfterHeader, 10)
            : 60
        } else if (res.status === 400 && responseData?.error?.details) {
          result.fieldErrors = responseData.error.details
        }

        return result
      }

      return { success: true, user: responseData?.data?.user }
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Network error during login',
      }
    }
  }

  // ── register (runs client-side in browser) ──────────────────────────
  async register(data: RegisterInput): Promise<AuthResult> {
    try {
      const csrfRes = await fetch('/api/v2/auth/csrf/', {
        credentials: 'include',
      })
      if (!csrfRes.ok)
        throw new Error(`Failed to get CSRF token (${csrfRes.status})`)

      const csrfData = await csrfRes.json()
      const csrfToken = csrfData?.data?.csrf_token
      if (!csrfToken) throw new Error('CSRF token not found in response')

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
        responseData = contentType.includes('application/json')
          ? await res.json()
          : null
      } catch {}

      if (!res.ok) {
        const bodyText = responseData ? '' : await res.text().catch(() => '')

        const result: AuthResult = {
          success: false,
          error:
            responseData?.message ||
            bodyText ||
            `Registration failed (${res.status})`,
          errorCode: responseData?.error?.code,
        }

        if (res.status === 429) {
          const retryAfterHeader = res.headers.get('Retry-After')
          result.retryAfter = retryAfterHeader
            ? parseInt(retryAfterHeader, 10)
            : 60
        } else if (res.status === 400 && responseData?.error?.details) {
          result.fieldErrors = responseData.error.details
        } else if (res.status === 409) {
          result.fieldErrors = {
            email: [
              responseData?.message ||
                'An account with this email already exists',
            ],
          }
        }

        return result
      }

      return { success: true, user: responseData?.data?.user }
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Network error during registration',
      }
    }
  }

  // ── selectRole (runs client-side in browser) ────────────────────────
  async selectRole(data: SelectRoleInput): Promise<SelectRoleResult> {
    try {
      const csrfRes = await fetch('/api/v2/auth/csrf/', {
        credentials: 'include',
      })
      if (!csrfRes.ok)
        throw new Error(`Failed to get CSRF token (${csrfRes.status})`)

      const csrfData = await csrfRes.json()
      const csrfToken = csrfData?.data?.csrf_token
      if (!csrfToken) throw new Error('CSRF token not found in response')

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
        responseData = contentType.includes('application/json')
          ? await res.json()
          : null
      } catch {}

      if (!res.ok) {
        const bodyText = responseData ? '' : await res.text().catch(() => '')
        return {
          success: false,
          error:
            responseData?.message ||
            bodyText ||
            `Role selection failed (${res.status})`,
          errorCode: responseData?.error?.code,
        }
      }

      return { success: true, user: responseData?.data?.user }
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Network error during role selection',
        errorCode: 'NETWORK_ERROR',
      }
    }
  }

  // ── logout (runs client-side in browser) ────────────────────────────
  async logout(): Promise<{ success: boolean; error?: string }> {
    try {
      const csrfRes = await fetch('/api/v2/auth/csrf/', {
        credentials: 'include',
      })

      let csrfToken = ''
      if (csrfRes.ok) {
        try {
          const csrfData = await csrfRes.json()
          csrfToken = csrfData?.data?.csrf_token || ''
        } catch {
          console.warn('[ApiAuthAdapter.logout] Failed to parse CSRF response')
        }
      }

      const headers: HeadersInit = { 'Content-Type': 'application/json' }
      if (csrfToken) headers['X-CSRFToken'] = csrfToken

      const res = await fetch('/api/v2/auth/logout/', {
        method: 'POST',
        headers,
        credentials: 'include',
      })

      if (!res.ok) {
        let responseData: any = null
        const contentType = res.headers.get('content-type') || ''
        if (contentType.includes('application/json')) {
          try {
            responseData = await res.json()
          } catch {}
        }
        return {
          success: false,
          error: responseData?.message || `Logout failed (${res.status})`,
        }
      }

      return { success: true }
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Network error during logout',
      }
    }
  }
}
