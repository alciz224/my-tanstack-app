import { createFileRoute } from '@tanstack/react-router'
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  Clock,
  Edit,
  Loader2,
  Plus,
  Trash2,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import { getTermTypesFn, getTermsFn } from '@/server/api/academic'

export const Route = createFileRoute('/_authed/super-admin/periods')({
  component: TermTypesPage,
})

function TermTypesPage() {
  const getTermTypes = useServerFn(getTermTypesFn)
  const getTerms = useServerFn(getTermsFn)

  const { data: termTypes, isLoading: loadingTermTypes } = useQuery({
    queryKey: ['academic', 'term-types', 'list'],
    queryFn: () => getTermTypes(),
  })

  const { data: terms } = useQuery({
    queryKey: ['academic', 'terms', 'list'],
    queryFn: () => getTerms(),
  })

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const getTermsForType = (termTypeId: string) => {
    return terms?.filter((t) => t.term_type_id === termTypeId) ?? []
  }

  const getStatusBadge = (periodCount: number) => {
    const colors: Record<number, string> = {
      2: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      3: 'bg-green-500/10 text-green-600 border-green-500/20',
      4: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
    }
    const style = colors[periodCount] || 'bg-muted text-muted-foreground'
    return (
      <span
        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${style}`}
      >
        <Clock className="w-3 h-3 mr-1" />
        {periodCount} périodes
      </span>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Types de Périodes
          </h1>
          <p className="text-muted-foreground mt-1">
            Définissez comment l'année scolaire est divisée (trimestres,
            semestres)
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium transition-colors hover:bg-primary/90 btn-shine hover-scale">
          <Plus className="w-5 h-5" />
          <span>Nouveau Type</span>
        </button>
      </div>

      <div className="space-y-4">
        {loadingTermTypes && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {termTypes?.map((termType) => {
          const typeTerms = getTermsForType(termType.id)
          const isExpanded = expandedIds.has(termType.id)

          return (
            <div
              key={termType.id}
              className="bg-card border border-border rounded-lg overflow-hidden hover-lift"
            >
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                onClick={() => toggleExpand(termType.id)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {termType.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Code: {termType.code}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getStatusBadge(termType.period_count)}
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <span>
                      {typeTerms.length} période
                      {typeTerms.length !== 1 ? 's' : ''}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-border bg-muted/20 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-foreground">
                      Périodes
                    </h4>
                    <button className="text-sm text-primary hover:text-primary/80 flex items-center gap-1">
                      <Plus className="w-3.5 h-3.5" />
                      Ajouter une période
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {typeTerms.map((term) => (
                      <div
                        key={term.id}
                        className="flex items-center justify-between p-3 bg-card border border-border rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                            {term.order}
                          </span>
                          <span className="font-medium text-foreground">
                            {term.name || term.code}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors">
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {typeTerms.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Aucune période définie
                    </p>
                  )}
                </div>
              )}
            </div>
          )
        })}

        {termTypes?.length === 0 && !loadingTermTypes && (
          <div className="text-center py-12 bg-card border border-border rounded-lg">
            <Calendar className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-foreground mb-1">
              Aucun type de période
            </h3>
            <p className="text-muted-foreground mb-4">
              Créez un type de période pour définir comment l'année scolaire est
              divisée
            </p>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
              <Plus className="w-4 h-4" />
              Créer un type de période
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
