import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  component: AuthLayout,
})

function AuthLayout() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/20 p-4">
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  )
}
