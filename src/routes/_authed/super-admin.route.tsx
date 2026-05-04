import { Outlet, createFileRoute } from '@tanstack/react-router'
import { requireRole } from '@/auth/requireRole'

/**
 * Super Admin Portal Layout
 * Only accessible by users with 'super_admin' role
 */
export const Route = createFileRoute('/_authed/super-admin')({
  beforeLoad: ({ context }) => {
    requireRole(context.user, ['super_admin'])
  },
  component: () => <Outlet />,
})
