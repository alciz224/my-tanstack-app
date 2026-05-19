import { createFileRoute } from '@tanstack/react-router'
import { Bell, Globe, Lock, Palette, Save } from 'lucide-react'

export const Route = createFileRoute('/_authed/super-admin/configuration')({
  component: ConfigurationPage,
})

function ConfigurationPage() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Configuration Système
          </h1>
          <p className="text-muted-foreground mt-1">
            Paramètres globaux de la plateforme.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium transition-colors hover:bg-primary/90 btn-shine hover-scale">
          <Save className="w-5 h-5" />
          <span>Enregistrer les modifications</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium transition-colors shadow-sm">
            <Globe className="w-5 h-5" />
            <span>Général</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-foreground/80 hover:text-foreground hover:bg-muted rounded-lg font-medium transition-colors">
            <Lock className="w-5 h-5" />
            <span>Sécurité</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-foreground/80 hover:text-foreground hover:bg-muted rounded-lg font-medium transition-colors">
            <Bell className="w-5 h-5" />
            <span>Notifications</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-foreground/80 hover:text-foreground hover:bg-muted rounded-lg font-medium transition-colors">
            <Palette className="w-5 h-5" />
            <span>Apparence globale</span>
          </button>
        </div>

        {/* Settings Form Area */}
        <div className="md:col-span-3 space-y-6">
          <div className="bg-card border border-border rounded-lg p-6 hover-lift">
            <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">
              Informations de la Plateforme
            </h2>
            <div className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Nom de l'application
                </label>
                <input
                  type="text"
                  defaultValue="Guinée School Management"
                  className="w-full bg-input border-none rounded-lg py-2.5 px-4 text-foreground focus:ring-2 focus:ring-ring focus:outline-none transition-shadow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  URL de support
                </label>
                <input
                  type="text"
                  defaultValue="https://support.education.gov.gn"
                  className="w-full bg-input border-none rounded-lg py-2.5 px-4 text-foreground focus:ring-2 focus:ring-ring focus:outline-none transition-shadow"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Devise par défaut
                </label>
                <select className="w-full bg-input border-none rounded-lg py-2.5 px-4 text-foreground focus:ring-2 focus:ring-ring focus:outline-none transition-shadow cursor-pointer">
                  <option value="GNF">Franc Guinéen (GNF)</option>
                  <option value="USD">Dollar Américain (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 hover-lift">
            <h2 className="text-xl font-semibold text-foreground mb-4 border-b border-border pb-2">
              Règles d'Inscription
            </h2>
            <div className="space-y-4 max-w-2xl">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 rounded border-border text-primary focus:ring-ring bg-input"
                />
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  Autoriser l'auto-inscription des écoles
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 rounded border-border text-primary focus:ring-ring bg-input"
                />
                <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  Nécessite la validation d'un super administrateur
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
