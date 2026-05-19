import { useState } from 'react'
import { UserPlus, X } from 'lucide-react'
import { useRouter } from '@tanstack/react-router'

interface CreateParentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (parent: unknown) => void
}

export function CreateParentModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateParentModalProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
  })

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // For now, we'll just show a success message since there's no create parent API
      // In production, you'd call a createParentFn here
      console.log('Creating parent:', formData)
      onSuccess?.(formData)
      onClose()
      setFormData({ full_name: '', email: '', phone: '', address: '' })
      router.invalidate()
    } catch (error) {
      console.error('Failed to create parent:', error)
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
            <UserPlus className="w-5 h-5 text-primary-foreground" />
            <h2 className="text-white font-bold text-lg">
              Nouveau Parent / Tuteur
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
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Nom complet <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
              placeholder="Ex: Jean Dupont"
              className="w-full bg-input border-none rounded-lg py-2.5 px-4 text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Ex: parent@email.com"
              className="w-full bg-input border-none rounded-lg py-2.5 px-4 text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Téléphone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="Ex: +243 999 000 000"
              className="w-full bg-input border-none rounded-lg py-2.5 px-4 text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              Adresse
            </label>
            <textarea
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="Adresse complète..."
              rows={2}
              className="w-full bg-input border-none rounded-lg py-2.5 px-4 text-foreground focus:ring-2 focus:ring-ring focus:outline-none resize-none"
            />
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
              disabled={isSubmitting || !formData.full_name}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Création...' : 'Créer le parent'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
