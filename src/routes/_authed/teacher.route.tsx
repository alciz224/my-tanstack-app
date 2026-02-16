import { Outlet, createFileRoute } from '@tanstack/react-router'
import { requireRole } from '@/auth/requireRole'

export const Route = createFileRoute('/_authed/teacher')({
    beforeLoad: ({ context }) => {
        requireRole(context.user!, ['teacher'])
    },
    component: () => <Outlet />,
})
