import { mockAdminUsers } from './mocks'
import { mockTeachers, mockSchoolYearTeachers } from '@/server/data/teachers/mocks'
import { mockSchools, mockSchoolYears } from '@/server/data/schools/mocks'
import { MOCK_STUDENTS } from '@/server/data/students/mocks'
import type { AdminUser, CreateAdminUserInput, UserDetail, UserProfiles, UsersDataAdapter } from './types'

let nextUserId = 100

export class LocalUsersAdapter implements UsersDataAdapter {
  private users = structuredClone(mockAdminUsers)

  private async delay(ms = 300) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async getUsers(): Promise<Array<AdminUser>> {
    await this.delay()
    return structuredClone(this.users.filter((u) => !u.is_deleted))
  }

  async getUserById(id: string): Promise<UserDetail | null> {
    await this.delay()
    const user = this.users.find((u) => u.id === id)
    if (!user) return null

    const profiles = this.buildProfiles(user)
    return { ...structuredClone(user), profiles }
  }

  private buildProfiles(user: AdminUser): UserProfiles {
    const fullName = `${user.first_name} ${user.last_name}`
    const email = user.email

    // Super admin
    const is_super_admin = user.is_staff && user.id === 'usr-008'

    // School admin — derived from is_staff + school association
    const school_admin_schools = (() => {
      if (user.id === 'usr-001' || user.id === 'usr-004') {
        return mockSchools.map((s) => ({ id: s.id, name: s.name }))
      }
      return []
    })()

    // Teacher — cross-reference by email
    const teacher_assignments = (() => {
      if (!email) return []
      const teacher = mockTeachers.find((t) => t.email === email)
      if (!teacher) return []
      const schoolYearTeachers = mockSchoolYearTeachers.filter(
        (syt) => syt.teacher_id === teacher.id,
      )
      return schoolYearTeachers.map((syt) => {
        const schoolYear = mockSchoolYears.find((sy) => sy.id === syt.school_year_id)
        const school = schoolYear
          ? mockSchools.find((s) => s.id === schoolYear.school_id)
          : undefined
        return {
          school_year_id: syt.school_year_id,
          school_year_name: schoolYear?.name ?? syt.school_year_id,
          school_id: school?.id ?? '',
          school_name: school?.name ?? '—',
          status: syt.status,
        }
      })
    })()

    // Student — cross-reference by full name
    const student_enrollments = (() => {
      const students = MOCK_STUDENTS.filter(
        (s) =>
          `${s.first_name} ${s.last_name}`.toLowerCase() === fullName.toLowerCase(),
      )
      return students.map((s) => ({
        student_id: s.id,
        student_name: `${s.first_name} ${s.last_name}`,
        school_year: s.academic_year,
        level: s.level,
        classroom: s.class_name,
        status: s.enrollment_status,
      }))
    })()

    // Parent — cross-reference by name on student records
    const parent_children = (() => {
      const students = MOCK_STUDENTS.filter(
        (s) => s.parent_name?.toLowerCase() === fullName.toLowerCase(),
      )
      return students.map((s) => ({
        student_name: `${s.first_name} ${s.last_name}`,
        school_year: s.academic_year,
        level: s.level,
        classroom: s.class_name,
      }))
    })()

    return {
      is_super_admin,
      school_admin_schools,
      teacher_assignments,
      student_enrollments,
      parent_children,
    }
  }

  async createUser(data: CreateAdminUserInput): Promise<AdminUser> {
    await this.delay()
    const now = new Date().toISOString()
    const user: AdminUser = {
      id: `usr-${nextUserId++}`,
      email: data.email,
      phone: data.phone ?? null,
      first_name: data.first_name,
      last_name: data.last_name,
      is_active: data.is_active,
      is_staff: data.is_staff,
      date_joined: now,
      last_login: null,
      updated_at: now,
    }
    this.users.push(user)
    return structuredClone(user)
  }

  async updateUser(id: string, data: Partial<AdminUser>): Promise<AdminUser> {
    await this.delay()
    const idx = this.users.findIndex((u) => u.id === id)
    if (idx === -1) throw new Error('User not found')
    this.users[idx] = {
      ...this.users[idx],
      ...data,
      updated_at: new Date().toISOString(),
    }
    return structuredClone(this.users[idx])
  }

  async deleteUser(id: string): Promise<void> {
    await this.delay()
    const idx = this.users.findIndex((u) => u.id === id)
    if (idx === -1) throw new Error('User not found')
    this.users[idx] = {
      ...this.users[idx],
      is_deleted: true,
      deleted_at: new Date().toISOString(),
    }
  }
}
