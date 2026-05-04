import { createFileRoute } from '@tanstack/react-router'
import { Users, BookOpen, Calendar, MessageSquare, TrendingUp, Bell } from 'lucide-react'

/**
 * Parent Portal Home Page
 * Dashboard for parents to monitor their children's academic progress
 */
export const Route = createFileRoute('/_authed/parent/')({
  component: ParentDashboard,
})

function ParentDashboard() {
  const { user } = Route.useRouteContext()

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg p-8 text-white shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Portail Parent</h1>
            <p className="text-white/90 text-lg">Bienvenue, {user.full_name}</p>
          </div>
        </div>
        <p className="text-white/80">
          Suivez la scolarité de vos enfants - Notes, devoirs, présence et communications
        </p>
      </div>

      {/* Children Overview */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Mes Enfants
        </h2>
        <div className="space-y-3">
          <div className="p-4 bg-muted/50 rounded-lg text-center text-muted-foreground">
            Aucun enfant associé à votre compte pour le moment.
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ActionCard
          title="Notes et résultats"
          description="Consultez les notes de vos enfants"
          icon={TrendingUp}
          color="bg-blue-500"
        />
        <ActionCard
          title="Devoirs"
          description="Suivez les devoirs à faire"
          icon={BookOpen}
          color="bg-green-500"
        />
        <ActionCard
          title="Présence"
          description="Vérifiez la présence en classe"
          icon={Calendar}
          color="bg-purple-500"
        />
        <ActionCard
          title="Communications"
          description="Messages des enseignants"
          icon={MessageSquare}
          color="bg-orange-500"
        />
        <ActionCard
          title="Emploi du temps"
          description="Consultez les horaires de cours"
          icon={Calendar}
          color="bg-pink-500"
        />
        <ActionCard
          title="Notifications"
          description="Alertes et rappels"
          icon={Bell}
          color="bg-indigo-500"
        />
      </div>

      {/* Recent Notifications */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notifications Récentes
        </h2>
        <div className="space-y-3">
          <div className="p-4 bg-muted/50 rounded-lg text-center text-muted-foreground">
            Aucune notification pour le moment.
          </div>
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Événements à Venir
        </h2>
        <div className="space-y-3">
          <div className="p-4 bg-muted/50 rounded-lg text-center text-muted-foreground">
            Aucun événement prévu.
          </div>
        </div>
      </div>
    </div>
  )
}

interface ActionCardProps {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

function ActionCard({ title, description, icon: Icon, color }: ActionCardProps) {
  return (
    <button className="p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-all hover:scale-105 text-left group">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </button>
  )
}
