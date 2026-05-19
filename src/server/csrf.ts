/**
 * CSRF Token Helpers (Server-Side)
 *
 * Server functions that need to make mutations to Django must include
 * a CSRF token. This module provides helpers for fetching CSRF tokens
 * server-side with proper cookie forwarding.
 */

import { getCookieHeader, getCsrfTokenFromCookie } from '@/lib/api-client'

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000'

/**
 * Get CSRF token from Django (server-side)
 *
 * This function runs on the Node.js server and forwards cookies from the
 * browser request to Django to get a valid CSRF token.
 *
 * @param ctx - Server function context (can be from simple or validator pattern)
 * @returns CSRF token string
 * @throws Error if CSRF token cannot be obtained
 *
 * @example
 * ```typescript
 * export const mutateFn = createServerFn({ method: 'POST' })
 *   .inputValidator((data) => data)
 *   .handler(async ({ data, context }) => {
 *     const csrfToken = await getCsrfTokenServerSide(context)
 *     // Use csrfToken in mutation request
 *   })
 * ```
 */
export async function getCsrfTokenServerSide(ctx: any): Promise<string> {
  const cookieHeader = getCookieHeader(ctx)

  // Prefer using csrftoken cookie if already present to avoid extra network calls
  const existing = getCsrfTokenFromCookie(cookieHeader)
  if (existing) return existing

  const res = await fetch(`${BACKEND_URL}/api/v2/auth/csrf/`, {
    headers: cookieHeader ? { Cookie: cookieHeader } : {},
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error(`Failed to get CSRF token (${res.status})`)
  }

  const contentType = res.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    throw new Error('CSRF endpoint returned non-JSON response')
  }

  const data = await res.json()
  const token = data?.data?.csrf_token

  if (!token) {
    throw new Error('CSRF token not found in response')
  }

  return token
}
