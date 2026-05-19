import { createFileRoute } from '@tanstack/react-router'
import {
  BookOpen,
  Calendar,
  ClipboardCheck,
  FileText,
  GraduationCap,
  TrendingUp,
} from 'lucide-react'

/**
 * Student Portal Home Page
 * Dashboard for students to access courses and assignments
 */
export const Route = createFileRoute('/_authed/student/')({
  component: StudentDashboard,
})

function StudentDashboard() {
  const { user } = Route.useRouteContext()

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg p-8 text-white shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Portail Étudiant</h1>
            <p className="text-white/90 text-lg">Bienvenue, {user.full_name}</p>
          </div>
        </div>
        <p className="text-white/80">
          Accédez à vos cours, notes et devoirs - Suivez votre progression
          académique
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Cours actifs"
          value="0"
          icon={BookOpen}
          color="bg-blue-500"
          trend="Ce semestre"
        />
        <StatCard
          title="Devoirs à rendre"
          value="0"
          icon={ClipboardCheck}
          color="bg-orange-500"
          trend="En attente"
        />
        <StatCard
          title="Moyenne générale"
          value="—"
          icon={TrendingUp}
          color="bg-green-500"
          trend="—"
        />
        <StatCard
          title="Prochains cours"
          value="0"
          icon={Calendar}
          color="bg-purple-500"
          trend="Aujourd'hui"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <GraduationCap className="w-5 h-5" />
          Actions Rapides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ActionButton
            title="Mes cours"
            description="Accéder à vos cours en ligne"
            icon={BookOpen}
          />
          <ActionButton
            title="Mes devoirs"
            description="Consulter et rendre les devoirs"
            icon={ClipboardCheck}
          />
          <ActionButton
            title="Mes notes"
            description="Voir vos résultats"
            icon={TrendingUp}
          />
          <ActionButton
            title="Emploi du temps"
            description="Consulter votre planning"
            icon={Calendar}
          />
          <ActionButton
            title="Ressources"
            description="Télécharger les documents"
            icon={FileText}
          />
          <ActionButton
            title="Présence"
            description="Voir votre assiduité"
            icon={ClipboardCheck}
          />
        </div>
      </div>

      {/* Upcoming Assignments */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <ClipboardCheck className="w-5 h-5" />
          Devoirs à Venir
        </h2>
        <div className="space-y-3">
          <div className="p-4 bg-muted/50 rounded-lg text-center text-muted-foreground">
            Aucun devoir à rendre pour le moment.
          </div>
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
        <div
          className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}
        >
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
