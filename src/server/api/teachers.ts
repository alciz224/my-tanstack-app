import { createServerFn } from '@tanstack/react-start'
import type {
  SchoolYearTeacher,
  Teacher,
  TeacherAssignment,
  TeacherClass,
} from '@/server/data/teachers/types'

export const getTeachersFn = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Array<Teacher>> => {
    return (await import('@/server/data/teachers/factory'))
      .getTeachersService()
      .getTeachers()
  },
)

export const getSchoolYearTeachersFn = createServerFn({ method: 'GET' })
  .inputValidator((schoolYearId: string) => schoolYearId)
  .handler(
    async ({ data: schoolYearId }): Promise<Array<SchoolYearTeacher>> => {
      return (await import('@/server/data/teachers/factory'))
        .getTeachersService()
        .getSchoolYearTeachers(schoolYearId)
    },
  )

export const getTeacherAssignmentsFn = createServerFn({ method: 'GET' })
  .inputValidator((schoolYearTeacherId: string) => schoolYearTeacherId)
  .handler(
    async ({
      data: schoolYearTeacherId,
    }): Promise<Array<TeacherAssignment>> => {
      return (await import('@/server/data/teachers/factory'))
        .getTeachersService()
        .getTeacherAssignments(schoolYearTeacherId)
    },
  )

export const getTeacherClassesFn = createServerFn({ method: 'GET' })
  .inputValidator((data: { teacherId: string; schoolYearId?: string }) => data)
  .handler(async ({ data }): Promise<Array<TeacherClass>> => {
    return (await import('@/server/data/teachers/factory'))
      .getTeachersService()
      .getTeacherClasses(data.teacherId, data.schoolYearId)
  })

export const assignTeacherToSchoolYearFn = createServerFn({ method: 'POST' })
  .inputValidator((data: Omit<SchoolYearTeacher, 'id'>) => data)
  .handler(async ({ data }): Promise<SchoolYearTeacher> => {
    return (await import('@/server/data/teachers/factory'))
      .getTeachersService()
      .assignTeacherToSchoolYear(data)
  })

export const updateSchoolYearTeacherFn = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { id: string; updates: Partial<SchoolYearTeacher> }) => data,
  )
  .handler(async ({ data: { id, updates } }): Promise<SchoolYearTeacher> => {
    return (await import('@/server/data/teachers/factory'))
      .getTeachersService()
      .updateSchoolYearTeacher(id, updates)
  })

export const createTeacherAssignmentFn = createServerFn({ method: 'POST' })
  .inputValidator((data: Omit<TeacherAssignment, 'id'>) => data)
  .handler(async ({ data }): Promise<TeacherAssignment> => {
    return (await import('@/server/data/teachers/factory'))
      .getTeachersService()
      .createTeacherAssignment(data)
  })

export const updateTeacherAssignmentFn = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { id: string; updates: Partial<TeacherAssignment> }) => data,
  )
  .handler(async ({ data: { id, updates } }): Promise<TeacherAssignment> => {
    return (await import('@/server/data/teachers/factory'))
      .getTeachersService()
      .updateTeacherAssignment(id, updates)
  })
