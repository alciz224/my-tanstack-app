import { useState } from 'react'
import { Clock, X } from 'lucide-react'
import { useRouter } from '@tanstack/react-router'

interface CreateTimeSlotModalProps {
  isOpen: boolean
  onClose: () => void
  schoolYearCycleId: string
}

export function CreateTimeSlotModal({
  isOpen,
  onClose,
  schoolYearCycleId,
}: CreateTimeSlotModalProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    start_time: '08:00',
    end_time: '08:50',
    duration_minutes: 50,
    order: 1,
  })

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const { createTimeSlotFn } = await import('@/server/api/schedules')
      await createTimeSlotFn({
        data: {
          school_year_cycle_id: schoolYearCycleId,
          name: formData.name,
          start_time: formData.start_time,
          end_time: formData.end_time,
          duration_minutes: formData.duration_minutes,
          order: formData.order,
          status: 'ACTIVE',
        },
      })
      onClose()
      setFormData({
        name: '',
        start_time: '08:00',
        end_time: '08:50',
        duration_minutes: 50,
        order: formData.order + 1,
      })
      router.invalidate()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erreur lors de la création',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  // Auto-calculate duration when times change
  const handleTimeChange = (
    field: 'start_time' | 'end_time',
    value: string,
  ) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value }
      if (newData.start_time && newData.end_time) {
        const [startH, startM] = newData.start_time.split(':').map(Number)
        const [endH, endM] = newData.end_time.split(':').map(Number)
        const duration = endH * 60 + endM - (startH * 60 + startM)
        newData.duration_minutes = Math.max(0, duration)
      }
      return newData
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-background rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-primary px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-primary-foreground" />
            <h2 className="text-white font-bold text-lg">
              Nouveau Créneau Horaire
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Nom du créneau <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ex: 1ère Heure, Récréation, Pause déjeuner"
              className="w-full bg-input border-none rounded-lg py-2.5 px-4 text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Heure de début <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={formData.start_time}
                onChange={(e) => handleTimeChange('start_time', e.target.value)}
                className="w-full bg-input border-none rounded-lg py-2.5 px-4 text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Heure de fin <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                value={formData.end_time}
                onChange={(e) => handleTimeChange('end_time', e.target.value)}
                className="w-full bg-input border-none rounded-lg py-2.5 px-4 text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Durée (minutes)
              </label>
              <input
                type="number"
                value={formData.duration_minutes}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    duration_minutes: parseInt(e.target.value) || 0,
                  })
                }
                min={0}
                max={240}
                className="w-full bg-input border-none rounded-lg py-2.5 px-4 text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Ordre
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    order: parseInt(e.target.value) || 1,
                  })
                }
                min={1}
                className="w-full bg-input border-none rounded-lg py-2.5 px-4 text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Création...' : 'Créer le créneau'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
