import { getCurrentUserFn } from '@/server/auth'
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'
import { buildFromParameter } from '@/auth/redirects'

export const Route = createFileRoute('/_authed')({
  beforeLoad: async ({ location }) => {
    const user = await getCurrentUserFn()
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
    <div className="min-h-[60px]">
      <div className="bg-slate-800 text-slate-200 px-4 py-2 text-sm">Protected Area</div>
      <Outlet />
    </div>
  )
}
