import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  Download,
  Edit,
  ExternalLink,
  FileText,
  GraduationCap,
  Home,
  Mail,
  MapPin,
  Phone,
  Printer,
  Star,
  Trash2,
  TrendingUp,
  UserCheck,
  UserX,
  Users,
  X,
} from 'lucide-react'
import { useState, useTransition } from 'react'
import type { EnrollmentStatus } from '@/server/data/students/mocks'
import { getStudentByIdFn } from '@/server/api/students'
import { getReportCardsFn } from '@/server/api/reports'
import { getStudentAssessmentsByEnrollmentFn } from '@/server/api/student-assessments'
import type { ReportCard } from '@/server/data/reports/types'
import type { StudentAssessment } from '@/server/data/student-assessments/types'
import { StudentIDCard } from '@/components/StudentCardPreview'

export const Route = createFileRoute(
  '/_authed/school-admin/students/$studentId',
)({
  component: StudentDetailPage,
  loader: async ({ params }) => {
    const student = await getStudentByIdFn({ data: params.studentId })
    if (!student) throw new Error('Student not found')

    // Load report cards & assessments in parallel, silently ignore errors
    const [reportCards, assessments] = await Promise.all([
      getReportCardsFn({
        data: { student_enrollment_id: params.studentId },
      }).catch(() => [] as ReportCard[]),
      getStudentAssessmentsByEnrollmentFn({ data: params.studentId }).catch(
        () => [] as StudentAssessment[],
      ),
    ])

    return { student, reportCards, assessments }
  },
})

const STATUS_LABELS: Record<
  EnrollmentStatus,
  { label: string; className: string }
> = {
  PRE_REGISTERED: {
    label: 'Pré-inscrit',
    className: 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400',
  },
  ACTIVE: { label: 'Actif', className: 'bg-success/15 text-success' },
  COMPLETED: {
    label: 'Terminé',
    className: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  },
  DROPPED: { label: 'Abandonné', className: 'bg-muted text-muted-foreground' },
}

function StatusBadge({ status }: { status: EnrollmentStatus }) {
  const s = STATUS_LABELS[status]
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${s.className}`}
    >
      {s.label}
    </span>
  )
}

function DecisionBadge({ decision }: { decision: string }) {
  const map: Record<string, { label: string; color: string }> = {
    PASS: { label: 'Admis', color: 'text-green-600 bg-green-500/15' },
    FAIL: { label: 'Échoué', color: 'text-red-600 bg-red-500/15' },
    REPEAT: { label: 'Redoublant', color: 'text-amber-600 bg-amber-500/15' },
    TRANSFER: { label: 'Transféré', color: 'text-purple-600 bg-purple-500/15' },
    PENDING: { label: 'En attente', color: 'text-muted-foreground bg-muted' },
  }
  const d = map[decision] ?? map['PENDING']
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${d.color}`}>
      {d.label}
    </span>
  )
}

// Mock classrooms for transfer (same level)
const AVAILABLE_CLASSROOMS = [
  { id: 'c1', name: '6ème A', level: '6ème', capacity: 35, enrolled: 32 },
  { id: 'c2', name: '6ème B', level: '6ème', capacity: 35, enrolled: 28 },
  { id: 'c3', name: '5ème A', level: '5ème', capacity: 35, enrolled: 31 },
  { id: 'c4', name: '5ème B', level: '5ème', capacity: 35, enrolled: 29 },
]

type ModalType = 'none' | 'transfer' | 'status' | 'id-card'

function StudentDetailPage() {
  const { student, reportCards, assessments } = Route.useLoaderData()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<
    'overview' | 'academic' | 'assessments'
  >('overview')
  const [modal, setModal] = useState<ModalType>('none')
  const [transferType, setTransferType] = useState<'INTERNAL' | 'EXTERNAL'>(
    'INTERNAL',
  )
  const [selectedClassroom, setSelectedClassroom] = useState('')
  const [transferReason, setTransferReason] = useState('')
  const [newStatus, setNewStatus] = useState<EnrollmentStatus>(
    student.enrollment_status,
  )
  const [isPending, startTransition] = useTransition()

  const sameLevel = AVAILABLE_CLASSROOMS.filter(
    (c) => c.level === student.level && c.name !== student.class_name,
  )

  const handleTransferConfirm = () => {
    startTransition(async () => {
      // In production: call transferStudentFn
      setModal('none')
      setTransferReason('')
      setSelectedClassroom('')
      router.invalidate()
    })
  }

  const handleStatusConfirm = () => {
    startTransition(async () => {
      // In production: call updateStudentStatusFn
      setModal('none')
      router.invalidate()
    })
  }

  // Group report cards by term
  const termGroups = reportCards.reduce<Record<string, ReportCard[]>>(
    (acc, rc) => {
      const key = rc.term_name ?? 'Inconnu'
      if (!acc[key]) acc[key] = []
      acc[key].push(rc)
      return acc
    },
    {},
  )

  // Compute a simple average from assessments for display
  const validScores = assessments.filter(
    (a) =>
      a.normalized_score != null && !a.is_absent && a.status === 'VALIDATED',
  )
  const avgScore =
    validScores.length > 0
      ? (
          validScores.reduce((sum, a) => sum + (a.normalized_score ?? 0), 0) /
          validScores.length
        ).toFixed(2)
      : null

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in-up pb-12">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/school-admin/students"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux élèves</span>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setModal('status')}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-muted text-foreground hover:bg-muted/80 rounded-md transition-colors"
          >
            <Edit className="w-4 h-4" /> Statut
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Header Profile Card */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-background shadow-md overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold flex-shrink-0 z-10">
          {student.photo_url ? (
            <img
              src={student.photo_url}
              alt={student.full_name}
              className="w-full h-full object-cover"
            />
          ) : (
            `${student.first_name[0]}${student.last_name[0]}`
          )}
        </div>

        <div className="flex-1 text-center md:text-left z-10">
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">
              {student.full_name}
            </h1>
            <div className="flex items-center justify-center gap-2">
              <StatusBadge status={student.enrollment_status} />
              <span className="px-2.5 py-1 rounded-full bg-muted text-foreground text-xs font-mono">
                {student.annual_identifier}
              </span>
            </div>
          </div>

          <p className="text-muted-foreground text-lg mb-4">
            {student.level}{' '}
            {student.class_name && `· Classe: ${student.class_name}`}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />{' '}
              {new Date(student.date_of_birth).toLocaleDateString('fr-FR')}
            </span>
            <span className="flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" /> {student.cycle} (
              {student.option})
            </span>
            {student.parent_phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="w-4 h-4" /> {student.parent_phone}
              </span>
            )}
            {avgScore && (
              <span className="flex items-center gap-1.5 text-primary font-semibold">
                <Star className="w-4 h-4 fill-primary" /> Moy. {avgScore}/20
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border flex gap-6 px-2">
        {[
          { id: 'overview', label: 'Vue générale' },
          { id: 'academic', label: 'Parcours scolaire' },
          {
            id: 'assessments',
            label: `Notes & Bulletins${reportCards.length > 0 ? ` (${reportCards.length})` : ''}`,
          },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 text-sm font-medium transition-all relative ${
              activeTab === tab.id
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="md:col-span-2 space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* Personal Info */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" /> Informations
                  Personnelles
                </h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Prénom</p>
                    <p className="font-medium">{student.first_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nom</p>
                    <p className="font-medium">{student.last_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Sexe</p>
                    <p className="font-medium">
                      {student.gender === 'M' ? 'Masculin' : 'Féminin'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Date de naissance
                    </p>
                    <p className="font-medium">
                      {new Date(student.date_of_birth).toLocaleDateString(
                        'fr-FR',
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Lieu de naissance
                    </p>
                    <p className="font-medium">
                      {student.birthplace_locality_name ?? 'Non renseigné'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Adresse</p>
                    <p className="font-medium">
                      {student.address ?? 'Non renseignée'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Parents Info */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" /> Tuteurs Légaux
                </h3>
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-foreground">
                        {student.parent_name ?? 'Non renseigné'}
                      </p>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Tuteur Principal
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 mt-4 text-sm">
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />{' '}
                      <span className="text-foreground">
                        {student.parent_phone ?? '—'}
                      </span>
                    </p>
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />{' '}
                      <span className="text-foreground">
                        {student.parent_email ?? '—'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'academic' && (
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" /> Historique
                d'inscription
              </h3>

              <div className="relative pl-6 border-l-2 border-muted space-y-8">
                {/* Current Year */}
                <div className="relative">
                  <div className="absolute -left-[33px] top-1 w-4 h-4 rounded-full bg-primary ring-4 ring-background" />
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-primary">
                        Année {student.academic_year}
                      </h4>
                      <StatusBadge status={student.enrollment_status} />
                    </div>
                    <p className="text-sm text-foreground mb-1">
                      Inscrit en{' '}
                      <strong>
                        {student.level} ({student.cycle})
                      </strong>
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      Classe: {student.class_name || 'Non assignée'}
                    </p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Pré-inscription:{' '}
                        {new Date(student.enrollment_date).toLocaleDateString(
                          'fr-FR',
                        )}
                      </div>
                      {student.start_date && (
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-success" />
                          Début:{' '}
                          {new Date(student.start_date).toLocaleDateString(
                            'fr-FR',
                          )}
                        </div>
                      )}
                      {student.end_date && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-warning" />
                          Fin:{' '}
                          {new Date(student.end_date).toLocaleDateString(
                            'fr-FR',
                          )}
                        </div>
                      )}
                      {student.transfer_reason && (
                        <div className="flex items-center gap-1 text-warning mt-2">
                          <AlertTriangle className="w-3 h-3" />
                          Motif: {student.transfer_reason}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Previous Class (if transferred) */}
                {student.previous_class_name && (
                  <div className="relative">
                    <div className="absolute -left-[33px] top-1 w-4 h-4 rounded-full bg-muted border-2 border-muted-foreground ring-4 ring-background" />
                    <div>
                      <h4 className="font-bold text-muted-foreground">
                        Classe précédente
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {student.previous_class_name}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'assessments' && (
            <div className="space-y-6">
              {/* Assessments summary */}
              {assessments.length > 0 && (
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" /> Notes
                    Individuelles
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="border-b border-border">
                        <tr className="text-muted-foreground">
                          <th className="pb-2 font-medium">Évaluation</th>
                          <th className="pb-2 font-medium text-center">Note</th>
                          <th className="pb-2 font-medium text-center">
                            Statut
                          </th>
                          <th className="pb-2 font-medium text-center">
                            Absent
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {assessments.map((a) => (
                          <tr
                            key={a.id}
                            className="hover:bg-muted/30 transition-colors"
                          >
                            <td className="py-3 text-foreground font-mono text-xs">
                              {a.assessment_subject_id}
                            </td>
                            <td className="py-3 text-center">
                              {a.is_absent ? (
                                <span className="text-muted-foreground">—</span>
                              ) : a.normalized_score != null ? (
                                <span
                                  className={`font-bold ${a.normalized_score >= 10 ? 'text-green-600' : 'text-red-500'}`}
                                >
                                  {a.normalized_score}/20
                                </span>
                              ) : (
                                <span className="text-muted-foreground">
                                  N/A
                                </span>
                              )}
                            </td>
                            <td className="py-3 text-center">
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  a.status === 'VALIDATED'
                                    ? 'bg-green-500/15 text-green-700'
                                    : a.status === 'SUBMITTED'
                                      ? 'bg-amber-500/15 text-amber-700'
                                      : a.status === 'CANCELLED'
                                        ? 'bg-red-500/15 text-red-700'
                                        : 'bg-muted text-muted-foreground'
                                }`}
                              >
                                {a.status === 'VALIDATED'
                                  ? 'Validé'
                                  : a.status === 'SUBMITTED'
                                    ? 'Soumis'
                                    : a.status === 'CANCELLED'
                                      ? 'Annulé'
                                      : 'Brouillon'}
                              </span>
                            </td>
                            <td className="py-3 text-center">
                              {a.is_absent ? (
                                <span className="text-amber-500 text-xs">
                                  {a.is_excused ? 'Excusé' : 'Non excusé'}
                                </span>
                              ) : (
                                <span className="text-muted-foreground/40">
                                  —
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {avgScore && (
                    <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20 flex items-center justify-between">
                      <span className="text-sm font-medium">
                        Moyenne générale (notes validées)
                      </span>
                      <span className="text-xl font-bold text-primary">
                        {avgScore}/20
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Report Cards */}
              {reportCards.length > 0 ? (
                <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" /> Bulletins
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(termGroups).map(([term, cards]) => (
                      <div key={term}>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                          {term}
                        </p>
                        <div className="space-y-2">
                          {cards.map((rc) => (
                            <Link
                              key={rc.id}
                              to="/school-admin/reports/report-cards/$cardId"
                              params={{ cardId: rc.id }}
                              className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-all group"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                  <FileText className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                  <p className="font-semibold text-foreground">
                                    {rc.term_name} — {rc.classroom_name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    Généré le{' '}
                                    {new Date(
                                      rc.generated_at,
                                    ).toLocaleDateString('fr-FR')}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                {rc.average_score != null && (
                                  <span
                                    className={`text-lg font-bold ${rc.average_score >= 10 ? 'text-green-600' : 'text-red-500'}`}
                                  >
                                    {rc.average_score}/20
                                  </span>
                                )}
                                {rc.rank && (
                                  <span className="text-xs text-muted-foreground">
                                    Rang {rc.rank}
                                  </span>
                                )}
                                <DecisionBadge decision={rc.decision} />
                                <span
                                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                                    rc.status === 'LOCKED'
                                      ? 'bg-slate-800 text-white'
                                      : rc.status === 'FINAL'
                                        ? 'bg-blue-500/15 text-blue-600'
                                        : 'bg-muted text-muted-foreground'
                                  }`}
                                >
                                  {rc.status === 'LOCKED'
                                    ? '🔐 Verrouillé'
                                    : rc.status === 'FINAL'
                                      ? 'Final'
                                      : 'Brouillon'}
                                </span>
                                <ExternalLink className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                assessments.length === 0 && (
                  <div className="bg-card border border-border rounded-xl p-12 shadow-sm text-center">
                    <BookOpen className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      Aucune donnée disponible
                    </h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Les notes et bulletins apparaîtront ici dès que des
                      évaluations seront validées pour cet élève.
                    </p>
                    <Link
                      to="/school-admin/assessments"
                      className="inline-flex items-center gap-2 mt-4 text-sm text-primary hover:underline"
                    >
                      Gérer les évaluations <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Quick Actions & Alerts */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
              Actions Rapides
            </h3>
            <div className="space-y-2">
              <Link
                to="/school-admin/reports/report-cards"
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted text-sm font-medium transition-colors border border-transparent hover:border-border"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-500" /> Voir Bulletins
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>
              {student.enrollment_status === 'ACTIVE' && (
                <button
                  onClick={() => setModal('transfer')}
                  className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted text-sm font-medium transition-colors border border-transparent hover:border-border"
                >
                  <span className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-500" /> Transférer
                    Élève
                  </span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
              <button
                onClick={() => setModal('id-card')}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted text-sm font-medium transition-colors border border-transparent hover:border-border"
              >
                <span className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-indigo-500" /> Carte d'identité
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
              <button
                onClick={() => setModal('status')}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted text-sm font-medium transition-colors border border-transparent hover:border-border"
              >
                <span className="flex items-center gap-2">
                  <UserX className="w-4 h-4 text-warning" /> Changer Statut
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
              <Link
                to="/school-admin/assessments"
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted text-sm font-medium transition-colors border border-transparent hover:border-border"
              >
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-green-500" /> Évaluations
                </span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            </div>
          </div>

          {/* Student info summary card */}
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Résumé
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5" /> Classe
                </span>
                <span className="font-medium text-foreground">
                  {student.class_name || 'Non assignée'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5" /> Cycle
                </span>
                <span className="font-medium text-foreground">
                  {student.cycle}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> Filière
                </span>
                <span className="font-medium text-foreground">
                  {student.option}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" /> Statut
                </span>
                <StatusBadge status={student.enrollment_status} />
              </div>
              {avgScore && (
                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5" /> Moyenne
                  </span>
                  <span
                    className={`font-bold ${Number(avgScore) >= 10 ? 'text-green-600' : 'text-red-500'}`}
                  >
                    {avgScore}/20
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Incomplete file warning */}
          {student.enrollment_status === 'PRE_REGISTERED' && (
            <div className="bg-warning/10 border border-warning/20 rounded-xl p-5 shadow-sm">
              <h3 className="font-semibold text-warning mb-2 flex items-center gap-2 text-sm">
                <AlertTriangle className="w-4 h-4" />
                Élève non assigné
              </h3>
              <p className="text-xs text-warning/80">
                Cet élève est pré-inscrit mais n'a pas encore été affecté à une
                classe.
              </p>
              <Link
                to="/school-admin/students/assign"
                className="mt-3 text-xs font-bold text-warning hover:underline flex items-center gap-1"
              >
                Affecter à une classe <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* TRANSFER MODAL */}
      {modal === 'transfer' && (
        <>
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={() => setModal('none')}
          />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card border border-border rounded-xl shadow-xl z-50 animate-scale-in">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" /> Transférer{' '}
                {student.first_name}
              </h2>
              <button
                onClick={() => setModal('none')}
                className="p-1 rounded hover:bg-muted"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {/* Current class */}
              <div className="p-3 bg-muted/30 rounded-lg border border-border">
                <p className="text-xs text-muted-foreground mb-1">
                  Classe actuelle
                </p>
                <p className="font-medium text-foreground">
                  {student.class_name}
                </p>
              </div>

              {/* Transfer type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Type de transfert
                </label>
                <div className="flex gap-2">
                  {(['INTERNAL', 'EXTERNAL'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTransferType(t)}
                      className={`flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                        transferType === t
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border text-muted-foreground hover:border-border/80'
                      }`}
                    >
                      {t === 'INTERNAL' ? 'Interne' : 'Externe'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Classroom picker (internal only) */}
              {transferType === 'INTERNAL' && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Nouvelle classe (même niveau)
                  </label>
                  {sameLevel.length > 0 ? (
                    <div className="space-y-2">
                      {sameLevel.map((cls) => {
                        const fill = Math.round(
                          (cls.enrolled / cls.capacity) * 100,
                        )
                        return (
                          <label
                            key={cls.id}
                            className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                              selectedClassroom === cls.id
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-border/80'
                            }`}
                          >
                            <input
                              type="radio"
                              name="classroom"
                              value={cls.id}
                              checked={selectedClassroom === cls.id}
                              onChange={() => setSelectedClassroom(cls.id)}
                              className="sr-only"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{cls.name}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${fill > 90 ? 'bg-red-500' : fill > 70 ? 'bg-amber-500' : 'bg-green-500'}`}
                                    style={{ width: `${fill}%` }}
                                  />
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {cls.enrolled}/{cls.capacity}
                                </span>
                              </div>
                            </div>
                          </label>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic p-3 bg-muted/30 rounded-lg">
                      Aucune autre classe disponible au même niveau.
                    </p>
                  )}
                </div>
              )}

              {/* Reason */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Motif du transfert <span className="text-destructive">*</span>
                </label>
                <textarea
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                  className="w-full bg-input border border-border rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/50 focus:outline-none min-h-[80px] resize-none"
                  placeholder="Raison du transfert..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-border">
              <button
                onClick={() => setModal('none')}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleTransferConfirm}
                disabled={
                  isPending ||
                  !transferReason.trim() ||
                  (transferType === 'INTERNAL' && !selectedClassroom)
                }
                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isPending && (
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                )}
                Confirmer le transfert
              </button>
            </div>
          </div>
        </>
      )}

      {/* ID CARD MODAL */}
      {modal === 'id-card' && (
        <>
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={() => setModal('none')}
          />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-card border border-border rounded-xl shadow-xl z-50 animate-scale-in">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" /> Carte d'identité
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title="Imprimer"
                >
                  <Printer className="w-5 h-5" />
                </button>
                <button
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title="Télécharger PDF"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setModal('none')}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="p-8 flex justify-center bg-muted/30">
              <div className="w-full max-w-[400px]">
                <StudentIDCard student={student as any} />
              </div>
            </div>
            <div className="p-5 border-t border-border flex justify-between items-center bg-card">
              <p className="text-xs text-muted-foreground">
                Format standard ISO 7810 ID-1 (85.60 × 53.98 mm)
              </p>
              <button
                onClick={() => setModal('none')}
                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </>
      )}

      {/* STATUS MODAL */}
      {modal === 'status' && (
        <>
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={() => setModal('none')}
          />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm bg-card border border-border rounded-xl shadow-xl z-50 animate-scale-in">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Edit className="w-5 h-5 text-primary" /> Changer le statut
              </h2>
              <button
                onClick={() => setModal('none')}
                className="p-1 rounded hover:bg-muted"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <p className="text-sm text-muted-foreground">
                Statut actuel :{' '}
                <StatusBadge status={student.enrollment_status} />
              </p>
              {(
                [
                  {
                    value: 'ACTIVE',
                    label: 'Actif',
                    desc: "L'élève suit les cours normalement",
                  },
                  {
                    value: 'COMPLETED',
                    label: 'Terminé',
                    desc: 'Cycle / année terminé(e)',
                  },
                  {
                    value: 'DROPPED',
                    label: 'Abandonné',
                    desc: "L'élève a quitté l'établissement",
                  },
                ] as const
              ).map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                    newStatus === opt.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-border/80'
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={opt.value}
                    checked={newStatus === opt.value}
                    onChange={() => setNewStatus(opt.value)}
                    className="mt-0.5"
                  />
                  <div>
                    <p className="font-medium text-sm text-foreground">
                      {opt.label}
                    </p>
                    <p className="text-xs text-muted-foreground">{opt.desc}</p>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-3 p-5 border-t border-border">
              <button
                onClick={() => setModal('none')}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                Annuler
              </button>
              <button
                onClick={handleStatusConfirm}
                disabled={isPending || newStatus === student.enrollment_status}
                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isPending && (
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                )}
                Confirmer
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
