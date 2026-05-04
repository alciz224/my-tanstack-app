import { createFileRoute } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { Calendar, Plus } from 'lucide-react'
import { getAcademicYearsFn } from '@/server/api/academic'
import {
  createAcademicYearFn,
  deleteAcademicYearFn,
  activateAcademicYearFn,
  archiveAcademicYearFn,
  setCurrentAcademicYearFn,
} from '@/server/api/academic-mutations'
import { academicKeys } from '@/lib/query-client'
import type { AcademicYear } from '@/types/academic'
import { toast } from '@/stores/toastStore'

export const Route = createFileRoute('/_authed/super-admin/academic-years')({
  loader: async () => {
    const data = await getAcademicYearsFn()
    const results = Array.isArray(data) ? data : data?.results ?? []
    return { academicYears: results }
  },
  component: AcademicYearsPage,
})

// Confirmation dialog state type
type ConfirmAction = {
  type: 'activate' | 'set-current' | 'archive' | 'delete'
  year: AcademicYear
} | null

function AcademicYearsPage() {
  const getYearId = (y: Partial<AcademicYear> | null | undefined): string => {
    const raw = (y as any)?.id ?? (y as any)?.pk ?? (y as any)?.uuid
    if (raw == null) return ''
    return String(raw)
  }
  const queryClient = useQueryClient()
  const loaderData = Route.useLoaderData()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<ConfirmAction>(null)
  const [pendingRowId, setPendingRowId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'archived'>('all')

  // Server functions wrapped with useServerFn
  const fetchAcademicYears = useServerFn(getAcademicYearsFn)
  const createAcademicYear = useServerFn(createAcademicYearFn)
  const activateAcademicYear = useServerFn(activateAcademicYearFn)
  const archiveAcademicYear = useServerFn(archiveAcademicYearFn)
  const setCurrentAcademicYear = useServerFn(setCurrentAcademicYearFn)
  const deleteAcademicYear = useServerFn(deleteAcademicYearFn)

  // Fetch academic years — SSR-prefetched via loader, kept fresh client-side
  const { data: academicYears, isLoading, isFetching } = useQuery({
    queryKey: academicKeys.academicYearsList(),
    queryFn: async () => {
      const response = await fetchAcademicYears()
      return Array.isArray(response) ? response : response?.results ?? []
    },
    initialData: loaderData.academicYears,
  })

  // Current year (for "Set Current" dialog context)
  const currentYear = academicYears?.find((y) => y.is_current)

  const normalizeStatus = (year: AcademicYear) => {
    const fallback = year.is_active === undefined ? undefined : year.is_active ? 'active' : 'inactive'
    const raw = year.status ?? fallback ?? (year.is_current ? 'active' : 'inactive')
    const normalized = String(raw ?? '').toLowerCase().trim()
    if (normalized === 'archived' || normalized === 'archive') return 'archived'
    if (normalized === 'inactive' || normalized === 'inactif') return 'inactive'
    if (normalized === 'active' || normalized === 'actif') return 'active'
    return year.is_current ? 'active' : 'inactive'
  }

  // Sorted: current first, then active, then inactive, then archived
  const sortedYears = [...(academicYears ?? [])]
    .sort((a, b) => {
      const rank = (y: AcademicYear) => {
        const status = normalizeStatus(y)
        if (y.is_current) return 0
        if (status === 'active') return 1
        if (status === 'inactive') return 2
        return 3
      }
      return rank(a) - rank(b)
    })
    .filter((y) => statusFilter === 'all' || normalizeStatus(y) === statusFilter)

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: academicKeys.academicYears() })

  const done = () => {
    setPendingRowId(null)
    setConfirmAction(null)
  }

  // Create mutation
  const createMutation = useMutation({
    mutationFn: async ({ start_year, end_year }: { start_year: number; end_year: number }) => {
      const name = `${start_year}-${end_year}`
      const result = await createAcademicYear({ data: { name, start_year, end_year } })
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: () => {
      invalidate()
      toast.success('Année scolaire créée avec succès')
      setIsCreateModalOpen(false)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Impossible de créer l\'année scolaire')
    },
  })

  // Activate mutation
  const activateMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await activateAcademicYear({ data: { resourceId: id } })
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: (_, id) => {
      invalidate()
      done()
      const y = academicYears?.find((a) => getYearId(a) === id)
      toast.success(`Année ${y?.name ?? ''} activée avec succès`)
    },
    onError: (error: any) => {
      done()
      toast.error(error.message || 'Impossible d\'activer l\'année scolaire')
    },
  })

  // Set current mutation
  const setCurrentMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await setCurrentAcademicYear({ data: { resourceId: id } })
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: (_, id) => {
      invalidate()
      done()
      const y = academicYears?.find((a) => getYearId(a) === id)
      toast.success(`Année courante mise à jour : ${y?.name ?? ''}`)
    },
    onError: (error: any) => {
      done()
      toast.error(error.message || 'Impossible de définir l\'année courante')
    },
  })

  // Archive mutation
  const archiveMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await archiveAcademicYear({ data: { resourceId: id } })
      if (!result.success) throw new Error(result.error)
      return result.data
    },
    onSuccess: (_, id) => {
      invalidate()
      done()
      const y = academicYears?.find((a) => getYearId(a) === id)
      toast.success(`Année ${y?.name ?? ''} archivée`)
    },
    onError: (error: any) => {
      done()
      toast.error(error.message || 'Impossible d\'archiver l\'année scolaire')
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const result = await deleteAcademicYear({ data: { resourceId: id } })
      if (!result.success) throw new Error(result.error)
    },
    onSuccess: (_, id) => {
      invalidate()
      done()
      const y = academicYears?.find((a) => getYearId(a) === id)
      toast.success(`Année ${y?.name ?? ''} supprimée`)
    },
    onError: (error: any) => {
      done()
      toast.error(error.message || 'Impossible de supprimer l\'année scolaire')
    },
  })

  const isAnyPending =
    activateMutation.isPending ||
    setCurrentMutation.isPending ||
    archiveMutation.isPending ||
    deleteMutation.isPending

  const isRowPending = (id: string) => pendingRowId === id

  const handleConfirm = () => {
    if (!confirmAction) return
    const id = getYearId(confirmAction.year)

    if (!id || id === 'undefined' || id === 'null') {
      console.warn('[academic-years] Missing year id for action', {
        action: confirmAction.type,
        year: confirmAction.year,
      })
      toast.error("Impossible d'exécuter l'action : identifiant de l'année manquant")
      done()
      return
    }

    setPendingRowId(id)
    if (confirmAction.type === 'activate') activateMutation.mutate(id)
    else if (confirmAction.type === 'set-current') setCurrentMutation.mutate(id)
    else if (confirmAction.type === 'archive') archiveMutation.mutate(id)
    else if (confirmAction.type === 'delete') deleteMutation.mutate(id)
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Années scolaires</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les années scolaires de la plateforme, définissez l'année courante et archivez les années passées.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isFetching && !isLoading && (
            <span className="text-xs text-muted-foreground">Mise à jour…</span>
          )}
          <button
            onClick={() => setIsCreateModalOpen(true)}
            disabled={isAnyPending}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium transition-colors hover:bg-primary/90 btn-shine hover-scale disabled:opacity-50 disabled:pointer-events-none"
          >
            <Plus className="w-5 h-5" />
            <span>Nouvelle année scolaire</span>
          </button>
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="mb-4 flex w-fit gap-1 rounded-lg bg-muted p-1">
        {(['all', 'active', 'inactive', 'archived'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${statusFilter === f
              ? 'bg-card text-foreground shadow'
              : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            {f === 'all' ? 'Tous' : f === 'active' ? 'Actifs' : f === 'inactive' ? 'Inactifs' : 'Archivés'}
          </button>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover-lift">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wide text-foreground/80">
                Année scolaire
              </th>
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wide text-foreground/80">
                Statut
              </th>
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wide text-foreground/80">
                Courante
              </th>
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wide text-foreground/80 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {/* Skeleton rows while loading */}
            {isLoading &&
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4">
                    <div className="h-4 w-28 animate-pulse rounded bg-muted" />
                    <div className="mt-1 h-3 w-20 animate-pulse rounded bg-muted/70" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="h-4 w-12 animate-pulse rounded bg-muted/70" />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="ml-auto h-4 w-32 animate-pulse rounded bg-muted" />
                  </td>
                </tr>
              ))}

            {/* Actual rows */}
            {!isLoading &&
              sortedYears.map((year) => {
                const yearId = getYearId(year)
                const isPending = isRowPending(yearId)
                const status = normalizeStatus(year)
                return (
                  <tr
                    key={getYearId(year)}
                    className={`hover:bg-muted/40 transition-colors group ${isPending ? 'opacity-50' : ''}`}
                  >
                    {/* Name + year range */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="font-semibold text-foreground">
                            {year.name}
                          </span>
                          <div className="mt-0.5 text-xs text-muted-foreground">
                            {year.start_year} – {year.end_year}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Status badge */}
                    <td className="whitespace-nowrap px-6 py-4">
                      <StatusBadge status={status} />
                    </td>

                    {/* Current indicator */}
                    <td className="whitespace-nowrap px-6 py-4">
                      {year.is_current ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          Courante
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </td>

                    {/* Actions — right-aligned */}
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      {isPending ? (
                        <span className="text-xs text-muted-foreground">Mise à jour…</span>
                      ) : status === 'archived' ? (
                        <span className="text-xs text-muted-foreground">—</span>
                      ) : (
                        <div className="inline-flex items-center justify-end gap-2">
                          {/* inactive: Activate (primary) */}
                          {status === 'inactive' && (
                            <ActionButton
                              label="Activer"
                              variant="primary"
                              onClick={() => setConfirmAction({ type: 'activate', year })}
                            />
                          )}
                          {/* active, not current: Set Current (primary) */}
                          {status === 'active' && !year.is_current && (
                            <ActionButton
                              label="Définir comme courante"
                              variant="primary"
                              onClick={() => setConfirmAction({ type: 'set-current', year })}
                            />
                          )}
                          {/* active: Archive (secondary, disabled if current) */}
                          {status === 'active' && (
                            <ActionButton
                              label="Archiver"
                              variant="secondary"
                              disabled={year.is_current}
                              title={
                                year.is_current
                                  ? 'Impossible d\'archiver l\'année courante. Définissez d\'abord une autre année comme courante.'
                                  : 'Archiver cette année scolaire'
                              }
                              onClick={() => setConfirmAction({ type: 'archive', year })}
                            />
                          )}
                          {/* inactive only: Delete (destructive, separated) */}
                          {status === 'inactive' && (
                            <>
                              <span className="text-muted-foreground/40" aria-hidden>|</span>
                              <ActionButton
                                label="Supprimer"
                                variant="danger"
                                onClick={() => setConfirmAction({ type: 'delete', year })}
                              />
                            </>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}

            {/* Empty state */}
            {!isLoading && sortedYears.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-16 text-center">
                  <div className="mx-auto max-w-xs">
                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-2xl text-primary">
                      📅
                    </div>
                    {statusFilter !== 'all' ? (
                      <>
                        <h3 className="mb-1 text-sm font-semibold text-foreground">
                          Aucun résultat
                        </h3>
                        <p className="mb-3 text-xs text-muted-foreground">
                          Aucune année scolaire ne correspond à ce filtre.
                        </p>
                        <button
                          onClick={() => setStatusFilter('all')}
                          className="text-xs text-primary hover:underline"
                        >
                          Réinitialiser les filtres
                        </button>
                      </>
                    ) : (
                      <>
                        <h3 className="mb-1 text-sm font-semibold text-foreground">
                          Aucune année scolaire
                        </h3>
                        <p className="mb-4 text-xs text-muted-foreground">
                          Créez la première année scolaire pour commencer la configuration de la plateforme.
                        </p>
                        <button
                          onClick={() => setIsCreateModalOpen(true)}
                          className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                        >
                          + Nouvelle année scolaire
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <CreateAcademicYearModal
          isSubmitting={createMutation.isPending}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={({ start_year, end_year }) => createMutation.mutate({ start_year, end_year })}
        />
      )}

      {/* Confirmation Dialog */}
      {confirmAction && (
        <ConfirmDialog
          action={confirmAction}
          currentYear={currentYear}
          isSubmitting={isAnyPending}
          onCancel={() => setConfirmAction(null)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  )
}

// ============================================================================
// Sub-components
// ============================================================================

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    inactive: 'bg-muted text-muted-foreground',
    archived: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  }
  const dots: Record<string, string> = {
    active: 'bg-emerald-500',
    inactive: 'bg-muted-foreground',
    archived: 'bg-amber-500',
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] ?? styles.inactive}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dots[status] ?? dots.inactive}`} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

function ActionButton({
  label,
  variant,
  onClick,
  disabled,
  title,
}: {
  label: string
  variant: 'primary' | 'secondary' | 'danger'
  onClick: () => void
  disabled?: boolean
  title?: string
}) {
  const styles: Record<string, string> = {
    primary: 'text-primary hover:text-primary/80',
    secondary: 'text-muted-foreground hover:text-foreground',
    danger: 'text-destructive hover:text-destructive/80',
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`text-xs font-medium transition-colors ${styles[variant]} disabled:cursor-not-allowed disabled:opacity-40`}
    >
      {label}
    </button>
  )
}

// ============================================================================
// ConfirmDialog — handles all 4 action types
// ============================================================================
function ConfirmDialog({
  action,
  currentYear,
  isSubmitting,
  onCancel,
  onConfirm,
}: {
  action: { type: 'activate' | 'set-current' | 'archive' | 'delete'; year: AcademicYear }
  currentYear: AcademicYear | undefined
  isSubmitting: boolean
  onCancel: () => void
  onConfirm: () => void
}) {
  const { type, year } = action

  const config = {
    activate: {
      icon: '✅',
      iconBg: 'bg-emerald-500/10',
      title: 'Activer cette année scolaire ?',
      description: (
        <>
          <span className="font-medium text-foreground">{year.name}</span> passera au statut{' '}
          <span className="font-medium">actif</span>. Elle sera disponible pour être définie comme
          année courante.
        </>
      ),
      confirmLabel: 'Activer',
      loadingLabel: 'Activation…',
      confirmClass: 'bg-emerald-600 hover:bg-emerald-700',
    },
    'set-current': {
      icon: '📌',
      iconBg: 'bg-primary/10',
      title: 'Définir comme année courante ?',
      description: (
        <>
          <span className="font-medium text-foreground">{year.name}</span> deviendra l'année scolaire
          de référence pour toute la plateforme.
          {currentYear && currentYear.id !== year.id && (
            <span className="mt-1 block text-amber-600 dark:text-amber-400">
              L'année actuelle (<span className="font-medium">{currentYear.name}</span>) ne sera plus
              marquée comme courante.
            </span>
          )}
        </>
      ),
      confirmLabel: 'Définir comme courante',
      loadingLabel: 'Mise à jour…',
      confirmClass: 'bg-primary hover:bg-primary/90',
    },
    archive: {
      icon: '📦',
      iconBg: 'bg-amber-500/10',
      title: 'Archiver cette année scolaire ?',
      description: (
        <>
          <span className="font-medium text-foreground">{year.name}</span> sera archivée et deviendra
          <span className="font-medium"> en lecture seule</span>. Cette action ne supprime aucune donnée.
        </>
      ),
      confirmLabel: 'Archiver',
      loadingLabel: 'Archivage…',
      confirmClass: 'bg-amber-600 hover:bg-amber-700',
    },
    delete: {
      icon: '🗑️',
      iconBg: 'bg-destructive/10',
      title: 'Supprimer cette année scolaire ?',
      description: (
        <>
          <span className="font-medium text-foreground">{year.name}</span> sera définitivement supprimée.{' '}
          <span className="font-medium text-destructive">Cette action est irréversible.</span>
        </>
      ),
      confirmLabel: 'Supprimer',
      loadingLabel: 'Suppression…',
      confirmClass: 'bg-destructive hover:bg-destructive/90',
    },
  }[type]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="w-full max-w-sm rounded-xl border border-border bg-card shadow-xl">
        <div className="p-6">
          <div className="mb-4 flex items-start gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ${config.iconBg}`}
              aria-hidden
            >
              {config.icon}
            </div>
            <div>
              <h3
                id="confirm-dialog-title"
                className="text-sm font-semibold text-foreground"
              >
                {config.title}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {config.description}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={onCancel}
              disabled={isSubmitting}
              className="rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground hover:bg-muted disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              disabled={isSubmitting}
              className={`rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${config.confirmClass}`}
            >
              {isSubmitting ? config.loadingLabel : config.confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// CreateAcademicYearModal — create only, no edit
// ============================================================================
function CreateAcademicYearModal({
  isSubmitting,
  onClose,
  onSubmit,
}: {
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (data: { start_year: number; end_year: number }) => void
}) {
  const thisYear = new Date().getFullYear()
  const [startYear, setStartYear] = useState(thisYear)
  const [endYear, setEndYear] = useState(thisYear + 1)
  const [errors, setErrors] = useState<{ start_year?: string; end_year?: string }>({})

  const previewName = `${startYear}-${endYear}`

  const handleStartChange = (val: number) => {
    setStartYear(val)
    setEndYear(val + 1)
    setErrors({})
  }

  const validate = () => {
    const e: { start_year?: string; end_year?: string } = {}
    if (!startYear || startYear < 2000) e.start_year = 'Année de début invalide'
    if (!endYear || endYear <= startYear) e.end_year = 'L\'année de fin doit être supérieure'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    onSubmit({ start_year: startYear, end_year: endYear })
  }

  const inputBase =
    'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary'
  const inputError =
    'border-destructive focus:ring-destructive'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-modal-title"
    >
      <div className="w-full max-w-sm rounded-xl border border-border bg-card shadow-xl">
        {/* Header */}
        <div className="border-b border-border px-6 py-4">
          <h2
            id="create-modal-title"
            className="text-base font-semibold text-foreground"
          >
            Nouvelle année scolaire
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Le nom sera généré automatiquement à partir des années choisies.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="px-6 pb-6 pt-5">
          {/* Year inputs */}
          <div className="mb-5 grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">
                Année de début
              </label>
              <input
                type="number"
                value={startYear}
                min={2000}
                max={2100}
                autoFocus
                onChange={(e) => handleStartChange(parseInt(e.target.value) || thisYear)}
                className={`${inputBase} ${errors.start_year ? inputError : ''}`}
              />
              {errors.start_year && (
                <p className="mt-1 text-xs text-destructive">{errors.start_year}</p>
              )}
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-foreground">
                Année de fin
              </label>
              <input
                type="number"
                value={endYear}
                min={2001}
                max={2101}
                onChange={(e) => {
                  setEndYear(parseInt(e.target.value) || thisYear + 1)
                  setErrors((err) => ({ ...err, end_year: undefined }))
                }}
                className={`${inputBase} ${errors.end_year ? inputError : ''}`}
              />
              {errors.end_year && (
                <p className="mt-1 text-xs text-destructive">{errors.end_year}</p>
              )}
            </div>
          </div>

          {/* Auto-generated name preview */}
          <div className="mb-6 rounded-lg bg-muted/50 px-3 py-2.5">
            <p className="text-xs text-muted-foreground">
              Nom généré :{' '}
              <span className="font-semibold text-foreground">
                {previewName}
              </span>
            </p>
          </div>

          <div className="flex justify-end gap-2">
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
              {isSubmitting ? 'Création…' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
