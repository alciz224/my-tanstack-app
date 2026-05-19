/**
 * School Year API Server Functions
 *
 * Server functions for School Year data endpoints.
 * These run on the server during SSR and forward cookies to Django.
 */

import { createServerFn } from '@tanstack/react-start'
import { getSchoolYearService } from '@/server/data/school-year/factory'

// ============================================================================
// School Years
// ============================================================================

export const getSchoolYearsFn = createServerFn({ method: 'GET' })
  .inputValidator((input: { schoolId?: string }) => input)
  .handler(async ({ data }) => {
    return getSchoolYearService().getSchoolYears(data?.schoolId)
  })

export const getSchoolYearFn = createServerFn({ method: 'GET' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    return getSchoolYearService().getSchoolYear(id)
  })

// ============================================================================
// School Year Cycles
// ============================================================================

export const getSchoolYearCyclesFn = createServerFn({ method: 'GET' })
  .inputValidator((schoolYearId: string) => schoolYearId)
  .handler(async ({ data: schoolYearId }) => {
    return getSchoolYearService().getSchoolYearCycles(schoolYearId)
  })

// ============================================================================
// School Year Levels
// ============================================================================

export const getSchoolYearLevelsFn = createServerFn({ method: 'GET' })
  .inputValidator((schoolYearCycleId: string) => schoolYearCycleId)
  .handler(async ({ data: schoolYearCycleId }) => {
    return getSchoolYearService().getSchoolYearLevels(schoolYearCycleId)
  })

// ============================================================================
// School Year Level Subjects
// ============================================================================

export const getSchoolYearLevelSubjectsFn = createServerFn({ method: 'GET' })
  .inputValidator((schoolYearLevelId: string) => schoolYearLevelId)
  .handler(async ({ data: schoolYearLevelId }) => {
    return getSchoolYearService().getSchoolYearLevelSubjects(schoolYearLevelId)
  })

// ============================================================================
// Classrooms
// ============================================================================

export const getClassroomsFn = createServerFn({ method: 'GET' })
  .inputValidator((schoolYearLevelId: string) => schoolYearLevelId)
  .handler(async ({ data: schoolYearLevelId }) => {
    return getSchoolYearService().getClassrooms(schoolYearLevelId)
  })

// ============================================================================
// Time Slots
// ============================================================================

export const getTimeSlotsFn = createServerFn({ method: 'GET' })
  .inputValidator((schoolYearCycleId: string) => schoolYearCycleId)
  .handler(async ({ data: schoolYearCycleId }) => {
    return getSchoolYearService().getTimeSlots(schoolYearCycleId)
  })
