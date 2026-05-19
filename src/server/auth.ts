/**
 * Authentication Module
 *
 * This module handles all authentication operations for the GuiSchool application.
 * It contains both SERVER FUNCTIONS (SSR) and CLIENT FUNCTIONS (browser-only).
 *
 * CRITICAL DISTINCTION:
 * - Server functions (createServerFn): Run on the server during SSR, forward cookies
 * - Client functions (async function): Run in the browser, manage session cookies
 *
 * WHY THIS MATTERS:
 * - Login/logout MUST run in browser to set/clear httpOnly cookies (API mode)
 * - User fetching MUST run on server (SSR) to forward cookies to Django (API mode)
 * - In LOCAL mode, ALL operations go through server functions so they share
 *   in-memory session state on the server process
 *
 * ADAPTER PATTERN:
 * All auth operations now go through the auth data adapter (local or API),
 * following the same pattern as geography, academic, and users.
 * When VITE_LOCAL_DATA=true, the local adapter provides a fully mocked auth
 * flow with in-memory session state.
 *
 * @see docs/ARCHITECTURE.md for detailed explanation
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

const _localLoginFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as LoginInput)
  .handler(async ({ data }) => {
    const authService = getAuthService()
    return authService.login(data)
  })

const _localRegisterFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as RegisterInput)
  .handler(async ({ data }) => {
    const authService = getAuthService()
    return authService.register(data)
  })

const _localSelectRoleFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as SelectRoleInput)
  .handler(async ({ data }) => {
    const authService = getAuthService()
    return authService.selectRole(data)
  })

const _localLogoutFn = createServerFn({ method: 'POST' }).handler(async () => {
  const authService = getAuthService()
  return authService.logout()
})

// ============================================================================
// Exported client functions
// ============================================================================
// These are the public API. Each one checks isLocalDataMode():
//   - LOCAL mode  → calls the server function (shared in-memory state)
//   - API mode    → does browser-side fetch (httpOnly cookie flow)
// ============================================================================

/**
 * Client-side login function
 *
 * In LOCAL mode: delegates to server function so session state is shared.
 * In API mode: runs in browser for proper httpOnly cookie handling.
 *
 * @param data - Login credentials
 * @returns AuthResult with user data on success, or detailed error information
 */
export async function loginFn(data: LoginInput): Promise<AuthResult> {
  if (isLocalDataMode()) {
    return _localLoginFn({ data })
  }

  // ── API mode: browser-side fetch ─────────────────────────────────
  const authService = getAuthService()
  return authService.login(data)
}

/**
 * Client-side registration function
 *
 * @param data - Registration information
 * @returns AuthResult with user data on success, or detailed error information
 */
export async function registerFn(data: RegisterInput): Promise<AuthResult> {
  if (isLocalDataMode()) {
    return _localRegisterFn({ data })
  }

  const authService = getAuthService()
  return authService.register(data)
}

/**
 * Client-side role selection function
 *
 * @param data - Role selection data
 * @returns SelectRoleResult with updated user data on success
 */
export async function selectRoleFn(
  data: SelectRoleInput,
): Promise<SelectRoleResult> {
  if (isLocalDataMode()) {
    return _localSelectRoleFn({ data })
  }

  const authService = getAuthService()
  return authService.selectRole(data)
}

/**
 * Logout function - clears session cookies (API) or in-memory state (local)
 */
export async function logoutFn(): Promise<{
  success: boolean
  error?: string
}> {
  if (isLocalDataMode()) {
    return _localLogoutFn()
  }

  const authService = getAuthService()
  return authService.logout()
}
