/**
 * Safe redirect utilities to prevent open redirect vulnerabilities
 */

/**
 * Sanitize a redirect path to ensure it's an internal path only.
 * Prevents open redirects by rejecting external URLs.
 * 
 * @param path - The path to sanitize (from query params, etc.)
 * @param fallback - Default path if the input is unsafe (default: '/dashboard')
 * @returns A safe internal path
 */
export function safeRedirectPath(path: string | null | undefined, fallback = '/dashboard'): string {
  if (!path || typeof path !== 'string') {
    return fallback
  }

  const trimmed = path.trim()

  // Reject empty strings
  if (!trimmed) {
    return fallback
  }

  // Must start with / (internal path)
  if (!trimmed.startsWith('/')) {
    return fallback
  }

  // Reject protocol-relative URLs (//evil.com)
  if (trimmed.startsWith('//')) {
    return fallback
  }

  // Reject any attempts to include protocols
  if (
    trimmed.includes('://') ||
    trimmed.toLowerCase().startsWith('javascript:') ||
    trimmed.toLowerCase().startsWith('data:') ||
    trimmed.toLowerCase().startsWith('vbscript:')
  ) {
    return fallback
  }

  return trimmed
}

/**
 * Build a safe "from" parameter for login redirect.
 * Only stores the internal path (pathname + search + hash), not the full href.
 * 
 * @param location - The location object from router
 * @returns An internal path string
 */
export function buildFromParameter(location: { pathname: string; search: Record<string, any>; hash: string }): string {
  const searchParams = new URLSearchParams()
  
  // Convert search object to query string
  Object.entries(location.search).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value))
    }
  })
  
  const searchStr = searchParams.toString()
  const query = searchStr ? `?${searchStr}` : ''
  const hash = location.hash || ''
  
  return `${location.pathname}${query}${hash}`
}
