import { Link, createFileRoute } from '@tanstack/react-router'
import { Building2, MapPin, Plus, Search } from 'lucide-react'

export const Route = createFileRoute('/_authed/super-admin/schools/')({
  component: SchoolsListPage,
})

function SchoolsListPage() {
  // Mock data tailored for Guinean context
  const schools = [
    {
      id: 'SCH-001',
      name: 'Lycée Albert Camus',
      type: 'Public',
      ire: 'Conakry',
      dpe: 'Ratoma',
      status: 'Active',
      studentsCount: 2450,
    },
    {
      id: 'SCH-002',
      name: 'Groupe Scolaire Ousmane Camara',
      type: 'Privé',
      ire: 'Conakry',
      dpe: 'Dixinn',
      status: 'Active',
      studentsCount: 1200,
    },
    {
      id: 'SCH-003',
      name: "Collège Château d'Eau",
      type: 'Public',
      ire: 'Kindia',
      dpe: 'Kindia',
      status: 'Inactive',
      studentsCount: 850,
    },
    {
      id: 'SCH-004',
      name: 'Complexe Scolaire Saint-Georges',
      type: 'Privé',
      ire: 'Conakry',
      dpe: 'Matoto',
      status: 'Active',
      studentsCount: 3100,
    },
    {
      id: 'SCH-005',
      name: 'Lycée Waly Diarrah',
      type: 'Public',
      ire: 'Labé',
      dpe: 'Labé',
      status: 'Active',
      studentsCount: 1900,
    },
  ]

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Gestion des Écoles
          </h1>
          <p className="text-muted-foreground mt-1">
            Supervisez les établissements scolaires à travers la Guinée.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium transition-colors hover:bg-primary/90 btn-shine hover-scale">
          <Plus className="w-5 h-5" />
          <span>Nouvelle École</span>
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-card border border-border rounded-lg p-4 flex flex-col md:flex-row gap-4 hover-lift">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom d'école, DPE, ou code..."
            className="w-full bg-input border-none rounded-lg py-2.5 pl-10 pr-4 text-foreground focus:ring-2 focus:ring-ring focus:outline-none transition-shadow"
          />
        </div>
        <div className="flex flex-wrap sm:flex-nowrap gap-3">
          <select className="appearance-none bg-input border-none rounded-lg py-2.5 px-4 pr-8 text-foreground font-medium focus:ring-2 focus:ring-ring focus:outline-none cursor-pointer">
            <option value="">Toutes les IRE</option>
            <option value="Conakry">Conakry</option>
            <option value="Kindia">Kindia</option>
            <option value="Labé">Labé</option>
            <option value="Kankan">Kankan</option>
          </select>
          <select className="appearance-none bg-input border-none rounded-lg py-2.5 px-4 pr-8 text-foreground font-medium focus:ring-2 focus:ring-ring focus:outline-none cursor-pointer">
            <option value="">Tous les types</option>
            <option value="Public">Public</option>
            <option value="Privé">Privé</option>
            <option value="Franco-Arabe">Franco-Arabe</option>
          </select>
        </div>
      </div>

      {/* School Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {schools.map((school) => (
          <Link
            to="/super-admin/schools/$schoolId"
            params={{ schoolId: school.id }}
            key={school.id}
            className="bg-card border border-border rounded-lg p-6 hover-lift flex flex-col group transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Building2 className="w-6 h-6" />
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide
                ${
                  school.status === 'Active'
                    ? 'bg-success/15 text-success'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {school.status}
              </span>
            </div>

            <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
              {school.name}
            </h3>
            <p className="text-sm font-mono text-muted-foreground mb-4">
              {school.id}
            </p>

            <div className="space-y-3 mt-auto pt-4 border-t border-border">
              <div className="flex items-center text-sm text-foreground/80">
                <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                <span>
                  IRE {school.ire} • DPE {school.dpe}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Type:</span>
                <span className="font-medium text-foreground">
                  {school.type}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Élèves inscrits:</span>
                <span className="font-medium text-foreground">
                  {school.studentsCount.toLocaleString('fr-FR')}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
