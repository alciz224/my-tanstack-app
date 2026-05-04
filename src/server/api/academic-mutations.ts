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
import { getCookieHeader } from '@/lib/api-client'
import { getCsrfTokenServerSide } from '@/server/csrf'
import type { MutationResult } from '@/server/mutation-helper'
import { createMutationFn } from '@/server/mutation-helper'
import type { AcademicYear, AcademicYearInput } from '@/types/academic'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

/** Helper: perform a POST/PATCH/DELETE to a dynamic URL */
async function serverAction<T>(
  endpoint: string,
  method: 'POST' | 'PATCH' | 'DELETE',
  request: Request, 
  body?: Record<string, any>
): Promise<MutationResult<T>> {
  try {
    const cookieHeader = getCookieHeader({ request })
    const csrfToken = await getCsrfTokenServerSide({ request })

    if (import.meta.env.DEV) {
      console.log(`[${method}] ${endpoint}`, body ?? '(no body)')
    }

    const res = await fetch(`${BACKEND_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      credentials: 'include',
      body: method !== 'DELETE' && body != null ? JSON.stringify(body) : undefined,
    })

    let responseData: any = null
    const contentType = res.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      try { responseData = await res.json() } catch { /* ignore */ }
    }

    if (!res.ok) {
      return {
        success: false,
        error: responseData?.message || responseData?.detail || `Request failed (${res.status})`,
        errorCode: responseData?.error?.code,
      }
    }

    return { success: true, data: responseData as T }
  } catch (err: any) {
    if (import.meta.env.DEV) console.error(`[${method}] ${endpoint} crashed:`, err)
    return { success: false, error: err?.message || 'Network error' }
  }
}

// ── Create ────────────────────────────────────────────────────────────────────

/**
 * POST /api/v1/academic/academic-years/
 * Usage: createAcademicYearFn({ data: { name, start_year, end_year } })
 */
export const createAcademicYearFn = createMutationFn<AcademicYearInput, AcademicYear>(
  '/api/v1/academic/academic-years/',
  'POST'
)

// ── Action Mutations ──────────────────────────────────────────────────────────

/**
 * PATCH /api/v1/academic/academic-years/{id}/
 * Usage: updateAcademicYearFn({ data: { resourceId: '123', body: { name: '...' } } })
 */
export const updateAcademicYearFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as { resourceId: string; body: Partial<AcademicYearInput> })
  .handler(async ({ data, request }) => {
    if (!data.resourceId) throw new Error('Missing resourceId')
    return serverAction<AcademicYear>(
      `/api/v1/academic/academic-years/${data.resourceId}/`,
      'PATCH',
      request,
      data.body
    )
  })

/**
 * DELETE /api/v1/academic/academic-years/{id}/
 * Usage: deleteAcademicYearFn({ data: { resourceId: '123' } })
 */
export const deleteAcademicYearFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as { resourceId: string })
  .handler(async ({ data, request }) => {
    if (!data.resourceId) throw new Error('Missing resourceId')
    return serverAction<void>(
      `/api/v1/academic/academic-years/${data.resourceId}/`,
      'DELETE',
      request
    )
  })

/**
 * POST /api/v1/academic/academic-years/{id}/activate/
 * Usage: activateAcademicYearFn({ data: { resourceId: '123' } })
 */
export const activateAcademicYearFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as { resourceId: string })
  .handler(async ({ data, request }) => {
    if (!data.resourceId) throw new Error('Missing resourceId')
    return serverAction<AcademicYear>(
      `/api/v1/academic/academic-years/${data.resourceId}/activate/`,
      'POST',
      request
    )
  })

/**
 * POST /api/v1/academic/academic-years/{id}/archive/
 * Usage: archiveAcademicYearFn({ data: { resourceId: '123' } })
 */
export const archiveAcademicYearFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as { resourceId: string })
  .handler(async ({ data, request }) => {
    if (!data.resourceId) throw new Error('Missing resourceId')
    return serverAction<AcademicYear>(
      `/api/v1/academic/academic-years/${data.resourceId}/archive/`,
      'POST',
      request
    )
  })

/**
 * POST /api/v1/academic/academic-years/{id}/set_current/
 * Usage: setCurrentAcademicYearFn({ data: { resourceId: '123' } })
 */
export const setCurrentAcademicYearFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as { resourceId: string })
  .handler(async ({ data, request }) => {
    if (!data.resourceId) throw new Error('Missing resourceId')
    return serverAction<AcademicYear>(
      `/api/v1/academic/academic-years/${data.resourceId}/set_current/`,
      'POST',
      request
    )
  })
