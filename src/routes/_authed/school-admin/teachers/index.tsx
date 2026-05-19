import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import { useState, useTransition } from 'react'
import {
  ArrowRightLeft,
  Briefcase,
  Filter,
  MoreVertical,
  Plus,
  Search,
  UserCheck,
  UserMinus,
  UserX,
} from 'lucide-react'
import type { ReplacementData } from '@/components/TeacherReplacementModal'
import {
  getSchoolYearTeachersFn,
  updateSchoolYearTeacherFn,
} from '@/server/api/teachers'
import { TeacherReplacementModal } from '@/components/TeacherReplacementModal'

export const Route = createFileRoute('/_authed/school-admin/teachers/')({
  component: TeachersList,
  loader: async () => {
    // Hardcoding 'sy-2' (current school year) for now
    const teachers = await getSchoolYearTeachersFn({ data: 'sy-2' })
    return { teachers }
  },
})

function TeachersList() {
  const { teachers } = Route.useLoaderData()
  const router = useRouter()
  const [isReplacementModalOpen, setIsReplacementModalOpen] = useState(false)
  const [selectedTeacher, setSelectedTeacher] = useState<
    (typeof teachers)[0] | null
  >(null)
  const [isPending, startTransition] = useTransition()

  const handleOpenReplacement = (teacher: (typeof teachers)[0]) => {
    setSelectedTeacher(teacher)
    setIsReplacementModalOpen(true)
  }

  const handleReplacement = (data: ReplacementData) => {
    if (!selectedTeacher) return
    startTransition(async () => {
      await updateSchoolYearTeacherFn({
        data: {
          id: selectedTeacher.id,
          updates: {
            status: 'SUSPENDED',
            replacement_data: data,
          },
        },
      })
      setIsReplacementModalOpen(false)
      router.invalidate()
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Enseignants</h1>
          <p className="text-muted-foreground">
            Gérez le corps professoral de l'année scolaire
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Ajouter un enseignant</span>
        </button>
      </div>

      {/* Filters/Search */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-3 hover-lift">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par nom, email..."
              className="w-full bg-input border-none rounded-lg py-2.5 pl-10 pr-4 text-foreground focus:ring-2 focus:ring-ring focus:outline-none transition-shadow"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors">
            <Filter className="w-4 h-4" />
            <span>Filtres</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">Enseignant</th>
                <th className="px-6 py-4 font-medium">Contact</th>
                <th className="px-6 py-4 font-medium">Date d'embauche</th>
                <th className="px-6 py-4 font-medium">Statut</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {teachers.map((syTeacher) => (
                <tr
                  key={syTeacher.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center text-primary font-semibold">
                        {syTeacher.teacher?.first_name[0]}
                        {syTeacher.teacher?.last_name[0]}
                      </div>
                      <div>
                        <div className="font-medium text-foreground">
                          {syTeacher.teacher?.first_name}{' '}
                          {syTeacher.teacher?.last_name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          ID: {syTeacher.teacher_id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-foreground">
                      {syTeacher.teacher?.email}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {syTeacher.teacher?.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-foreground">
                    {syTeacher.hire_date
                      ? new Date(syTeacher.hire_date).toLocaleDateString()
                      : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={syTeacher.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/school-admin/teachers/${syTeacher.id}/assignments`}
                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                        title="Affectations"
                      >
                        <Briefcase className="w-4 h-4" />
                      </Link>
                      {syTeacher.status === 'ACTIVE' && (
                        <button
                          onClick={() => handleOpenReplacement(syTeacher)}
                          className="p-2 text-muted-foreground hover:text-amber-600 hover:bg-amber-500/10 rounded-md transition-colors"
                          title="Remplacer"
                        >
                          <ArrowRightLeft className="w-4 h-4" />
                        </button>
                      )}
                      <button className="p-2 text-muted-foreground hover:text-foreground rounded-md transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {teachers.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    Aucun enseignant trouvé pour cette année scolaire.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTeacher && (
        <TeacherReplacementModal
          isOpen={isReplacementModalOpen}
          onClose={() => {
            setIsReplacementModalOpen(false)
            setSelectedTeacher(null)
          }}
          onSubmit={handleReplacement}
          currentTeacherName={`${selectedTeacher.teacher?.first_name} ${selectedTeacher.teacher?.last_name}`}
          assignmentSubject="Mathématiques"
          assignmentClassroom="6ème A"
          isLoading={isPending}
        />
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'ACTIVE') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-success/15 text-success border border-success/20">
        <UserCheck className="w-3 h-3" />
        Actif
      </span>
    )
  }
  if (status === 'SUSPENDED') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20">
        <UserMinus className="w-3 h-3" />
        Suspendu
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-muted text-muted-foreground border border-border">
      <UserX className="w-3 h-3" />
      Parti
    </span>
  )
}
