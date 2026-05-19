import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { AlertCircle, ArrowLeft, CheckCircle, Clock, Plus, ToggleLeft, ToggleRight, Trash2, X } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import {
  deleteTimeSlotFn,
  getTimeSlotsFn,
  updateTimeSlotFn,
} from '@/server/api/schedules'
import { CreateTimeSlotModal } from '@/components/CreateTimeSlotModal'
import type { SchoolYearCycleTimeSlot } from '@/server/data/schedules/types'

export const Route = createFileRoute(
  '/_authed/school-admin/schedule/time-slots/',
)({
  component: TimeSlotsPage,
  loader: async () => {
    const timeSlots = await getTimeSlotsFn({ data: 'syc-1' })
    return { timeSlots }
  },
})

const CYCLES = [
  { id: 'syc-1', name: 'Primaire' },
  { id: 'syc-2', name: 'Secondaire' },
]

function TimeSlotsPage() {
  const { timeSlots: initialTimeSlots } = Route.useLoaderData()
  const [timeSlots, setTimeSlots] = useState<SchoolYearCycleTimeSlot[]>(initialTimeSlots)
  const [activeCycleId, setActiveCycleId] = useState('syc-1')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [actionError, setActionError] = useState<string | null>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleCycleChange = async (cycleId: string) => {
    setActiveCycleId(cycleId)
    const slots = await getTimeSlotsFn({ data: cycleId })
    setTimeSlots(slots)
  }

  const handleToggleStatus = async (slot: SchoolYearCycleTimeSlot) => {
    setActionError(null)
    setLoadingId(slot.id)
    const newStatus = slot.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    try {
      const updated = await updateTimeSlotFn({ data: { id: slot.id, updates: { status: newStatus } } })
      setTimeSlots((prev) => prev.map((s) => (s.id === slot.id ? updated : s)))
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setLoadingId(null)
    }
  }

  const handleDelete = async (slot: SchoolYearCycleTimeSlot) => {
    setActionError(null)
    setLoadingId(slot.id)
    try {
      await deleteTimeSlotFn({ data: slot.id })
      setTimeSlots((prev) => prev.filter((s) => s.id !== slot.id))
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Erreur lors de la suppression')
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/school-admin/schedule"
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Créneaux Horaires</h1>
            <p className="text-muted-foreground text-sm">Gérez le découpage de la journée par cycle.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-card border border-border rounded-lg p-1 flex">
            {CYCLES.map((c) => (
              <button
                key={c.id}
                onClick={() => handleCycleChange(c.id)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeCycleId === c.id ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted/50'}`}
              >
                {c.name}
              </button>
            ))}
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" /> Ajouter un créneau
          </button>
        </div>
      </div>

      {/* Error */}
      {actionError && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 text-sm text-red-600 dark:text-red-400">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="flex-1">{actionError}</div>
          <button onClick={() => setActionError(null)}><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Info alert */}
      <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl flex items-start gap-3 text-sm">
        <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-foreground mb-0.5">Règles importantes</p>
          <ul className="text-muted-foreground space-y-0.5 list-disc list-inside">
            <li>Les créneaux ne peuvent pas se <strong>chevaucher</strong> au sein d'un même cycle.</li>
            <li>Un créneau utilisé par des cours existants ne peut pas être <strong>supprimé</strong> — désactivez-le.</li>
            <li>Les horaires d'un créneau utilisé sont <strong>immuables</strong> (seul le nom est modifiable).</li>
          </ul>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/40 border-b border-border text-muted-foreground">
              <tr>
                <th className="px-5 py-3.5 font-semibold w-16">Ordre</th>
                <th className="px-5 py-3.5 font-semibold">Nom du créneau</th>
                <th className="px-5 py-3.5 font-semibold">Début</th>
                <th className="px-5 py-3.5 font-semibold">Fin</th>
                <th className="px-5 py-3.5 font-semibold">Durée</th>
                <th className="px-5 py-3.5 font-semibold text-center">Statut</th>
                <th className="px-5 py-3.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {timeSlots.map((slot) => {
                const isBreak = slot.name.toLowerCase().includes('réc') || slot.name.toLowerCase().includes('pause')
                const isLoading = loadingId === slot.id
                return (
                  <tr
                    key={slot.id}
                    className={`hover:bg-muted/20 transition-colors group ${slot.status === 'INACTIVE' ? 'opacity-60' : ''}`}
                  >
                    <td className="px-5 py-4 font-mono font-bold text-muted-foreground">#{slot.order}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {isBreak && <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />}
                        <span className={`font-semibold ${isBreak ? 'text-amber-700 dark:text-amber-400' : 'text-foreground'}`}>
                          {slot.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-2 text-foreground font-mono">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" /> {slot.start_time}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-2 text-foreground font-mono">
                        <Clock className="w-3.5 h-3.5 text-muted-foreground" /> {slot.end_time}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">
                      <span className="px-2 py-0.5 bg-muted rounded-full text-xs font-medium">
                        {slot.duration_minutes} min
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${slot.status === 'ACTIVE' ? 'bg-green-500/15 text-green-700 dark:text-green-400' : 'bg-muted text-muted-foreground'}`}>
                        {slot.status === 'ACTIVE' ? <><CheckCircle className="w-3 h-3" /> Actif</> : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Toggle status */}
                        <button
                          onClick={() => handleToggleStatus(slot)}
                          disabled={isLoading}
                          title={slot.status === 'ACTIVE' ? 'Désactiver ce créneau' : 'Activer ce créneau'}
                          className={`p-2 rounded-md transition-colors ${slot.status === 'ACTIVE' ? 'text-muted-foreground hover:text-amber-600 hover:bg-amber-500/10' : 'text-muted-foreground hover:text-green-600 hover:bg-green-500/10'} disabled:opacity-40`}
                        >
                          {slot.status === 'ACTIVE' ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                        </button>
                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(slot)}
                          disabled={isLoading}
                          title="Supprimer (uniquement si non utilisé)"
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors disabled:opacity-40"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {timeSlots.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    Aucun créneau configuré pour ce cycle.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CreateTimeSlotModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        schoolYearCycleId={activeCycleId}
      />
    </div>
  )
}
