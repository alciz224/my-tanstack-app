import { Outlet, createFileRoute } from '@tanstack/react-router'
import { requireRole } from '@/auth/requireRole'

/**
 * Admin Portal Layout
 * Only accessible by users with 'admin' role
 */
export const Route = createFileRoute('/_authed/admin')({
  beforeLoad: ({ context }) => {
    requireRole(context.user, ['admin'])
  },
  component: () => <Outlet />,
})
