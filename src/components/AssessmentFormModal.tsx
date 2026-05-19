'use client'

import { useEffect, useState } from 'react'
import { Calendar, FileText, Save, X } from 'lucide-react'
import type { Assessment } from '@/server/data/assessments/types'

interface AssessmentFormModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: AssessmentFormData) => void
  assessment?: Assessment
  isLoading?: boolean
}

export interface AssessmentFormData {
  name: string
  school_year_cycle_id: string
  school_year_cycle_term_id: string
  assessment_type_id: string
  start_date: string
  end_date: string
}

const ASSESSMENT_TYPES = [
  { id: 'type-1', name: 'Interrogation' },
  { id: 'type-2', name: 'Examen' },
  { id: 'type-3', name: 'Devoir Maison' },
  { id: 'type-4', name: 'Projet' },
  { id: 'type-5', name: 'Composition' },
]

const CYCLES = [
  { id: 'syc-1', name: 'Primaire' },
  { id: 'syc-2', name: 'Secondaire' },
]

const TERMS = [
  { id: 'term-1', name: 'Trimestre 1', cycle_id: 'syc-1' },
  { id: 'term-2', name: 'Trimestre 2', cycle_id: 'syc-1' },
  { id: 'term-3', name: 'Trimestre 3', cycle_id: 'syc-1' },
  { id: 'term-4', name: 'Trimestre 1', cycle_id: 'syc-2' },
  { id: 'term-5', name: 'Trimestre 2', cycle_id: 'syc-2' },
  { id: 'term-6', name: 'Trimestre 3', cycle_id: 'syc-2' },
]

export function AssessmentFormModal({
  isOpen,
  onClose,
  onSubmit,
  assessment,
  isLoading,
}: AssessmentFormModalProps) {
  const [formData, setFormData] = useState<AssessmentFormData>({
    name: '',
    school_year_cycle_id: 'syc-1',
    school_year_cycle_term_id: 'term-1',
    assessment_type_id: 'type-1',
    start_date: '',
    end_date: '',
  })

  const [errors, setErrors] = useState<
    Partial<Record<keyof AssessmentFormData, string>>
  >({})

  useEffect(() => {
    if (assessment) {
      setFormData({
        name: assessment.name,
        school_year_cycle_id: assessment.school_year_cycle_id,
        school_year_cycle_term_id: assessment.school_year_cycle_term_id,
        assessment_type_id: assessment.assessment_type_id,
        start_date: assessment.start_date,
        end_date: assessment.end_date,
      })
    } else {
      setFormData({
        name: '',
        school_year_cycle_id: 'syc-1',
        school_year_cycle_term_id: 'term-1',
        assessment_type_id: 'type-1',
        start_date: '',
        end_date: '',
      })
    }
    setErrors({})
  }, [assessment, isOpen])

  const filteredTerms = TERMS.filter(
    (t) => t.cycle_id === formData.school_year_cycle_id,
  )

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof AssessmentFormData, string>> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Le nom de l'évaluation est requis"
    }
    if (!formData.start_date) {
      newErrors.start_date = 'La date de début est requise'
    }
    if (!formData.end_date) {
      newErrors.end_date = 'La date de fin est requise'
    }
    if (
      formData.start_date &&
      formData.end_date &&
      new Date(formData.start_date) > new Date(formData.end_date)
    ) {
      newErrors.end_date = 'La date de fin doit être après la date de début'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      onSubmit(formData)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-card border border-border rounded-xl shadow-xl animate-fade-in-up">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-foreground">
              {assessment ? "Modifier l'évaluation" : 'Nouvelle évaluation'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Nom de l&apos;évaluation *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Ex: Interrogation de Mi-Trimestre 1"
              className={`w-full bg-input border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/50 ${errors.name ? 'ring-2 ring-red-500' : ''}`}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Cycle *
              </label>
              <select
                value={formData.school_year_cycle_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    school_year_cycle_id: e.target.value,
                    school_year_cycle_term_id:
                      TERMS.find((t) => t.cycle_id === e.target.value)?.id ||
                      '',
                  })
                }
                className="w-full bg-input border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/50"
              >
                {CYCLES.map((cycle) => (
                  <option key={cycle.id} value={cycle.id}>
                    {cycle.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Trimestre *
              </label>
              <select
                value={formData.school_year_cycle_term_id}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    school_year_cycle_term_id: e.target.value,
                  })
                }
                className="w-full bg-input border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/50"
              >
                {filteredTerms.map((term) => (
                  <option key={term.id} value={term.id}>
                    {term.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Type d&apos;évaluation *
            </label>
            <select
              value={formData.assessment_type_id}
              onChange={(e) =>
                setFormData({ ...formData, assessment_type_id: e.target.value })
              }
              className="w-full bg-input border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/50"
            >
              {ASSESSMENT_TYPES.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-1">
                <Calendar className="w-4 h-4" /> Date de début *
              </label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) =>
                  setFormData({ ...formData, start_date: e.target.value })
                }
                className={`w-full bg-input border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/50 ${errors.start_date ? 'ring-2 ring-red-500' : ''}`}
              />
              {errors.start_date && (
                <p className="text-xs text-red-500">{errors.start_date}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-1">
                <Calendar className="w-4 h-4" /> Date de fin *
              </label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) =>
                  setFormData({ ...formData, end_date: e.target.value })
                }
                className={`w-full bg-input border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/50 ${errors.end_date ? 'ring-2 ring-red-500' : ''}`}
              />
              {errors.end_date && (
                <p className="text-xs text-red-500">{errors.end_date}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {assessment ? 'Enregistrer' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
