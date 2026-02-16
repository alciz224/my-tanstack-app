import { Outlet, createFileRoute } from '@tanstack/react-router'
import { requireRole } from '@/auth/requireRole'

export const Route = createFileRoute('/_authed/student')({
    beforeLoad: ({ context }) => {
        requireRole(context.user!, ['student'])
    },
    component: () => <Outlet />,
})
