import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/school-admin/reports/')({
  beforeLoad: () => {
    throw redirect({
      to: '/school-admin/reports/statistics',
    })
  },
})
