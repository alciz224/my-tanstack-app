import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import {
  ArrowLeft, BadgeCheck, Building2, Calendar, ChevronLeft, ChevronRight, GraduationCap, Loader2,
  Mail, Phone, School, Shield, User, UserCheck, Users, XCircle,
} from 'lucide-react'
import { getUsersFn, getUserByIdFn } from '@/server/api/users'

export const Route = createFileRoute('/_authed/super-admin/users/$userId')({
  component: UserDetailPage,
})

function UserDetailPage() {
  const { userId } = Route.useParams()
  const navigate = useNavigate()
  const getUsers = useServerFn(getUsersFn)
  const getUserById = useServerFn(getUserByIdFn)

  const { data: users } = useQuery({
    queryKey: ['users', 'list'],
    queryFn: () => getUsers(),
  })
  const { data: user, isLoading } = useQuery({
    queryKey: ['users', userId],
    queryFn: () => getUserById({ data: { id: userId } }),
  })

  const currentIdx = users?.findIndex((u) => u.id === userId) ?? -1
  const prevUser = currentIdx > 0 ? users![currentIdx - 1] : null
  const nextUser = currentIdx >= 0 && currentIdx < (users?.length ?? 0) - 1 ? users![currentIdx + 1] : null

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        Utilisateur introuvable
      </div>
    )
  }

  const { profiles } = user
  const hasProfiles =
    profiles.is_super_admin ||
    profiles.school_admin_schools.length > 0 ||
    profiles.teacher_assignments.length > 0 ||
    profiles.student_enrollments.length > 0 ||
    profiles.parent_children.length > 0

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/super-admin/users"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la liste
        </Link>
        <div className="flex items-center gap-1">
          <button
            onClick={() => prevUser && navigate({ to: '/super-admin/users/$userId', params: { userId: prevUser.id } })}
            disabled={!prevUser}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {prevUser ? `${prevUser.first_name} ${prevUser.last_name}`.split(' ')[0] : 'Précédent'}
          </button>
          <span className="text-xs text-muted-foreground px-1">
            {currentIdx + 1}/{users?.length ?? 0}
          </span>
          <button
            onClick={() => nextUser && navigate({ to: '/super-admin/users/$userId', params: { userId: nextUser.id } })}
            disabled={!nextUser}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            {nextUser ? `${nextUser.first_name} ${nextUser.last_name}`.split(' ')[0] : 'Suivant'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* User Info Card */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-6 py-6 sm:px-8">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-foreground truncate">
                {user.first_name} {user.last_name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                {user.is_active ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-success/15 text-success">
                    <BadgeCheck className="w-3.5 h-3.5" />
                    Actif
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
                    <XCircle className="w-3.5 h-3.5" />
                    Inactif
                  </span>
                )}
                {user.is_staff && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary/15 text-secondary">
                    <Shield className="w-3.5 h-3.5" />
                    Staff
                  </span>
                )}
                <span className="text-xs font-mono text-muted-foreground">
                  ID: {user.id}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 sm:px-8 py-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span>{user.email ?? '—'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <span>{user.phone ?? '—'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>Inscrit le {new Date(user.date_joined).toLocaleDateString('fr-FR')}</span>
          </div>
          {user.last_login && (
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-muted-foreground" />
              <span>Dernière connexion le {new Date(user.last_login).toLocaleDateString('fr-FR')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Profiles Section */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Profils associés
        </h2>
        {!hasProfiles && (
          <p className="text-sm text-muted-foreground bg-card border border-border rounded-lg px-4 py-8 text-center">
            Aucun profil associé à cet utilisateur.
          </p>
        )}

        <div className="grid grid-cols-1 gap-4">
          {/* Super Admin */}
          {profiles.is_super_admin && (
            <ProfileCard
              icon={<Shield className="w-5 h-5" />}
              title="Super Administrateur"
              color="text-red-500"
              bgColor="bg-red-500/10"
            >
              <p className="text-sm text-muted-foreground">
                Accès administrateur plateforme — niveau super admin.
              </p>
            </ProfileCard>
          )}

          {/* School Admin */}
          {profiles.school_admin_schools.length > 0 && (
            <ProfileCard
              icon={<Building2 className="w-5 h-5" />}
              title="Administrateur d'établissement"
              color="text-blue-500"
              bgColor="bg-blue-500/10"
            >
              <div className="space-y-2">
                {profiles.school_admin_schools.map((s) => (
                  <Link
                    key={s.id}
                    to="/super-admin/schools/$schoolId"
                    params={{ schoolId: s.id }}
                    className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <School className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{s.name}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </ProfileCard>
          )}

          {/* Teacher */}
          {profiles.teacher_assignments.length > 0 && (
            <ProfileCard
              icon={<GraduationCap className="w-5 h-5" />}
              title="Enseignant"
              color="text-emerald-500"
              bgColor="bg-emerald-500/10"
            >
              <div className="space-y-2">
                {profiles.teacher_assignments.map((ta, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg border border-border"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <School className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{ta.school_name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        Année scolaire: {ta.school_year_name}
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide
                      ${ta.status === 'ACTIVE' ? 'bg-success/15 text-success' : ta.status === 'SUSPENDED' ? 'bg-warning/15 text-warning' : 'bg-muted text-muted-foreground'}`}
                    >
                      {ta.status === 'ACTIVE' ? 'Actif' : ta.status === 'SUSPENDED' ? 'Suspendu' : 'Quitté'}
                    </span>
                  </div>
                ))}
              </div>
            </ProfileCard>
          )}

          {/* Student */}
          {profiles.student_enrollments.length > 0 && (
            <ProfileCard
              icon={<Users className="w-5 h-5" />}
              title="Élève"
              color="text-violet-500"
              bgColor="bg-violet-500/10"
            >
              <div className="space-y-2">
                {profiles.student_enrollments.map((se, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg border border-border"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{se.student_name}</span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span>Année: {se.school_year}</span>
                        <span>Niveau: {se.level}</span>
                        {se.classroom && <span>Classe: {se.classroom}</span>}
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide
                      ${se.status === 'ACTIVE' ? 'bg-success/15 text-success' : se.status === 'PRE_REGISTERED' ? 'bg-warning/15 text-warning' : 'bg-muted text-muted-foreground'}`}
                    >
                      {se.status === 'ACTIVE' ? 'Actif' : se.status === 'PRE_REGISTERED' ? 'Pré-inscrit' : se.status === 'COMPLETED' ? 'Terminé' : 'Abandon'}
                    </span>
                  </div>
                ))}
              </div>
            </ProfileCard>
          )}

          {/* Parent */}
          {profiles.parent_children.length > 0 && (
            <ProfileCard
              icon={<Users className="w-5 h-5" />}
              title="Parent"
              color="text-amber-500"
              bgColor="bg-amber-500/10"
            >
              <div className="space-y-2">
                {profiles.parent_children.map((pc, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg border border-border"
                  >
                    <div className="space-y-0.5">
                      <span className="text-sm font-medium">{pc.student_name}</span>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span>Année: {pc.school_year}</span>
                        <span>Niveau: {pc.level}</span>
                        {pc.classroom && <span>Classe: {pc.classroom}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ProfileCard>
          )}
        </div>
      </div>
    </div>
  )
}

function ProfileCard({
  icon,
  title,
  color,
  bgColor,
  children,
}: {
  icon: React.ReactNode
  title: string
  color: string
  bgColor: string
  children: React.ReactNode
}) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      <div className={`flex items-center gap-3 px-6 py-4 border-b border-border ${bgColor}`}>
        <span className={color}>{icon}</span>
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      <div className="px-6 py-4">{children}</div>
    </div>
  )
}
