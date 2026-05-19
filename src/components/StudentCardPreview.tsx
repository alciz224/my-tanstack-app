import { Download, Printer, X } from 'lucide-react'
import type { EnrollmentStatus, Student } from '@/server/data/students/mocks'
import { generateStudentAvatar, getInitials } from '@/lib/utils'

interface StudentCardPreviewProps {
  student: Student
  onClose: () => void
}

const STATUS_STYLES: Record<EnrollmentStatus, { bg: string; label: string }> = {
  PRE_REGISTERED: { bg: 'bg-yellow-500', label: 'Pré-inscrit' },
  ACTIVE: { bg: 'bg-green-500', label: 'Actif' },
  COMPLETED: { bg: 'bg-blue-500', label: 'Terminé' },
  DROPPED: { bg: 'bg-gray-400', label: 'Abandonné' },
}

export function StudentCardPreview({
  student,
  onClose,
}: StudentCardPreviewProps) {
  const photoUrl =
    student.photo_url ||
    generateStudentAvatar(student.first_name, student.last_name, student.gender)
  const status = STATUS_STYLES[student.enrollment_status]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-background rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="bg-primary px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-white font-bold text-lg">Carte d&apos;élève</h2>
            <p className="text-primary-foreground/80 text-sm">
              Année scolaire {student.academic_year}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Content */}
        <div className="p-6">
          <div className="flex items-start gap-6">
            {/* Photo */}
            <div className="relative">
              <div className="w-28 h-32 rounded-lg overflow-hidden bg-muted border-2 border-primary/20">
                <img
                  src={photoUrl}
                  alt={`${student.first_name} ${student.last_name}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full ${status.bg} border-2 border-white`}
              />
            </div>

            {/* Student Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-foreground truncate">
                {student.first_name} {student.last_name}
              </h3>
              <p className="text-sm text-muted-foreground font-medium">
                {student.gender === 'M' ? 'Garçon' : 'Fille'}
              </p>
              <div className="mt-3 space-y-1.5 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Matricule:</span>
                  <span className="font-mono font-semibold text-foreground">
                    {student.annual_identifier}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Classe:</span>
                  <span className="font-semibold text-foreground">
                    {student.class_name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Niveau:</span>
                  <span className="text-foreground">{student.level}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-4 border-t border-border space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Date de naissance:</span>
              <span className="text-foreground">
                {new Date(student.date_of_birth).toLocaleDateString('fr-FR')}
              </span>
            </div>
            {student.parent_name && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Parent/Tuteur:</span>
                <span className="text-foreground truncate max-w-[150px]">
                  {student.parent_name}
                </span>
              </div>
            )}
            {student.address && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Adresse:</span>
                <span className="text-foreground truncate max-w-[150px]">
                  {student.address}
                </span>
              </div>
            )}
          </div>

          {/* Status Badge */}
          <div className="mt-4 flex items-center justify-center">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${status.bg}`}
            >
              {status.label}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-muted/30 flex items-center justify-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            <Download className="w-4 h-4" />
            <span>Télécharger</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors">
            <Printer className="w-4 h-4" />
            <span>Imprimer</span>
          </button>
        </div>
      </div>
    </div>
  )
}

// Avatar component for list views
export function StudentAvatar({
  student,
  size = 'md',
}: {
  student: Student
  size?: 'sm' | 'md' | 'lg'
}) {
  const photoUrl =
    student.photo_url ||
    generateStudentAvatar(student.first_name, student.last_name, student.gender)

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-lg',
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full overflow-hidden bg-primary/10 flex items-center justify-center text-primary font-semibold`}
    >
      {student.photo_url ? (
        <img
          src={photoUrl}
          alt={student.full_name}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{getInitials(student.first_name, student.last_name)}</span>
      )}
    </div>
  )
}
