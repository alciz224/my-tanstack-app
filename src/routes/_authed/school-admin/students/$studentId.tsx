import { Link, createFileRoute } from '@tanstack/react-router'
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle2,
  Edit,
  FileText,
  GraduationCap,
  Home,
  Mail,
  MapPin,
  Phone,
  Trash2,
  UserX,
  Users,
} from 'lucide-react'
import { useState } from 'react'
import type { EnrollmentStatus } from '@/server/data/students/mocks'
import { getStudentByIdFn } from '@/server/api/students'

export const Route = createFileRoute(
  '/_authed/school-admin/students/$studentId',
)({
  component: StudentDetailPage,
  loader: async ({ params }) => {
    const student = await getStudentByIdFn({ data: params.studentId })
    if (!student) throw new Error('Student not found')
    return { student }
  },
})

const STATUS_LABELS: Record<
  EnrollmentStatus,
  { label: string; className: string }
> = {
  PRE_REGISTERED: {
    label: 'Pré-inscrit',
    className: 'bg-yellow-500/15 text-yellow-600 dark:text-yellow-400',
  },
  ACTIVE: { label: 'Actif', className: 'bg-success/15 text-success' },
  COMPLETED: {
    label: 'Terminé',
    className: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  },
  DROPPED: { label: 'Abandonné', className: 'bg-muted text-muted-foreground' },
}

function StatusBadge({ status }: { status: EnrollmentStatus }) {
  const s = STATUS_LABELS[status]
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${s.className}`}
    >
      {s.label}
    </span>
  )
}

function StudentDetailPage() {
  const { student } = Route.useLoaderData()
  const [activeTab, setActiveTab] = useState<
    'overview' | 'academic' | 'assessments'
  >('overview')
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false)

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in-up pb-12">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/school-admin/students"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux élèves</span>
        </Link>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-muted text-foreground hover:bg-muted/80 rounded-md transition-colors">
            <Edit className="w-4 h-4" /> Modifier
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Header Profile Card */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-background shadow-md overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold flex-shrink-0 z-10">
          {student.photo_url ? (
            <img
              src={student.photo_url}
              alt={student.full_name}
              className="w-full h-full object-cover"
            />
          ) : (
            `${student.first_name[0]}${student.last_name[0]}`
          )}
        </div>

        <div className="flex-1 text-center md:text-left z-10">
          <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">
              {student.full_name}
            </h1>
            <div className="flex items-center justify-center gap-2">
              <StatusBadge status={student.enrollment_status} />
              <span className="px-2.5 py-1 rounded-full bg-muted text-foreground text-xs font-mono">
                {student.annual_identifier}
              </span>
            </div>
          </div>

          <p className="text-muted-foreground text-lg mb-4">
            {student.level}{' '}
            {student.class_name && `· Classe: ${student.class_name}`}
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />{' '}
              {new Date(student.date_of_birth).toLocaleDateString('fr-FR')}
            </span>
            <span className="flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" /> {student.cycle} (
              {student.option})
            </span>
            {student.parent_phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="w-4 h-4" /> {student.parent_phone}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border flex gap-6 px-2">
        {[
          { id: 'overview', label: 'Vue générale' },
          { id: 'academic', label: 'Parcours scolaire' },
          { id: 'assessments', label: 'Notes & Bulletins' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 text-sm font-medium transition-all relative ${
              activeTab === tab.id
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Main content based on tab */}
        <div className="md:col-span-2 space-y-6">
          {activeTab === 'overview' && (
            <>
              {/* Personal Info */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" /> Informations
                  Personnelles
                </h3>
                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Prénom</p>
                    <p className="font-medium">{student.first_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Nom</p>
                    <p className="font-medium">{student.last_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Sexe</p>
                    <p className="font-medium">
                      {student.gender === 'M' ? 'Masculin' : 'Féminin'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Date de naissance
                    </p>
                    <p className="font-medium">
                      {new Date(student.date_of_birth).toLocaleDateString(
                        'fr-FR',
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Lieu de naissance
                    </p>
                    <p className="font-medium">
                      {student.birthplace_locality_name ?? 'Non renseigné'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Adresse</p>
                    <p className="font-medium">
                      {student.address ?? 'Non renseignée'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Parents Info */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" /> Tuteurs Légaux
                </h3>
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-foreground">
                        {student.parent_name ?? 'Non renseigné'}
                      </p>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Tuteur Principal
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 mt-4 text-sm">
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />{' '}
                      <span className="text-foreground">
                        {student.parent_phone ?? '—'}
                      </span>
                    </p>
                    <p className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />{' '}
                      <span className="text-foreground">
                        {student.parent_email ?? '—'}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'academic' && (
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" /> Historique
                d'inscription
              </h3>

              <div className="relative pl-6 border-l-2 border-muted space-y-8">
                {/* Current Year */}
                <div className="relative">
                  <div className="absolute -left-[33px] top-1 w-4 h-4 rounded-full bg-primary ring-4 ring-background" />
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-primary">
                        Année {student.academic_year}
                      </h4>
                      <StatusBadge status={student.enrollment_status} />
                    </div>
                    <p className="text-sm text-foreground mb-1">
                      Inscrit en{' '}
                      <strong>
                        {student.level} ({student.cycle})
                      </strong>
                    </p>
                    <p className="text-sm text-muted-foreground mb-2">
                      Classe: {student.class_name}
                    </p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Pré-inscription:{' '}
                        {new Date(student.enrollment_date).toLocaleDateString(
                          'fr-FR',
                        )}
                      </div>
                      {student.start_date && (
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-success" />
                          Début:{' '}
                          {new Date(student.start_date).toLocaleDateString(
                            'fr-FR',
                          )}
                        </div>
                      )}
                      {student.end_date && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-warning" />
                          Fin:{' '}
                          {new Date(student.end_date).toLocaleDateString(
                            'fr-FR',
                          )}
                        </div>
                      )}
                      {student.transfer_reason && (
                        <div className="flex items-center gap-1 text-warning mt-2">
                          <AlertTriangle className="w-3 h-3" />
                          Motif: {student.transfer_reason}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Previous Class (if transferred) */}
                {student.previous_class_name && (
                  <div className="relative">
                    <div className="absolute -left-[33px] top-1 w-4 h-4 rounded-full bg-muted border-2 border-muted-foreground ring-4 ring-background" />
                    <div>
                      <h4 className="font-bold text-muted-foreground">
                        Classe précédente
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {student.previous_class_name}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'assessments' && (
            <div className="bg-card border border-border rounded-xl p-12 shadow-sm text-center">
              <BookOpen className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Module d'Évaluation en cours de développement
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Le suivi des notes, des bulletins et des compétences sera
                disponible dans la Phase 5 du déploiement du portail.
              </p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Quick Actions & Alerts */}
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
              Actions Rapides
            </h3>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted text-sm font-medium transition-colors border border-transparent hover:border-border">
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-500" /> Générer
                  Bulletin
                </span>
              </button>
              <button
                onClick={() => setIsTransferModalOpen(true)}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted text-sm font-medium transition-colors border border-transparent hover:border-border"
              >
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-purple-500" /> Transférer
                  Élève
                </span>
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-muted text-sm font-medium transition-colors border border-transparent hover:border-border">
                <span className="flex items-center gap-2">
                  <UserX className="w-4 h-4 text-warning" /> Suspendre /
                  Renvoyer
                </span>
              </button>
            </div>
          </div>

          <div className="bg-warning/10 border border-warning/20 rounded-xl p-5 shadow-sm">
            <h3 className="font-semibold text-warning mb-2 flex items-center gap-2 text-sm">
              <AlertTriangle className="w-4 h-4" />
              Dossier Incomplet
            </h3>
            <p className="text-xs text-warning/80">
              Il manque des documents obligatoires pour finaliser le dossier de
              cet élève (Extrait de naissance, Certificat médical).
            </p>
            <button className="mt-3 text-xs font-bold text-warning hover:underline">
              Mettre à jour les documents
            </button>
          </div>
        </div>
      </div>

      {/* Transfer Modal */}
      {isTransferModalOpen && (
        <>
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={() => setIsTransferModalOpen(false)}
          />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card border border-border rounded-xl shadow-xl z-50 animate-scale-in p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" /> Transférer{' '}
              {student.first_name}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Selon le modèle de données ERD, un transfert met à jour la classe
              actuelle et mémorise la classe précédente (transfert interne) ou
              marque l'inscription comme terminée (transfert externe).
            </p>
            <div className="space-y-4 mb-6">
              <div className="p-3 bg-muted/30 rounded-lg border border-border">
                <p className="text-xs text-muted-foreground mb-1">
                  Classe actuelle
                </p>
                <p className="font-medium text-foreground">
                  {student.class_name}
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Type de transfert
                </label>
                <select className="w-full bg-input border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/50">
                  <option value="INTERNAL">Interne (Autre classe)</option>
                  <option value="EXTERNAL">
                    Externe (Autre établissement)
                  </option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Nouvelle classe
                </label>
                <input
                  type="text"
                  className="w-full bg-input border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/50"
                  placeholder="Ex: 6ème B"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Motif du transfert
                </label>
                <textarea
                  className="w-full bg-input border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/50 min-h-[80px]"
                  placeholder="Raison du transfert..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsTransferModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => setIsTransferModalOpen(false)}
                className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Confirmer
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
