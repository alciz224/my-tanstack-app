import { getCurrentUserFn } from '@/server/auth'
import { Outlet, createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed')({
  beforeLoad: async ({ location }) => {
    const user = await getCurrentUserFn()
    if (!user) {
      throw redirect({ to: '/login', search: { from: location.href } })
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
