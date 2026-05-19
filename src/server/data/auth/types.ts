/**
 * Auth Data Adapter Types
 *
 * Defines the contract that both LocalAuthAdapter and ApiAuthAdapter implement.
 * Server functions depend ONLY on AuthDataAdapter — no adapter-specific types leak upward.
 */

import type {
  AuthResult,
  LoginInput,
  RegisterInput,
  SelectRoleInput,
  SelectRoleResult,
  User,
} from '@/server/auth'

/**
 * Auth data adapter interface — every auth operation goes through this.
 */
export interface AuthDataAdapter {
  /** Get the currently authenticated user (or null) */
  getCurrentUser: (cookieHeader?: string) => Promise<User | null>

  /** Authenticate with credentials */
  login: (data: LoginInput) => Promise<AuthResult>

  /** Register a new account */
  register: (data: RegisterInput) => Promise<AuthResult>

  /** Select an active role for the session */
  selectRole: (data: SelectRoleInput) => Promise<SelectRoleResult>

  /** End the current session */
  logout: () => Promise<{ success: boolean; error?: string }>
}
