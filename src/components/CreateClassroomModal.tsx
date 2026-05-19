import { useState } from 'react'
import { DoorOpen, X } from 'lucide-react'
import { useRouter } from '@tanstack/react-router'

interface CreateClassroomModalProps {
  isOpen: boolean
  onClose: () => void
  schoolYearLevels: Array<{
    id: string
    level_name: string
    cycle_name: string
  }>
  onSuccess?: (classroom: unknown) => void
}

export function CreateClassroomModal({
  isOpen,
  onClose,
  schoolYearLevels,
  onSuccess,
}: CreateClassroomModalProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    schoolYearLevelId: schoolYearLevels[0]?.id || '',
    name: '',
    capacity: 35,
    room_number: '',
  })

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const { createClassroomFn } = await import('@/server/api/schools')
      const newClassroom = await createClassroomFn({ data: formData })
      onSuccess?.(newClassroom)
      onClose()
      router.invalidate()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erreur lors de la création',
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-background rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-primary px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DoorOpen className="w-5 h-5 text-primary-foreground" />
            <h2 className="text-white font-bold text-lg">Nouvelle Classe</h2>
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
              Niveau scolaire
            </label>
            <select
              value={formData.schoolYearLevelId}
              onChange={(e) =>
                setFormData({ ...formData, schoolYearLevelId: e.target.value })
              }
              className="w-full bg-input border-none rounded-lg py-2.5 px-4 text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
              required
            >
              {schoolYearLevels.map((level) => (
                <option key={level.id} value={level.id}>
                  {level.cycle_name} - {level.level_name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Nom de la classe <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ex: 6ème A, 5ème B"
              pattern="^[0-9]+ème [A-Z]$|^[0-9]+e [A-Z]$"
              title="Format: 6ème A (chiffre + ème + espace + lettre majuscule)"
              className="w-full bg-input border-none rounded-lg py-2.5 px-4 text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Format recommandé: "6ème A", "5ème B"
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Capacité
              </label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    capacity: parseInt(e.target.value) || 0,
                  })
                }
                min={0}
                max={60}
                className="w-full bg-input border-none rounded-lg py-2.5 px-4 text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Salle
              </label>
              <input
                type="text"
                value={formData.room_number}
                onChange={(e) =>
                  setFormData({ ...formData, room_number: e.target.value })
                }
                placeholder="Ex: R01"
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
              {isSubmitting ? 'Création...' : 'Créer la classe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
