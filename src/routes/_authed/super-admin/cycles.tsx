import { createFileRoute } from '@tanstack/react-router'
import { Edit2, Loader2, MoreVertical, Plus, Shield } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { getCyclesFn } from '@/server/api/academic'
import { academicKeys } from '@/lib/query-client'

export const Route = createFileRoute('/_authed/super-admin/cycles')({
  component: CyclesPage,
})

function CyclesPage() {
  const getCycles = useServerFn(getCyclesFn)

  const { data: cycles, isLoading } = useQuery({
    queryKey: academicKeys.cyclesList(),
    queryFn: () => getCycles(),
  })

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Gestion des Cycles
          </h1>
          <p className="text-muted-foreground mt-1">
            Configurez les cycles d'enseignement du système éducatif guinéen.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium transition-colors hover:bg-primary/90 btn-shine hover-scale">
          <Plus className="w-5 h-5" />
          <span>Nouveau Cycle</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoading && (
          <div className="col-span-full flex justify-center py-12 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        )}
        {cycles?.map((cycle) => (
          <div
            key={cycle.id}
            className="bg-card border border-border rounded-lg p-6 hover-lift flex flex-col group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Shield className="w-6 h-6" />
              </div>
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
              {cycle.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Durée:{' '}
              <span className="font-medium text-foreground">
                {cycle.duration}
              </span>
            </p>
            <div className="mt-auto pt-4 border-t border-border flex justify-between items-center">
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide
                ${cycle.status === 'Active' ? 'bg-success/15 text-success' : 'bg-muted text-muted-foreground'}
              `}
              >
                {cycle.status}
              </span>
              <button className="flex items-center text-sm text-primary hover:underline gap-1">
                <Edit2 className="w-4 h-4" />
                Modifier
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
