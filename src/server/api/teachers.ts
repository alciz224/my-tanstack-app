import { createServerFn } from '@tanstack/react-start'
import type {
  SchoolYearTeacher,
  Teacher,
  TeacherAssignment,
} from '@/server/data/teachers/types'
import { getTeachersService } from '@/server/data/teachers/factory'

export const getTeachersFn = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Array<Teacher>> => {
    return getTeachersService().getTeachers()
  },
)

export const getSchoolYearTeachersFn = createServerFn({ method: 'GET' })
  .inputValidator((schoolYearId: string) => schoolYearId)
  .handler(
    async ({ data: schoolYearId }): Promise<Array<SchoolYearTeacher>> => {
      return getTeachersService().getSchoolYearTeachers(schoolYearId)
    },
  )

export const getTeacherAssignmentsFn = createServerFn({ method: 'GET' })
  .inputValidator((schoolYearTeacherId: string) => schoolYearTeacherId)
  .handler(
    async ({
      data: schoolYearTeacherId,
    }): Promise<Array<TeacherAssignment>> => {
      return getTeachersService().getTeacherAssignments(schoolYearTeacherId)
    },
  )

export const assignTeacherToSchoolYearFn = createServerFn({ method: 'POST' })
  .inputValidator((data: Omit<SchoolYearTeacher, 'id'>) => data)
  .handler(async ({ data }): Promise<SchoolYearTeacher> => {
    return getTeachersService().assignTeacherToSchoolYear(data)
  })

export const updateSchoolYearTeacherFn = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { id: string; updates: Partial<SchoolYearTeacher> }) => data,
  )
  .handler(async ({ data: { id, updates } }): Promise<SchoolYearTeacher> => {
    return getTeachersService().updateSchoolYearTeacher(id, updates)
  })

export const createTeacherAssignmentFn = createServerFn({ method: 'POST' })
  .inputValidator((data: Omit<TeacherAssignment, 'id'>) => data)
  .handler(async ({ data }): Promise<TeacherAssignment> => {
    return getTeachersService().createTeacherAssignment(data)
  })

export const updateTeacherAssignmentFn = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { id: string; updates: Partial<TeacherAssignment> }) => data,
  )
  .handler(async ({ data: { id, updates } }): Promise<TeacherAssignment> => {
    return getTeachersService().updateTeacherAssignment(id, updates)
  })
