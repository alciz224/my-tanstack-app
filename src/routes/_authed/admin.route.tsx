import { Outlet, createFileRoute } from '@tanstack/react-router'
import { requireRole } from '@/auth/requireRole'

export const Route = createFileRoute('/_authed/admin')({
    beforeLoad: ({ context }) => {
        requireRole(context.user!, ['admin'])
    },
    component: () => <Outlet />,
})
