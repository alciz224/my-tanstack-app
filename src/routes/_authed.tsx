import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { getCurrentUserFn } from '@/server/auth'
import { buildFromParameter } from '@/auth/redirects'



export const Route = createFileRoute('/_authed')({
  beforeLoad: async ({ location, context }) => {
    const user = context.user ?? (await getCurrentUserFn())
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
  return (
    <div className="min-h-15">
      <Outlet />
    </div>
  )
}
