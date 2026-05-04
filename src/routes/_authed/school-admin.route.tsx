import { Outlet, createFileRoute } from '@tanstack/react-router'
import { requireRole } from '@/auth/requireRole'

/**
 * School Admin Portal Layout
 * Only accessible by users with 'school_admin' role
 */
export const Route = createFileRoute('/_authed/school-admin')({
  beforeLoad: ({ context }) => {
    requireRole(context.user, ['school_admin'])
  },
  component: () => <Outlet />,
})
