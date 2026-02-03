import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/admin')({
  beforeLoad: async ({ context, location }) => {
    const user = await context.getCurrentUser()
    if (!user) {
      throw redirect({ to: '/login', search: { from: location.href } })
    }
    if (user.role !== 'admin') {
      throw redirect({ to: '/unauthorized' })
    }
    return { user }
  },
  component: AdminPage,
})

function AdminPage() {
  return (
    <div className="p-4">
      <h2 className="text-white text-xl font-semibold">Admin</h2>
      <p className="text-slate-300 mt-2">Only admins can see this.</p>
    </div>
  )
}
