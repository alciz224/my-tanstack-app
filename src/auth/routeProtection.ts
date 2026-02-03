/**
 * Improved route protection detection using route metadata instead of hard-coded paths.
 * 
 * This approach is more maintainable and less error-prone than maintaining a list of paths.
 */

import type { AnyRoute, Router } from '@tanstack/react-router'

/**
 * Check if the current route requires authentication by examining the route tree.
 * 
 * Routes under `/_authed` are considered protected.
 * Public routes: `/`, `/login`, `/logout`, `/unauthorized`, `/demo/*`
 * 
 * @param router - The router instance
 * @returns true if the current route requires authentication
 */
export function isCurrentRouteProtected(router: Router): boolean {
  const currentPath = router.state.location.pathname

  // Explicitly public routes
  const publicPaths = ['/', '/login', '/logout', '/unauthorized']
  if (publicPaths.includes(currentPath)) {
    return false
  }

  // Demo routes are public
  if (currentPath.startsWith('/demo/')) {
    return false
  }

  // Check if any matched route includes the `_authed` layout
  const matches = router.state.matches || []
  const hasAuthedLayout = matches.some((match: any) => {
    const routeId = match.routeId || match.id || ''
    return routeId.includes('/_authed')
  })

  return hasAuthedLayout
}

/**
 * Fallback check using pathname (for cases where router state isn't available)
 * This is less accurate but works for edge cases.
 */
export function isProtectedPath(pathname: string): boolean {
  // Public routes
  if (
    pathname === '/' ||
    pathname === '/login' ||
    pathname === '/logout' ||
    pathname === '/unauthorized' ||
    pathname.startsWith('/demo/')
  ) {
    return false
  }

  // Known protected paths (fallback list)
  const protectedPaths = ['/dashboard', '/admin']
  return protectedPaths.some((path) => pathname.startsWith(path))
}
