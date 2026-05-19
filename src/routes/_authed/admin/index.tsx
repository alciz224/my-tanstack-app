import { createFileRoute } from '@tanstack/react-router'
import {
  Activity,
  Database,
  FileText,
  Settings,
  Shield,
  Users,
} from 'lucide-react'

/**
 * Admin Portal Home Page
 * General administration dashboard
 */
export const Route = createFileRoute('/_authed/admin/')({
  component: AdminDashboard,
})

function AdminDashboard() {
  const { user } = Route.useRouteContext()

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-8 text-white shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <Settings className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Portail Administrateur</h1>
            <p className="text-white/90 text-lg">Bienvenue, {user.full_name}</p>
          </div>
        </div>
        <p className="text-white/80">
          Administration générale - Gestion des utilisateurs, contenus et
          paramètres
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Utilisateurs"
          value="0"
          icon={Users}
          color="bg-blue-500"
          trend="+0%"
        />
        <StatCard
          title="Contenus"
          value="0"
          icon={FileText}
          color="bg-green-500"
          trend="+0%"
        />
        <StatCard
          title="Base de données"
          value="0 MB"
          icon={Database}
          color="bg-purple-500"
          trend="Normal"
        />
        <StatCard
          title="Activité"
          value="0"
          icon={Activity}
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
            title="Gestion des utilisateurs"
            description="Créer, modifier ou désactiver des comptes"
            icon={Users}
          />
          <ActionButton
            title="Gestion des contenus"
            description="Gérer les cours et ressources"
            icon={FileText}
          />
          <ActionButton
            title="Configuration"
            description="Paramètres du système"
            icon={Settings}
          />
          <ActionButton
            title="Rapports"
            description="Statistiques et analyses"
            icon={Activity}
          />
          <ActionButton
            title="Sécurité"
            description="Permissions et accès"
            icon={Shield}
          />
          <ActionButton
            title="Base de données"
            description="Maintenance et sauvegarde"
            icon={Database}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Activité Récente
        </h2>
        <div className="space-y-3">
          <ActivityItem action="Aucune activité récente" time="—" type="info" />
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
