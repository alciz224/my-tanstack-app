import { createFileRoute } from '@tanstack/react-router'
import {
  BookOpen,
  Edit,
  Filter,
  GraduationCap,
  Layers,
  Loader2,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import { getSubjectsFn } from '@/server/api/academic'
import {
  createSubjectFn,
  updateSubjectFn,
  deleteSubjectFn,
} from '@/server/api/academic-mutations-extra'
import { academicKeys } from '@/lib/query-client'
import { toast } from '@/stores/toastStore'
import type { Subject } from '@/server/data/academic/types'

export const Route = createFileRoute('/_authed/super-admin/subjects')({
  component: SubjectsPage,
})

function SubjectsPage() {
  const queryClient = useQueryClient()
  const getSubjects = useServerFn(getSubjectsFn)
  const createSubject = useServerFn(createSubjectFn)
  const updateSubject = useServerFn(updateSubjectFn)
  const deleteSubject = useServerFn(deleteSubjectFn)

  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState<Subject | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<Subject | null>(null)

  const { data: subjects, isLoading } = useQuery({
    queryKey: academicKeys.subjectsList(),
    queryFn: () => getSubjects(),
  })

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: academicKeys.subjects() })

  const createMut = useMutation({
    mutationFn: async (data: Omit<Subject, 'id'>) => {
      const r = await createSubject({ data })
      invalidate()
      return r
    },
    onSuccess: () => {
      toast.success('Matière créée avec succès')
      setCreateOpen(false)
    },
    onError: (e: any) => toast.error(e.message),
  })

  const updateMut = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: Partial<Subject>
    }) => {
      const r = await updateSubject({ data: { id, data } })
      invalidate()
      return r
    },
    onSuccess: () => {
      toast.success('Matière modifiée avec succès')
      setEditing(null)
    },
    onError: (e: any) => toast.error(e.message),
  })

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      await deleteSubject({ data: { id } })
      invalidate()
    },
    onSuccess: () => {
      toast.success('Matière supprimée avec succès')
      setDeleteConfirm(null)
    },
    onError: (e: any) => {
      toast.error(e.message)
      setDeleteConfirm(null)
    },
  })

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Gestion des Matières
          </h1>
          <p className="text-muted-foreground mt-1">
            Gérez le catalogue global des matières enseignées et leurs
            affectations.
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium transition-colors hover:bg-primary/90 btn-shine hover-scale"
        >
          <Plus className="w-5 h-5" />
          <span>Nouvelle Matière</span>
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg p-4 flex flex-col sm:flex-row gap-4 hover-lift">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher une matière..."
            className="w-full bg-input border-none rounded-lg py-2.5 pl-10 pr-4 text-foreground focus:ring-2 focus:ring-ring focus:outline-none transition-shadow"
          />
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <select className="appearance-none bg-input border-none rounded-lg py-2.5 pl-4 pr-10 text-foreground font-medium focus:ring-2 focus:ring-ring focus:outline-none cursor-pointer h-full">
              <option value="">Tous les types</option>
              <option value="Scientifique">Scientifique</option>
              <option value="Littéraire">Littéraire</option>
              <option value="Général">Général</option>
            </select>
            <Filter className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading && (
          <div className="col-span-full flex justify-center py-12 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        )}
        {subjects?.map((sub) => (
          <div
            key={sub.id}
            className="bg-card border border-border rounded-lg p-5 hover-lift flex flex-col group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono bg-muted text-foreground px-2 py-1 rounded border border-border">
                {sub.code}
              </span>
            </div>

            <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
              {sub.name}
            </h3>
            <span
              className={`inline-flex self-start text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full mb-4
              ${
                (sub as any).type === 'Scientifique'
                  ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400'
                  : (sub as any).type === 'Littéraire'
                    ? 'bg-orange-500/15 text-orange-600 dark:text-orange-400'
                    : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
              }
            `}
            >
              {(sub as any).type || 'Général'}
            </span>

            <div className="space-y-3 mt-auto pt-4 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1.5 uppercase font-semibold tracking-wide">
                  <Layers className="w-3.5 h-3.5" />
                  Dispensée au :
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {sub.cycle_ids?.map((c) => (
                    <span
                      key={c}
                      className="text-xs bg-muted text-foreground/80 px-2 py-1 rounded-md"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1.5 uppercase font-semibold tracking-wide">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Profils / Séries :
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(sub.track_id ? [sub.track_id] : ['Toutes Séries']).map(
                    (t) => (
                      <span
                        key={t}
                        className="text-[11px] font-medium text-secondary bg-secondary/15 border border-secondary/20 px-2 py-0.5 rounded-md"
                      >
                        {t}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4 mt-4 flex justify-end gap-3">
              <button
                onClick={() => setDeleteConfirm(sub)}
                className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors hover-scale"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setEditing(sub)}
                className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors hover-scale"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {createOpen && (
        <SubjectModal
          isSubmitting={createMut.isPending}
          onClose={() => setCreateOpen(false)}
          onSubmit={(data) => createMut.mutate(data)}
        />
      )}
      {editing && (
        <SubjectModal
          initial={editing}
          isSubmitting={updateMut.isPending}
          onClose={() => setEditing(null)}
          onSubmit={(data) =>
            updateMut.mutate({ id: editing.id, data })
          }
        />
      )}
      {deleteConfirm && (
        <ConfirmDelete
          subject={deleteConfirm}
          isSubmitting={deleteMut.isPending}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={() => deleteMut.mutate(deleteConfirm.id)}
        />
      )}
    </div>
  )
}

function SubjectModal({
  initial,
  isSubmitting,
  onClose,
  onSubmit,
}: {
  initial?: Subject
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (data: any) => void
}) {
  const isEdit = !!initial
  const [code, setCode] = useState(initial?.code || '')
  const [name, setName] = useState(initial?.name || '')
  const [description, setDescription] = useState(initial?.description || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEdit) {
      const payload: Partial<Subject> = {}
      if (code !== initial!.code) payload.code = code
      if (name !== initial!.name) payload.name = name
      if (description !== (initial!.description ?? ''))
        payload.description = description || undefined
      onSubmit(payload)
    } else {
      onSubmit({
        code,
        name,
        description: description || undefined,
      })
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-xl border border-border bg-card shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold text-foreground">
            {isEdit ? 'Modifier la Matière' : 'Nouvelle Matière'}
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} noValidate className="px-6 pb-6 pt-5 space-y-4">
          <Field label="Code">
            <input
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </Field>
          <Field label="Nom">
            <input
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Field>
          <Field label="Description">
            <textarea
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[80px] resize-y"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </Field>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground hover:bg-muted disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {isSubmitting
                ? 'En cours...'
                : isEdit
                  ? 'Modifier'
                  : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-foreground">
        {label}
      </label>
      {children}
    </div>
  )
}

function ConfirmDelete({
  subject,
  isSubmitting,
  onClose,
  onConfirm,
}: {
  subject: Subject
  isSubmitting: boolean
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-sm rounded-xl border border-border bg-card shadow-xl p-6">
        <div className="mb-4 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-lg">
            <Trash2 className="w-5 h-5 text-destructive" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">
              Supprimer cette matière ?
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">
                {subject.code} — {subject.name}
              </span>{' '}
              sera définitivement supprimée.
              <span className="block mt-1 font-medium text-destructive">
                Cette action est irréversible.
              </span>
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground hover:bg-muted disabled:opacity-50"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={isSubmitting}
            className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-white hover:bg-destructive/90 disabled:opacity-50"
          >
            {isSubmitting ? 'Suppression...' : 'Supprimer'}
          </button>
        </div>
      </div>
    </div>
  )
}
