import { Link, createFileRoute } from '@tanstack/react-router'
import {
  AlertCircle,
  BookOpen,
  Calendar,
  Clock,
  Layers,
  Users,
} from 'lucide-react'
import { getSchoolYearByIdFn } from '@/server/api/schools'

export const Route = createFileRoute('/_authed/school-admin/years/$yearId/')({
  component: SchoolYearDetail,
  loader: async ({ params }) => {
    const year = await getSchoolYearByIdFn({ data: params.yearId })
    if (!year) {
      throw new Error('Année scolaire non trouvée')
    }
    return { year }
  },
})

function SchoolYearDetail() {
  const { year } = Route.useLoaderData()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-foreground">{year.name}</h1>
            <StatusBadge status={year.status} />
          </div>
          <p className="text-muted-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {new Date(year.start_date).toLocaleDateString()} -{' '}
            {new Date(year.end_date).toLocaleDateString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/school-admin/years/$yearId/edit"
            params={{ yearId: year.id }}
            className="px-4 py-2 bg-muted text-foreground hover:bg-muted/80 rounded-md font-medium transition-colors"
          >
            Modifier
          </Link>
          {year.status !== 'CURRENT' && (
            <button className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md font-medium transition-colors">
              Définir comme courante
            </button>
          )}
        </div>
      </div>

      {/* Tabs / Modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <ModuleCard
          title="Cycles & Niveaux"
          description="Structure pédagogique"
          icon={Layers}
          count="1 cycle"
        />
        <ModuleCard
          title="Matières"
          description="Programme et coefficients"
          icon={BookOpen}
          count="12 matières"
        />
        <ModuleCard
          title="Classes"
          description="Salles et effectifs"
          icon={Users}
          count="6 classes"
        />
        <ModuleCard
          title="Emplois du temps"
          description="Créneaux et plannings"
          icon={Clock}
          count="Configuration"
        />
      </div>

      {/* Details placeholder */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold border-b pb-3 mb-4">
          Aperçu de l'année
        </h2>
        <div className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
          <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
          <div>
            <p className="font-medium">Configuration en cours</p>
            <p className="text-sm text-muted-foreground mt-1">
              Vous devez configurer les classes et assigner les enseignants
              avant de pouvoir ouvrir les inscriptions pour cette année
              scolaire.
            </p>
          </div>
        </div>
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
    <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-muted text-muted-foreground">
      Archivé
    </span>
  )
}

function ModuleCard({
  title,
  description,
  icon: Icon,
  count,
}: {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  count: string
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-5 hover:border-primary/50 hover:shadow-sm transition-all group cursor-default">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-semibold">
            {count}
          </p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
