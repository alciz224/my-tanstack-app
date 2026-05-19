import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { BookOpen, Loader2, Users } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { getCurrentUserFn } from '@/server/auth'
import { getTeacherClassesFn } from '@/server/api/teachers'

export const Route = createFileRoute('/_authed/teacher/classes/')({
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
  component: MyClassesPage,
})

function MyClassesPage() {
  const loaderData = Route.useLoaderData()
  const { classes, teacherId } = loaderData
  const getTeacherClasses = useServerFn(getTeacherClassesFn)

  const { data: liveClasses, isLoading } = useQuery({
    queryKey: ['teacher', 'classes', teacherId],
    queryFn: () => getTeacherClasses({ data: { teacherId: teacherId || '' } }),
    initialData: classes,
    enabled: !!teacherId,
  })

  const displayedClasses = isLoading ? classes : liveClasses

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mes Classes</h1>
        <p className="text-muted-foreground mt-1">
          Gérez vos classes et accédez aux évaluations
        </p>
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedClasses?.map((cls) => (
          <Link
            key={cls.id}
            to="/teacher/classes/$classId"
            params={{ classId: cls.assignment_id }}
            className="bg-card border border-border rounded-lg p-6 hover-lift hover:border-primary/50 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-lg ${cls.color} flex items-center justify-center`}
              >
                <Users className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm text-muted-foreground">
                {cls.students} élèves
              </span>
            </div>

            <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
              {cls.name}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">{cls.level}</p>

            <div className="flex items-center gap-2 text-sm">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-foreground font-medium">{cls.subject}</span>
            </div>
          </Link>
        ))}
      </div>

      {!isLoading && displayedClasses?.length === 0 && (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <Users className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-foreground mb-1">
            Aucune classe assignée
          </h3>
          <p className="text-muted-foreground">
            Contactez l'administration pour être assigné à des classes
          </p>
        </div>
      )}
    </div>
  )
}
