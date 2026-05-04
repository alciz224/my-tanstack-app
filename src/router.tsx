import { createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import type { RouteContext } from './types/router'

export type RouterContext = RouteContext

// Create a new router instance
export const getRouter = () => {
  const router = createRouter({
    routeTree,
    context: {
      // Initial context - will be populated by root route beforeLoad
      user: null,
    },

    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  })

  return router
}
