/**
 * Local Auth Adapter — in-memory mock authentication
 *
 * Simulates the full auth lifecycle (login → select-role → status → logout)
 * without a running backend. State is held in a module-level variable so it
 * persists across server-function invocations within the same dev-server process.
 *
 * IMPORTANT: In local mode, ALL auth operations (login, selectRole, etc.) run
 * as server functions (createServerFn). This ensures they modify the SAME
 * module-level `sessionUser` variable that getCurrentUserFn reads.
 * Browser-side code never touches this adapter directly.
 *
 * This follows the same adapter pattern used by geography, academic, and users.
 */

import { MOCK_CREDENTIALS, mockUser } from './mocks'
import type {
  AuthResult,
  LoginInput,
  RegisterInput,
  SelectRoleInput,
  SelectRoleResult,
  User,
} from '@/server/auth'
import type { UserRole } from '@/types/roles'
import type { AuthDataAdapter } from './types'
import { isValidRole } from '@/types/roles'

// ── Session state for LOCAL mode ──────────────────────────────────────────
// Uses globalThis + localStorage fallback so the session survives
// Vite SSR HMR module re-evaluations and works across requests
const GLOBAL_SESSION_KEY = '__eduvault_local_session__' as const

function getSessionUser(): User | null {
  // First try globalThis (for same-request/server-side)
  let user = (globalThis as any)[GLOBAL_SESSION_KEY] ?? null

  // Fallback: try localStorage (for cross-request/client-side)
  if (!user && typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('eduvault_local_user')
      if (stored) {
        user = JSON.parse(stored)
      }
    } catch (e) {
      // ignore
    }
  }

  return user
}

export function setSessionUser(user: User | null): void {
  // Store in globalThis
  ;(globalThis as any)[GLOBAL_SESSION_KEY] = user

  // Also store in localStorage for persistence
  if (typeof window !== 'undefined') {
    if (user) {
      localStorage.setItem('eduvault_local_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('eduvault_local_user')
    }
  }
}

// Client session getter - set by client code after login
let _clientSessionGetter: (() => User | null) | null = null

export function setClientSessionGetter(fn: () => User | null) {
  _clientSessionGetter = fn
}

export function initLocalAuthClientSession() {
  // No-op: client session is already handled via localStorage in getSessionUser()
}

/**
 * Simulate realistic network latency
 */
function delay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export class LocalAuthAdapter implements AuthDataAdapter {
  // ── getCurrentUser ──────────────────────────────────────────────────
  async getCurrentUser(_cookieHeader?: string): Promise<User | null> {
    await delay(100)

    let sessionUser = getSessionUser()

    // Also try client session getter if available
    if (!sessionUser && _clientSessionGetter) {
      sessionUser = _clientSessionGetter()
    }

    if (import.meta.env.DEV) {
      console.debug(
        '[LocalAuthAdapter.getCurrentUser] sessionUser:',
        sessionUser?.role ?? 'null',
      )
    }

    return sessionUser ? { ...sessionUser } : null
  }

  // ── login ───────────────────────────────────────────────────────────
  async login(data: LoginInput): Promise<AuthResult> {
    await delay(500)

    // Check credentials against mock list
    const valid = MOCK_CREDENTIALS.some(
      (c) => c.identifier === data.identifier && c.password === data.password,
    )

    if (!valid) {
      if (import.meta.env.DEV) {
        console.debug(
          '[LocalAuthAdapter.login] Invalid credentials for:',
          data.identifier,
        )
      }
      return {
        success: false,
        error: 'Incorrect identifier or password.',
        errorCode: 'INVALID_CREDENTIALS',
      }
    }

    // Create session — role starts as null (user must select portal)
    const newSession: User = {
      ...mockUser,
      role: null,
      last_login: new Date().toISOString(),
    }
    setSessionUser(newSession)

    if (import.meta.env.DEV) {
      console.debug(
        '[LocalAuthAdapter.login] ✅ Logged in as:',
        newSession.full_name,
      )
    }

    return {
      success: true,
      user: { ...newSession },
    }
  }

  // ── register ────────────────────────────────────────────────────────
  async register(data: RegisterInput): Promise<AuthResult> {
    await delay(600)

    // Simulate duplicate-email check
    if (data.email === mockUser.email) {
      return {
        success: false,
        error: 'An account with this email already exists.',
        errorCode: 'DUPLICATE_EMAIL',
        fieldErrors: {
          email: ['An account with this email already exists'],
        },
      }
    }

    // Create a new user from registration data
    const newUser: User = {
      ...mockUser,
      id: `mock-user-${Date.now()}`,
      email: data.email,
      email_masked: data.email.replace(/(.{2}).+(@.+)/, '$1***$2'),
      phone: data.phone || null,
      phone_masked: data.phone
        ? data.phone.replace(/(.{4}).+(.{3})/, '$1***$2')
        : null,
      first_name: data.first_name,
      last_name: data.last_name,
      full_name: `${data.first_name} ${data.last_name}`,
      role: null,
      available_roles: ['student'] as Array<UserRole>, // New users start as students
      date_joined: new Date().toISOString(),
      last_login: new Date().toISOString(),
    }

    setSessionUser(newUser)

    if (import.meta.env.DEV) {
      console.debug(
        '[LocalAuthAdapter.register] ✅ Registered:',
        newUser.full_name,
      )
    }

    return {
      success: true,
      user: { ...newUser },
    }
  }

  // ── selectRole ──────────────────────────────────────────────────────
  async selectRole(data: SelectRoleInput): Promise<SelectRoleResult> {
    await delay(300)

    const currentUser = getSessionUser()
    if (!currentUser) {
      return {
        success: false,
        error: 'Not authenticated.',
        errorCode: 'NOT_AUTHENTICATED',
      }
    }

    if (!isValidRole(data.role)) {
      return {
        success: false,
        error: `Invalid role: ${data.role}`,
        errorCode: 'INVALID_ROLE',
      }
    }

    const role = data.role
    if (!currentUser.available_roles.includes(role)) {
      return {
        success: false,
        error: `You do not have access to the role: ${data.role}`,
        errorCode: 'ROLE_NOT_AVAILABLE',
      }
    }

    // Update session with selected role
    const updatedUser = { ...currentUser, role }
    setSessionUser(updatedUser)

    if (import.meta.env.DEV) {
      console.debug('[LocalAuthAdapter.selectRole] ✅ Role set to:', role)
    }

    return {
      success: true,
      user: { ...updatedUser },
    }
  }

  // ── logout ──────────────────────────────────────────────────────────
  async logout(): Promise<{ success: boolean; error?: string }> {
    await delay(200)

    setSessionUser(null)

    if (import.meta.env.DEV) {
      console.debug('[LocalAuthAdapter.logout] ✅ Session cleared')
    }

    return { success: true }
  }
}
