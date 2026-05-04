import { createFileRoute } from '@tanstack/react-router'
import { FileText, Download, BarChart3, TrendingUp, Users, Building2, MapPin } from 'lucide-react'

export const Route = createFileRoute('/_authed/super-admin/reports')({
  component: ReportsPage,
})

function ReportsPage() {
  const stats = [
    { label: "Écoles Actives", value: "8,450", icon: <Building2 className="w-6 h-6 text-primary" />, trend: "+12% par rapport à l'année dernière" },
    { label: "Élèves Inscrits", value: "2.4M", icon: <Users className="w-6 h-6 text-secondary" />, trend: "+5% d'augmentation globale" },
    { label: "Taux de Réussite (BAC)", value: "48.5%", icon: <TrendingUp className="w-6 h-6 text-success" />, trend: "+2.3% par rapport à 2025" },
    { label: "Inspections (IRE) Couvertes", value: "8/8", icon: <MapPin className="w-6 h-6 text-accent" />, trend: "100% du territoire national" },
  ]

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Rapports et Statistiques</h1>
          <p className="text-muted-foreground mt-1">Vue d'ensemble des données académiques et administratives nationales.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium transition-colors hover:bg-primary/90 btn-shine hover-scale">
          <Download className="w-5 h-5" />
          <span>Exporter les données (PDF)</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-6 hover-lift flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-muted/50 rounded-lg inline-flex">
                {stat.icon}
              </div>
            </div>
            <h3 className="text-3xl font-bold text-foreground mb-1">{stat.value}</h3>
            <p className="text-sm font-medium text-foreground/80 mb-2">{stat.label}</p>
            <p className="text-xs text-muted-foreground mt-auto">{stat.trend}</p>
          </div>
        ))}
      </div>

      {/* Report Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-lg p-6 hover-lift">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
            <BarChart3 className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Performances aux Examens Nationaux</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer group">
              <div>
                <p className="font-semibold text-foreground group-hover:text-primary transition-colors">Résultats du Baccalauréat (Lycée)</p>
                <p className="text-xs text-muted-foreground">Analyses par Profil (SM, SE, SS) et par IRE.</p>
              </div>
              <Download className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
            </div>
            <div className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer group">
              <div>
                <p className="font-semibold text-foreground group-hover:text-primary transition-colors">Résultats du BEPC (Collège)</p>
                <p className="text-xs text-muted-foreground">Performances par DPE/DCE.</p>
              </div>
              <Download className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
            </div>
            <div className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer group">
              <div>
                <p className="font-semibold text-foreground group-hover:text-primary transition-colors">Résultats du CEE (Primaire)</p>
                <p className="text-xs text-muted-foreground">Taux de passage en 7ème Année.</p>
              </div>
              <Download className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 hover-lift">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
            <FileText className="w-6 h-6 text-secondary" />
            <h2 className="text-xl font-bold text-foreground">Démographie et Infrastructures</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer group">
              <div>
                <p className="font-semibold text-foreground group-hover:text-secondary transition-colors">Effectifs Scolaires 2026-2027</p>
                <p className="text-xs text-muted-foreground">Répartition Filles/Garçons et par région.</p>
              </div>
              <Download className="w-4 h-4 text-muted-foreground group-hover:text-secondary" />
            </div>
            <div className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer group">
              <div>
                <p className="font-semibold text-foreground group-hover:text-secondary transition-colors">État des Infrastructures</p>
                <p className="text-xs text-muted-foreground">Rapport sur les salles de classe, laboratoires et équipements.</p>
              </div>
              <Download className="w-4 h-4 text-muted-foreground group-hover:text-secondary" />
            </div>
            <div className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg transition-colors cursor-pointer group">
              <div>
                <p className="font-semibold text-foreground group-hover:text-secondary transition-colors">Personnel Enseignant</p>
                <p className="text-xs text-muted-foreground">Statistiques sur les enseignants déployés par DPE.</p>
              </div>
              <Download className="w-4 h-4 text-muted-foreground group-hover:text-secondary" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
