import { createServerFn } from '@tanstack/react-start'
import type {
  Classroom,
  CreateSchoolInput,
  School,
  SchoolYear,
  SchoolYearCycle,
  SchoolYearLevel,
  SchoolYearLevelSubject,
} from '@/server/data/schools/types'

export const getSchoolsFn = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Array<School>> => {
    const { getSchoolsService } = await import('@/server/data/schools/factory')
    return getSchoolsService().getSchools()
  },
)

export const getSchoolByIdFn = createServerFn({ method: 'GET' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }): Promise<School | null> => {
    const { getSchoolsService } = await import('@/server/data/schools/factory')
    return getSchoolsService().getSchoolById(id)
  })

export const getSchoolYearsFn = createServerFn({ method: 'GET' })
  .inputValidator((schoolId: string) => schoolId)
  .handler(async ({ data: schoolId }): Promise<Array<SchoolYear>> => {
    const { getSchoolsService } = await import('@/server/data/schools/factory')
    return getSchoolsService().getSchoolYears(schoolId)
  })

export const getSchoolYearByIdFn = createServerFn({ method: 'GET' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }): Promise<SchoolYear | null> => {
    const { getSchoolsService } = await import('@/server/data/schools/factory')
    return getSchoolsService().getSchoolYearById(id)
  })

export const createSchoolYearFn = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: Omit<SchoolYear, 'id' | 'created_at' | 'updated_at'>) => data,
  )
  .handler(async ({ data }): Promise<SchoolYear> => {
    const { getSchoolsService } = await import('@/server/data/schools/factory')
    return getSchoolsService().createSchoolYear(data)
  })

export const updateSchoolYearFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string; updates: Partial<SchoolYear> }) => data)
  .handler(async ({ data: { id, updates } }): Promise<SchoolYear> => {
    const { getSchoolsService } = await import('@/server/data/schools/factory')
    return getSchoolsService().updateSchoolYear(id, updates)
  })

export const getSchoolYearCyclesFn = createServerFn({ method: 'GET' })
  .inputValidator((schoolYearId: string) => schoolYearId)
  .handler(async ({ data: schoolYearId }): Promise<Array<SchoolYearCycle>> => {
    const { getSchoolsService } = await import('@/server/data/schools/factory')
    return getSchoolsService().getSchoolYearCycles(schoolYearId)
  })

export const getSchoolYearLevelsFn = createServerFn({ method: 'GET' })
  .inputValidator((schoolYearCycleId: string) => schoolYearCycleId)
  .handler(
    async ({ data: schoolYearCycleId }): Promise<Array<SchoolYearLevel>> => {
      const { getSchoolsService } =
        await import('@/server/data/schools/factory')
      return getSchoolsService().getSchoolYearLevels(schoolYearCycleId)
    },
  )

export const getSchoolYearLevelSubjectsFn = createServerFn({ method: 'GET' })
  .inputValidator((schoolYearLevelId: string) => schoolYearLevelId)
  .handler(
    async ({
      data: schoolYearLevelId,
    }): Promise<Array<SchoolYearLevelSubject>> => {
      const { getSchoolsService } =
        await import('@/server/data/schools/factory')
      return getSchoolsService().getSchoolYearLevelSubjects(schoolYearLevelId)
    },
  )

export const getClassroomsFn = createServerFn({ method: 'GET' })
  .inputValidator((schoolYearLevelId: string) => schoolYearLevelId)
  .handler(async ({ data: schoolYearLevelId }): Promise<Array<Classroom>> => {
    const { getSchoolsService } = await import('@/server/data/schools/factory')
    return getSchoolsService().getClassrooms(schoolYearLevelId)
  })

export const createClassroomFn = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: {
      schoolYearLevelId: string
      name: string
      capacity?: number
      room_number?: string
    }) => data && data.schoolYearLevelId && data.name,
  )
  .handler(
    async ({
      data,
    }: {
      data: {
        schoolYearLevelId: string
        name: string
        capacity?: number
        room_number?: string
      }
    }): Promise<Classroom> => {
      const { getSchoolsService } =
        await import('@/server/data/schools/factory')
      return getSchoolsService().createClassroom({
        school_year_level_id: data.schoolYearLevelId,
        name: data.name,
        capacity: data.capacity,
        room_number: data.room_number,
      })
    },
  )

export const createSchoolFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as CreateSchoolInput)
  .handler(async ({ data }) => {
    const { getSchoolsService } = await import('@/server/data/schools/factory')
    return getSchoolsService().createSchool(data)
  })

export const updateSchoolFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as { id: string; data: Partial<School> })
  .handler(async ({ data }) => {
    const { getSchoolsService } = await import('@/server/data/schools/factory')
    return getSchoolsService().updateSchool(data.id, data.data)
  })

export const deleteSchoolFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as { id: string })
  .handler(async ({ data }) => {
    const { getSchoolsService } = await import('@/server/data/schools/factory')
    return getSchoolsService().deleteSchool(data.id)
  })
