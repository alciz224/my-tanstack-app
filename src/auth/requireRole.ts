import { redirect } from '@tanstack/react-router'
import type { User } from '@/server/auth'
import type { UserRole } from '@/types/roles'
import { isValidRole } from '@/types/roles'

/**
 * Check if user has one of the allowed roles.
 * Call this inside a portal route's `beforeLoad` (child of `/_authed`).
 *
 * This function validates:
 * 1. User has selected a role (user.role is not null)
 * 2. The selected role is a valid UserRole (runtime check)
 * 3. The selected role matches one of the allowedRoles
 * 4. The selected role is in the user's available_roles (extra security)
 *
 * Redirects:
 * - /select-portal if user.role is null (no role selected yet)
 * - /unauthorized if role doesn't match or user doesn't have access
 *
 * @param user - Non-null User object (guaranteed by parent `/_authed` layout)
 * @param allowedRoles - Array of roles that can access this route
 */
export function requireRole(user: User, allowedRoles: Array<UserRole>) {
  if (import.meta.env.DEV) {
    console.debug(
      '[requireRole] user.role:',
      user.role,
      '| allowedRoles:',
      allowedRoles,
      '| available_roles:',
      user.available_roles,
    )
  }

  if (!user.role) {
    if (import.meta.env.DEV)
      console.debug('[requireRole] → redirect /select-portal (role is null)')
    throw redirect({ to: '/select-portal' })
  }

  if (!isValidRole(user.role)) {
    console.error('[requireRole] Invalid role from API:', user.role)
    throw redirect({ to: '/unauthorized' })
  }

  if (!allowedRoles.includes(user.role)) {
    if (import.meta.env.DEV)
      console.debug(
        '[requireRole] → redirect /unauthorized (role not in allowedRoles)',
      )
    throw redirect({ to: '/unauthorized' })
  }

  if (!user.available_roles.includes(user.role)) {
    if (import.meta.env.DEV)
      console.debug(
        '[requireRole] → redirect /unauthorized (role not in available_roles)',
      )
    throw redirect({ to: '/unauthorized' })
  }

  if (import.meta.env.DEV) {
    console.debug('[requireRole] ✅ Access granted for role:', user.role)
  }
}
