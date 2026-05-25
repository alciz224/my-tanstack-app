export interface AdminUser {
  id: string
  email: string | null
  phone: string | null
  first_name: string
  last_name: string
  is_active: boolean
  is_staff: boolean
  date_joined: string
  last_login: string | null
  updated_at: string
  created_by?: string
  updated_by?: string
  is_deleted?: boolean
  deleted_at?: string
  deleted_by?: string
}

export interface CreateAdminUserInput {
  email: string
  phone?: string
  first_name: string
  last_name: string
  is_active: boolean
  is_staff: boolean
}

export interface UserProfileEntry {
  school_year_id: string
  school_year_name: string
  school_id: string
  school_name: string
  status: string
}

export interface StudentEnrollmentEntry {
  student_id: string
  student_name: string
  school_year: string
  level: string
  classroom: string | null
  status: string
}

export interface ParentChildEntry {
  student_name: string
  school_year: string
  level: string
  classroom: string | null
}

export interface UserProfiles {
  is_super_admin: boolean
  school_admin_schools: Array<{ id: string; name: string }>
  teacher_assignments: Array<UserProfileEntry>
  student_enrollments: Array<StudentEnrollmentEntry>
  parent_children: Array<ParentChildEntry>
}

export interface UserDetail extends AdminUser {
  profiles: UserProfiles
}

export interface UsersDataAdapter {
  getUsers: () => Promise<Array<AdminUser>>
  getUserById: (id: string) => Promise<UserDetail | null>
  createUser: (data: CreateAdminUserInput) => Promise<AdminUser>
  updateUser: (id: string, data: Partial<AdminUser>) => Promise<AdminUser>
  deleteUser: (id: string) => Promise<void>
}
