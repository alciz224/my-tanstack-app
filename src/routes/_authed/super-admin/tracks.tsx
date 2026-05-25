import { createFileRoute } from '@tanstack/react-router'
import {
  BookOpen,
  Compass,
  Edit,
  Filter,
  GraduationCap,
  Loader2,
  Plus,
  Search,
  Trash2,
  Users,
  X,
} from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import { getTracksFn, getCyclesFn } from '@/server/api/academic'
import {
  createTrackFn,
  updateTrackFn,
  deleteTrackFn,
} from '@/server/api/academic-mutations-extra'
import { academicKeys } from '@/lib/query-client'
import { toast } from '@/stores/toastStore'
import type { Track, Cycle } from '@/server/data/academic/types'

export const Route = createFileRoute('/_authed/super-admin/tracks')({
  component: TracksPage,
})

function TracksPage() {
  const queryClient = useQueryClient()
  const getTracks = useServerFn(getTracksFn)
  const getCycles = useServerFn(getCyclesFn)
  const createTrack = useServerFn(createTrackFn)
  const updateTrack = useServerFn(updateTrackFn)
  const deleteTrack = useServerFn(deleteTrackFn)

  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState<Track | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<Track | null>(null)
  const [search, setSearch] = useState('')
  const [cycleFilter, setCycleFilter] = useState('')

  const { data: tracks, isLoading } = useQuery({
    queryKey: academicKeys.tracksList(),
    queryFn: () => getTracks(),
  })

  const { data: cycles } = useQuery({
    queryKey: academicKeys.cyclesList(),
    queryFn: () => getCycles(),
  })

  const cycleMap = new Map((cycles ?? []).map((c) => [c.id, c]))
  const trackableCycles = (cycles ?? []).filter((c) => c.has_track)

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: academicKeys.tracks() })

  const createMutation = useMutation({
    mutationFn: async (data: Omit<Track, 'id'>) => {
      const result = await createTrack(data)
      return result
    },
    onSuccess: () => {
      invalidate()
      toast.success('Profil créé avec succès')
      setCreateOpen(false)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Impossible de créer le profil')
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Track> }) => {
      const result = await updateTrack({ id, data })
      return result
    },
    onSuccess: () => {
      invalidate()
      toast.success('Profil modifié avec succès')
      setEditing(null)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Impossible de modifier le profil')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteTrack({ id })
    },
    onSuccess: () => {
      invalidate()
      toast.success('Profil supprimé avec succès')
      setDeleteConfirm(null)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Impossible de supprimer le profil')
    },
  })

  const filtered = (tracks ?? []).filter((t) => {
    const matchSearch =
      !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.code.toLowerCase().includes(search.toLowerCase())
    const matchCycle = !cycleFilter || t.cycle_id === cycleFilter
    return matchSearch && matchCycle
  })

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Gestion des Profils & Options
          </h1>
          <p className="text-muted-foreground mt-1">
            Configurez les séries d'études (ex: SM, SE, SS) pour les lycées et
            collèges.
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium transition-colors hover:bg-primary/90 btn-shine hover-scale"
        >
          <Plus className="w-5 h-5" />
          <span>Nouveau Profil</span>
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg p-4 flex flex-col sm:flex-row gap-4 hover-lift">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher un profil (SM, SS)..."
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
              {trackableCycles.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <Filter className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading && (
          <div className="col-span-full flex justify-center py-12 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        )}
        {filtered.map((track) => {
          const cycle = cycleMap.get(track.cycle_id)
          return (
            <div
              key={track.id}
              className="bg-card border border-border rounded-lg p-6 hover-lift flex flex-col group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Compass className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono font-bold bg-muted text-foreground px-3 py-1 rounded border border-border">
                  {track.code || track.name.substring(0, 2).toUpperCase()}
                </span>
              </div>

              <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {track.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-6 line-clamp-2 leading-relaxed">
                {track.description}
              </p>

              <div className="space-y-3 mt-auto pt-4 border-t border-border">
                <div className="flex items-center text-sm text-foreground/80">
                  <GraduationCap className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>
                    Cycle concerné :{' '}
                    <span className="font-semibold text-foreground">
                      {cycle?.name ?? track.cycle_id}
                    </span>
                  </span>
                </div>
                <div className="flex items-center text-sm text-foreground/80">
                  <BookOpen className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>
                    Matières au programme :{' '}
                    <span className="font-semibold text-foreground">
                      {(track as any).subjectsCount || 10}
                    </span>
                  </span>
                </div>
                <div className="flex items-center text-sm text-foreground/80">
                  <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>
                    Élèves inscrits (Global) :{' '}
                    <span className="font-semibold text-foreground">
                      {((track as any).studentsCount || 450).toLocaleString(
                        'fr-FR',
                      )}
                    </span>
                  </span>
                </div>
              </div>

              <div className="border-t border-border pt-4 mt-5 flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirm(track)}
                  className="flex items-center text-sm text-destructive hover:underline gap-1 transition-all hover-scale"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
                </button>
                <button
                  onClick={() => setEditing(track)}
                  className="flex items-center text-sm text-primary hover:underline gap-1 transition-all hover-scale"
                >
                  <Edit className="w-4 h-4" />
                  Modifier le profil
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {createOpen && (
        <CreateEditTrackModal
          cycles={trackableCycles}
          isSubmitting={createMutation.isPending}
          onClose={() => setCreateOpen(false)}
          onSubmit={(data) => createMutation.mutate(data)}
        />
      )}

      {editing && (
        <CreateEditTrackModal
          track={editing}
          cycles={trackableCycles}
          isSubmitting={updateMutation.isPending}
          onClose={() => setEditing(null)}
          onSubmit={(data) =>
            updateMutation.mutate({ id: editing.id, data })
          }
        />
      )}

      {deleteConfirm && (
        <DeleteTrackConfirm
          track={deleteConfirm}
          cycleName={cycleMap.get(deleteConfirm.cycle_id)?.name}
          isSubmitting={deleteMutation.isPending}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={() => deleteMutation.mutate(deleteConfirm.id)}
        />
      )}
    </div>
  )
}

function CreateEditTrackModal({
  track,
  cycles,
  isSubmitting,
  onClose,
  onSubmit,
}: {
  track?: Track
  cycles: Cycle[]
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (data: Omit<Track, 'id'>) => void
}) {
  const [cycleId, setCycleId] = useState(track?.cycle_id ?? (cycles[0]?.id || ''))
  const [code, setCode] = useState(track?.code ?? '')
  const [name, setName] = useState(track?.name ?? '')
  const [description, setDescription] = useState(track?.description ?? '')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isEdit = !!track

  const inputBase =
    'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary'
  const inputError = 'border-destructive focus:ring-destructive'
  const labelClass = 'mb-1 block text-xs font-medium text-foreground'

  const validate = () => {
    const e: Record<string, string> = {}
    if (!cycleId) e.cycle_id = 'Veuillez sélectionner un cycle'
    if (!code.trim()) e.code = 'Le code est requis'
    if (!name.trim()) e.name = 'Le nom est requis'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    onSubmit({ cycle_id: cycleId, code: code.trim(), name: name.trim(), description: description.trim() || undefined })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="track-modal-title"
    >
      <div className="w-full max-w-md rounded-xl border border-border bg-card shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2
              id="track-modal-title"
              className="text-base font-semibold text-foreground"
            >
              {isEdit ? 'Modifier le profil' : 'Nouveau profil'}
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {isEdit
                ? 'Modifiez les informations du profil.'
                : 'Créez un nouveau profil pour un cycle.'}
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

        <form onSubmit={handleSubmit} noValidate className="px-6 pb-6 pt-5 space-y-4">
          <div>
            <label className={labelClass}>Cycle</label>
            <select
              value={cycleId}
              onChange={(e) => { setCycleId(e.target.value); setErrors((err) => ({ ...err, cycle_id: '' })) }}
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
              onChange={(e) => { setCode(e.target.value); setErrors((err) => ({ ...err, code: '' })) }}
              placeholder="Ex: SM, SE, SS"
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
              onChange={(e) => { setName(e.target.value); setErrors((err) => ({ ...err, name: '' })) }}
              placeholder="Ex: Sciences Mathématiques"
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
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description optionnelle du profil..."
              rows={3}
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

function DeleteTrackConfirm({
  track,
  cycleName,
  isSubmitting,
  onClose,
  onConfirm,
}: {
  track: Track
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
      aria-labelledby="delete-confirm-title"
    >
      <div className="w-full max-w-sm rounded-xl border border-border bg-card shadow-xl">
        <div className="p-6">
          <div className="mb-4 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-lg">
              <Trash2 className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <h3
                id="delete-confirm-title"
                className="text-sm font-semibold text-foreground"
              >
                Supprimer ce profil ?
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">
                  {track.code} — {track.name}
                </span>{' '}
                sera définitivement supprimé{cycleName ? ` (${cycleName})` : ''}.
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
