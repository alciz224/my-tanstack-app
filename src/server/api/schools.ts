import { createServerFn } from '@tanstack/react-start'
import type {
  Classroom,
  School,
  SchoolYear,
  SchoolYearCycle,
  SchoolYearLevel,
  SchoolYearLevelSubject,
} from '@/server/data/schools/types'
import { getSchoolsService } from '@/server/data/schools/factory'

export const getSchoolsFn = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Array<School>> => {
    return getSchoolsService().getSchools()
  },
)

export const getSchoolByIdFn = createServerFn({ method: 'GET' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }): Promise<School | null> => {
    return getSchoolsService().getSchoolById(id)
  })

export const getSchoolYearsFn = createServerFn({ method: 'GET' })
  .inputValidator((schoolId: string) => schoolId)
  .handler(async ({ data: schoolId }): Promise<Array<SchoolYear>> => {
    return getSchoolsService().getSchoolYears(schoolId)
  })

export const getSchoolYearByIdFn = createServerFn({ method: 'GET' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }): Promise<SchoolYear | null> => {
    return getSchoolsService().getSchoolYearById(id)
  })

export const createSchoolYearFn = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: Omit<SchoolYear, 'id' | 'created_at' | 'updated_at'>) => data,
  )
  .handler(async ({ data }): Promise<SchoolYear> => {
    return getSchoolsService().createSchoolYear(data)
  })

export const updateSchoolYearFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string; updates: Partial<SchoolYear> }) => data)
  .handler(async ({ data: { id, updates } }): Promise<SchoolYear> => {
    return getSchoolsService().updateSchoolYear(id, updates)
  })

export const getSchoolYearCyclesFn = createServerFn({ method: 'GET' })
  .inputValidator((schoolYearId: string) => schoolYearId)
  .handler(async ({ data: schoolYearId }): Promise<Array<SchoolYearCycle>> => {
    return getSchoolsService().getSchoolYearCycles(schoolYearId)
  })

export const getSchoolYearLevelsFn = createServerFn({ method: 'GET' })
  .inputValidator((schoolYearCycleId: string) => schoolYearCycleId)
  .handler(
    async ({ data: schoolYearCycleId }): Promise<Array<SchoolYearLevel>> => {
      return getSchoolsService().getSchoolYearLevels(schoolYearCycleId)
    },
  )

export const getSchoolYearLevelSubjectsFn = createServerFn({ method: 'GET' })
  .inputValidator((schoolYearLevelId: string) => schoolYearLevelId)
  .handler(
    async ({
      data: schoolYearLevelId,
    }): Promise<Array<SchoolYearLevelSubject>> => {
      return getSchoolsService().getSchoolYearLevelSubjects(schoolYearLevelId)
    },
  )

export const getClassroomsFn = createServerFn({ method: 'GET' })
  .inputValidator((schoolYearLevelId: string) => schoolYearLevelId)
  .handler(async ({ data: schoolYearLevelId }): Promise<Array<Classroom>> => {
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
      return getSchoolsService().createClassroom({
        school_year_level_id: data.schoolYearLevelId,
        name: data.name,
        capacity: data.capacity,
        room_number: data.room_number,
      })
    },
  )
