/**
 * Authentication Module — Server-Only
 *
 * Contains:
 *   getCurrentUserFn — server function for SSR auth checks
 *   localLoginFn etc. — server functions for LOCAL mode (in-memory session)
 *   Types (User, LoginInput, AuthResult, etc.)
 *
 * Client-side auth functions (login, register, selectRole, logout) are in
 * src/lib/auth-client.ts to avoid TanStack Start's server-module RPC boundary.
 * They import local*Fn from here only for local data mode.
 *
 * ADAPTER PATTERN:
 * All auth operations go through the auth data adapter (local or API).
 * When VITE_LOCAL_DATA=true, the local adapter provides a fully mocked auth
 * flow with in-memory session state.
 *
 * @see src/lib/auth-client.ts for browser-side login/register/logout
 */

import { createServerFn } from '@tanstack/react-start'
import type { UserRole } from '@/types/roles'
import { getAuthService, isLocalDataMode } from '@/server/data/auth/factory'

// ============================================================================
// Types (unchanged — still the V2 API contract)
// ============================================================================

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
  role: UserRole | null // Currently selected role (null = must select)
  available_roles: Array<UserRole> // Roles user can switch between
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
    suggestions: Array<string>
  }
  profiles?: {
    has_student: boolean
    has_teacher: boolean
    has_school_admin: boolean
  }
  teacher_id?: string // Link to teacher profile if user has teacher role
  date_joined: string
  last_login: string | null
  is_active: boolean
}

export interface LoginInput {
  identifier: string // Email or phone number
  password: string
  remember_me?: boolean
}

export interface AuthResult {
  success: boolean
  user?: User
  error?: string // Human-readable error message
  errorCode?: string // Machine-readable error code
  fieldErrors?: Record<string, Array<string>> // Field-specific validation errors
  retryAfter?: number // Seconds to wait before retry (for rate limiting)
}

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

export interface SelectRoleInput {
  role: string
}

export interface SelectRoleResult {
  success: boolean
  user?: User
  error?: string
  errorCode?: string
}

// ============================================================================
// Server function: getCurrentUser (always runs on server, both modes)
// ============================================================================

/**
 * Get the current authenticated user.
 *
 * Uses the auth data adapter factory — when in local mode, this returns
 * the in-memory mock user. Otherwise, it calls Django's /api/v2/auth/status/.
 *
 * Called from __root.tsx beforeLoad on every navigation.
 */
export const getCurrentUserFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    // Dynamic import inside handler is stripped from client bundle by TanStack Start
    const { getCookies } = await import('@tanstack/react-start/server')
    const cookies = getCookies()
    const cookieHeader = Object.entries(cookies)
      .map(([k, v]) => `${k}=${v}`)
      .join('; ')

    const authService = getAuthService()
    const user = await authService.getCurrentUser(cookieHeader)

    if (import.meta.env.DEV) {
      console.debug(
        '[getCurrentUserFn] user.role:',
        user?.role ?? 'null (unauthenticated)',
      )
    }

    return user
  },
)

// ============================================================================
// Server function wrappers for LOCAL mode
// ============================================================================
// In local mode, mutations MUST run on the server so they modify the
// same in-memory session state that getCurrentUserFn reads.
// These are NOT called in API mode, where browser-side fetch
// is needed for proper httpOnly cookie handling.
// ============================================================================

export const localLoginFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as LoginInput)
  .handler(async ({ data }) => {
    const authService = getAuthService()
    return authService.login(data)
  })

export const localRegisterFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as RegisterInput)
  .handler(async ({ data }) => {
    const authService = getAuthService()
    return authService.register(data)
  })

export const localSelectRoleFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as SelectRoleInput)
  .handler(async ({ data }) => {
    const authService = getAuthService()
    return authService.selectRole(data)
  })

export const localLogoutFn = createServerFn({ method: 'POST' }).handler(async () => {
  const authService = getAuthService()
  return authService.logout()
})

