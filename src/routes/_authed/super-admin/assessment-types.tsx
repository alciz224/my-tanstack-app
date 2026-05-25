import { createFileRoute } from '@tanstack/react-router'
import {
  ClipboardCheck,
  Edit,
  FileText,
  Loader2,
  Plus,
  Trash2,
  X,
} from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import { getAssessmentTypesFn } from '@/server/api/academic'
import {
  createAssessmentTypeFn,
  updateAssessmentTypeFn,
  deleteAssessmentTypeFn,
} from '@/server/api/academic-mutations-extra'
import { academicKeys } from '@/lib/query-client'
import { toast } from '@/stores/toastStore'
import type { AssessmentType } from '@/server/data/academic/types'

export const Route = createFileRoute('/_authed/super-admin/assessment-types')({
  component: AssessmentTypesPage,
})

function AssessmentTypesPage() {
  const queryClient = useQueryClient()
  const getAssessmentTypes = useServerFn(getAssessmentTypesFn)
  const createAssessmentType = useServerFn(createAssessmentTypeFn)
  const updateAssessmentType = useServerFn(updateAssessmentTypeFn)
  const deleteAssessmentType = useServerFn(deleteAssessmentTypeFn)

  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState<AssessmentType | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<AssessmentType | null>(null)

  const { data: assessmentTypes, isLoading } = useQuery({
    queryKey: academicKeys.assessmentTypesList(),
    queryFn: () => getAssessmentTypes(),
  })

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: academicKeys.assessmentTypes() })

  const createMutation = useMutation({
    mutationFn: async (data: Omit<AssessmentType, 'id'>) => {
      return createAssessmentType(data)
    },
    onSuccess: () => {
      invalidate()
      toast.success("Type d'évaluation créé avec succès")
      setCreateOpen(false)
    },
    onError: (error: any) => {
      toast.error(error.message || "Impossible de créer le type d'évaluation")
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string
      data: Partial<AssessmentType>
    }) => {
      return updateAssessmentType({ id, data })
    },
    onSuccess: () => {
      invalidate()
      toast.success("Type d'évaluation modifié avec succès")
      setEditing(null)
    },
    onError: (error: any) => {
      toast.error(error.message || "Impossible de modifier le type d'évaluation")
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteAssessmentType({ id })
    },
    onSuccess: () => {
      invalidate()
      toast.success("Type d'évaluation supprimé avec succès")
      setDeleteConfirm(null)
    },
    onError: (error: any) => {
      toast.error(error.message || "Impossible de supprimer le type d'évaluation")
    },
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
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium transition-colors hover:bg-primary/90 btn-shine hover-scale"
        >
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
                    <button
                      onClick={() => setEditing(at)}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors hover-scale"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(at)}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors hover-scale"
                    >
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
            <button
              onClick={() => setCreateOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Créer un type d'évaluation
            </button>
          </div>
        )}
      </div>

      {createOpen && (
        <CreateEditAssessmentTypeModal
          isSubmitting={createMutation.isPending}
          onClose={() => setCreateOpen(false)}
          onSubmit={(data) => createMutation.mutate(data)}
        />
      )}

      {editing && (
        <CreateEditAssessmentTypeModal
          assessmentType={editing}
          isSubmitting={updateMutation.isPending}
          onClose={() => setEditing(null)}
          onSubmit={(data) =>
            updateMutation.mutate({ id: editing.id, data })
          }
        />
      )}

      {deleteConfirm && (
        <DeleteAssessmentTypeConfirm
          assessmentType={deleteConfirm}
          isSubmitting={deleteMutation.isPending}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={() => deleteMutation.mutate(deleteConfirm.id)}
        />
      )}
    </div>
  )
}

const inputBase =
  'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary'
const inputError = 'border-destructive focus:ring-destructive'
const labelClass = 'mb-1 block text-xs font-medium text-foreground'

function CreateEditAssessmentTypeModal({
  assessmentType,
  isSubmitting,
  onClose,
  onSubmit,
}: {
  assessmentType?: AssessmentType
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (data: Omit<AssessmentType, 'id'> | { id: string; data: Partial<AssessmentType> }) => void
}) {
  const isEdit = !!assessmentType
  const [code, setCode] = useState(assessmentType?.code ?? '')
  const [name, setName] = useState(assessmentType?.name ?? '')
  const [description, setDescription] = useState(assessmentType?.description ?? '')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const e: Record<string, string> = {}
    if (!code.trim()) e.code = 'Le code est requis'
    if (!name.trim()) e.name = 'Le nom est requis'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    const payload: Omit<AssessmentType, 'id'> = {
      code: code.trim(),
      name: name.trim(),
      description: description.trim() || undefined,
    }
    onSubmit(payload)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="assessment-type-modal-title"
    >
      <div className="w-full max-w-md rounded-xl border border-border bg-card shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2
              id="assessment-type-modal-title"
              className="text-base font-semibold text-foreground"
            >
              {isEdit ? "Modifier le type d'évaluation" : 'Nouveau type d\'évaluation'}
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {isEdit
                ? "Modifiez les informations du type d'évaluation."
                : "Créez un nouveau type d'évaluation."}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="px-6 pb-6 pt-5 space-y-4"
        >
          <div>
            <label className={labelClass}>Code</label>
            <input
              type="text"
              value={code}
              autoFocus
              onChange={(e) => {
                setCode(e.target.value)
                setErrors((err) => ({ ...err, code: '' }))
              }}
              placeholder="Ex: COMPO, DEVOIR, ORAL"
              className={`${inputBase} ${errors.code ? inputError : ''}`}
            />
            {errors.code && (
              <p className="mt-1 text-xs text-destructive">{errors.code}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Nom</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setErrors((err) => ({ ...err, name: '' }))
              }}
              placeholder="Ex: Composition, Devoir, Oral"
              className={`${inputBase} ${errors.name ? inputError : ''}`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-destructive">{errors.name}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={description}
              rows={3}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description optionnelle du type d'évaluation..."
              className={inputBase}
            />
          </div>

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
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50"
            >
              {isSubmitting
                ? isEdit
                  ? 'Modification…'
                  : 'Création…'
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

function DeleteAssessmentTypeConfirm({
  assessmentType,
  isSubmitting,
  onClose,
  onConfirm,
}: {
  assessmentType: AssessmentType
  isSubmitting: boolean
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-assessment-type-confirm-title"
    >
      <div className="w-full max-w-sm rounded-xl border border-border bg-card shadow-xl">
        <div className="p-6">
          <div className="mb-4 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-lg">
              <Trash2 className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <h3
                id="delete-assessment-type-confirm-title"
                className="text-sm font-semibold text-foreground"
              >
                Supprimer ce type d'évaluation ?
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">
                  {assessmentType.code} — {assessmentType.name}
                </span>{' '}
                sera définitivement supprimé.
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
              {isSubmitting ? 'Suppression…' : 'Supprimer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
