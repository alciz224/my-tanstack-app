import { Outlet, createFileRoute } from '@tanstack/react-router'
import { requireRole } from '@/auth/requireRole'

/**
 * Student Portal Layout
 * Only accessible by users with 'student' role
 */
export const Route = createFileRoute('/_authed/student')({
  beforeLoad: ({ context }) => {
    requireRole(context.user, ['student'])
  },
  component: () => <Outlet />,
})
