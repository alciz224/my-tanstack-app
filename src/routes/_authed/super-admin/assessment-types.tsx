import { createFileRoute } from '@tanstack/react-router'
import {
  ClipboardCheck,
  Edit,
  FileText,
  Loader2,
  Plus,
  Trash2,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { getAssessmentTypesFn } from '@/server/api/academic'

export const Route = createFileRoute('/_authed/super-admin/assessment-types')({
  component: AssessmentTypesPage,
})

function AssessmentTypesPage() {
  const getAssessmentTypes = useServerFn(getAssessmentTypesFn)

  const { data: assessmentTypes, isLoading } = useQuery({
    queryKey: ['academic', 'assessment-types', 'list'],
    queryFn: () => getAssessmentTypes(),
  })

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Types d'Évaluations
          </h1>
          <p className="text-muted-foreground mt-1">
            Définissez les types d'évaluations (composition, devoir, oral,
            projet...)
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium transition-colors hover:bg-primary/90 btn-shine hover-scale">
          <Plus className="w-5 h-5" />
          <span>Nouveau Type</span>
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover-lift">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wide text-foreground/80">
                Code
              </th>
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wide text-foreground/80">
                Nom
              </th>
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wide text-foreground/80">
                Description
              </th>
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wide text-foreground/80 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
                </td>
              </tr>
            )}
            {assessmentTypes?.map((at) => (
              <tr
                key={at.id}
                className="hover:bg-muted/40 transition-colors group"
              >
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 bg-primary/10 text-primary rounded text-sm font-mono font-semibold">
                    {at.code}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                      <ClipboardCheck className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-foreground">
                      {at.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {at.description || '—'}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {assessmentTypes?.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-foreground mb-1">
              Aucun type d'évaluation
            </h3>
            <p className="text-muted-foreground mb-4">
              Créez des types d'évaluations pour classer les épreuves
            </p>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
              <Plus className="w-4 h-4" />
              Créer un type d'évaluation
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
