import { Outlet, createFileRoute } from '@tanstack/react-router'
import { requireRole } from '@/auth/requireRole'

/**
 * Teacher Portal Layout
 * Only accessible by users with 'teacher' role
 */
export const Route = createFileRoute('/_authed/teacher')({
  beforeLoad: ({ context }) => {
    requireRole(context.user, ['teacher'])
  },
  component: () => <Outlet />,
})
