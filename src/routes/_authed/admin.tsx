import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/admin')({
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
