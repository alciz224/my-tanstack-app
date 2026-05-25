import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import { Edit2, Loader2, Plus, Shield, Trash2 } from 'lucide-react'
import { getCyclesFn } from '@/server/api/academic'
import { createCycleFn, updateCycleFn, deleteCycleFn } from '@/server/api/academic-mutations-extra'
import { academicKeys } from '@/lib/query-client'
import { toast } from '@/stores/toastStore'
import type { Cycle } from '@/server/data/academic/types'

export const Route = createFileRoute('/_authed/super-admin/cycles')({
  component: CyclesPage,
})

function CyclesPage() {
  const queryClient = useQueryClient()
  const getCycles = useServerFn(getCyclesFn)
  const createCycle = useServerFn(createCycleFn)
  const updateCycle = useServerFn(updateCycleFn)
  const deleteCycle = useServerFn(deleteCycleFn)

  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState<Cycle | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const { data: cycles, isLoading } = useQuery({
    queryKey: academicKeys.cyclesList(),
    queryFn: () => getCycles(),
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: academicKeys.cyclesList() })

  const createMut = useMutation({
    mutationFn: async (data: Omit<Cycle, 'id'>) => { const r = await createCycle({ data }); invalidate(); return r },
    onSuccess: () => { toast.success('Cycle créé avec succès'); setCreateOpen(false) },
    onError: (e: any) => toast.error(e.message),
  })

  const updateMut = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Cycle> }) => { const r = await updateCycle({ data: { id, data } }); invalidate(); return r },
    onSuccess: () => { toast.success('Cycle modifié avec succès'); setEditing(null) },
    onError: (e: any) => toast.error(e.message),
  })

  const deleteMut = useMutation({
    mutationFn: async (id: string) => { await deleteCycle({ data: { id } }); invalidate() },
    onSuccess: () => { toast.success('Cycle supprimé avec succès'); setDeleteConfirm(null) },
    onError: (e: any) => { toast.error(e.message); setDeleteConfirm(null) },
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
        <button onClick={() => setCreateOpen(true)} className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium transition-colors hover:bg-primary/90 btn-shine hover-scale">
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
              <button onClick={() => setDeleteConfirm(cycle.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
            <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
              {cycle.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Code:{' '}
              <span className="font-medium text-foreground">
                {cycle.code}
              </span>
            </p>
            <div className="mt-auto pt-4 border-t border-border flex justify-between items-center">
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide
                  ${cycle.has_track ? 'bg-success/15 text-success' : 'bg-muted text-muted-foreground'}
                `}
              >
                {cycle.has_track ? 'Avec filières' : 'Sans filières'}
              </span>
              <button onClick={() => setEditing(cycle)} className="flex items-center text-sm text-primary hover:underline gap-1">
                <Edit2 className="w-4 h-4" />
                Modifier
              </button>
            </div>
          </div>
        ))}
      </div>

      {createOpen && (
        <CycleModal
          isSubmitting={createMut.isPending}
          onClose={() => setCreateOpen(false)}
          onSubmit={(data) => createMut.mutate(data)}
        />
      )}
      {editing && (
        <CycleModal
          initial={editing}
          isSubmitting={updateMut.isPending}
          onClose={() => setEditing(null)}
          onSubmit={(data) => updateMut.mutate({ id: editing.id, data })}
        />
      )}
      {deleteConfirm && (
        <ConfirmDelete
          isSubmitting={deleteMut.isPending}
          onCancel={() => setDeleteConfirm(null)}
          onConfirm={() => deleteMut.mutate(deleteConfirm)}
        />
      )}
    </div>
  )
}

function CycleModal({ initial, isSubmitting, onClose, onSubmit }: {
  initial?: Cycle; isSubmitting: boolean; onClose: () => void; onSubmit: (data: any) => void
}) {
  const isEdit = !!initial
  const [code, setCode] = useState(initial?.code || '')
  const [name, setName] = useState(initial?.name || '')
  const [hasTrack, setHasTrack] = useState(initial?.has_track ?? false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEdit) {
      const payload: Partial<Cycle> = {}
      if (code !== initial!.code) payload.code = code
      if (name !== initial!.name) payload.name = name
      if (hasTrack !== initial!.has_track) payload.has_track = hasTrack
      onSubmit(payload)
    } else {
      onSubmit({ code, name, has_track: hasTrack })
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-xl border border-border bg-card shadow-xl">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold text-foreground">{isEdit ? 'Modifier le Cycle' : 'Nouveau Cycle'}</h2>
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
          <Field label="Avoir des filières">
            <label className="inline-flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                className="w-5 h-5 rounded border-input bg-background text-primary focus:ring-2 focus:ring-ring"
                checked={hasTrack}
                onChange={(e) => setHasTrack(e.target.checked)}
              />
              <span className="text-sm text-foreground">{hasTrack ? 'Oui' : 'Non'}</span>
            </label>
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
