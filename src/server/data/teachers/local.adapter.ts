import {
  mockSchoolYearTeachers,
  mockTeacherAssignments,
  mockTeachers,
  getTeacherClassesFromAssignments,
} from './mocks'
import type {
  SchoolYearTeacher,
  Teacher,
  TeacherAssignment,
  TeacherClass,
  TeachersDataAdapter,
} from './types'

export class LocalTeachersAdapter implements TeachersDataAdapter {
  private teachers = [...mockTeachers]
  private schoolYearTeachers = [...mockSchoolYearTeachers]
  private teacherAssignments = [...mockTeacherAssignments]

  async getTeachers(): Promise<Array<Teacher>> {
    return this.teachers
  }

  async getSchoolYearTeachers(
    schoolYearId: string,
  ): Promise<Array<SchoolYearTeacher>> {
    return this.schoolYearTeachers.filter(
      (t) => t.school_year_id === schoolYearId,
    )
  }

  async getTeacherAssignments(
    schoolYearTeacherId: string,
  ): Promise<Array<TeacherAssignment>> {
    return this.teacherAssignments.filter(
      (a) => a.school_year_teacher_id === schoolYearTeacherId,
    )
  }

  async getTeacherClasses(
    teacherId: string,
    _schoolYearId?: string,
  ): Promise<Array<TeacherClass>> {
    const syt = this.schoolYearTeachers.find((s) => s.teacher_id === teacherId)
    if (!syt) return []

    const assignments = this.teacherAssignments.filter(
      (a) =>
        a.school_year_teacher_id === syt.id && a.assignment_status === 'ACTIVE',
    )

    return getTeacherClassesFromAssignments(assignments)
  }

  async assignTeacherToSchoolYear(
    data: Omit<SchoolYearTeacher, 'id'>,
  ): Promise<SchoolYearTeacher> {
    const newSYT: SchoolYearTeacher = {
      ...data,
      id: `syt-${Date.now()}`,
      teacher: this.teachers.find((t) => t.id === data.teacher_id),
    }
    this.schoolYearTeachers.push(newSYT)
    return newSYT
  }

  async updateSchoolYearTeacher(
    id: string,
    updates: Partial<SchoolYearTeacher>,
  ): Promise<SchoolYearTeacher> {
    const index = this.schoolYearTeachers.findIndex((t) => t.id === id)
    if (index === -1) throw new Error('Not found')
    this.schoolYearTeachers[index] = {
      ...this.schoolYearTeachers[index],
      ...updates,
    }
    return this.schoolYearTeachers[index]
  }

  async createTeacherAssignment(
    data: Omit<TeacherAssignment, 'id'>,
  ): Promise<TeacherAssignment> {
    const newAssignment: TeacherAssignment = {
      ...data,
      id: `ta-${Date.now()}`,
    }
    this.teacherAssignments.push(newAssignment)
    return newAssignment
  }

  async updateTeacherAssignment(
    id: string,
    updates: Partial<TeacherAssignment>,
  ): Promise<TeacherAssignment> {
    const index = this.teacherAssignments.findIndex((a) => a.id === id)
    if (index === -1) throw new Error('Not found')
    this.teacherAssignments[index] = {
      ...this.teacherAssignments[index],
      ...updates,
    }
    return this.teacherAssignments[index]
  }
}
