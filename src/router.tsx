import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { makeQueryClient } from './lib/query-client'
import type { RouterContext } from './types/router'

export type { RouterContext }

// Create a new router instance
export const getRouter = () => {
  const queryClient = makeQueryClient()

  const router = createRouter({
    routeTree,
    context: {
      queryClient,
    },

    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  })

  // Integrate TanStack Query with the router for SSR hydration/streaming
  // and automatic QueryClientProvider wrapping via the router's Wrap option
  setupRouterSsrQueryIntegration({ router, queryClient })

  return router
}
