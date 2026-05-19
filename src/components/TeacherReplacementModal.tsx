'use client'

import { useEffect, useState } from 'react'
import { ArrowRightLeft, Calendar, Search, X } from 'lucide-react'

interface TeacherReplacementModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (replacementData: ReplacementData) => void
  currentTeacherName: string
  assignmentSubject: string
  assignmentClassroom: string
  isLoading?: boolean
}

export interface ReplacementData {
  replacement_teacher_id: string
  effective_date: string
  reason: string
}

const AVAILABLE_TEACHERS = [
  {
    id: 't-101',
    name: 'M. Mohamed Diallo',
    subject: 'Mathématiques',
    status: 'available',
  },
  {
    id: 't-102',
    name: 'Mme Fatou Bâ',
    subject: 'Français',
    status: 'available',
  },
  {
    id: 't-103',
    name: 'M. Alpha Condé',
    subject: 'Anglais',
    status: 'available',
  },
  { id: 't-104', name: 'Mme Aïcha Touré', subject: 'Sciences', status: 'busy' },
  {
    id: 't-105',
    name: 'M. Ousmane Baldé',
    subject: 'Histoire-Géo',
    status: 'available',
  },
]

export function TeacherReplacementModal({
  isOpen,
  onClose,
  onSubmit,
  currentTeacherName,
  assignmentSubject,
  assignmentClassroom,
  isLoading,
}: TeacherReplacementModalProps) {
  const [selectedTeacher, setSelectedTeacher] = useState('')
  const [effectiveDate, setEffectiveDate] = useState('')
  const [reason, setReason] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (isOpen) {
      setSelectedTeacher('')
      setEffectiveDate('')
      setReason('')
      setSearchQuery('')
    }
  }, [isOpen])

  const filteredTeachers = AVAILABLE_TEACHERS.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      t.status === 'available',
  )

  const handleSubmit = () => {
    if (!selectedTeacher || !effectiveDate || !reason) return
    onSubmit({
      replacement_teacher_id: selectedTeacher,
      effective_date: effectiveDate,
      reason,
    })
  }

  const isValid = selectedTeacher && effectiveDate && reason

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-card border border-border rounded-xl shadow-xl animate-fade-in-up max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-600">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Remplacer l&apos;enseignant
              </h2>
              <p className="text-sm text-muted-foreground">
                Sélectionnez un remplaçant
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="bg-muted/30 rounded-lg p-4 border border-border">
            <p className="text-sm text-muted-foreground mb-2">
              Remplacement pour
            </p>
            <p className="font-medium text-foreground">{currentTeacherName}</p>
            <p className="text-sm text-muted-foreground">
              {assignmentSubject} - {assignmentClassroom}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Rechercher un remplaçant
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Rechercher par nom..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-input border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Enseignants disponibles
            </label>
            <div className="border border-border rounded-lg divide-y max-h-40 overflow-y-auto">
              {filteredTeachers.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground text-center">
                  Aucun enseignant disponible
                </p>
              ) : (
                filteredTeachers.map((teacher) => (
                  <label
                    key={teacher.id}
                    className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-muted/50 transition-colors ${
                      selectedTeacher === teacher.id ? 'bg-primary/10' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="replacement"
                      value={teacher.id}
                      checked={selectedTeacher === teacher.id}
                      onChange={() => setSelectedTeacher(teacher.id)}
                      className="w-4 h-4 text-primary focus:ring-primary"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">
                        {teacher.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {teacher.subject}
                      </p>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-1">
              <Calendar className="w-4 h-4" /> Date de début du remplacement
            </label>
            <input
              type="date"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              className="w-full bg-input border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Motif du remplacement
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-input border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/50"
            >
              <option value="">Sélectionner un motif...</option>
              <option value="maladie">Maladie</option>
              <option value="conge">Congé</option>
              <option value="formation">Formation</option>
              <option value="mutation">Mutation</option>
              <option value="autre">Autre</option>
            </select>
          </div>
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
            disabled={!isValid || isLoading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <ArrowRightLeft className="w-4 h-4" />
            )}
            Confirmer le remplacement
          </button>
        </div>
      </div>
    </div>
  )
}
