'use client'

import { useEffect, useState } from 'react'
import { BookOpen, Calendar, Save, Users, X } from 'lucide-react'

interface BulkCreateSubjectsModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (subjects: Array<BulkSubjectData>) => void
  assessmentId: string
  isLoading?: boolean
}

export interface BulkSubjectData {
  school_year_level_subject_id: string
  classroom_id: string
  teacher_assignment_id: string
  name: string
  exam_date: string
  max_score: number
  coefficient: number
}

const SUBJECTS = [
  { id: 'syls-1', name: 'Mathématiques', coefficient: 3 },
  { id: 'syls-2', name: 'Français', coefficient: 3 },
  { id: 'syls-3', name: 'Anglais', coefficient: 2 },
  { id: 'syls-4', name: 'Histoire-Géo', coefficient: 2 },
  { id: 'syls-5', name: 'Sciences', coefficient: 2 },
  { id: 'syls-6', name: 'Éducation Physique', coefficient: 1 },
]

const CLASSES = [
  {
    id: 'c1',
    name: '6ème A',
    subject_teacher_ids: {
      'syls-1': 'ta-1',
      'syls-2': 'ta-2',
      'syls-3': 'ta-3',
      'syls-4': 'ta-4',
      'syls-5': 'ta-5',
      'syls-6': 'ta-6',
    },
  },
  {
    id: 'c2',
    name: '6ème B',
    subject_teacher_ids: {
      'syls-1': 'ta-7',
      'syls-2': 'ta-8',
      'syls-3': 'ta-9',
      'syls-4': 'ta-10',
      'syls-5': 'ta-11',
      'syls-6': 'ta-12',
    },
  },
  {
    id: 'c3',
    name: '5ème A',
    subject_teacher_ids: {
      'syls-1': 'ta-13',
      'syls-2': 'ta-14',
      'syls-3': 'ta-15',
      'syls-4': 'ta-16',
      'syls-5': 'ta-17',
      'syls-6': 'ta-18',
    },
  },
  {
    id: 'c4',
    name: '5ème B',
    subject_teacher_ids: {
      'syls-1': 'ta-19',
      'syls-2': 'ta-20',
      'syls-3': 'ta-21',
      'syls-4': 'ta-22',
      'syls-5': 'ta-23',
      'syls-6': 'ta-24',
    },
  },
]

export function BulkCreateSubjectsModal({
  isOpen,
  onClose,
  onSubmit,
  assessmentId,
  isLoading,
}: BulkCreateSubjectsModalProps) {
  const [selectedClasses, setSelectedClasses] = useState<Array<string>>([])
  const [selectedSubjects, setSelectedSubjects] = useState<Array<string>>([])
  const [examDate, setExamDate] = useState('')
  const [defaultMaxScore, setDefaultMaxScore] = useState(20)
  const [errors, setErrors] = useState<Array<string>>([])

  useEffect(() => {
    if (isOpen) {
      setSelectedClasses([])
      setSelectedSubjects([])
      setExamDate('')
      setDefaultMaxScore(20)
      setErrors([])
    }
  }, [isOpen])

  const toggleClass = (classId: string) => {
    setSelectedClasses((prev) =>
      prev.includes(classId)
        ? prev.filter((id) => id !== classId)
        : [...prev, classId],
    )
  }

  const toggleSubject = (subjectId: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId],
    )
  }

  const selectAllClasses = () => {
    if (selectedClasses.length === CLASSES.length) {
      setSelectedClasses([])
    } else {
      setSelectedClasses(CLASSES.map((c) => c.id))
    }
  }

  const selectAllSubjects = () => {
    if (selectedSubjects.length === SUBJECTS.length) {
      setSelectedSubjects([])
    } else {
      setSelectedSubjects(SUBJECTS.map((s) => s.id))
    }
  }

  const validate = (): boolean => {
    const newErrors: Array<string> = []
    if (selectedClasses.length === 0) {
      newErrors.push('Veuillez sélectionner au moins une classe')
    }
    if (selectedSubjects.length === 0) {
      newErrors.push('Veuillez sélectionner au moins une matière')
    }
    if (!examDate) {
      newErrors.push("Veuillez sélectionner une date d'examen")
    }
    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return

    const subjects: Array<BulkSubjectData> = []

    for (const classId of selectedClasses) {
      const classe = CLASSES.find((c) => c.id === classId)
      if (!classe) continue

      for (const subjectId of selectedSubjects) {
        const subject = SUBJECTS.find((s) => s.id === subjectId)
        if (!subject) continue

        const teacherId =
          classe.subject_teacher_ids[
            subjectId as keyof typeof classe.subject_teacher_ids
          ]

        subjects.push({
          school_year_level_subject_id: subjectId,
          classroom_id: classId,
          teacher_assignment_id: teacherId || '',
          name: `${subject.name} - ${classe.name}`,
          exam_date: examDate,
          max_score: defaultMaxScore,
          coefficient: subject.coefficient,
        })
      }
    }

    onSubmit(subjects)
  }

  const totalCombinations = selectedClasses.length * selectedSubjects.length

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-card border border-border rounded-xl shadow-xl animate-fade-in-up max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <BookOpen className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-foreground">
              Créer plusieurs épreuves
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {errors.length > 0 && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, idx) => (
                  <li
                    key={idx}
                    className="text-sm text-red-600 dark:text-red-400"
                  >
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground flex items-center gap-1">
                  <Users className="w-4 h-4" /> Classes
                </label>
                <button
                  onClick={selectAllClasses}
                  className="text-xs text-primary hover:underline"
                >
                  {selectedClasses.length === CLASSES.length
                    ? 'Tout désélectionner'
                    : 'Tout sélectionner'}
                </button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto border border-border rounded-lg p-3 bg-muted/20">
                {CLASSES.map((classe) => (
                  <label
                    key={classe.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedClasses.includes(classe.id)}
                      onChange={() => toggleClass(classe.id)}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium">{classe.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground flex items-center gap-1">
                  <BookOpen className="w-4 h-4" /> Matières
                </label>
                <button
                  onClick={selectAllSubjects}
                  className="text-xs text-primary hover:underline"
                >
                  {selectedSubjects.length === SUBJECTS.length
                    ? 'Tout désélectionner'
                    : 'Tout sélectionner'}
                </button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto border border-border rounded-lg p-3 bg-muted/20">
                {SUBJECTS.map((subject) => (
                  <label
                    key={subject.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSubjects.includes(subject.id)}
                      onChange={() => toggleSubject(subject.id)}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium">{subject.name}</span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      Coef: {subject.coefficient}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-1">
                <Calendar className="w-4 h-4" /> Date d&apos;examen
              </label>
              <input
                type="date"
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full bg-input border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Note maximale (par défaut)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={defaultMaxScore}
                onChange={(e) =>
                  setDefaultMaxScore(parseInt(e.target.value) || 20)
                }
                className="w-full bg-input border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          {totalCombinations > 0 && (
            <div className="bg-muted/30 rounded-lg p-4 border border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  Prévisualisation
                </span>
                <span className="text-lg font-bold text-primary">
                  {totalCombinations} épreuve{totalCombinations > 1 ? 's' : ''}{' '}
                  à créer
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {selectedClasses.length} classe
                {selectedClasses.length > 1 ? 's' : ''} ×{' '}
                {selectedSubjects.length} matière
                {selectedSubjects.length > 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-border flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-muted rounded-lg hover:bg-muted/80 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || totalCombinations === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Créer {totalCombinations} épreuves
          </button>
        </div>
      </div>
    </div>
  )
}
