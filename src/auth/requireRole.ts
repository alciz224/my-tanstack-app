import { redirect } from '@tanstack/react-router'
import type { User } from '@/server/auth'

export type UserRole = 'admin' | 'teacher' | 'student'

/**
 * Check if user has one of the allowed roles.
 * Call this inside a layout route's `beforeLoad`.
 * Redirects to /unauthorized if the role doesn't match.
 */
export function requireRole(user: User, allowedRoles: UserRole[]) {
    const userRole = user.role as UserRole | undefined
    if (!userRole || !allowedRoles.includes(userRole)) {
        throw redirect({ to: '/unauthorized' })
    }
}
