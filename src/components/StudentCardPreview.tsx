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
  const qrData = JSON.stringify({
    id: student.id,
    matricule: student.annual_identifier,
    name: student.full_name,
    class: student.class_name,
  })

  return (
    <div
      className="relative overflow-hidden rounded-xl shadow-lg bg-white border border-border"
      style={{ aspectRatio: '85.6 / 54' }}
    >
      {/* Left accent bar */}
      <div className="absolute top-0 left-0 bottom-0 w-[5px] bg-gradient-to-b from-primary via-primary/80 to-primary/60" />

      {/* Subtle watermark pattern */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 12px,
            oklch(0.42 0.16 264) 12px,
            oklch(0.42 0.16 264) 13px
          )`,
        }}
      />

      {/* Top edge accent */}
      <div className="absolute top-0 left-[5px] right-0 h-[2px] bg-gradient-to-r from-primary/40 via-primary/20 to-transparent" />

      {/* Card content */}
      <div className="relative h-full flex flex-col p-3 pl-[10px]">
        {/* Header: School name */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <CreditCard className="w-3 h-3 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-[7px] font-bold text-primary uppercase tracking-[0.15em] leading-none truncate">
              École d&apos;Excellence
            </p>
            <p className="text-[5px] text-muted-foreground uppercase tracking-wider leading-none mt-0.5">
              Carte d&apos;identité scolaire
            </p>
          </div>
          <div className="ml-auto text-right flex-shrink-0">
            <p className="text-[5px] text-muted-foreground uppercase tracking-wide">
              Année
            </p>
            <p className="text-[6px] font-semibold text-foreground">
              {student.academic_year}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-primary/20 via-border to-transparent mb-1.5" />

        {/* Main body: Photo + Info + QR */}
        <div className="flex gap-2 flex-1 min-h-0">
          {/* Photo */}
          <div className="flex-shrink-0 flex flex-col items-center gap-1">
            <div className="w-14 h-[68px] rounded-md overflow-hidden border border-border bg-muted shadow-sm">
              <img
                src={photoUrl}
                alt={student.full_name}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            </div>
          </div>

          {/* Student Info */}
          <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
            <div>
              <p className="text-[9px] font-bold text-foreground leading-tight truncate">
                {student.last_name.toUpperCase()}
              </p>
              <p className="text-[8px] font-medium text-muted-foreground leading-tight truncate">
                {student.first_name}
              </p>
            </div>

            <div className="space-y-[1px] mt-0.5">
              <InfoRow label="Matricule" value={student.annual_identifier} />
              <InfoRow label="Classe" value={student.class_name} />
              <InfoRow label="Niveau" value={student.level} />
              <InfoRow
                label="Né(e) le"
                value={new Date(student.date_of_birth).toLocaleDateString(
                  'fr-FR',
                )}
              />
              <InfoRow
                label="Genre"
                value={student.gender === 'M' ? 'Masculin' : 'Féminin'}
              />
            </div>
          </div>

          {/* QR Code */}
          <div className="flex-shrink-0 flex flex-col items-center justify-center">
            <div className="bg-white rounded border border-border/50 p-[3px] shadow-sm">
              <QRCodeSVG value={qrData} size={40} level="L" />
            </div>
            <p className="text-[4px] text-muted-foreground/60 uppercase tracking-[0.1em] mt-0.5">
              Scan
            </p>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mt-1.5 -mx-3 -mb-3 px-3 py-[5px] bg-primary/5 border-t border-primary/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-[18px] h-[12px] rounded-[2px] bg-gradient-to-br from-primary/40 to-primary/20 border border-primary/30 flex items-center justify-center">
                <span className="text-[5px] font-bold text-primary/60">GE</span>
              </div>
              <p className="text-[5px] font-medium text-muted-foreground/70 uppercase tracking-[0.15em]">
                République de Guinée
              </p>
            </div>
            <p className="text-[6px] font-mono font-semibold text-primary/70 tracking-wider">
              {student.annual_identifier}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-1 items-baseline">
      <span className="text-[5px] text-muted-foreground/60 uppercase tracking-wide flex-shrink-0 w-10">
        {label}
      </span>
      <span className="text-[6px] font-semibold text-foreground truncate">
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
    const unique = [...new Set(students.map((s) => s.class_name).filter(Boolean))]
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
