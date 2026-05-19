'use client'

import { useCallback, useEffect, useState } from 'react'
import { AlertTriangle, CheckCircle, User, X } from 'lucide-react'
import type { Student } from '@/server/data/students/mocks'
import { findSimilarStudentsFn } from '@/server/api/students'

interface HomonymDetectionProps {
  firstName: string
  lastName: string
  onSimilarFound?: (similar: boolean) => void
  onProceedAnyway?: () => void
}

export function HomonymDetection({
  firstName,
  lastName,
  onSimilarFound,
  onProceedAnyway,
}: HomonymDetectionProps) {
  const [similarStudents, setSimilarStudents] = useState<Array<Student>>([])
  const [isChecking, setIsChecking] = useState(false)
  const [hasChecked, setHasChecked] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  const checkSimilarNames = useCallback(async () => {
    if (!firstName.trim() && !lastName.trim()) {
      setSimilarStudents([])
      setHasChecked(false)
      return
    }

    setIsChecking(true)
    try {
      const result = await findSimilarStudentsFn({
        data: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          currentYear: '2024-2025',
        },
      })
      setSimilarStudents(result)
      setHasChecked(true)
      onSimilarFound?.(result.length > 0)
    } catch {
      setSimilarStudents([])
      setHasChecked(true)
    } finally {
      setIsChecking(false)
    }
  }, [firstName, lastName, onSimilarFound])

  useEffect(() => {
    const timer = setTimeout(() => {
      if ((firstName || lastName) && !dismissed) {
        checkSimilarNames()
      }
    }, 800)
    return () => clearTimeout(timer)
  }, [firstName, lastName, checkSimilarNames, dismissed])

  const handleDismiss = () => {
    setDismissed(true)
    onSimilarFound?.(false)
  }

  if (isChecking) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span>Vérification des noms similaires...</span>
      </div>
    )
  }

  if (!hasChecked || similarStudents.length === 0 || dismissed) {
    return null
  }

  return (
    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 animate-fade-in">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="font-medium text-amber-900 dark:text-amber-100">
            {similarStudents.length === 1
              ? '1 élève avec un nom similaire trouvé'
              : `${similarStudents.length} élèves avec des noms similaires trouvés`}
          </p>
          <p className="text-sm text-amber-700 dark:text-amber-200 mt-1">
            Vérifiez que ce n&apos;est pas un doublon :
          </p>

          <div className="mt-3 space-y-2">
            {similarStudents.map((student) => (
              <div
                key={student.id}
                className="flex items-center gap-3 bg-white dark:bg-amber-900/20 rounded-lg p-2.5 border border-amber-100 dark:border-amber-800"
              >
                <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-800 flex items-center justify-center">
                  <User className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-amber-900 dark:text-amber-100 text-sm">
                    {student.first_name} {student.last_name}
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 truncate">
                    {student.matricule} • {student.class_name}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleDismiss}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-amber-700 dark:text-amber-200 bg-amber-100 dark:bg-amber-800/30 hover:bg-amber-200 dark:hover:bg-amber-800/50 rounded-md transition-colors"
            >
              <CheckCircle className="w-4 h-4" />
              C&apos;est un élève différent
            </button>
            {onProceedAnyway && (
              <button
                onClick={onProceedAnyway}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-amber-700 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-800/30 rounded-md transition-colors"
              >
                <X className="w-4 h-4" />
                Ignorer
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
