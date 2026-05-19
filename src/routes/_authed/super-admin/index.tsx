import { Link, createFileRoute } from '@tanstack/react-router'
import {
  Activity,
  BarChart,
  BookOpen,
  Database,
  Settings,
  Shield,
  Users,
} from 'lucide-react'

/**
 * Super Admin Portal Home Page
 * Platform-wide administration dashboard
 */
export const Route = createFileRoute('/_authed/super-admin/')({
  component: SuperAdminDashboard,
})

function SuperAdminDashboard() {
  const { user } = Route.useRouteContext()

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-lg p-8 text-white shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Portail Super Admin</h1>
            <p className="text-white/90 text-lg">Bienvenue, {user.full_name}</p>
          </div>
        </div>
        <p className="text-white/80">
          Gestion complète de la plateforme EduVault - Accès à tous les systèmes
          et données
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Établissements"
          value="0"
          icon={Database}
          color="bg-blue-500"
          trend="+0%"
        />
        <StatCard
          title="Utilisateurs Totaux"
          value="0"
          icon={Users}
          color="bg-green-500"
          trend="+0%"
        />
        <StatCard
          title="Activité Système"
          value="100%"
          icon={Activity}
          color="bg-purple-500"
          trend="Normal"
        />
        <StatCard
          title="Performance"
          value="Excellent"
          icon={BarChart}
          color="bg-orange-500"
          trend="+0ms"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Actions Rapides
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <ActionLink
            to="/super-admin/academic-years"
            title="Années académiques"
            description="Gérer les années académiques de référence"
            icon={BookOpen}
          />
          <ActionButton
            title="Gérer les établissements"
            description="Créer, modifier ou supprimer des établissements"
            icon={Database}
          />
          <ActionButton
            title="Gestion des utilisateurs"
            description="Administration des comptes utilisateurs"
            icon={Users}
          />
          <ActionButton
            title="Configuration système"
            description="Paramètres globaux de la plateforme"
            icon={Settings}
          />
          <ActionButton
            title="Monitoring"
            description="Surveillance en temps réel"
            icon={Activity}
          />
          <ActionButton
            title="Rapports globaux"
            description="Statistiques et analyses"
            icon={BarChart}
          />
          <ActionButton
            title="Sécurité"
            description="Gestion des accès et permissions"
            icon={Shield}
          />
        </div>
      </div>

      {/* System Status */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          État du Système
        </h2>
        <div className="space-y-3">
          <StatusRow
            label="Base de données"
            status="Opérationnel"
            variant="success"
          />
          <StatusRow
            label="API Backend"
            status="Opérationnel"
            variant="success"
          />
          <StatusRow
            label="Services de cache"
            status="Opérationnel"
            variant="success"
          />
          <StatusRow
            label="Système de fichiers"
            status="Opérationnel"
            variant="success"
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

interface ActionLinkProps {
  to: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
}

function ActionLink({ to, title, description, icon: Icon }: ActionLinkProps) {
  return (
    <Link
      to={to}
      className="p-4 bg-muted hover:bg-muted/80 rounded-lg text-left transition-colors group block"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </Link>
  )
}

interface StatusRowProps {
  label: string
  status: string
  variant: 'success' | 'warning' | 'error'
}

function StatusRow({ label, status, variant }: StatusRowProps) {
  const colors = {
    success: 'bg-success/15 text-success border-success/20',
    warning: 'bg-warning/15 text-warning border-warning/20',
    error: 'bg-destructive/15 text-destructive border-destructive/20',
  }

  return (
    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
      <span className="text-foreground font-medium">{label}</span>
      <span
        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide border ${colors[variant]}`}
      >
        {status}
      </span>
    </div>
  )
}
