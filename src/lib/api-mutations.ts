/**
 * Client-side API mutation functions
 * 
 * These functions run in the BROWSER (not server-side) to ensure
 * session cookies are properly sent with requests.
 * 
 * Server functions (createServerFn) cannot access browser cookies
 * when called from user actions (button clicks, etc.)
 * 
 * Pattern: All mutations use browser fetch() with credentials: 'include'
 * and call through Vite proxy (/api/v1/...) which forwards to Django
 */

import type { AcademicYear, AcademicYearInput } from '@/types/academic'

async function safeReadJson(res: Response): Promise<any | null> {
  // Some endpoints may return 204 No Content or non-JSON (e.g. HTML error pages)
  const contentType = res.headers.get('content-type') || ''
  if (res.status === 204) return null

  // Prefer JSON when declared
  if (contentType.includes('application/json')) {
    try {
      return await res.json()
    } catch {
      return null
    }
  }

  // Fallback: try to parse text as JSON, otherwise ignore
  try {
    const text = await res.text()
    if (!text) return null
    try {
      return JSON.parse(text)
    } catch {
      return { detail: text }
    }
  } catch {
    return null
  }
}

/**
 * Result type for API mutations
 */
export interface MutationResult<T = any> {
  success: boolean
  data?: T
  error?: string
  errorCode?: string
}

/**
 * Get CSRF token from cookies (client-side only)
 */
function getCsrfTokenFromCookie(): string | null {
  const match = document.cookie.match(/csrftoken=([^;]+)/)
  return match ? match[1] : null
}

/**
 * Create a new academic year
 * POST /api/v1/academic/academic-years/
 */
export async function createAcademicYear(
  input: AcademicYearInput
): Promise<MutationResult<AcademicYear>> {
  try {
    const csrfToken = getCsrfTokenFromCookie()

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken
    }

    const res = await fetch('/api/v1/academic/academic-years/', {
      method: 'POST',
      headers,
      credentials: 'include',
      body: JSON.stringify(input),
    })

    const data = await safeReadJson(res)

    if (!res.ok) {
      return {
        success: false,
        error:
          (data as any)?.message ||
          (data as any)?.detail ||
          `Request failed (${res.status})`,
      }
    }

    return {
      success: true,
      data: data as any,
    }
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Network error',
    }
  }
}

/**
 * Update an academic year
 * PATCH /api/v1/academic/academic-years/{id}/
 */
export async function updateAcademicYear(
  id: string,
  input: Partial<AcademicYearInput>
): Promise<MutationResult<AcademicYear>> {
  try {
    const csrfToken = getCsrfTokenFromCookie()

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken
    }

    const res = await fetch(`/api/v1/academic/academic-years/${id}/`, {
      method: 'PATCH',
      headers,
      credentials: 'include',
      body: JSON.stringify(input),
    })

    const data = await safeReadJson(res)

    if (!res.ok) {
      return {
        success: false,
        error:
          (data as any)?.message ||
          (data as any)?.detail ||
          `Request failed (${res.status})`,
      }
    }

    return {
      success: true,
      data: data as any,
    }
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Network error',
    }
  }
}

/**
 * Delete an academic year
 * DELETE /api/v1/academic/academic-years/{id}/
 */
export async function deleteAcademicYear(
  id: string
): Promise<MutationResult<void>> {
  try {
    const csrfToken = getCsrfTokenFromCookie()

    const headers: HeadersInit = {}

    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken
    }

    const res = await fetch(`/api/v1/academic/academic-years/${id}/`, {
      method: 'DELETE',
      headers,
      credentials: 'include',
    })

    if (!res.ok) {
      const data = (await safeReadJson(res)) ?? {}
      return {
        success: false,
        error: data?.message || data?.detail || `Request failed (${res.status})`,
      }
    }

    return {
      success: true,
    }
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Network error',
    }
  }
}

/**
 * Activate an academic year
 * POST /api/v1/academic/academic-years/{id}/activate/
 */
export async function activateAcademicYear(
  id: string
): Promise<MutationResult<AcademicYear>> {
  try {
    const csrfToken = getCsrfTokenFromCookie()

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken
    }

    const res = await fetch(`/api/v1/academic/academic-years/${id}/activate/`, {
      method: 'POST',
      headers,
      credentials: 'include',
    })

    const data = await safeReadJson(res)

    if (!res.ok) {
      return {
        success: false,
        error:
          (data as any)?.message ||
          (data as any)?.detail ||
          `Request failed (${res.status})`,
      }
    }

    return {
      success: true,
      data: data as any,
    }
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Network error',
    }
  }
}

/**
 * Archive an academic year
 * POST /api/v1/academic/academic-years/{id}/archive/
 */
export async function archiveAcademicYear(
  id: string
): Promise<MutationResult<AcademicYear>> {
  try {
    const csrfToken = getCsrfTokenFromCookie()

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken
    }

    const res = await fetch(`/api/v1/academic/academic-years/${id}/archive/`, {
      method: 'POST',
      headers,
      credentials: 'include',
    })

    const data = await safeReadJson(res)

    if (!res.ok) {
      return {
        success: false,
        error:
          (data as any)?.message ||
          (data as any)?.detail ||
          `Request failed (${res.status})`,
      }
    }

    return {
      success: true,
      data: data as any,
    }
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Network error',
    }
  }
}

/**
 * Set an academic year as current
 * POST /api/v1/academic/academic-years/{id}/set-current/
 */
export async function setCurrentAcademicYear(
  id: string
): Promise<MutationResult<AcademicYear>> {
  try {
    const csrfToken = getCsrfTokenFromCookie()

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken
    }

    const attempt = async (url: string) => {
      const res = await fetch(url, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify({}),
      })
      return { res, data: await safeReadJson(res) }
    }

    // Some backends expose this action as `set-current` while others use `set_current`.
    let { res, data } = await attempt(
      `/api/v1/academic/academic-years/${id}/set_current/`
    )

    if (res.status === 404) {
      ; ({ res, data } = await attempt(
        `/api/v1/academic/academic-years/${id}/set_current/`
      ))
    }

    if (!res.ok) {
      return {
        success: false,
        error:
          (data as any)?.message ||
          (data as any)?.detail ||
          `Request failed (${res.status})`,
      }
    }

    return {
      success: true,
      data: data as any,
    }
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Network error',
    }
  }
}
