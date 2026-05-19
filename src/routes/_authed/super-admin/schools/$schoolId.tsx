import { Link, createFileRoute } from '@tanstack/react-router'
import {
  Activity,
  ArrowLeft,
  BookOpen,
  Building2,
  Edit,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Settings,
  Shield,
  Users,
} from 'lucide-react'

export const Route = createFileRoute('/_authed/super-admin/schools/$schoolId')({
  component: SchoolDetailPage,
})

function SchoolDetailPage() {
  const { schoolId } = Route.useParams()

  // Mock detail data based on Guinean context
  const school = {
    id: schoolId,
    name:
      schoolId === 'SCH-001'
        ? 'Lycée Albert Camus'
        : 'Groupe Scolaire Ousmane Camara',
    type: schoolId === 'SCH-001' ? 'Public' : 'Privé',
    status: 'Active',
    ire: 'Conakry',
    dpe: schoolId === 'SCH-001' ? 'Ratoma' : 'Dixinn',
    address: 'Quartier Kipé, Commune de Ratoma, Conakry',
    phone: '+224 622 00 11 22',
    email: 'contact@albertcamus.edu.gn',
    principal: 'M. Ibrahima Sory Diallo',
    stats: {
      students: 2450,
      teachers: 85,
      classrooms: 42,
      cycles: ['Collège', 'Lycée'],
    },
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Back Navigation */}
      <div>
        <Link
          to="/super-admin/schools"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à la liste des écoles
        </Link>
      </div>

      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-lg">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/20 flex items-center justify-center text-white border border-white/20 shadow-sm backdrop-blur-sm">
            <Building2 className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                {school.name}
              </h1>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide bg-white/20 text-white backdrop-blur-sm border border-white/30">
                {school.status}
              </span>
            </div>
            <p className="text-white/80 font-mono text-sm mb-2">{school.id}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-white/90">
              <span className="flex items-center">
                <MapPin className="w-4 h-4 mr-1.5 text-white/70" />{' '}
                {school.address}
              </span>
              <span className="flex items-center">
                <Shield className="w-4 h-4 mr-1.5 text-white/70" /> Type:{' '}
                {school.type}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button className="flex-1 sm:flex-none items-center justify-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white border border-white/20 rounded-lg font-medium transition-colors hover-scale flex backdrop-blur-sm">
            <Edit className="w-4 h-4" />
            <span>Modifier</span>
          </button>
          <button className="flex-1 sm:flex-none items-center justify-center gap-2 px-4 py-2 bg-white text-blue-700 hover:text-blue-800 rounded-lg font-medium transition-colors hover:bg-white/90 btn-shine hover-scale flex shadow-sm">
            <Settings className="w-4 h-4" />
            <span>Configuration</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Main Info & Stats) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Statistics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-lg p-5 flex flex-col items-center justify-center text-center hover-lift">
              <Users className="w-6 h-6 text-primary mb-2" />
              <span className="text-2xl font-bold text-foreground mb-1">
                {school.stats.students.toLocaleString('fr-FR')}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Élèves
              </span>
            </div>
            <div className="bg-card border border-border rounded-lg p-5 flex flex-col items-center justify-center text-center hover-lift">
              <GraduationCap className="w-6 h-6 text-secondary mb-2" />
              <span className="text-2xl font-bold text-foreground mb-1">
                {school.stats.teachers}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Enseignants
              </span>
            </div>
            <div className="bg-card border border-border rounded-lg p-5 flex flex-col items-center justify-center text-center hover-lift">
              <BookOpen className="w-6 h-6 text-accent mb-2" />
              <span className="text-2xl font-bold text-foreground mb-1">
                {school.stats.classrooms}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Salles
              </span>
            </div>
            <div className="bg-card border border-border rounded-lg p-5 flex flex-col items-center justify-center text-center hover-lift">
              <Activity className="w-6 h-6 text-emerald-500 mb-2" />
              <span className="text-2xl font-bold text-foreground mb-1">
                {school.stats.cycles.length}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Cycles
              </span>
            </div>
          </div>

          {/* Detailed Info Card */}
          <div className="bg-card border border-border rounded-lg p-6 hover-lift">
            <h2 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">
              Informations Académiques
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Inspection Régionale (IRE)
                </p>
                <p className="font-medium text-foreground">{school.ire}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Direction Préfectorale (DPE/DCE)
                </p>
                <p className="font-medium text-foreground">{school.dpe}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Directeur / Proviseur
                </p>
                <p className="font-medium text-foreground">
                  {school.principal}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Cycles d'enseignement
                </p>
                <div className="flex gap-2 flex-wrap">
                  {school.stats.cycles.map((cycle) => (
                    <span
                      key={cycle}
                      className="bg-muted text-foreground/80 px-2 py-0.5 rounded text-sm"
                    >
                      {cycle}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Contact & Actions) */}
        <div className="space-y-6">
          {/* Contact Card */}
          <div className="bg-card border border-border rounded-lg p-6 hover-lift">
            <h2 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">
              Coordonnées
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Adresse complète
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {school.address}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Téléphone
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {school.phone}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Email de contact
                  </p>
                  <a
                    href={`mailto:${school.email}`}
                    className="text-sm text-primary hover:underline"
                  >
                    {school.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card border border-border rounded-lg p-6 hover-lift">
            <h2 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">
              Accès Rapide
            </h2>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors group">
                <div className="flex items-center gap-3 text-foreground/80 group-hover:text-foreground">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Gérer le personnel
                  </span>
                </div>
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors group">
                <div className="flex items-center gap-3 text-foreground/80 group-hover:text-foreground">
                  <GraduationCap className="w-4 h-4" />
                  <span className="text-sm font-medium">Gérer les élèves</span>
                </div>
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors group">
                <div className="flex items-center gap-3 text-foreground/80 group-hover:text-foreground">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Programmes académiques
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
