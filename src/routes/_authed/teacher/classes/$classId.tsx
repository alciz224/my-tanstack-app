import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { useState } from 'react'
import {
  ArrowLeft,
  BookOpen,
  ClipboardCheck,
  FileText,
  Search,
  Users,
  Calendar,
  MoreVertical,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { getCurrentUserFn } from '@/server/auth'
import { getTeacherClassesFn } from '@/server/api/teachers'
import { getStudentsFn } from '@/server/api/students'

export const Route = createFileRoute('/_authed/teacher/classes/$classId')({
  loader: async ({ params }) => {
    const user = await getCurrentUserFn()
    if (!user?.teacher_id) {
      return { classInfo: null, students: [], assignmentId: params.classId }
    }

    const classes = await getTeacherClassesFn({
      data: { teacherId: user.teacher_id },
    })

    const classInfo = classes.find((c) => c.assignment_id === params.classId)

    const students = classInfo
      ? await getStudentsFn({ class_name: classInfo.name })
      : []

    return { classInfo, students, assignmentId: params.classId }
  },
  component: ClassDetailPage,
})

interface Student {
  id: string
  annual_identifier: string
  first_name: string
  last_name: string
  full_name: string
  gender: 'M' | 'F'
  enrollment_status: string
}

function ClassDetailPage() {
  const { classInfo, students, assignmentId } = Route.useLoaderData()
  const params = useParams({ from: '/_authed/teacher/classes/$classId' })
  const [search, setSearch] = useState('')

  const getTeacherClasses = useServerFn(getTeacherClassesFn)
  const getStudents = useServerFn(getStudentsFn)

  const { data: liveClassInfo } = useQuery({
    queryKey: ['teacher', 'class', params.classId],
    queryFn: async () => {
      const user = await getCurrentUserFn()
      if (!user?.teacher_id) return null
      const classes = await getTeacherClasses({
        data: { teacherId: user.teacher_id },
      })
      return classes.find((c) => c.assignment_id === params.classId)
    },
    initialData: classInfo,
    enabled: !!classInfo,
  })

  const { data: liveStudents } = useQuery({
    queryKey: ['students', 'class', liveClassInfo?.name],
    queryFn: async () => {
      if (!liveClassInfo?.name) return []
      return getStudents({ class_name: liveClassInfo.name })
    },
    initialData: students,
    enabled: !!liveClassInfo?.name,
  })

  const displayedStudents = liveStudents?.filter(
    (s) =>
      s.first_name.toLowerCase().includes(search.toLowerCase()) ||
      s.last_name.toLowerCase().includes(search.toLowerCase()),
  )

  if (!liveClassInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Users className="w-16 h-16 text-muted-foreground/50 mb-4" />
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Classe non trouvée
        </h2>
        <p className="text-muted-foreground mb-4">
          Cette classe n'existe pas ou vous n'y êtes pas assigné.
        </p>
        <Link
          to="/teacher/classes"
          className="flex items-center gap-2 text-primary hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à mes classes
        </Link>
      </div>
    )
  }

  const activeStudents = liveStudents?.filter(
    (s) => s.enrollment_status === 'ACTIVE',
  )

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div>
        <Link
          to="/teacher/classes"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux classes</span>
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-lg ${liveClassInfo.color} flex items-center justify-center`}
            >
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {liveClassInfo.name}
              </h1>
              <p className="text-muted-foreground">
                {liveClassInfo.subject} • {liveClassInfo.level}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/teacher/grades/$classId"
              params={{ classId: assignmentId }}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              <ClipboardCheck className="w-4 h-4" />
              <span>Saisir les notes</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Effectif total</p>
              <p className="text-2xl font-bold text-foreground">
                {liveStudents?.length || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Élèves actifs</p>
              <p className="text-2xl font-bold text-foreground">
                {activeStudents?.length || 0}
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
              <p className="text-sm text-muted-foreground">
                Cours cette semaine
              </p>
              <p className="text-2xl font-bold text-foreground">4</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/teacher/grades/$classId"
          params={{ classId: assignmentId }}
          className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <ClipboardCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Saisie des notes</h3>
              <p className="text-sm text-muted-foreground">
                Évaluations et devoirs
              </p>
            </div>
          </div>
        </Link>
        <Link
          to="/teacher/schedule"
          className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
              <Calendar className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Emploi du temps</h3>
              <p className="text-sm text-muted-foreground">
                Planning hebdomadaire
              </p>
            </div>
          </div>
        </Link>
        <button className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors group text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center group-hover:bg-orange-500/20 transition-colors">
              <FileText className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Carnet de notes</h3>
              <p className="text-sm text-muted-foreground">
                Historique des notes
              </p>
            </div>
          </div>
        </button>
        <button className="bg-card border border-border rounded-lg p-4 hover:border-primary/50 transition-colors group text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
              <Users className="w-5 h-5 text-cyan-500" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">Absentéisme</h3>
              <p className="text-sm text-muted-foreground">
                Suivi des présences
              </p>
            </div>
          </div>
        </button>
      </div>

      {/* Student List */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Users className="w-5 h-5" />
            Liste des élèves ({displayedStudents?.length || 0})
          </h2>
          <div className="relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher un élève..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-input border-none rounded-lg py-2 pl-9 pr-4 text-foreground focus:ring-2 focus:ring-ring focus:outline-none w-64"
            />
          </div>
        </div>

        {displayedStudents && displayedStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                    #
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                    Élève
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                    Matricule
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                    Genre
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                    Statut
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide w-16">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {displayedStudents.map((student, index) => (
                  <tr
                    key={student.id}
                    className="hover:bg-muted/40 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {index + 1}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                          {student.first_name[0]}
                          {student.last_name[0]}
                        </div>
                        <span className="font-medium text-foreground">
                          {student.first_name} {student.last_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground font-mono">
                      {student.annual_identifier}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          student.gender === 'M'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-pink-100 text-pink-800'
                        }`}
                      >
                        {student.gender === 'M' ? 'M' : 'F'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          student.enrollment_status === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {student.enrollment_status === 'ACTIVE'
                          ? 'Actif'
                          : student.enrollment_status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button className="p-1 hover:bg-muted rounded transition-colors">
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-foreground mb-1">
              Aucun élève trouvé
            </h3>
            <p className="text-muted-foreground">
              {search
                ? 'Aucun élève ne correspond à votre recherche.'
                : 'Aucun élève inscrit dans cette classe.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
