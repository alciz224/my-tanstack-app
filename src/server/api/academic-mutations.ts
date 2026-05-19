/**
 * Academic Year Mutations (Server Functions)
 *
 * Each action is a dedicated createServerFn — no generic wrappers.
 * Input type always uses `resourceId` (avoids any TanStack Start naming issues).
 *
 * Calling convention: fn({ data: { resourceId: '123' } })
 * The `data` wrapper is required by TanStack Start.
 */

import { createServerFn } from '@tanstack/react-start'
import type { AcademicYear, AcademicYearInput } from '@/types/academic'
export const createAcademicYearFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as AcademicYearInput)
  .handler(async ({ data }) => {
    const { serverAction } = await import('@/server/mutation-helper.server')
    return serverAction<AcademicYear>(
      '/api/v1/academic/academic-years/',
      'POST',
      data,
    )
  })

// ── Action Mutations ──────────────────────────────────────────────────────────

/**
 * PATCH /api/v1/academic/academic-years/{id}/
 * Usage: updateAcademicYearFn({ data: { resourceId: '123', body: { name: '...' } } })
 */
export const updateAcademicYearFn = createServerFn({ method: 'POST' })
  .inputValidator(
    (d: unknown) =>
      d as { resourceId: string; body: Partial<AcademicYearInput> },
  )
  .handler(async ({ data }) => {
    if (!data.resourceId) throw new Error('Missing resourceId')
    const { serverAction } = await import('@/server/mutation-helper.server')
    return serverAction<AcademicYear>(
      `/api/v1/academic/academic-years/${data.resourceId}/`,
      'PATCH',
      data.body,
    )
  })

/**
 * DELETE /api/v1/academic/academic-years/{id}/
 * Usage: deleteAcademicYearFn({ data: { resourceId: '123' } })
 */
export const deleteAcademicYearFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as { resourceId: string })
  .handler(async ({ data }) => {
    if (!data.resourceId) throw new Error('Missing resourceId')
    const { serverAction } = await import('@/server/mutation-helper.server')
    return serverAction<void>(
      `/api/v1/academic/academic-years/${data.resourceId}/`,
      'DELETE',
    )
  })

/**
 * POST /api/v1/academic/academic-years/{id}/activate/
 * Usage: activateAcademicYearFn({ data: { resourceId: '123' } })
 */
export const activateAcademicYearFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as { resourceId: string })
  .handler(async ({ data }) => {
    if (!data.resourceId) throw new Error('Missing resourceId')
    const { serverAction } = await import('@/server/mutation-helper.server')
    return serverAction<AcademicYear>(
      `/api/v1/academic/academic-years/${data.resourceId}/activate/`,
      'POST',
    )
  })

/**
 * POST /api/v1/academic/academic-years/{id}/archive/
 * Usage: archiveAcademicYearFn({ data: { resourceId: '123' } })
 */
export const archiveAcademicYearFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as { resourceId: string })
  .handler(async ({ data }) => {
    if (!data.resourceId) throw new Error('Missing resourceId')
    const { serverAction } = await import('@/server/mutation-helper.server')
    return serverAction<AcademicYear>(
      `/api/v1/academic/academic-years/${data.resourceId}/archive/`,
      'POST',
    )
  })

/**
 * POST /api/v1/academic/academic-years/{id}/set_current/
 * Usage: setCurrentAcademicYearFn({ data: { resourceId: '123' } })
 */
export const setCurrentAcademicYearFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as { resourceId: string })
  .handler(async ({ data }) => {
    if (!data.resourceId) throw new Error('Missing resourceId')
    const { serverAction } = await import('@/server/mutation-helper.server')
    return serverAction<AcademicYear>(
      `/api/v1/academic/academic-years/${data.resourceId}/set_current/`,
      'POST',
    )
  })
