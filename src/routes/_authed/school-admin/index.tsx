import { createFileRoute } from '@tanstack/react-router'
import { Building2, Users, Calendar, FileText, Settings, TrendingUp } from 'lucide-react'

/**
 * School Admin Portal Home Page
 * Establishment-level administration dashboard
 */
export const Route = createFileRoute('/_authed/school-admin/')({
  component: SchoolAdminDashboard,
})

function SchoolAdminDashboard() {
  const { user } = Route.useRouteContext()

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-8 text-white shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Portail Admin École</h1>
            <p className="text-white/90 text-lg">Bienvenue, {user.full_name}</p>
          </div>
        </div>
        <p className="text-white/80">
          Gérez votre établissement - Personnel, élèves, emplois du temps et ressources
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Élèves"
          value="0"
          icon={Users}
          color="bg-blue-500"
          trend="+0%"
        />
        <StatCard
          title="Enseignants"
          value="0"
          icon={Users}
          color="bg-green-500"
          trend="+0%"
        />
        <StatCard
          title="Classes"
          value="0"
          icon={Calendar}
          color="bg-purple-500"
          trend="+0%"
        />
        <StatCard
          title="Présence"
          value="0%"
          icon={TrendingUp}
          color="bg-orange-500"
          trend="Aujourd'hui"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Actions Rapides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ActionButton
            title="Gestion des élèves"
            description="Inscrire, modifier ou archiver des élèves"
            icon={Users}
          />
          <ActionButton
            title="Gestion du personnel"
            description="Enseignants et personnel administratif"
            icon={Users}
          />
          <ActionButton
            title="Emplois du temps"
            description="Créer et gérer les horaires"
            icon={Calendar}
          />
          <ActionButton
            title="Rapports"
            description="Statistiques et analyses"
            icon={FileText}
          />
          <ActionButton
            title="Configuration école"
            description="Paramètres de l'établissement"
            icon={Settings}
          />
          <ActionButton
            title="Inscriptions"
            description="Gérer les nouvelles inscriptions"
            icon={Building2}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Activité Récente</h2>
        <div className="space-y-3">
          <ActivityItem
            action="Aucune activité récente"
            time="—"
            type="info"
          />
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

interface ActivityItemProps {
  action: string
  time: string
  type: 'info' | 'success' | 'warning'
}

function ActivityItem({ action, time, type }: ActivityItemProps) {
  const colors = {
    info: 'bg-blue-100 dark:bg-blue-900/20',
    success: 'bg-green-100 dark:bg-green-900/20',
    warning: 'bg-yellow-100 dark:bg-yellow-900/20',
  }

  return (
    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
      <div className="flex items-center gap-3">
        <div className={`w-2 h-2 rounded-full ${colors[type]}`} />
        <span className="text-foreground">{action}</span>
      </div>
      <span className="text-sm text-muted-foreground">{time}</span>
    </div>
  )
}
