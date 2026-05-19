/**
 * Academic API Server Functions
 *
 * Server functions for Academic reference data endpoints.
 * Uses the Data Adapter pattern to toggle between local mock and real API.
 *
 * Pattern:
 * - GET requests: createServerFn with serverFetch (cookie forwarding for SSR)
 * - Mutations (POST/PATCH/DELETE): use server functions in @/server/api/academic-mutations
 *   (serverMutate forwards cookies + CSRF to Django)
 */

import { createServerFn } from '@tanstack/react-start'
import { getAcademicService } from '@/server/data/academic/factory'

// ============================================================================
// Academic Years
// ============================================================================

/**
 * Get list of academic years
 */
export const getAcademicYearsFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    return getAcademicService().getAcademicYears()
  },
)

/**
 * Get a single academic year by ID
 * GET /api/v1/academic/academic-years/{id}/
 */
export const getAcademicYearFn = createServerFn({ method: 'GET' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id, context }: { data: string; context: any }) => {
    const result = await serverFetch<AcademicYear>(
      ACADEMIC_ENDPOINTS.ACADEMIC_YEAR_DETAIL(id),
      context,
    )

    return result
  })

/**
 * Get the current academic year
 * GET /api/v1/academic/academic-years/current/
 */
export const getCurrentAcademicYearFn = createServerFn({
  method: 'GET',
}).handler(async (ctx) => {
  const data = await serverFetch<AcademicYear>(
    ACADEMIC_ENDPOINTS.ACADEMIC_YEAR_CURRENT,
    ctx,
  )

  return data
})

// ============================================================================
// Other Academic Entities (Data Adapter Pattern)
// ============================================================================

export const getCyclesFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    return getAcademicService().getCycles()
  },
)

export const getLevelsFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    return getAcademicService().getLevels()
  },
)

export const getTracksFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    return getAcademicService().getTracks()
  },
)

export const getSubjectsFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    return getAcademicService().getSubjects()
  },
)

export const getPeriodsFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    return getAcademicService().getTermTypes()
  },
)

export const getTermTypesFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    return getAcademicService().getTermTypes()
  },
)

export const getTermsFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    return getAcademicService().getTerms()
  },
)

export const getAssessmentTypesFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    return getAcademicService().getAssessmentTypes()
  },
)

// ============================================================================
// Usage Examples (for documentation)
// ============================================================================

/**
 * EXAMPLE: Using in a route loader
 *
 * export const Route = createFileRoute('/_authed/super-admin/academic-years')({
 *   loader: async () => {
 *     const data = await getAcademicYearsFn()
 *     return { academicYears: data?.results ?? [] }
 *   },
 *   component: AcademicYearsPage,
 * })
 *
 * EXAMPLE: Using mutations (server functions)
 *
 * import {
 *   createAcademicYearFn,
 *   updateAcademicYearFn,
 *   deleteAcademicYearFn,
 *   activateAcademicYearFn,
 *   archiveAcademicYearFn,
 *   setCurrentAcademicYearFn,
 * } from '@/server/api/academic-mutations'
 *
 * const createMutation = useMutation({
 *   mutationFn: async (input: AcademicYearInput) => {
 *     const result = await createAcademicYear(input)
 *     if (!result.success) throw new Error(result.error)
 *     return result.data
 *   },
 *   onSuccess: () => queryClient.invalidateQueries({ queryKey: academicKeys.academicYears() }),
 * })
 */
