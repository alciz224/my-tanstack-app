/**
 * Mock auth data for local development - Guinea context
 */

import type { User } from '@/server/auth'
import type { UserRole } from '@/types/roles'

// Guinea phone format: +224 xxx xx xx xx
export const MOCK_CREDENTIALS = [
  { identifier: 'admin@excellence.edu.gn', password: 'password' },
  { identifier: 'directeur', password: 'password' },
  { identifier: '+224 620 00 00 00', password: 'password' },
] as const

export const mockUser: User = {
  id: 'user-001',
  email: 'directeur@excellence.edu.gn',
  email_masked: 'd***r@excellence.edu.gn',
  phone: '+224 620 11 22 33',
  phone_masked: '+224 620 ***233',
  first_name: 'Abdoulaye',
  last_name: 'Diallo',
  full_name: 'Abdoulaye Diallo',
  backup_phone: null,
  backup_phone_owner: null,
  role: null,
  available_roles: [
    'super_admin',
    'admin',
    'school_admin',
    'teacher',
    'student',
    'parent',
  ] as Array<UserRole>,
  verification: {
    is_verified: true,
    email_verified: true,
    email_verified_at: '2024-09-01T10:00:00Z',
    phone_verified: true,
    phone_verified_at: '2024-09-01T10:05:00Z',
  },
  security: {
    score: 85,
    level: 'high',
    has_security_questions: true,
    security_questions_count: 3,
    has_backup_phone: false,
    suggestions: [],
  },
  profiles: {
    has_student: false,
    has_teacher: true,
    has_school_admin: true,
  },
  teacher_id: 't-1', // Links to teacher profile for local dev
  date_joined: '2020-09-01T08:00:00Z',
  last_login: new Date().toISOString(),
  is_active: true,
}
