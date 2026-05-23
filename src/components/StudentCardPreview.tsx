import { useState, useMemo } from 'react'
import { Download, Printer, X, ChevronDown, CreditCard } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import type { Student } from '@/server/data/students/mocks'

interface StudentCardPreviewProps {
  students: Array<Student>
  onClose: () => void
  initialClass?: string
}

// ── Realistic photo generation (no emoji) ─────────────────────────────────
function getStudentPhotoUrl(student: Student): string {
  if (student.photo_url) return student.photo_url
  // Use DiceBear "notionists" style for clean, professional-looking avatars
  const seed = `${student.first_name}-${student.last_name}-${student.id}`
  return `https://api.dicebear.com/9.x/notionists/svg?seed=${encodeURIComponent(seed)}&backgroundColor=e8e8e8&radius=0`
}

// ── Single ID Card ────────────────────────────────────────────────────────
function StudentIDCard({ student }: { student: Student }) {
  const photoUrl = getStudentPhotoUrl(student)

  // Use the verification URL for the QR code
  const verificationUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/verify-student/${student.id}`
      : `/verify-student/${student.id}`

  const qrData = verificationUrl

  return (
    <div
      className="relative overflow-hidden rounded-xl shadow-lg bg-white border border-gray-200"
      style={{ aspectRatio: '85.6 / 54' }}
    >
      {/* Blue header band */}
      <div className="absolute top-0 left-0 right-0 h-[30%] bg-gradient-to-br from-sky-900 via-blue-800 to-indigo-900">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent, transparent 8px, rgba(255,255,255,0.3) 8px, rgba(255,255,255,0.3) 9px)',
          }}
        />
        <div className="relative h-full flex flex-col justify-between px-4 pt-2.5 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-3 h-3 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-[8px] font-bold text-white uppercase tracking-[0.12em] leading-none truncate">
                École d&apos;Excellence
              </p>
              <p className="text-[5px] text-blue-200 uppercase tracking-wider leading-none mt-0.5">
                Carte d&apos;identité scolaire
              </p>
              <p className="text-[4px] text-blue-100/60 lowercase leading-none mt-1 truncate">
                contact@excellence.edu.gn
              </p>
            </div>
          </div>
          <div className="self-end">
            <p className="text-[5px] text-blue-200 uppercase tracking-wide">
              Année
            </p>
            <p className="text-[7px] font-bold text-white">
              {student.academic_year}
            </p>
          </div>
        </div>
      </div>

      {/* Shadow transition */}
      <div className="absolute top-[30%] left-0 right-0 h-3 bg-gradient-to-b from-blue-900/20 to-transparent z-10" />

      {/* Body */}
      <div className="absolute bottom-0 left-0 right-0 h-[70%] px-4 pt-2 pb-3 flex gap-2.5">
        {/* Photo */}
        <div className="-mt-6 flex-shrink-0 z-20">
          <div className="w-[64px] h-[78px] rounded-md overflow-hidden border-2 border-white shadow-md bg-gray-100">
            <img
              src={photoUrl}
              alt={student.full_name}
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 z-20">
          <p className="text-[9px] font-bold text-gray-900 leading-tight truncate">
            {student.last_name.toUpperCase()}
          </p>
          <p className="text-[7px] text-gray-600 leading-tight truncate">
            {student.first_name}
          </p>
          <div className="space-y-px mt-1">
            <InfoRow label="Matricule" value={student.annual_identifier} />
            <InfoRow label="Classe" value={student.class_name} />
            <InfoRow label="Niveau" value={student.level} />
            <InfoRow
              label="Né(e) le"
              value={new Date(student.date_of_birth).toLocaleDateString(
                'fr-FR',
              )}
            />
            <div className="my-0.5 border-t border-gray-100" />
            <InfoRow label="Tuteur" value={student.parent_phone || 'N/A'} />
            <InfoRow label="École Tél" value="+224 622 12 34 56" />
          </div>
        </div>

        {/* QR */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center z-20">
          <div className="bg-white rounded border border-gray-200/50 p-[2px] shadow-sm">
            <QRCodeSVG value={qrData} size={34} level="L" />
          </div>
          <p className="text-[4px] text-gray-400 uppercase tracking-[0.1em] mt-0.5">
            Scan
          </p>
        </div>
      </div>

      {/* Bottom strip */}
      <div className="absolute bottom-0 left-0 right-0 h-5 bg-gradient-to-r from-sky-900 via-blue-800 to-indigo-900 px-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-[10px] rounded-sm bg-white/15 border border-white/25 flex items-center justify-center">
            <span className="text-[4px] font-bold text-white/80">GE</span>
          </div>
          <span className="text-[4.5px] font-medium text-blue-200 uppercase tracking-[0.12em] leading-none">
            République de Guinée
          </span>
        </div>
        <span className="text-[5px] font-mono font-semibold text-white/70 tracking-wider">
          {student.annual_identifier}
        </span>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-1 items-baseline">
      <span className="text-[5px] text-gray-400 uppercase tracking-wide flex-shrink-0 w-10">
        {label}
      </span>
      <span className="text-[6px] font-semibold text-gray-900 truncate">
        {value}
      </span>
    </div>
  )
}

// ── Main Component: Grid of cards by class ────────────────────────────────
export function StudentCardPreview({
  students,
  onClose,
  initialClass,
}: StudentCardPreviewProps) {
  // Derive unique class names
  const classes = useMemo(() => {
    const unique = [
      ...new Set(students.map((s) => s.class_name).filter(Boolean)),
    ]
    return unique.sort()
  }, [students])

  const [selectedClass, setSelectedClass] = useState(
    initialClass || classes[0] || '',
  )
  const [classDropdownOpen, setClassDropdownOpen] = useState(false)

  // Filter students by selected class
  const filteredStudents = useMemo(() => {
    return students.filter((s) => s.class_name === selectedClass)
  }, [students, selectedClass])

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/60 backdrop-blur-sm">
      {/* Toolbar */}
      <div className="flex-shrink-0 bg-card border-b border-border px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">
              Cartes d&apos;identité scolaire
            </h2>
          </div>

          {/* Class selector */}
          <div className="relative">
            <button
              onClick={() => setClassDropdownOpen(!classDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg text-sm font-medium text-foreground hover:bg-muted/80 transition-colors"
            >
              <span>{selectedClass || 'Sélectionner une classe'}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${classDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {classDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setClassDropdownOpen(false)}
                />
                <div className="absolute top-full left-0 mt-1 z-20 w-48 bg-card border border-border rounded-lg shadow-lg py-1 max-h-60 overflow-y-auto">
                  {classes.map((cls) => (
                    <button
                      key={cls}
                      onClick={() => {
                        setSelectedClass(cls)
                        setClassDropdownOpen(false)
                      }}
                      className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                        cls === selectedClass
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      {cls}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <span className="text-sm text-muted-foreground">
            {filteredStudents.length} carte
            {filteredStudents.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            <Printer className="w-4 h-4" />
            Imprimer
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-muted text-foreground rounded-lg text-sm font-medium hover:bg-muted/80 transition-colors">
            <Download className="w-4 h-4" />
            PDF
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Cards grid - scrollable */}
      <div className="flex-1 overflow-y-auto p-6 bg-muted/30">
        {filteredStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <CreditCard className="w-16 h-16 mb-4 opacity-30" />
            <p className="text-lg font-medium">Aucun élève dans cette classe</p>
            <p className="text-sm">
              Sélectionnez une autre classe pour voir les cartes.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5 max-w-[1800px] mx-auto">
            {filteredStudents.map((student) => (
              <StudentIDCard key={student.id} student={student} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Avatar component for list views (unchanged)
export function StudentAvatar({
  student,
  size = 'md',
}: {
  student: Student
  size?: 'sm' | 'md' | 'lg'
}) {
  const photoUrl = getStudentPhotoUrl(student)

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-16 h-16 text-lg',
  }

  return (
    <div
      className={`${sizeClasses[size]} rounded-full overflow-hidden bg-primary/10 flex items-center justify-center text-primary font-semibold`}
    >
      <img
        src={photoUrl}
        alt={student.full_name}
        className="w-full h-full object-cover"
      />
    </div>
  )
}
