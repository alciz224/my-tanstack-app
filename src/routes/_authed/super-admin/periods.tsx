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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import { getTermTypesFn, getTermsFn } from '@/server/api/academic'
import {
  createTermTypeFn,
  updateTermTypeFn,
  deleteTermTypeFn,
  createTermFn,
  updateTermFn,
  deleteTermFn,
} from '@/server/api/academic-mutations-extra'
import { academicKeys } from '@/lib/query-client'
import { toast } from '@/stores/toastStore'
import type { TermType, Term } from '@/server/data/academic/types'

export const Route = createFileRoute('/_authed/super-admin/periods')({
  component: TermTypesPage,
})

function TermTypesPage() {
  const queryClient = useQueryClient()
  const getTermTypes = useServerFn(getTermTypesFn)
  const getTerms = useServerFn(getTermsFn)
  const createTermType = useServerFn(createTermTypeFn)
  const updateTermType = useServerFn(updateTermTypeFn)
  const deleteTermType = useServerFn(deleteTermTypeFn)
  const createTerm = useServerFn(createTermFn)
  const updateTerm = useServerFn(updateTermFn)
  const deleteTerm = useServerFn(deleteTermFn)

  const { data: termTypes, isLoading: loadingTermTypes } = useQuery({
    queryKey: academicKeys.termTypesList(),
    queryFn: () => getTermTypes(),
  })

  const { data: terms } = useQuery({
    queryKey: academicKeys.termsList(),
    queryFn: () => getTerms(),
  })

  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [createTypeOpen, setCreateTypeOpen] = useState(false)
  const [editingType, setEditingType] = useState<TermType | null>(null)
  const [createTermOpen, setCreateTermOpen] = useState<string | null>(null)
  const [editingTerm, setEditingTerm] = useState<Term | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<{ kind: 'termType'; id: string } | { kind: 'term'; id: string } | null>(null)

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: academicKeys.termTypesList() })
    queryClient.invalidateQueries({ queryKey: academicKeys.termsList() })
  }

  const createTypeMut = useMutation({
    mutationFn: async (data: Omit<TermType, 'id'>) => { const r = await createTermType({ data }); invalidate(); return r },
    onSuccess: () => { toast.success('Type de période créé avec succès'); setCreateTypeOpen(false) },
    onError: (e: any) => toast.error(e.message),
  })

  const updateTypeMut = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<TermType> }) => { const r = await updateTermType({ data: { id, data } }); invalidate(); return r },
    onSuccess: () => { toast.success('Type de période modifié avec succès'); setEditingType(null) },
    onError: (e: any) => toast.error(e.message),
  })

  const deleteTypeMut = useMutation({
    mutationFn: async (id: string) => { await deleteTermType({ data: { id } }); invalidate() },
    onSuccess: () => { toast.success('Type de période supprimé avec succès'); setDeleteConfirm(null) },
    onError: (e: any) => { toast.error(e.message); setDeleteConfirm(null) },
  })

  const createTermMut = useMutation({
    mutationFn: async (data: Omit<Term, 'id'>) => { const r = await createTerm({ data }); invalidate(); return r },
    onSuccess: () => { toast.success('Période créée avec succès'); setCreateTermOpen(null) },
    onError: (e: any) => toast.error(e.message),
  })

  const updateTermMut = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Term> }) => { const r = await updateTerm({ data: { id, data } }); invalidate(); return r },
    onSuccess: () => { toast.success('Période modifiée avec succès'); setEditingTerm(null) },
    onError: (e: any) => toast.error(e.message),
  })

  const deleteTermMut = useMutation({
    mutationFn: async (id: string) => { await deleteTerm({ data: { id } }); invalidate() },
    onSuccess: () => { toast.success('Période supprimée avec succès'); setDeleteConfirm(null) },
    onError: (e: any) => { toast.error(e.message); setDeleteConfirm(null) },
  })

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
        <button
          onClick={() => setCreateTypeOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium transition-colors hover:bg-primary/90 btn-shine hover-scale"
        >
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
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); setEditingType(termType) }}
                      className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteConfirm({ kind: 'termType', id: termType.id }) }}
                      className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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
                    <button
                      onClick={() => setCreateTermOpen(termType.id)}
                      className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
                    >
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
                          <button
                            onClick={() => setEditingTerm(term)}
                            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ kind: 'term', id: term.id })}
                            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors"
                          >
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
            <button
              onClick={() => setCreateTypeOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Créer un type de période
            </button>
          </div>
        )}
      </div>

      {createTypeOpen && (
        <TermTypeModal
          isSubmitting={createTypeMut.isPending}
          onClose={() => setCreateTypeOpen(false)}
          onSubmit={(data) => createTypeMut.mutate(data)}
        />
      )}
      {editingType && (
        <TermTypeModal
          initial={editingType}
          isSubmitting={updateTypeMut.isPending}
          onClose={() => setEditingType(null)}
          onSubmit={(data) => updateTypeMut.mutate({ id: editingType.id, data })}
        />
      )}
      {createTermOpen && (
        <TermModal
          termTypeId={createTermOpen}
          isSubmitting={createTermMut.isPending}
          onClose={() => setCreateTermOpen(null)}
          onSubmit={(data) => createTermMut.mutate(data)}
        />
      )}
      {editingTerm && (
        <TermModal
          initial={editingTerm}
          isSubmitting={updateTermMut.isPending}
          onClose={() => setEditingTerm(null)}
          onSubmit={(data) => updateTermMut.mutate({ id: editingTerm.id, data })}
        />
      )}
      {deleteConfirm && (
        <ConfirmDelete
          isSubmitting={deleteConfirm.kind === 'termType' ? deleteTypeMut.isPending : deleteTermMut.isPending}
          onCancel={() => setDeleteConfirm(null)}
          onConfirm={() => {
            if (deleteConfirm.kind === 'termType') {
              deleteTypeMut.mutate(deleteConfirm.id)
            } else {
              deleteTermMut.mutate(deleteConfirm.id)
            }
          }}
        />
      )}
    </div>
  )
}

function TermTypeModal({ initial, isSubmitting, onClose, onSubmit }: {
  initial?: TermType; isSubmitting: boolean; onClose: () => void; onSubmit: (data: any) => void
}) {
  const isEdit = !!initial
  const [code, setCode] = useState(initial?.code || '')
  const [name, setName] = useState(initial?.name || '')
  const [periodCount, setPeriodCount] = useState<number>(initial?.period_count ?? 2)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEdit) {
      const payload: Partial<TermType> = {}
      if (code !== initial!.code) payload.code = code
      if (name !== initial!.name) payload.name = name
      if (periodCount !== initial!.period_count) payload.period_count = periodCount
      onSubmit(payload)
    } else {
      onSubmit({ code, name, period_count: periodCount })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-xl border border-border bg-card shadow-xl">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold text-foreground">{isEdit ? 'Modifier le Type' : 'Nouveau Type de Période'}</h2>
        </div>
        <form onSubmit={handleSubmit} noValidate className="px-6 pb-6 pt-5 space-y-4">
          <Field label="Code">
            <input
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              value={code} onChange={(e) => setCode(e.target.value)} required
            />
          </Field>
          <Field label="Nom">
            <input
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              value={name} onChange={(e) => setName(e.target.value)} required
            />
          </Field>
          <Field label="Nombre de périodes">
            <input
              type="number"
              min={1}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              value={periodCount} onChange={(e) => setPeriodCount(Number(e.target.value))} required
            />
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground hover:bg-muted disabled:opacity-50">Annuler</button>
            <button type="submit" disabled={isSubmitting} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">{isSubmitting ? 'En cours...' : isEdit ? 'Modifier' : 'Créer'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function TermModal({ initial, termTypeId, isSubmitting, onClose, onSubmit }: {
  initial?: Term; termTypeId?: string; isSubmitting: boolean; onClose: () => void; onSubmit: (data: any) => void
}) {
  const isEdit = !!initial
  const [code, setCode] = useState(initial?.code || '')
  const [name, setName] = useState(initial?.name || '')
  const [order, setOrder] = useState<number>(initial?.order ?? 1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEdit) {
      const payload: Partial<Term> = {}
      if (code !== initial!.code) payload.code = code
      if (name !== initial!.name) payload.name = name
      if (order !== initial!.order) payload.order = order
      onSubmit(payload)
    } else {
      onSubmit({ term_type_id: termTypeId!, code, name, order })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-xl border border-border bg-card shadow-xl">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold text-foreground">{isEdit ? 'Modifier la Période' : 'Ajouter une Période'}</h2>
        </div>
        <form onSubmit={handleSubmit} noValidate className="px-6 pb-6 pt-5 space-y-4">
          <Field label="Code">
            <input
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              value={code} onChange={(e) => setCode(e.target.value)} required
            />
          </Field>
          <Field label="Nom">
            <input
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              value={name} onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <Field label="Ordre">
            <input
              type="number"
              min={1}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              value={order} onChange={(e) => setOrder(Number(e.target.value))} required
            />
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground hover:bg-muted disabled:opacity-50">Annuler</button>
            <button type="submit" disabled={isSubmitting} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">{isSubmitting ? 'En cours...' : isEdit ? 'Modifier' : 'Ajouter'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-foreground">{label}</label>
      {children}
    </div>
  )
}

function ConfirmDelete({ isSubmitting, onCancel, onConfirm }: { isSubmitting: boolean; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card shadow-xl p-6">
        <h3 className="text-sm font-semibold text-foreground mb-2">Confirmer la suppression</h3>
        <p className="text-xs text-muted-foreground mb-4">Cette action est irréversible.</p>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} disabled={isSubmitting} className="rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground hover:bg-muted disabled:opacity-50">Annuler</button>
          <button onClick={onConfirm} disabled={isSubmitting} className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-white hover:bg-destructive/90 disabled:opacity-50">{isSubmitting ? 'Suppression...' : 'Supprimer'}</button>
        </div>
      </div>
    </div>
  )
}
