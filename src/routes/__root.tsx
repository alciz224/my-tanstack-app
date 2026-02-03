import { HeadContent, Scripts, createRootRoute, useRouter } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import * as React from 'react'

import Header from '../components/Header'
import { subscribeAuthEvents } from '@/auth/authEvents'
import { isProtectedPath } from '@/auth/protectedRoutes'

import appCss from '../styles.css?url'

export const Route = createRootRoute({
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
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
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
      if (event.type === 'logout') {
        // Invalidate router state so protected routes re-run beforeLoad
        router.invalidate()

        // Redirect to login only if currently on a protected route
        const currentPath = router.state.location.pathname
        if (isProtectedPath(currentPath)) {
          router.navigate({ to: '/login', replace: true })
        }
      } else if (event.type === 'login') {
        // Optionally refresh auth state so tabs can show updated user
        router.invalidate()
      }
    })

    return unsubscribe
  }, [router])

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Header />
        {children}
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
        <Scripts />
      </body>
    </html>
  )
}
