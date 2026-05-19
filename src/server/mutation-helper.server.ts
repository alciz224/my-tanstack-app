/**
 * Mutation Helpers
 *
 * Generic factories for creating TanStack Start server functions for mutations.
 * These handle common boilerplate like cookie forwarding and CSRF tokens.
 */

import { createServerFn } from '@tanstack/react-start'
import { getCookies } from '@tanstack/react-start/server'
import { getCsrfTokenServerSide } from './csrf'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

export interface MutationResult<T = any> {
  success: boolean
  data?: T
  error?: string
  errorCode?: string
}

/** Helper: perform a POST/PATCH/DELETE to a dynamic URL */
export async function serverAction<T>(
  endpoint: string,
  method: 'POST' | 'PATCH' | 'DELETE',
  body?: any,
): Promise<MutationResult<T>> {
  try {
    const cookies = getCookies()
    const cookieHeader =
      Object.entries(cookies)
        .map(([k, v]) => `${k}=${v}`)
        .join('; ') || undefined
    const csrfToken = await getCsrfTokenServerSide({
      headers: {
        get: (name: string) => (name === 'cookie' ? cookieHeader : undefined),
      },
    })

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
      body:
        method !== 'DELETE' && body != null ? JSON.stringify(body) : undefined,
    })

    let responseData: any = null
    const contentType = res.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      try {
        responseData = await res.json()
      } catch {
        /* ignore */
      }
    }

    if (!res.ok) {
      return {
        success: false,
        error:
          responseData?.message ||
          responseData?.detail ||
          `Request failed (${res.status})`,
        errorCode: responseData?.error?.code,
      }
    }

    return { success: true, data: responseData as T }
  } catch (err: any) {
    if (import.meta.env.DEV)
      console.error(`[${method}] ${endpoint} crashed:`, err)
    return { success: false, error: err?.message || 'Network error' }
  }
}


/**
 * Create a simple mutation server function
 *
 * @param endpoint - The API endpoint relative to BACKEND_URL
 * @param method - HTTP method
 *
 * @example
 * ```typescript
 * export const createPostFn = createMutationFn<PostInput, Post>('/api/posts/', 'POST')
 * ```
 */
export function createMutationFn<TInput, TOutput>(
  endpoint: string,
  method: 'POST' | 'PATCH' | 'DELETE' = 'POST',
) {
  return createServerFn({ method: 'POST' })
    .inputValidator((input: unknown) => input as TInput)
    .handler(async ({ data }) => {
      try {
        const cookies = getCookies()
        const cookieHeader =
          Object.entries(cookies)
            .map(([k, v]) => `${k}=${v}`)
            .join('; ') || undefined
        const csrfToken = await getCsrfTokenServerSide({
          headers: {
            get: (name: string) =>
              name === 'cookie' ? cookieHeader : undefined,
          },
        })

        if (import.meta.env.DEV) {
          console.debug(
            `[${method} ${endpoint}] Cookie forwarding:`,
            cookieHeader ? 'yes' : 'no',
          )
          if (!cookieHeader) {
            console.warn(
              `[${method} ${endpoint}] Missing cookie header from request`,
            )
          }
        }

        if (!cookieHeader) {
          return {
            success: false,
            error: 'Missing auth cookies in server function request',
          } as any
        }

        // Make mutation request
        const res = await fetch(`${BACKEND_URL}${endpoint}`, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
            ...(cookieHeader ? { Cookie: cookieHeader } : {}),
          },
          credentials: 'include',
          body: method !== 'DELETE' ? JSON.stringify(data) : undefined,
        })

        if (import.meta.env.DEV) {
          console.debug(`[${method} ${endpoint}] Response:`, res.status)
        }

        // Handle response
        let responseData: any = null
        const contentType = res.headers.get('content-type') || ''

        if (method !== 'DELETE' && contentType.includes('application/json')) {
          try {
            responseData = await res.json()
          } catch {
            // JSON parsing failed
          }
        }

        if (!res.ok) {
          if (!responseData && contentType.includes('application/json')) {
            try {
              responseData = await res.json()
            } catch {
              // Ignore
            }
          }

          return {
            success: false,
            error:
              responseData?.message ||
              responseData?.detail ||
              `Request failed (${res.status})`,
            errorCode: responseData?.error?.code,
          }
        }

        return {
          success: true,
          data: responseData as TOutput,
        } as any
      } catch (err: any) {
        if (import.meta.env.DEV) {
          console.error(`[${method} ${endpoint}] Error:`, err)
        }

        return {
          success: false,
          error: err?.message || 'Network error',
        } as any
      }
    })
}

/**
 * Create a parameterized mutation server function
 *
 * Use this when the endpoint includes a dynamic parameter (like an ID).
 *
 * IMPORTANT: The input type uses `body` (not `data`) for the request payload
 * because TanStack Start reserves the top-level `data` property in the
 * calling convention: `fn({ data: inputValue })`.
 *
 * @param getEndpoint - Function that takes the parameter and returns the endpoint
 * @param method - HTTP method
 *
 * @example
 * ```typescript
 * export const updateAcademicYearFn = createParameterizedMutationFn<
 *   { id: string; body: Partial<AcademicYearInput> },
 *   AcademicYear
 * >(
 *   (params) => `/api/v1/academic/academic-years/${params.id}/`,
 *   'PATCH'
 * )
 *
 * // Usage — note the { data: ... } wrapper (TanStack Start convention)
 * const result = await updateAcademicYearFn({
 *   data: { id: '123', body: { name: 'Updated Name' } }
 * })
 * ```
 */
export function createParameterizedMutationFn<
  TInput extends { id: string; body?: any },
  TOutput,
>(
  getEndpoint: (params: TInput) => string,
  method: 'POST' | 'PATCH' | 'DELETE' = 'POST',
) {
  return createServerFn({ method: 'POST' })
    .inputValidator((input: unknown) => input as TInput)
    .handler(async ({ data: input }) => {
      const endpointPrefix = `[${method}]`
      try {
        if (import.meta.env.DEV) {
          console.log(`${endpointPrefix} Handler input:`, JSON.stringify(input))
        }

        const cookies2 = getCookies()
        const cookieHeader =
          Object.entries(cookies2)
            .map(([k, v]) => `${k}=${v}`)
            .join('; ') || undefined
        const endpoint = getEndpoint(input as TInput)
        const requestBody = input.body

        if (import.meta.env.DEV) {
          console.log(`${endpointPrefix} Target endpoint: ${endpoint}`)
          console.debug(
            `${endpointPrefix} Cookie forwarding:`,
            cookieHeader ? 'yes' : 'no',
          )
          if (!cookieHeader) {
            console.warn(`${endpointPrefix} Missing cookie header from request`)
          }
        }

        if (!cookieHeader) {
          return {
            success: false,
            error: 'Missing auth cookies in server function request',
          } as any
        }

        // Get CSRF token
        const csrfToken = await getCsrfTokenServerSide({
          headers: {
            get: (name: string) =>
              name === 'cookie' ? cookieHeader : undefined,
          },
        })

        // Make mutation request
        const res = await fetch(`${BACKEND_URL}${endpoint}`, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken,
            ...(cookieHeader ? { Cookie: cookieHeader } : {}),
          },
          credentials: 'include',
          body:
            method !== 'DELETE' && requestBody != null
              ? JSON.stringify(requestBody)
              : undefined,
        })

        if (import.meta.env.DEV) {
          console.log(`${endpointPrefix} Backend response: ${res.status}`)
        }

        // Handle response
        let responseData: any = null
        const contentType = res.headers.get('content-type') || ''

        if (method !== 'DELETE' && contentType.includes('application/json')) {
          try {
            responseData = await res.json()
          } catch {
            // JSON parsing failed
          }
        }

        if (!res.ok) {
          if (!responseData && contentType.includes('application/json')) {
            try {
              responseData = await res.json()
            } catch {
              // Ignore
            }
          }

          return {
            success: false,
            error:
              responseData?.message ||
              responseData?.detail ||
              `Request failed (${res.status})`,
            errorCode: responseData?.error?.code,
          }
        }

        return {
          success: true,
          data: responseData as TOutput,
        } as any
      } catch (err: any) {
        if (import.meta.env.DEV) {
          console.error(`${endpointPrefix} Mutation handler crash:`, err)
        }

        return {
          success: false,
          error: err?.message || 'Network error',
        } as any
      }
    })
}
