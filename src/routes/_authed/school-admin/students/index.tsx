import { Link, createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import {
  Calendar,
  CreditCard,
  Edit,
  Eye,
  Filter,
  GraduationCap,
  LayoutGrid,
  List,
  Loader2,
  MoreVertical,
  Phone,
  Plus,
  Search,
  Trash2,
  UserCircle,
  X,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import type { EnrollmentStatus, Student } from '@/server/data/students/mocks'
import { getStudentsFn } from '@/server/api/students'
import {
  ACADEMIC_YEARS,
  CYCLES,
  LEVELS_BY_CYCLE,
  MOCK_STUDENTS,
  OPTIONS_BY_CYCLE,
} from '@/server/data/students/mocks'
import { StudentCardPreview } from '@/components/StudentCardPreview'
import { generateStudentAvatar } from '@/lib/utils'

export const Route = createFileRoute('/_authed/school-admin/students/')({
  component: StudentsPage,
})

// ── Status config ─────────────────────────────────────────────────────────
const STATUS_STYLES: Record<
  EnrollmentStatus,
  { bg: string; label: string; dot: string }
> = {
  PRE_REGISTERED: {
    bg: 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400',
    label: 'Pré-inscrit',
    dot: 'bg-yellow-500',
  },
  ACTIVE: {
    bg: 'bg-success/15 text-success',
    label: 'Actif',
    dot: 'bg-success',
  },
  COMPLETED: {
    bg: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
    label: 'Terminé',
    dot: 'bg-blue-500',
  },
  DROPPED: {
    bg: 'bg-muted text-muted-foreground',
    label: 'Abandonné',
    dot: 'bg-muted-foreground',
  },
}

function StatusBadge({ status }: { status: EnrollmentStatus }) {
  const s = STATUS_STYLES[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide ${s.bg}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  )
}

function GenderBadge({ gender }: { gender: 'M' | 'F' }) {
  return (
    <span
      className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
        gender === 'M'
          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
          : 'bg-pink-500/10 text-pink-600 dark:text-pink-400'
      }`}
    >
      {gender === 'M' ? 'Garçon' : 'Fille'}
    </span>
  )
}

function StudentAvatar({
  student,
  size = 'md',
}: {
  student: Student
  size?: 'sm' | 'md' | 'lg'
}) {
  const sizes = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-14 h-14 text-lg',
    lg: 'w-20 h-20 text-2xl',
  }

  const avatarUrl =
    student.photo_url ||
    generateStudentAvatar(student.first_name, student.last_name, student.gender)

  return (
    <img
      src={avatarUrl}
      alt={student.full_name}
      className={`${sizes[size]} rounded-full object-cover border-2 border-border shadow-md flex-shrink-0`}
    />
  )
}

function ActionMenu({ student: _student }: { student: Student }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
      >
        <MoreVertical className="w-5 h-5" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-20 w-44 bg-card border border-border rounded-lg shadow-lg py-1 animate-scale-in">
            <Link
              to="/school-admin/students/$studentId"
              params={{ studentId: _student.id }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
            >
              <Eye className="w-4 h-4" /> Voir le profil
            </Link>
            <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
              <Edit className="w-4 h-4" /> Modifier
            </button>
            <hr className="my-1 border-border" />
            <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors">
              <Trash2 className="w-4 h-4" /> Supprimer
            </button>
          </div>
        </>
      )}
    </div>
  )
}

function StudentCard({ student }: { student: Student }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-300 group flex flex-col gap-3">
      <div className="flex items-start justify-between">
        <StudentAvatar student={student} size="lg" />
        <ActionMenu student={student} />
      </div>
      <div>
        <Link
          to="/school-admin/students/$studentId"
          params={{ studentId: student.id }}
          className="font-bold text-foreground text-base hover:text-primary transition-colors leading-tight"
        >
          {student.full_name}
        </Link>
        <p className="text-xs text-muted-foreground font-mono mt-0.5">
          {student.annual_identifier}
        </p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <GenderBadge gender={student.gender} />
        <StatusBadge status={student.enrollment_status} />
      </div>
      <div className="pt-2 border-t border-border/50 space-y-1.5 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <GraduationCap className="w-4 h-4 flex-shrink-0 text-primary/60" />
          <span className="font-medium text-foreground">
            {student.class_name}
          </span>
          <span className="text-xs">· {student.cycle}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Filter className="w-4 h-4 flex-shrink-0 text-primary/60" />
          <span>{student.option}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="w-4 h-4 flex-shrink-0" />
          <span>
            {new Date(student.date_of_birth).toLocaleDateString('fr-FR')}
          </span>
        </div>
        {student.parent_name && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <UserCircle className="w-4 h-4 flex-shrink-0" />
            <span className="truncate">{student.parent_name}</span>
          </div>
        )}
        {student.parent_phone && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="w-4 h-4 flex-shrink-0" />
            <span>{student.parent_phone}</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Filter select helper ──────────────────────────────────────────────────
function FilterSelect({
  value,
  onChange,
  placeholder,
  options,
  icon: Icon,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  options: Array<string>
  icon?: React.ComponentType<{ className?: string }>
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-input border-none rounded-lg py-2.5 pl-4 pr-9 text-sm text-foreground font-medium focus:ring-2 focus:ring-ring focus:outline-none cursor-pointer h-full"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      {Icon && (
        <Icon className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      )}
    </div>
  )
}

// ── Active filter pill ────────────────────────────────────────────────────
function FilterPill({
  label,
  onRemove,
}: {
  label: string
  onRemove: () => void
}) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
      {label}
      <button onClick={onRemove} className="hover:opacity-70">
        <X className="w-3 h-3" />
      </button>
    </span>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────
function StudentsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  // Filters
  const [search, setSearch] = useState('')
  const [academicYear, setAcademicYear] = useState('')
  const [cycle, setCycle] = useState('')
  const [option, setOption] = useState('')
  const [level, setLevel] = useState('')
  const [classFilter, setClassFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [genderFilter, setGenderFilter] = useState('')

  // Student card preview
  const [showCardPreview, setShowCardPreview] = useState(false)

  // Cascade reset: when cycle changes, reset dependent filters
  const handleCycleChange = (v: string) => {
    setCycle(v)
    setOption('')
    setLevel('')
    setClassFilter('')
  }
  const handleOptionChange = (v: string) => {
    setOption(v)
    setLevel('')
    setClassFilter('')
  }
  const handleLevelChange = (v: string) => {
    setLevel(v)
    setClassFilter('')
  }

  // Derived option/level choices
  const optionChoices = cycle
    ? (OPTIONS_BY_CYCLE[cycle] ?? [])
    : Object.values(OPTIONS_BY_CYCLE).flat()
  const levelChoices = cycle
    ? (LEVELS_BY_CYCLE[cycle] ?? [])
    : Object.values(LEVELS_BY_CYCLE).flat()

  // Server function — filters applied server-side by adapter
  const getStudents = useServerFn(getStudentsFn)
  const { data: students = [], isLoading } = useQuery({
    queryKey: [
      'school-admin',
      'students',
      {
        academicYear,
        cycle,
        option,
        level,
        classFilter,
        statusFilter,
        genderFilter,
        search,
      },
    ],
    queryFn: () =>
      getStudents({
        data: {
          search: search || undefined,
          academic_year: academicYear || undefined,
          cycle: cycle || undefined,
          option: option || undefined,
          level: level || undefined,
          class_name: classFilter || undefined,
          status: statusFilter || undefined,
          gender: genderFilter || undefined,
        },
      }),
  })

  // Derive unique class names from all mock data filtered by current cycle/level
  const allClasses = useMemo(() => {
    return [
      ...new Set(
        MOCK_STUDENTS.filter(
          (s) => (!cycle || s.cycle === cycle) && (!level || s.level === level),
        ).map((s) => s.class_name),
      ),
    ].sort()
  }, [cycle, level])

  // Active filter pills
  const activePills = [
    academicYear && {
      label: `Année: ${academicYear}`,
      clear: () => setAcademicYear(''),
    },
    cycle && {
      label: `Cycle: ${cycle}`,
      clear: handleCycleChange.bind(null, ''),
    },
    option && { label: `Option: ${option}`, clear: () => setOption('') },
    level && {
      label: `Niveau: ${level}`,
      clear: handleLevelChange.bind(null, ''),
    },
    classFilter && {
      label: `Classe: ${classFilter}`,
      clear: () => setClassFilter(''),
    },
    statusFilter && {
      label:
        STATUS_STYLES[statusFilter as EnrollmentStatus]?.label ?? statusFilter,
      clear: () => setStatusFilter(''),
    },
    genderFilter && {
      label: genderFilter === 'M' ? 'Garçons' : 'Filles',
      clear: () => setGenderFilter(''),
    },
  ].filter(Boolean) as Array<{ label: string; clear: () => void }>

  const clearAll = () => {
    setSearch('')
    setAcademicYear('')
    setCycle('')
    setOption('')
    setLevel('')
    setClassFilter('')
    setStatusFilter('')
    setGenderFilter('')
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Gestion des Élèves
          </h1>
          <p className="text-muted-foreground mt-1">
            {isLoading
              ? 'Chargement…'
              : `${students.length} élève${students.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCardPreview(true)}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium transition-colors hover:bg-secondary/80 btn-shine hover-scale"
          >
            <CreditCard className="w-5 h-5" />
            Prévisualiser cartes
          </button>
          <Link
            to="/school-admin/students/assign"
            className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg font-medium transition-colors hover:bg-muted/80 btn-shine hover-scale"
          >
            Affecter aux classes
          </Link>
          <Link
            to="/school-admin/students/pre-register"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium transition-colors hover:bg-primary/90 btn-shine hover-scale"
          >
            <Plus className="w-5 h-5" />
            Inscrire un élève
          </Link>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-3 hover-lift">
        {/* Row 1: search + view toggle */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, matricule ou parent…"
              className="w-full bg-input border-none rounded-lg py-2.5 pl-10 pr-4 text-foreground focus:ring-2 focus:ring-ring focus:outline-none transition-shadow"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex rounded-lg border border-border overflow-hidden flex-shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 transition-colors ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted'}`}
              title="Vue grille"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 transition-colors ${viewMode === 'table' ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:bg-muted'}`}
              title="Vue tableau"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Row 2: cascade filters */}
        <div className="flex flex-wrap gap-2">
          <FilterSelect
            value={academicYear}
            onChange={setAcademicYear}
            placeholder="Année scolaire"
            options={ACADEMIC_YEARS}
            icon={Calendar}
          />
          <FilterSelect
            value={cycle}
            onChange={handleCycleChange}
            placeholder="Cycle"
            options={CYCLES}
            icon={GraduationCap}
          />
          <FilterSelect
            value={option}
            onChange={handleOptionChange}
            placeholder="Option"
            options={optionChoices}
            icon={Filter}
          />
          <FilterSelect
            value={level}
            onChange={handleLevelChange}
            placeholder="Niveau"
            options={levelChoices}
            icon={Filter}
          />
          <FilterSelect
            value={classFilter}
            onChange={setClassFilter}
            placeholder="Classe"
            options={allClasses}
            icon={GraduationCap}
          />
          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Statut"
            options={['PRE_REGISTERED', 'ACTIVE', 'COMPLETED', 'DROPPED']}
            icon={Filter}
          />
          <FilterSelect
            value={genderFilter}
            onChange={setGenderFilter}
            placeholder="Genre"
            options={['M', 'F']}
            icon={Filter}
          />
          {activePills.length > 0 && (
            <button
              onClick={clearAll}
              className="px-3 py-2 text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
            >
              <X className="w-3 h-3" /> Effacer tout
            </button>
          )}
        </div>

        {/* Row 3: active filter pills */}
        {activePills.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {activePills.map((p) => (
              <FilterPill key={p.label} label={p.label} onRemove={p.clear} />
            ))}
          </div>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      )}

      {/* Empty */}
      {!isLoading && students.length === 0 && (
        <div className="bg-card border border-border rounded-lg p-12 text-center">
          <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Aucun élève trouvé
          </h3>
          <p className="text-muted-foreground">
            Modifiez vos filtres ou inscrivez un nouvel élève.
          </p>
        </div>
      )}

      {/* Grid View */}
      {!isLoading && students.length > 0 && viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {students.map((student) => (
            <StudentCard key={student.id} student={student} />
          ))}
        </div>
      )}

      {/* Table View */}
      {!isLoading && students.length > 0 && viewMode === 'table' && (
        <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover-lift">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {[
                    'Élève',
                    'Matricule',
                    'Cycle / Option',
                    'Niveau · Classe',
                    'Genre',
                    'Statut',
                    'Parent',
                    'Actions',
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-4 text-[11px] font-semibold uppercase tracking-wide text-foreground/80 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-muted/40 transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <StudentAvatar student={student} size="sm" />
                        <div>
                          <Link
                            to="/school-admin/students/$studentId"
                            params={{ studentId: student.id }}
                            className="font-semibold text-foreground text-sm hover:text-primary hover:underline transition-colors"
                          >
                            {student.full_name}
                          </Link>
                          <div className="text-xs text-muted-foreground">
                            {new Date(student.date_of_birth).toLocaleDateString(
                              'fr-FR',
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-mono text-muted-foreground">
                      {student.annual_identifier}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-foreground">
                        {student.cycle}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {student.option}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm text-foreground">
                        {student.level}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {student.class_name}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <GenderBadge gender={student.gender} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={student.enrollment_status} />
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {student.parent_name ?? '—'}
                    </td>
                    <td className="px-4 py-3">
                      <ActionMenu student={student} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-border bg-muted/10 text-sm text-muted-foreground">
            {students.length} élève{students.length !== 1 ? 's' : ''} affiché
            {students.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      {/* Student Card Preview Modal */}
      {showCardPreview && (
        <StudentCardPreview
          students={students}
          onClose={() => setShowCardPreview(false)}
          initialClass={classFilter || undefined}
        />
      )}
    </div>
  )
}
