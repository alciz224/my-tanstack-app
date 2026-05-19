import { Link, createFileRoute } from '@tanstack/react-router'
import { Archive, Calendar, Plus, Settings } from 'lucide-react'
import { getSchoolYearsFn } from '@/server/api/schools'

export const Route = createFileRoute('/_authed/school-admin/years/')({
  component: SchoolYearsPage,
  loader: async () => {
    // Hardcoding 'school-1' for now since user.school_id is not directly available
    // In a real app, this would come from the current user's profile
    const years = await getSchoolYearsFn({ data: 'school-1' })
    return { years }
  },
})

function SchoolYearsPage() {
  const { years } = Route.useLoaderData()

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Années Scolaires
          </h1>
          <p className="text-muted-foreground">
            Gérez les années scolaires de votre établissement
          </p>
        </div>
        <Link
          to="/school-admin/years/create"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle Année</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {years.map((year) => (
          <div
            key={year.id}
            className={`bg-card border rounded-lg p-6 relative overflow-hidden transition-shadow hover:shadow-md ${
              year.status === 'CURRENT'
                ? 'border-green-500 shadow-sm'
                : 'border-border'
            }`}
          >
            {year.status === 'CURRENT' && (
              <div className="absolute top-0 right-0 w-2 h-full bg-green-500" />
            )}

            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  {year.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(year.start_date).toLocaleDateString()} -{' '}
                  {new Date(year.end_date).toLocaleDateString()}
                </p>
              </div>
              <StatusBadge status={year.status} />
            </div>

            <div className="flex gap-2 mt-6">
              <Link
                to={`/school-admin/years/${year.id}`}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-muted text-foreground rounded-md hover:bg-muted/80 transition-colors text-sm font-medium"
              >
                <Settings className="w-4 h-4" />
                <span>Gérer</span>
              </Link>
            </div>
          </div>
        ))}

        {years.length === 0 && (
          <div className="col-span-full py-12 text-center bg-muted/30 rounded-lg border border-dashed border-border">
            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-foreground mb-1">
              Aucune année scolaire
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Commencez par configurer votre première année scolaire.
            </p>
            <Link
              to="/school-admin/years/create"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Créer une année</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'CURRENT') {
    return (
      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-success/15 text-success">
        En cours
      </span>
    )
  }
  if (status === 'FUTURE') {
    return (
      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-blue-500/15 text-blue-600 dark:text-blue-400">
        À venir
      </span>
    )
  }
  return (
    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-muted text-muted-foreground flex items-center gap-1">
      <Archive className="w-3 h-3" />
      Archivé
    </span>
  )
}
