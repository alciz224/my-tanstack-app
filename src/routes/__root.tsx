import { HeadContent, Scripts, createRootRouteWithContext, useRouter } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import * as React from 'react'



import appCss from '../styles.css?url'



import { subscribeAuthEvents } from '@/auth/authEvents'
import { safeRedirectPath } from '@/auth/redirects'
import { isCurrentRouteProtected } from '@/auth/routeProtection'
import { getCurrentUserFn } from '@/server/auth'

import type { RouterContext } from '@/router'

export const Route = createRootRouteWithContext<RouterContext>()({
  beforeLoad: async () => {
    // Provide auth state to all routes (public + protected) so shared UI (Header)
    // stays in sync across navigation.
    const user = await getCurrentUserFn()
    return { user }
  },
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
        title: 'EduVault - Academic Management Platform',
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



  // Subscribe to cross-tab auth events
  React.useEffect(() => {
    const unsubscribe = subscribeAuthEvents((event) => {
      switch (event.type) {
        case 'logout': {
          // Invalidate router state so routes re-run beforeLoad
          router.invalidate()

          // Redirect to login only if currently on a protected route
          if (isCurrentRouteProtected(router)) {
            router.navigate({ to: '/login', search: { from: undefined }, replace: true })
          }
          break
        }
        case 'login': {
          // Refresh auth state so tabs can show updated user
          router.invalidate()

          // If currently on login page, redirect away (user is now authenticated)
          if (router.state.location.pathname === '/login') {
            const fromParam = (router.state.location.search as any).from as
              | string
              | undefined
            const destination = safeRedirectPath(fromParam, '/dashboard')
            router.navigate({ to: destination, replace: true })
          }
          break
        }
      }
    })

    return unsubscribe
  }, [router])

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
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="min-h-screen bg-background text-foreground">
          {children}
        </div>
        <Scripts />
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
      </body>
    </html>
  )
}
