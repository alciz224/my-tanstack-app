/**
 * API Client Utilities
 *
 * Base fetch wrapper for all API requests with:
 * - Cookie forwarding for SSR (server functions)
 * - CSRF token handling for mutations
 * - Typed responses
 * - Consistent error handling
 *
 * USAGE PATTERNS:
 * - Server functions (SSR): Use `serverFetch` with cookie forwarding
 * - Client-side: Use `clientFetch` (goes through Vite proxy)
 */

import type { ApiResponse } from '@/types/api'

/**
 * Backend base URL (server-side only)
 * Used by server functions to call Django directly
 */
function getBackendUrl(): string {
  return process.env.BACKEND_URL || 'http://localhost:8000'
}

/**
 * Extract cookie header from server function context
 * Pattern used across all TanStack Start server functions
 *
 * Handles both handler patterns:
 * - Simple: handler(async (ctx) => ...) - ctx.request
 * - With validator: handler(async ({ data, context }) => ...) - context.request
 */
export function getCookieHeader(ctx: any): string | undefined {
  // Try multiple possible locations for the request object
  const req = ctx?.request || ctx?.context?.request || ctx

  if (!req?.headers?.get) {
    if (import.meta.env.DEV) {
      console.warn(
        '[getCookieHeader] No headers.get method found in context:',
        Object.keys(ctx || {}),
      )
    }
    return undefined
  }

  const cookie = req.headers.get('cookie') || undefined

  if (import.meta.env.DEV) {
    console.debug('[getCookieHeader] Cookie found:', cookie ? 'YES' : 'NO')
  }

  return cookie
}

/**
 * Get CSRF token from cookie header (server-side)
 * Reads the csrftoken cookie set by Django
 */
export function getCsrfTokenFromCookie(
  cookieHeader?: string,
): string | undefined {
  if (!cookieHeader) return undefined

  const match = cookieHeader.match(/csrftoken=([^;]+)/)
  return match?.[1]
}

/**
 * Get CSRF token from Django (client-side)
 * Fetches a fresh CSRF token via the API
 */
export async function fetchCsrfToken(): Promise<string> {
  const res = await fetch('/api/v2/auth/csrf/', {
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error(`Failed to get CSRF token (${res.status})`)
  }

  const data = await res.json()
  const token = data?.data?.csrf_token

  if (!token) {
    throw new Error('CSRF token not found in response')
  }

  return token
}

/**
 * Server-side fetch wrapper with cookie forwarding
 * Use this in createServerFn handlers for SSR data fetching
 *
 * @example
 * export const getDataFn = createServerFn({ method: 'GET' }).handler(
 *   async (ctx) => {
 *     return serverFetch<MyType>('/api/v1/endpoint/', ctx)
 *   }
 * )
 */
export async function serverFetch<T>(
  endpoint: string,
  ctx?: any,
  options: RequestInit = {},
): Promise<T | null> {
  try {
    // Extract cookies from SSR context
    const cookieHeader = getCookieHeader(ctx)

    if (import.meta.env.DEV && cookieHeader) {
      console.debug('[serverFetch] Cookie forwarding enabled:', endpoint)
    }

    // Build headers with cookie forwarding
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    }

    if (cookieHeader) {
      headers['Cookie'] = cookieHeader
    }

    // Make request to Django backend
    const res = await fetch(`${getBackendUrl()}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    })

    if (import.meta.env.DEV) {
      console.debug('[serverFetch] Response:', endpoint, res.status, res.ok)
    }

    // Handle non-OK responses
    if (!res.ok) {
      if (import.meta.env.DEV && res.status !== 401 && res.status !== 404) {
        console.warn('[serverFetch] Unexpected status:', endpoint, res.status)
      }
      return null
    }

    // Ensure JSON response
    const contentType = res.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      if (import.meta.env.DEV) {
        console.warn('[serverFetch] Non-JSON response:', endpoint, contentType)
      }
      return null
    }

    // Parse API response
    const responseData = await res.json()

    if (import.meta.env.DEV) {
      console.debug('[serverFetch] Parsed data:', responseData)
    }

    // Handle two response formats:
    // 1. Custom ApiResponse wrapper: { success: true, data: {...} }
    // 2. Direct Django REST response: { count, results, ... } or plain object

    // Check if it's wrapped in ApiResponse format
    if ('success' in responseData && 'data' in responseData) {
      const data = responseData as ApiResponse<T>
      if (!data.success || !data.data) {
        if (import.meta.env.DEV && data.error) {
          console.warn('[serverFetch] API error:', endpoint, data.error)
        }
        return null
      }
      return data.data
    }

    // Otherwise, return the response directly (DRF paginated or plain object)
    return responseData as T
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error('[serverFetch] Error:', endpoint, err)
    }
    return null
  }
}

/**
 * Server-side mutation wrapper with cookie forwarding + CSRF
 * Use this in createServerFn({ method: 'POST' }) handlers
 *
 * @example
 * export const createItemFn = createServerFn({ method: 'POST' })
 *   .inputValidator((data: CreateItemInput) => data)
 *   .handler(async ({ data, context }) => {
 *     return serverMutate<Item>('/api/v1/items/', context, {
 *       method: 'POST',
 *       body: JSON.stringify(data),
 *     })
 *   })
 */
export async function serverMutate<T>(
  endpoint: string,
  ctx?: any,
  options: RequestInit = {},
): Promise<
  | { success: true; data: T }
  | { success: false; error: string; errorCode?: string }
> {
  try {
    // Extract cookies from SSR context
    const cookieHeader = getCookieHeader(ctx)
    const csrfToken = getCsrfTokenFromCookie(cookieHeader)

    if (import.meta.env.DEV) {
      console.debug(
        '[serverMutate] Request:',
        endpoint,
        options.method || 'POST',
      )
    }

    // Build headers with cookie + CSRF
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (cookieHeader) {
      headers['Cookie'] = cookieHeader
    }

    if (csrfToken) {
      headers['X-CSRFToken'] = csrfToken
    }

    // Make request to Django backend
    const res = await fetch(`${getBackendUrl()}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include',
    })

    // Parse response
    let responseData: any = null
    const contentType = res.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
      try {
        responseData = await res.json()
      } catch {
        // Ignore parse errors
      }
    }

    if (import.meta.env.DEV) {
      console.debug(
        '[serverMutate] Response:',
        endpoint,
        res.status,
        responseData,
      )
    }

    if (!res.ok) {
      const errorMsg =
        responseData?.message ||
        responseData?.detail ||
        `Request failed (${res.status})`
      const errorCode = responseData?.error?.code

      if (import.meta.env.DEV) {
        console.error(
          '[serverMutate] HTTP error:',
          endpoint,
          res.status,
          errorMsg,
        )
      }

      return {
        success: false,
        error: errorMsg,
        errorCode,
      }
    }

    // Handle two response formats:
    // 1. Custom ApiResponse wrapper: { success: true, data: {...} }
    // 2. Direct Django REST response: plain object or created item

    if (responseData && 'success' in responseData && 'data' in responseData) {
      // ApiResponse wrapper format
      if (!responseData.success || !responseData.data) {
        return {
          success: false,
          error: responseData?.message || 'Invalid response from server',
        }
      }
      return {
        success: true,
        data: responseData.data,
      }
    }

    // Direct DRF response - return as-is
    return {
      success: true,
      data: responseData as T,
    }
  } catch (err: any) {
    if (import.meta.env.DEV) {
      console.error('[serverMutate] Error:', endpoint, err)
    }

    return {
      success: false,
      error: err?.message || 'Network error',
    }
  }
}

/**
 * Client-side fetch wrapper (uses Vite proxy)
 * Use this in React components for client-side data fetching
 * Browser automatically includes cookies via credentials: 'include'
 *
 * @example
 * const data = await clientFetch<MyType>('/api/v1/endpoint/')
 */
export async function clientFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T | null> {
  try {
    const res = await fetch(endpoint, {
      ...options,
      credentials: 'include',
    })

    if (!res.ok) {
      if (import.meta.env.DEV && res.status !== 401 && res.status !== 404) {
        console.warn('[clientFetch] HTTP error:', endpoint, res.status)
      }
      return null
    }

    const contentType = res.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      if (import.meta.env.DEV) {
        console.warn('[clientFetch] Non-JSON response:', endpoint, contentType)
      }
      return null
    }

    const data: ApiResponse<T> = await res.json()
    return data.success && data.data ? data.data : null
  } catch (err) {
    if (import.meta.env.DEV) {
      console.error('[clientFetch] Error:', endpoint, err)
    }
    return null
  }
}

/**
 * Client-side mutation wrapper with CSRF token
 * Use this in React components for mutations
 *
 * @example
 * const result = await clientMutate<Item>('/api/v1/items/', {
 *   method: 'POST',
 *   body: JSON.stringify(data),
 * })
 */
export async function clientMutate<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<
  | { success: true; data: T }
  | { success: false; error: string; errorCode?: string }
> {
  try {
    // Get CSRF token first
    const csrfToken = await fetchCsrfToken()

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
      ...options.headers,
    }

    const res = await fetch(endpoint, {
      ...options,
      headers,
      credentials: 'include',
    })

    let responseData: ApiResponse<T> | null = null
    const contentType = res.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
      try {
        responseData = await res.json()
      } catch {
        // Ignore parse errors
      }
    }

    if (!res.ok) {
      const errorMsg = responseData?.message || `Request failed (${res.status})`
      const errorCode = responseData?.error?.code

      if (import.meta.env.DEV) {
        console.error(
          '[clientMutate] HTTP error:',
          endpoint,
          res.status,
          errorMsg,
        )
      }

      return {
        success: false,
        error: errorMsg,
        errorCode,
      }
    }

    if (!responseData?.success || !responseData.data) {
      return {
        success: false,
        error: responseData?.message || 'Invalid response from server',
      }
    }

    return {
      success: true,
      data: responseData.data,
    }
  } catch (err: any) {
    if (import.meta.env.DEV) {
      console.error('[clientMutate] Error:', endpoint, err)
    }

    return {
      success: false,
      error: err?.message || 'Network error',
    }
  }
}
