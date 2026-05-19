import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import type { User } from '@/server/auth'
import { buildFromParameter } from '@/auth/redirects'
import Header from '@/components/Header'
import { Sidebar } from '@/components/Sidebar'
import { AuthErrorFallback } from '@/components/ErrorBoundary'

/**
 * Protected route layout - requires authentication
 * Redirects to login if user is not authenticated
 * Redirects to role selection if user.role is null
 */
export const Route = createFileRoute('/_authed')({
  beforeLoad: async ({ location, context }) => {
    const user = context.user

    if (import.meta.env.DEV) {
      console.debug(
        '[_authed.beforeLoad] path:',
        location.pathname,
        '| user.role:',
        user?.role ?? 'no user',
      )
    }

    if (!user) {
      if (import.meta.env.DEV)
        console.debug('[_authed.beforeLoad] → redirect /login (no user)')
      const from = buildFromParameter(location)
      throw redirect({ to: '/login', search: { from } })
    }

    if (user.role === null && location.pathname !== '/select-portal') {
      if (import.meta.env.DEV)
        console.debug(
          '[_authed.beforeLoad] → redirect /select-portal (role is null)',
        )
      throw redirect({ to: '/select-portal' })
    }

    return { user }
  },
  errorComponent: ({ error, reset }) => (
    <AuthErrorFallback error={error} reset={reset} />
  ),
  component: AuthedLayout,
})

function AuthedLayout() {
  const { user } = Route.useRouteContext()

  return (
    <div className="min-h-screen bg-background">
      <Sidebar user={user} />
      <div className="flex flex-col min-h-screen lg:ml-64">
        <Header />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
