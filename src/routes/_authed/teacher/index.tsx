import { createFileRoute } from '@tanstack/react-router'
import { BookOpen, Users, Calendar, FileText, ClipboardCheck, TrendingUp } from 'lucide-react'

/**
 * Teacher Portal Home Page
 * Dashboard for teachers to manage classes and students
 */
export const Route = createFileRoute('/_authed/teacher/')({
  component: TeacherDashboard,
})

function TeacherDashboard() {
  const { user } = Route.useRouteContext()

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-lg p-8 text-white shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <BookOpen className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Portail Enseignant</h1>
            <p className="text-white/90 text-lg">Bienvenue, {user.full_name}</p>
          </div>
        </div>
        <p className="text-white/80">
          Gérez vos classes et évaluations - Emploi du temps, devoirs et suivi des élèves
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Mes Classes"
          value="0"
          icon={Users}
          color="bg-blue-500"
          trend="Active"
        />
        <StatCard
          title="Élèves"
          value="0"
          icon={Users}
          color="bg-green-500"
          trend="Total"
        />
        <StatCard
          title="Devoirs en attente"
          value="0"
          icon={ClipboardCheck}
          color="bg-orange-500"
          trend="À corriger"
        />
        <StatCard
          title="Cours cette semaine"
          value="0"
          icon={Calendar}
          color="bg-purple-500"
          trend="Planifiés"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Actions Rapides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ActionButton
            title="Mes classes"
            description="Gérer vos classes et élèves"
            icon={Users}
          />
          <ActionButton
            title="Créer un devoir"
            description="Assigner un nouveau devoir"
            icon={ClipboardCheck}
          />
          <ActionButton
            title="Emploi du temps"
            description="Consulter votre planning"
            icon={Calendar}
          />
          <ActionButton
            title="Notes et évaluations"
            description="Saisir des notes"
            icon={TrendingUp}
          />
          <ActionButton
            title="Ressources pédagogiques"
            description="Gérer vos documents"
            icon={FileText}
          />
          <ActionButton
            title="Présence"
            description="Prendre les présences"
            icon={ClipboardCheck}
          />
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Emploi du Temps - Aujourd'hui
        </h2>
        <div className="space-y-3">
          <div className="p-4 bg-muted/50 rounded-lg text-center text-muted-foreground">
            Aucun cours prévu aujourd'hui.
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Activité Récente</h2>
        <div className="space-y-3">
          <div className="p-4 bg-muted/50 rounded-lg text-center text-muted-foreground">
            Aucune activité récente.
          </div>
        </div>
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  trend: string
}

function StatCard({ title, value, icon: Icon, color, trend }: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <span className="text-sm text-muted-foreground">{trend}</span>
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-1">{value}</h3>
      <p className="text-sm text-muted-foreground">{title}</p>
    </div>
  )
}

interface ActionButtonProps {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

function ActionButton({ title, description, icon: Icon }: ActionButtonProps) {
  return (
    <button className="p-4 bg-muted hover:bg-muted/80 rounded-lg text-left transition-colors group">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </button>
  )
}
