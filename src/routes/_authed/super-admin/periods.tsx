import { createFileRoute } from '@tanstack/react-router'
import { Calendar, Plus, Clock, CheckCircle2, PlayCircle, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { getPeriodsFn } from '@/server/api/academic'

export const Route = createFileRoute('/_authed/super-admin/periods')({
  component: PeriodsPage,
})

function PeriodsPage() {
  const getPeriods = useServerFn(getPeriodsFn)
  
  const { data: periods, isLoading } = useQuery({
    queryKey: ['academic', 'periods', 'list'],
    queryFn: () => getPeriods(),
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Terminé': return 'bg-success/15 text-success'
      case 'En cours': return 'bg-primary/15 text-primary'
      case 'Planifié': return 'bg-warning/15 text-warning'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Terminé': return <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
      case 'En cours': return <PlayCircle className="w-3.5 h-3.5 mr-1" />
      case 'Planifié': return <Clock className="w-3.5 h-3.5 mr-1" />
      default: return null
    }
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Découpage de l'Année Scolaire</h1>
          <p className="text-muted-foreground mt-1">Gérez les trimestres, semestres et périodes d'examens nationaux.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium transition-colors hover:bg-primary/90 btn-shine hover-scale">
          <Plus className="w-5 h-5" />
          <span>Nouvelle Période</span>
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover-lift">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wide text-foreground/80">Période</th>
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wide text-foreground/80">Type</th>
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wide text-foreground/80">Date de début</th>
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wide text-foreground/80">Date de fin</th>
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wide text-foreground/80">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                </td>
              </tr>
            )}
            {periods?.map((period) => (
              <tr key={period.id} className="hover:bg-muted/40 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-foreground">{period.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-foreground/80">{period.type}</td>
                <td className="px-6 py-4 text-sm font-medium text-foreground/90">{period.start_date}</td>
                <td className="px-6 py-4 text-sm font-medium text-foreground/90">{period.end_date}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide ${getStatusColor(period.status)}`}>
                    {getStatusIcon(period.status)}
                    {period.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
