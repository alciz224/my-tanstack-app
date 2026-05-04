import { Outlet, createFileRoute } from '@tanstack/react-router'
import { requireRole } from '@/auth/requireRole'

/**
 * Parent Portal Layout
 * Only accessible by users with 'parent' role
 */
export const Route = createFileRoute('/_authed/parent')({
  beforeLoad: ({ context }) => {
    requireRole(context.user, ['parent'])
  },
  component: () => <Outlet />,
})
