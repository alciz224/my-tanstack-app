/**
 * Router context types for TanStack Router
 * Defines the shape of context available to all routes
 */

import type { QueryClient } from '@tanstack/react-query'
import type { User } from '@/server/auth'

/**
 * Context available to all routes from root beforeLoad.
 * Also includes queryClient for SSR-friendly prefetching in loaders.
 */
export interface RouterContext {
  /**
   * QueryClient instance for prefetching data in route loaders.
   * Server: created per-request. Client: singleton singleton.
   */
  queryClient: QueryClient
}

/**
 * Context available to all routes from root beforeLoad
 */
export interface RouteContext {
  /**
   * Current authenticated user, or null if not authenticated
   * Available in all routes after root beforeLoad runs
   */
  user: User | null
}

/**
 * Extended context for authenticated routes
 * Ensures user is always present (non-null)
 */
export interface AuthedRouteContext extends RouteContext {
  /**
   * Current authenticated user (guaranteed to be present in authed routes)
   */
  user: User
}
