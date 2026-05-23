import { Link, Outlet, createFileRoute } from '@tanstack/react-router'
import { BarChart3, FileText, History } from 'lucide-react'

export const Route = createFileRoute('/_authed/school-admin/reports')({
  component: ReportsLayout,
})

function ReportsLayout() {
  return (
    <div className="space-y-6">
      <div className="flex border-b border-border overflow-x-auto">
        <Link
          to="/school-admin/reports/statistics"
          className="px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2"
          activeProps={{
            className: 'border-primary text-primary',
          }}
          inactiveProps={{
            className:
              'border-transparent text-muted-foreground hover:text-foreground',
          }}
        >
          <BarChart3 className="w-4 h-4" />
          Statistiques
        </Link>
        <Link
          to="/school-admin/reports/report-cards"
          className="px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2"
          activeProps={{
            className: 'border-primary text-primary',
          }}
          inactiveProps={{
            className:
              'border-transparent text-muted-foreground hover:text-foreground',
          }}
        >
          <FileText className="w-4 h-4" />
          Bulletins
        </Link>
        <Link
          to="/school-admin/reports/transcripts"
          className="px-6 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2"
          activeProps={{
            className: 'border-primary text-primary',
          }}
          inactiveProps={{
            className:
              'border-transparent text-muted-foreground hover:text-foreground',
          }}
        >
          <History className="w-4 h-4" />
          Relevés
        </Link>
      </div>
      <Outlet />
    </div>
  )
}
