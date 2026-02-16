import { createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { getCurrentUserFn } from './server/auth'
import type { User } from './server/auth'


export type RouterContext = {
  getCurrentUser: typeof getCurrentUserFn
  user?: User | null
}

// Create a new router instance
export const getRouter = () => {
  const router = createRouter({
    routeTree,
    context: {
      getCurrentUser: getCurrentUserFn,
    },

    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  })

  return router
}
