import { createFileRoute } from '@tanstack/react-router'
import {
  Edit,
  Filter,
  GraduationCap,
  Loader2,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import { getLevelsFn, getCyclesFn, getTracksFn } from '@/server/api/academic'
import {
  createLevelFn,
  updateLevelFn,
  deleteLevelFn,
} from '@/server/api/academic-mutations-extra'
import { academicKeys } from '@/lib/query-client'
import { toast } from '@/stores/toastStore'
import type { Level, Cycle, Track } from '@/server/data/academic/types'

export const Route = createFileRoute('/_authed/super-admin/levels')({
  component: LevelsPage,
})

function LevelsPage() {
  const queryClient = useQueryClient()
  const getLevels = useServerFn(getLevelsFn)
  const getCycles = useServerFn(getCyclesFn)
  const getTracks = useServerFn(getTracksFn)
  const createLevel = useServerFn(createLevelFn)
  const updateLevel = useServerFn(updateLevelFn)
  const deleteLevel = useServerFn(deleteLevelFn)

  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState<Level | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<Level | null>(null)
  const [search, setSearch] = useState('')
  const [cycleFilter, setCycleFilter] = useState('')

  const { data: levels, isLoading } = useQuery({
    queryKey: academicKeys.levelsList(),
    queryFn: () => getLevels(),
  })

  const { data: cycles } = useQuery({
    queryKey: academicKeys.cyclesList(),
    queryFn: () => getCycles(),
  })

  const { data: tracks } = useQuery({
    queryKey: academicKeys.tracksList(),
    queryFn: () => getTracks(),
  })

  const cycleMap = new Map((cycles ?? []).map((c) => [c.id, c]))
  const tracksByCycle = new Map<string, Track[]>()
  for (const t of tracks ?? []) {
    const list = tracksByCycle.get(t.cycle_id) ?? []
    list.push(t)
    tracksByCycle.set(t.cycle_id, list)
  }

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: academicKeys.levels() })

  const createMutation = useMutation({
    mutationFn: async (data: Omit<Level, 'id'>) => {
      const result = await createLevel(data)
      return result
    },
    onSuccess: () => {
      invalidate()
      toast.success('Niveau créé avec succès')
      setCreateOpen(false)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Impossible de créer le niveau')
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Level> }) => {
      const result = await updateLevel({ id, data })
      return result
    },
    onSuccess: () => {
      invalidate()
      toast.success('Niveau modifié avec succès')
      setEditing(null)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Impossible de modifier le niveau')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteLevel({ id })
    },
    onSuccess: () => {
      invalidate()
      toast.success('Niveau supprimé avec succès')
      setDeleteConfirm(null)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Impossible de supprimer le niveau')
    },
  })

  const filtered = (levels ?? []).filter((l) => {
    const matchSearch =
      !search ||
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.code.toLowerCase().includes(search.toLowerCase())
    const matchCycle = !cycleFilter || l.cycle_id === cycleFilter
    return matchSearch && matchCycle
  })

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Gestion des Niveaux
          </h1>
          <p className="text-muted-foreground mt-1">
            Définissez les niveaux scolaires associés à chaque cycle.
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium transition-colors hover:bg-primary/90 btn-shine hover-scale"
        >
          <Plus className="w-5 h-5" />
          <span>Nouveau Niveau</span>
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg p-4 flex flex-col sm:flex-row gap-4 hover-lift">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher un niveau..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-input border-none rounded-lg py-2.5 pl-10 pr-4 text-foreground focus:ring-2 focus:ring-ring focus:outline-none transition-shadow"
          />
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <select
              value={cycleFilter}
              onChange={(e) => setCycleFilter(e.target.value)}
              className="appearance-none bg-input border-none rounded-lg py-2.5 pl-4 pr-10 text-foreground font-medium focus:ring-2 focus:ring-ring focus:outline-none cursor-pointer h-full"
            >
              <option value="">Tous les cycles</option>
              {(cycles ?? []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <Filter className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover-lift">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wide text-foreground/80">
                Nom du Niveau
              </th>
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wide text-foreground/80">
                Code
              </th>
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wide text-foreground/80">
                Cycle Associé
              </th>
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wide text-foreground/80">
                Ordre
              </th>
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wide text-foreground/80 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-muted-foreground"
                >
                  <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                </td>
              </tr>
            )}
            {filtered.map((level) => {
              const cycle = cycleMap.get(level.cycle_id)
              return (
                <tr
                  key={level.id}
                  className="hover:bg-muted/40 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-foreground">
                        {level.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 bg-primary/10 text-primary rounded text-sm font-mono font-semibold">
                      {level.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-foreground/80">
                    {cycle?.name ?? level.cycle_id}
                  </td>
                  <td className="px-6 py-4 text-foreground/80">
                    {level.order}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setEditing(level)}
                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors hover-scale"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(level)}
                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors hover-scale"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {createOpen && (
        <CreateEditLevelModal
          cycles={cycles ?? []}
          tracksByCycle={tracksByCycle}
          isSubmitting={createMutation.isPending}
          onClose={() => setCreateOpen(false)}
          onSubmit={(data) => createMutation.mutate(data)}
        />
      )}

      {editing && (
        <CreateEditLevelModal
          level={editing}
          cycles={cycles ?? []}
          tracksByCycle={tracksByCycle}
          isSubmitting={updateMutation.isPending}
          onClose={() => setEditing(null)}
          onSubmit={(data) =>
            updateMutation.mutate({ id: editing.id, data })
          }
        />
      )}

      {deleteConfirm && (
        <DeleteLevelConfirm
          level={deleteConfirm}
          cycleName={cycleMap.get(deleteConfirm.cycle_id)?.name}
          isSubmitting={deleteMutation.isPending}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={() => deleteMutation.mutate(deleteConfirm.id)}
        />
      )}
    </div>
  )
}

function CreateEditLevelModal({
  level,
  cycles,
  tracksByCycle,
  isSubmitting,
  onClose,
  onSubmit,
}: {
  level?: Level
  cycles: Cycle[]
  tracksByCycle: Map<string, Track[]>
  isSubmitting: boolean
  onSubmit: (data: Omit<Level, 'id'> | { id: string; data: Partial<Level> }) => void
  onClose: () => void
}) {
  const isEdit = !!level
  const initialCycleId = level?.cycle_id ?? (cycles[0]?.id || '')
  const [cycleId, setCycleId] = useState(initialCycleId)
  const [code, setCode] = useState(level?.code ?? '')
  const [name, setName] = useState(level?.name ?? '')
  const [order, setOrder] = useState(level?.order ?? 1)
  const [trackId, setTrackId] = useState(level?.track_id ?? '')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const selectedCycle = cycles.find((c) => c.id === cycleId)
  const showTrackSelect = selectedCycle?.has_track ?? false
  const availableTracks = tracksByCycle.get(cycleId) ?? []

  const inputBase =
    'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary'
  const inputError = 'border-destructive focus:ring-destructive'
  const labelClass = 'mb-1 block text-xs font-medium text-foreground'

  const validate = () => {
    const e: Record<string, string> = {}
    if (!cycleId) e.cycle_id = 'Veuillez sélectionner un cycle'
    if (!code.trim()) e.code = 'Le code est requis'
    if (!name.trim()) e.name = 'Le nom est requis'
    if (!order || order < 1) e.order = 'Veuillez entrer un ordre valide'
    if (showTrackSelect && !trackId) e.track_id = 'Veuillez sélectionner une série'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    const payload: Omit<Level, 'id'> = {
      cycle_id: cycleId,
      code: code.trim(),
      name: name.trim(),
      order,
      track_id: showTrackSelect ? trackId : null,
    }
    onSubmit(payload)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="level-modal-title"
    >
      <div className="w-full max-w-md rounded-xl border border-border bg-card shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2
              id="level-modal-title"
              className="text-base font-semibold text-foreground"
            >
              {isEdit ? 'Modifier le niveau' : 'Nouveau niveau'}
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {isEdit
                ? 'Modifiez les informations du niveau.'
                : 'Créez un nouveau niveau scolaire.'}
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
            <label className={labelClass}>Cycle</label>
            <select
              value={cycleId}
              onChange={(e) => {
                setCycleId(e.target.value)
                setTrackId('')
                setErrors((err) => ({ ...err, cycle_id: '' }))
              }}
              className={`${inputBase} ${errors.cycle_id ? inputError : ''}`}
            >
              <option value="">Sélectionnez un cycle</option>
              {cycles.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            {errors.cycle_id && (
              <p className="mt-1 text-xs text-destructive">{errors.cycle_id}</p>
            )}
          </div>

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
              placeholder="Ex: 6EME, 5EME, TLE"
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
              placeholder="Ex: Sixième, Cinquième, Terminale"
              className={`${inputBase} ${errors.name ? inputError : ''}`}
            />
            {errors.name && (
              <p className="mt-1 text-xs text-destructive">{errors.name}</p>
            )}
          </div>

          <div>
            <label className={labelClass}>Ordre</label>
            <input
              type="number"
              value={order}
              min={1}
              onChange={(e) => {
                setOrder(Number(e.target.value))
                setErrors((err) => ({ ...err, order: '' }))
              }}
              placeholder="Ex: 1, 2, 3"
              className={`${inputBase} ${errors.order ? inputError : ''}`}
            />
            {errors.order && (
              <p className="mt-1 text-xs text-destructive">{errors.order}</p>
            )}
          </div>

          {showTrackSelect && (
            <div>
              <label className={labelClass}>Série / Profil</label>
              <select
                value={trackId}
                onChange={(e) => {
                  setTrackId(e.target.value)
                  setErrors((err) => ({ ...err, track_id: '' }))
                }}
                className={`${inputBase} ${errors.track_id ? inputError : ''}`}
              >
                <option value="">Sélectionnez une série</option>
                {availableTracks.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.code} — {t.name}
                  </option>
                ))}
              </select>
              {errors.track_id && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.track_id}
                </p>
              )}
            </div>
          )}

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

function DeleteLevelConfirm({
  level,
  cycleName,
  isSubmitting,
  onClose,
  onConfirm,
}: {
  level: Level
  cycleName?: string
  isSubmitting: boolean
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-level-confirm-title"
    >
      <div className="w-full max-w-sm rounded-xl border border-border bg-card shadow-xl">
        <div className="p-6">
          <div className="mb-4 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-lg">
              <Trash2 className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <h3
                id="delete-level-confirm-title"
                className="text-sm font-semibold text-foreground"
              >
                Supprimer ce niveau ?
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">
                  {level.code} — {level.name}
                </span>{' '}
                sera définitivement supprimé
                {cycleName ? ` (${cycleName})` : ''}.
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
