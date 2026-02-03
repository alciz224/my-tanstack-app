/**
 * Determine if a given pathname requires authentication.
 * 
 * In this app, routes under `/_authed` layout are protected (but the layout is pathless,
 * so they appear as `/dashboard`, `/admin`, etc.).
 * 
 * Public routes: `/`, `/login`, `/logout`, `/unauthorized`, and any demo routes.
 */

const PROTECTED_PATHS = ['/dashboard', '/admin']

/**
 * Check if a pathname requires authentication
 */
export function isProtectedPath(pathname: string): boolean {
  // Already on login/logout/public? Not protected.
  if (
    pathname === '/' ||
    pathname === '/login' ||
    pathname === '/logout' ||
    pathname === '/unauthorized' ||
    pathname.startsWith('/demo/')
  ) {
    return false
  }

  // Check against known protected paths
  return PROTECTED_PATHS.some((path) => pathname.startsWith(path))
}
