import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import {
  ArrowRight,
  BookOpen,
  Calendar,
  ClipboardCheck,
  FileText,
  Filter,
  Search,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { getCurrentUserFn } from '@/server/auth'
import { getTeacherClassesFn } from '@/server/api/teachers'

export const Route = createFileRoute('/_authed/teacher/grades/')({
  loader: async () => {
    const user = await getCurrentUserFn()
    if (!user?.teacher_id) {
      return { classes: [] }
    }
    const classes = await getTeacherClassesFn({
      data: { teacherId: user.teacher_id },
    })
    return { classes, teacherId: user.teacher_id }
  },
  component: TeacherGradesOverviewPage,
})

interface Assessment {
  id: string
  name: string
  type: string
  date: string
  status: string
  className: string
  subject: string
  studentsCount: number
  submittedCount: number
}

const MOCK_ASSESSMENTS: Assessment[] = [
  {
    id: 'a1',
    name: 'Composition du 1er Trimestre',
    type: 'Composition',
    date: '2024-12-10',
    status: 'active',
    className: '6ème A',
    subject: 'Mathématiques',
    studentsCount: 28,
    submittedCount: 28,
  },
  {
    id: 'a2',
    name: 'Devoir Maison 3',
    type: 'Devoir',
    date: '2024-12-05',
    status: 'validated',
    className: '5ème A',
    subject: 'Mathématiques',
    studentsCount: 25,
    submittedCount: 25,
  },
  {
    id: 'a3',
    name: 'Interrogation 2',
    type: 'Interrogation',
    date: '2024-12-08',
    status: 'draft',
    className: '6ème A',
    subject: 'Mathématiques',
    studentsCount: 28,
    submittedCount: 0,
  },
  {
    id: 'a4',
    name: 'Composition du 1er Trimestre',
    type: 'Composition',
    date: '2024-12-12',
    status: 'closed',
    className: '4ème A',
    subject: 'Mathématiques',
    studentsCount: 22,
    submittedCount: 22,
  },
]

function TeacherGradesOverviewPage() {
  const { classes } = Route.useLoaderData()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [classFilter, setClassFilter] = useState<string>('all')

  const getTeacherClasses = useServerFn(getTeacherClassesFn)

  const { data: liveClasses } = useQuery({
    queryKey: ['teacher', 'classes'],
    queryFn: async () => {
      const user = await getCurrentUserFn()
      if (!user?.teacher_id) return []
      return getTeacherClasses({ data: { teacherId: user.teacher_id } })
    },
    initialData: classes,
  })

  const filteredAssessments = MOCK_ASSESSMENTS.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.className.toLowerCase().includes(search.toLowerCase()) ||
      a.subject.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter
    const matchesClass = classFilter === 'all' || a.className === classFilter
    return matchesSearch && matchesStatus && matchesClass
  })

  const getStatusBadge = (status: string) => {
    const statusMap: Record<
      string,
      { bg: string; text: string; label: string }
    > = {
      draft: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Brouillon' },
      active: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Active' },
      validated: {
        bg: 'bg-green-100',
        text: 'text-green-800',
        label: 'Validée',
      },
      closed: {
        bg: 'bg-orange-100',
        text: 'text-orange-800',
        label: 'Clôturée',
      },
    }
    const s = statusMap[status] || statusMap.draft
    return (
      <span
        className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${s.bg} ${s.text}`}
      >
        {s.label}
      </span>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Notes & Évaluations
        </h1>
        <p className="text-muted-foreground mt-1">
          Gérez les évaluations et la saisie des notes pour toutes vos classes
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Mes Classes</p>
              <p className="text-2xl font-bold text-foreground">
                {liveClasses?.length || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <ClipboardCheck className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">
                Évaluations Actives
              </p>
              <p className="text-2xl font-bold text-foreground">
                {MOCK_ASSESSMENTS.filter((a) => a.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">En attente</p>
              <p className="text-2xl font-bold text-foreground">
                {MOCK_ASSESSMENTS.filter((a) => a.status === 'draft').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Évaluations</p>
              <p className="text-2xl font-bold text-foreground">
                {MOCK_ASSESSMENTS.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher une évaluation..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-input border-none rounded-lg py-2 pl-9 pr-4 text-foreground focus:ring-2 focus:ring-ring focus:outline-none w-full"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-input border border-border rounded-lg py-2 px-3 text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
            >
              <option value="all">Tous les statuts</option>
              <option value="draft">Brouillon</option>
              <option value="active">Active</option>
              <option value="validated">Validée</option>
              <option value="closed">Clôturée</option>
            </select>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="bg-input border border-border rounded-lg py-2 px-3 text-foreground focus:ring-2 focus:ring-ring focus:outline-none"
            >
              <option value="all">Toutes les classes</option>
              {liveClasses?.map((cls) => (
                <option key={cls.id} value={cls.name}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Assessments Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Évaluations ({filteredAssessments.length})
          </h2>
        </div>

        {filteredAssessments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                    Évaluation
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                    Classe
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                    Matière
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                    Date
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide">
                    Notes
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                    Statut
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide w-20">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredAssessments.map((assessment) => (
                  <tr
                    key={assessment.id}
                    className="hover:bg-muted/40 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <span className="font-medium text-foreground">
                        {assessment.name}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-muted-foreground">
                        {assessment.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-foreground">
                        {assessment.className}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-muted-foreground">
                        {assessment.subject}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-muted-foreground">
                        {assessment.date}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm text-foreground">
                        {assessment.submittedCount}/{assessment.studentsCount}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(assessment.status)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {assessment.status === 'active' ||
                      assessment.status === 'draft' ? (
                        <Link
                          to="/teacher/grades/$classId"
                          params={{ classId: 'ta-1' }}
                          className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                        >
                          Saisir
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      ) : (
                        <button className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-muted text-muted-foreground rounded-md hover:bg-muted/80 transition-colors">
                          Voir
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-foreground mb-1">
              Aucune évaluation trouvée
            </h3>
            <p className="text-muted-foreground">
              Aucune évaluation ne correspond à vos critères de recherche.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
