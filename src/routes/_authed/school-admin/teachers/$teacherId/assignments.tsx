import { Link, createFileRoute } from '@tanstack/react-router'
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  Plus,
  Users,
} from 'lucide-react'
import { getTeacherAssignmentsFn } from '@/server/api/teachers'

export const Route = createFileRoute(
  '/_authed/school-admin/teachers/$teacherId/assignments',
)({
  component: TeacherAssignments,
  loader: async ({ params }) => {
    const assignments = await getTeacherAssignmentsFn({
      data: params.teacherId,
    })
    return { assignments }
  },
})

function TeacherAssignments() {
  const { assignments } = Route.useLoaderData()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link
            to="/school-admin/teachers"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux enseignants</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Affectations</h1>
          <p className="text-muted-foreground">
            Gérez les classes et matières de cet enseignant
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Nouvelle Affectation</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Classes</p>
            <p className="text-2xl font-bold">
              {new Set(assignments.map((a) => a.classroom_id)).size}
            </p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Matières</p>
            <p className="text-2xl font-bold">
              {new Set(assignments.map((a) => a.subject_name)).size}
            </p>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Heures / Semaine</p>
            <p className="text-2xl font-bold">18h</p>
          </div>
        </div>
      </div>

      {/* Assignments Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border font-medium flex justify-between items-center bg-muted/30">
          <span>Classes affectées</span>
        </div>

        {assignments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-medium">Classe</th>
                  <th className="px-6 py-4 font-medium">Matière</th>
                  <th className="px-6 py-4 font-medium">Début</th>
                  <th className="px-6 py-4 font-medium">Statut</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {assignments.map((assignment) => (
                  <tr
                    key={assignment.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-foreground">
                      {assignment.classroom_name}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {assignment.subject_name}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {new Date(assignment.start_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                          assignment.assignment_status === 'ACTIVE'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}
                      >
                        {assignment.assignment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button className="text-xs text-primary hover:underline">
                        Remplacer
                      </button>
                      <button className="text-xs text-destructive hover:underline">
                        Terminer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-muted-foreground">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>Cet enseignant n'a pas encore de classes affectées.</p>
            <button className="mt-4 text-primary font-medium hover:underline">
              Ajouter une affectation
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
