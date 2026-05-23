import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import { useEffect, useRef, useState, useTransition } from 'react'
import {
  AlertCircle,
  Archive,
  BarChart3,
  Calendar as CalendarIcon,
  CheckCircle2,
  Edit2,
  FileText,
  Filter,
  MoreHorizontal,
  Pause,
  Play,
  Plus,
  Search,
} from 'lucide-react'
import type { Assessment } from '@/server/data/assessments/types'
import type { AssessmentFormData } from '@/components/AssessmentFormModal'
import {
  createAssessmentFn,
  getAssessmentsFn,
  updateAssessmentFn,
} from '@/server/api/assessments'
import { AssessmentFormModal } from '@/components/AssessmentFormModal'

const VALID_TRANSITIONS: Record<
  Assessment['status'],
  Array<Assessment['status']>
> = {
  DRAFT: ['ACTIVE'],
  ACTIVE: ['CLOSED'],
  CLOSED: ['ARCHIVED'],
  ARCHIVED: [],
}

const getNextStatus = (
  currentStatus: Assessment['status'],
): Array<Assessment['status']> => {
  return VALID_TRANSITIONS[currentStatus] || []
}

const getStatusLabel = (status: Assessment['status']): string => {
  const labels: Record<Assessment['status'], string> = {
    DRAFT: 'Brouillon',
    ACTIVE: 'En cours',
    CLOSED: 'Clôturé',
    ARCHIVED: 'Archivé',
  }
  return labels[status] || status
}

export const Route = createFileRoute('/_authed/school-admin/assessments/')({
  component: AssessmentsPage,
  loader: async () => {
    const assessments = await getAssessmentsFn({})
    return { assessments }
  },
})

function StatusBadge({ status }: { status: string }) {
  if (status === 'ACTIVE')
    return (
      <span className="px-2.5 py-1 rounded-full bg-success/15 text-success text-xs font-semibold">
        En cours
      </span>
    )
  if (status === 'DRAFT')
    return (
      <span className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-xs font-semibold">
        Brouillon
      </span>
    )
  if (status === 'CLOSED')
    return (
      <span className="px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 text-xs font-semibold">
        Clôturé
      </span>
    )
  if (status === 'ARCHIVED')
    return (
      <span className="px-2.5 py-1 rounded-full bg-warning/15 text-warning text-xs font-semibold">
        Archivé
      </span>
    )
  return null
}

function AssessmentsPage() {
  const { assessments } = Route.useLoaderData()
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAssessment, setEditingAssessment] = useState<
    Assessment | undefined
  >(undefined)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleOpenCreate = () => {
    setEditingAssessment(undefined)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (assessment: Assessment) => {
    setEditingAssessment(assessment)
    setIsModalOpen(true)
  }

  const handleStatusChange = (
    assessmentId: string,
    newStatus: Assessment['status'],
  ) => {
    startTransition(async () => {
      await updateAssessmentFn({
        data: { id: assessmentId, updates: { status: newStatus } },
      })
      setActiveDropdown(null)
      router.invalidate()
    })
  }

  const handleFormSubmit = (data: AssessmentFormData) => {
    if (editingAssessment) {
      startTransition(async () => {
        const cycleName =
          data.school_year_cycle_id === 'syc-1' ? 'Primaire' : 'Secondaire'
        const termName = data.school_year_cycle_term_id.includes('1')
          ? 'Trimestre 1'
          : data.school_year_cycle_term_id.includes('2')
            ? 'Trimestre 2'
            : 'Trimestre 3'
        const typeName =
          data.assessment_type_id === 'type-1'
            ? 'Interrogation'
            : data.assessment_type_id === 'type-2'
              ? 'Examen'
              : 'Devoir'

        await updateAssessmentFn({
          data: {
            id: editingAssessment.id,
            updates: {
              ...data,
              cycle_name: cycleName,
              term_name: termName,
              type_name: typeName,
            },
          },
        })
        setIsModalOpen(false)
        setEditingAssessment(undefined)
        router.invalidate()
      })
    } else {
      startTransition(async () => {
        const cycleName =
          data.school_year_cycle_id === 'syc-1' ? 'Primaire' : 'Secondaire'
        const termName = data.school_year_cycle_term_id.includes('1')
          ? 'Trimestre 1'
          : data.school_year_cycle_term_id.includes('2')
            ? 'Trimestre 2'
            : 'Trimestre 3'
        const typeName =
          data.assessment_type_id === 'type-1'
            ? 'Interrogation'
            : data.assessment_type_id === 'type-2'
              ? 'Examen'
              : 'Devoir'

        const newAssessment = {
          ...data,
          school_year_id: 'sy-2',
          status: 'DRAFT' as const,
          cycle_name: cycleName,
          term_name: termName,
          type_name: typeName,
        }

        await createAssessmentFn({ data: newAssessment })
        setIsModalOpen(false)
        router.invalidate()
      })
    }
  }

  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filtered = assessments.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      (a.type_name && a.type_name.toLowerCase().includes(search.toLowerCase())),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Évaluations</h1>
          <p className="text-muted-foreground">
            Gérez les sessions d'examens et le suivi des notes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/school-admin/reports/report-cards"
            className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
          >
            <FileText className="w-5 h-5" /> Voir les Bulletins
          </Link>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors btn-shine hover-scale"
          >
            <Plus className="w-5 h-5" /> Nouvelle Session
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-card border border-border p-4 rounded-xl flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher une évaluation..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-input border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select className="bg-input border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50">
            <option value="">Tous les cycles</option>
            <option value="syc-1">Primaire</option>
            <option value="syc-2">Secondaire</option>
          </select>
          <button className="flex items-center gap-2 px-3 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors text-sm">
            <Filter className="w-4 h-4" /> Filtres
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtered.map((assessment) => (
          <div
            key={assessment.id}
            className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
                      {assessment.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {assessment.cycle_name} · {assessment.term_name}
                    </p>
                  </div>
                </div>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() =>
                      setActiveDropdown(
                        activeDropdown === assessment.id ? null : assessment.id,
                      )
                    }
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-border hover:bg-muted/50 transition-colors"
                  >
                    <StatusBadge status={assessment.status} />
                    {getNextStatus(assessment.status).length > 0 && (
                      <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                  </button>
                  {activeDropdown === assessment.id &&
                    getNextStatus(assessment.status).length > 0 && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-lg shadow-lg z-10 py-1 animate-fade-in">
                        <div className="px-3 py-2 text-xs text-muted-foreground border-b border-border">
                          Changer le statut
                        </div>
                        {getNextStatus(assessment.status).map((nextStatus) => (
                          <button
                            key={nextStatus}
                            onClick={() =>
                              handleStatusChange(assessment.id, nextStatus)
                            }
                            disabled={isPending}
                            className="w-full px-3 py-2 text-left text-sm hover:bg-muted/50 flex items-center gap-2 transition-colors"
                          >
                            {nextStatus === 'ACTIVE' && (
                              <Play className="w-4 h-4 text-green-500" />
                            )}
                            {nextStatus === 'CLOSED' && (
                              <Pause className="w-4 h-4 text-blue-500" />
                            )}
                            {nextStatus === 'ARCHIVED' && (
                              <Archive className="w-4 h-4 text-amber-500" />
                            )}
                            <span>Passer à {getStatusLabel(nextStatus)}</span>
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                  <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <CalendarIcon className="w-3 h-3" /> Période
                  </div>
                  <div className="text-sm font-medium">
                    {new Date(assessment.start_date).toLocaleDateString(
                      'fr-FR',
                      { day: '2-digit', month: 'short' },
                    )}{' '}
                    -{' '}
                    {new Date(assessment.end_date).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'short',
                    })}
                  </div>
                </div>
                <div className="bg-muted/30 p-3 rounded-lg border border-border/50">
                  <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                    <BarChart3 className="w-3 h-3" /> Type
                  </div>
                  <div className="text-sm font-medium">
                    {assessment.type_name}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-4 border-t border-border mt-auto">
              <button
                onClick={() => handleOpenEdit(assessment)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors text-sm font-medium"
              >
                <Edit2 className="w-4 h-4" /> Modifier
              </button>
              <Link
                to={`/school-admin/assessments/${assessment.id}/subjects`}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors text-sm font-medium"
              >
                Matières & Éuvres
              </Link>
              <Link
                to={`/school-admin/assessments/${assessment.id}/validate`}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm font-medium ${
                  assessment.status === 'ACTIVE'
                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20'
                    : 'bg-muted text-muted-foreground opacity-50 cursor-not-allowed'
                }`}
              >
                <CheckCircle2 className="w-4 h-4" /> Saisie & Validation
              </Link>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full p-12 text-center text-muted-foreground bg-card border border-border rounded-xl">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>Aucune évaluation ne correspond à votre recherche.</p>
          </div>
        )}
      </div>

      <AssessmentFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingAssessment(undefined)
        }}
        onSubmit={handleFormSubmit}
        assessment={editingAssessment}
        isLoading={isPending}
      />
    </div>
  )
}
