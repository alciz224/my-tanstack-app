import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
  useRouter,
} from '@tanstack/react-router'
import * as React from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import appCss from '../styles.css?url'
import type { RouterContext } from '@/router'
import type { RouteContext } from '@/types/router'



import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ToastContainer } from '@/components/Toast'


import { subscribeAuthEvents } from '@/auth/authEvents'
import { safeRedirectPath } from '@/auth/redirects'
import { isCurrentRouteProtected } from '@/auth/routeProtection'
import { getCurrentUserFn } from '@/server/auth'
import { makeQueryClient } from '@/lib/query-client'
import {
  initLocalAuthClientSession,
  setSessionUser,
} from '@/server/data/auth/local.adapter'
import { mockUser } from '@/server/data/auth/mocks'


/**
 * Root route - provides auth context to all child routes
 * Runs on every navigation to keep user state fresh
 */
export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async ({ context }): Promise<RouteContext> => {
    // If a user is already present in the router context (e.g., just set after
    // a successful login), use it to avoid racing a stale server fetch
    if (context.user) {
      if (import.meta.env.DEV) {
        console.debug(
          '[__root.beforeLoad] Using existing context user.role:',
          context.user.role,
        )
      }
      return { user: context.user }
    }

    // Otherwise fetch fresh user from auth service
    let user = await getCurrentUserFn()

    // Auto-login for local mode to completely bypass login flow
    if (!user && import.meta.env.VITE_LOCAL_DATA === 'true') {
      // Auto-set the role to school_admin to bypass the select-portal page as well
      user = { ...mockUser, role: 'school_admin' } as any
      // Sync with LocalAuthAdapter session for server function calls
      setSessionUser(user)
    }

    if (import.meta.env.DEV) {
      console.debug(
        '[__root.beforeLoad] Fetched user.role:',
        user?.role ?? 'null (unauthenticated)',
      )
    }
    return { user }
  },
  errorComponent: () => (
    <ErrorBoundary
      fallback={(err, resetFn) => (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="bg-card border border-border rounded-lg shadow-lg p-8 text-center">
              <h1 className="text-2xl font-bold text-foreground mb-4">
                Something went wrong
              </h1>
              <p className="text-muted-foreground mb-6">{err.message}</p>
              <button
                onClick={resetFn}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
    >
      {/* This won't be reached, but satisfies TypeScript */}
      <div />
    </ErrorBoundary>
  ),
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'GuiSchool - Academic Management Platform',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
    scripts: [
      // Prevent FOUC (Flash of Unstyled Content)
      {
        children: `
          (function() {
            try {
              const stored = localStorage.getItem('theme-storage');
              if (stored) {
                const { state } = JSON.parse(stored);
                const theme = state.theme === 'system' 
                  ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
                  : state.theme;
                document.documentElement.classList.add(theme);
              } else {
                document.documentElement.classList.add(
                  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
                );
              }
            } catch (e) {
              document.documentElement.classList.add('light');
            }
          })();
        `,
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  // Create QueryClient instance (memoized to avoid recreation on re-renders)
  const [queryClient] = React.useState(() => makeQueryClient())

  // Subscribe to cross-tab auth events
  React.useEffect(() => {
    const unsubscribe = subscribeAuthEvents((event) => {
      switch (event.type) {
        case 'logout': {
          // Invalidate router state so routes re-run beforeLoad
          router.invalidate()

          // Clear React Query cache on logout
          queryClient.clear()

          // Redirect to login only if currently on a protected route
          if (isCurrentRouteProtected(router)) {
            router.navigate({
              to: '/login',
              search: { from: undefined },
              replace: true,
            })
          }
          break
        }
        case 'login': {
          // Refresh auth state so other tabs can show updated user
          // Note: The tab that performed the login handles its own redirect.
          // This handler is for cross-tab sync only.
          router.invalidate()
          break
        }
      }
    })

    return unsubscribe
  }, [router, queryClient])

  // Revalidate auth state when tab becomes visible or gains focus
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        router.invalidate()
      }
    }

    const handleFocus = () => {
      router.invalidate()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('focus', handleFocus)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [router])

  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en">
        <head>
          <HeadContent />
        </head>
        <body>
          <div className="min-h-screen bg-background text-foreground">
            {children}
          </div>
          <ToastContainer />
          <Scripts />

        </body>
      </html>
    </QueryClientProvider>
  )
}
