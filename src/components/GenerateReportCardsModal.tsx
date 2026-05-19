import { useState } from 'react'
import { FileText, AlertCircle, X, CheckCircle2 } from 'lucide-react'
import { useRouter } from '@tanstack/react-router'

interface GenerateReportCardsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function GenerateReportCardsModal({
  isOpen,
  onClose,
}: GenerateReportCardsModalProps) {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [formData, setFormData] = useState({
    termId: '',
    classroomId: '',
  })

  if (!isOpen) return null

  // Mocks for options
  const terms = [
    { id: 'term-1', name: 'Trimestre 1' },
    { id: 'term-2', name: 'Trimestre 2' },
    { id: 'term-3', name: 'Trimestre 3' },
  ]
  const classrooms = [
    { id: 'cls-1', name: '6ème A' },
    { id: 'cls-2', name: '6ème B' },
    { id: 'cls-3', name: '5ème A' },
  ]

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.termId || !formData.classroomId) {
      setError('Veuillez sélectionner un trimestre et une classe.')
      return
    }

    setError(null)
    setIsGenerating(true)

    // Simulate API call and prerequisite check
    setTimeout(() => {
      setIsGenerating(false)
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        onClose()
        router.invalidate()
      }, 2000)
    }, 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-background rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-primary px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-primary-foreground" />
            <h2 className="text-white font-bold text-lg">Générer les Bulletins</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center flex flex-col items-center justify-center space-y-4">
             <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600 dark:text-green-400">
               <CheckCircle2 className="w-12 h-12" />
             </div>
             <h3 className="text-xl font-bold text-foreground">Génération Réussie</h3>
             <p className="text-muted-foreground">Les bulletins ont été générés avec succès pour la classe sélectionnée.</p>
          </div>
        ) : (
          <form onSubmit={handleGenerate} className="p-6 space-y-5">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg flex gap-3 text-sm">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <p className="text-blue-900 dark:text-blue-200">
                Assurez-vous que toutes les notes du trimestre sont <strong>saisies et validées</strong> avant de lancer la génération.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Trimestre <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.termId}
                onChange={(e) => setFormData({ ...formData, termId: e.target.value })}
                className="w-full bg-input border-none rounded-lg py-2.5 px-4 text-foreground focus:ring-2 focus:ring-primary/50 focus:outline-none"
                required
              >
                <option value="" disabled>Sélectionner un trimestre</option>
                {terms.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Classe ciblée <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.classroomId}
                onChange={(e) => setFormData({ ...formData, classroomId: e.target.value })}
                className="w-full bg-input border-none rounded-lg py-2.5 px-4 text-foreground focus:ring-2 focus:ring-primary/50 focus:outline-none"
                required
              >
                <option value="" disabled>Sélectionner une classe</option>
                <option value="ALL">Toutes les classes</option>
                {classrooms.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                disabled={isGenerating}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isGenerating}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                    Génération...
                  </>
                ) : (
                  'Lancer la génération'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
