/**
 * Centralized Role Type Definitions
 *
 * This module defines all user roles, portal routes, and role metadata
 * used throughout the GuiSchool application.
 */

/**
 * All available user roles in the system
 */
export const USER_ROLES = [
  'student',
  'teacher',
  'parent',
  'admin',
  'school_admin',
  'super_admin',
] as const

/**
 * User role type - derived from USER_ROLES array
 */
export type UserRole = (typeof USER_ROLES)[number]

/**
 * Portal route paths for each role
 * Maps role to its corresponding protected route path
 */
export const PORTAL_ROUTES: Record<UserRole, string> = {
  student: '/student',
  teacher: '/teacher',
  parent: '/parent',
  admin: '/admin',
  school_admin: '/school-admin',
  super_admin: '/super-admin',
}

/**
 * Portal metadata for each role
 * Used in the portal selection UI
 */
export const PORTAL_LABELS: Record<
  UserRole,
  { title: string; description: string }
> = {
  student: {
    title: 'Portail Étudiant',
    description: 'Accédez à vos cours, notes et devoirs',
  },
  teacher: {
    title: 'Portail Enseignant',
    description: 'Gérez vos classes et évaluations',
  },
  parent: {
    title: 'Portail Parent',
    description: 'Suivez la scolarité de vos enfants',
  },
  admin: {
    title: 'Portail Administrateur',
    description: 'Administration générale',
  },
  school_admin: {
    title: 'Portail Admin École',
    description: 'Gérez votre établissement',
  },
  super_admin: {
    title: 'Portail Super Admin',
    description: 'Administration plateforme',
  },
}

/**
 * Check if a string is a valid UserRole
 */
export function isValidRole(role: unknown): role is UserRole {
  return typeof role === 'string' && USER_ROLES.includes(role as UserRole)
}
