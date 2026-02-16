import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { buildFromParameter } from '@/auth/redirects'
import Header from '@/components/Header'
import { Sidebar } from '@/components/Sidebar'

export const Route = createFileRoute('/_authed')({
  beforeLoad: async ({ location, context }) => {
    const user = context.user
    if (!user) {
      // Build a safe internal path (not full href) for post-login redirect
      const from = buildFromParameter(location)
      throw redirect({ to: '/login', search: { from } })
    }
    return { user }
  },
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
