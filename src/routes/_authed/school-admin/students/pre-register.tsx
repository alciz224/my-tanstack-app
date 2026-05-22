import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import {
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  Upload,
  User,
  Users,
} from 'lucide-react'
import { HomonymDetection } from '@/components/HomonymDetection'

export const Route = createFileRoute(
  '/_authed/school-admin/students/pre-register',
)({
  component: PreRegisterStudent,
})

function PreRegisterStudent() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/school-admin/students"
          className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Pré-inscription (Nouvel Élève)
          </h1>
          <p className="text-muted-foreground">
            Enregistrez un nouvel élève pour l'année académique courante.
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted -z-10 rounded-full" />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary -z-10 rounded-full transition-all duration-300"
          style={{ width: `${((step - 1) / 2) * 100}%` }}
        />

        {[
          { id: 1, title: 'Infos Élève', icon: User },
          { id: 2, title: 'Scolarité', icon: Briefcase },
          { id: 3, title: 'Parents', icon: Users },
        ].map((s) => {
          const active = step >= s.id
          const current = step === s.id
          return (
            <div
              key={s.id}
              className="flex flex-col items-center gap-2 bg-background px-2"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  active
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-muted text-muted-foreground'
                } ${current ? 'ring-4 ring-primary/20' : ''}`}
              >
                <s.icon className="w-5 h-5" />
              </div>
              <span
                className={`text-xs font-semibold ${active ? 'text-primary' : 'text-muted-foreground'}`}
              >
                {s.title}
              </span>
            </div>
          )
        })}
      </div>

      {/* Form Content */}
      <div className="bg-card border border-border rounded-xl shadow-sm p-6 sm:p-8 relative overflow-hidden">
        {step === 1 && <StudentInfoStep onNext={() => setStep(2)} />}
        {step === 2 && (
          <AcademicInfoStep
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <ParentsInfoStep
            onBack={() => setStep(2)}
            onSubmit={() => {
              // Mock submission delay
              setTimeout(() => navigate({ to: '/school-admin/students' }), 1000)
            }}
          />
        )}
      </div>
    </div>
  )
}

function StudentInfoStep({ onNext }: { onNext: () => void }) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  return (
    <div className="space-y-6 animate-slide-in">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <User className="w-5 h-5 text-primary" />
        Informations de l'élève
      </h2>

      <div className="flex flex-col sm:flex-row gap-8">
        <div className="flex flex-col items-center gap-3">
          <div className="w-32 h-32 rounded-xl bg-muted border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:bg-muted/80 hover:border-primary/50 transition-colors cursor-pointer group">
            <Upload className="w-8 h-8 group-hover:text-primary group-hover:scale-110 transition-transform" />
          </div>
          <button className="text-sm text-primary font-medium hover:underline">
            Ajouter une photo
          </button>
        </div>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Prénom *
            </label>
            <input
              type="text"
              className="w-full bg-input border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/50"
              placeholder="Ex: Jean"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Nom *</label>
            <input
              type="text"
              className="w-full bg-input border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/50"
              placeholder="Ex: Dupont"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          {(firstName || lastName) && (
            <div className="sm:col-span-2">
              <HomonymDetection firstName={firstName} lastName={lastName} />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Genre *
            </label>
            <select className="w-full bg-input border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/50">
              <option value="">Sélectionner</option>
              <option value="M">Masculin</option>
              <option value="F">Féminin</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Date de naissance *
            </label>
            <input
              type="date"
              className="w-full bg-input border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium text-foreground">
              Lieu de naissance
            </label>
            <input
              type="text"
              className="w-full bg-input border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/50"
              placeholder="Ex: Kinshasa"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-6 border-t border-border mt-8">
        <button
          onClick={onNext}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Suivant <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function AcademicInfoStep({
  onBack,
  onNext,
}: {
  onBack: () => void
  onNext: () => void
}) {
  return (
    <div className="space-y-6 animate-slide-in">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Briefcase className="w-5 h-5 text-primary" />
        Profil Pédagogique
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Année Scolaire d'inscription *
          </label>
          <select className="w-full bg-input border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/50">
            <option>2024-2025</option>
            <option>2025-2026</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Statut d'inscription *
          </label>
          <select className="w-full bg-input border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/50">
            <option value="PRE_REGISTERED">Pré-inscription (En attente)</option>
            <option value="ACTIVE">Confirmé (Actif)</option>
          </select>
        </div>

        <div className="col-span-1 sm:col-span-2">
          <hr className="border-border my-2" />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Cycle souhaité *
          </label>
          <select className="w-full bg-input border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/50">
            <option value="">Sélectionner un cycle</option>
            <option value="primaire">Primaire</option>
            <option value="secondaire">Secondaire</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Niveau / Classe souhaitée *
          </label>
          <select className="w-full bg-input border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/50">
            <option value="">Sélectionner d'abord le cycle</option>
            <option value="6eme">6ème Année</option>
            <option value="7eme">7ème EB (1ère Sec)</option>
          </select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <label className="text-sm font-medium text-foreground">
            École de provenance (Transfert)
          </label>
          <input
            type="text"
            className="w-full bg-input border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/50"
            placeholder="Laissez vide si non applicable"
          />
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t border-border mt-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-muted text-muted-foreground hover:text-foreground px-6 py-2.5 rounded-lg font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Retour
        </button>
        <button
          onClick={onNext}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Suivant <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function ParentsInfoStep({
  onBack,
  onSubmit,
}: {
  onBack: () => void
  onSubmit: () => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = () => {
    setIsSubmitting(true)
    onSubmit()
  }

  return (
    <div className="space-y-6 animate-slide-in">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Users className="w-5 h-5 text-primary" />
        Tuteurs Légaux
      </h2>

      <div className="bg-muted/30 rounded-xl p-5 border border-border">
        <h3 className="font-medium mb-4">Tuteur Principal (Obligatoire)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Nom complet *
            </label>
            <input
              type="text"
              className="w-full bg-input border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/50"
              placeholder="Ex: Jean Dupont"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Lien de parenté *
            </label>
            <select className="w-full bg-input border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/50">
              <option value="pere">Père</option>
              <option value="mere">Mère</option>
              <option value="oncle">Oncle / Tante</option>
              <option value="autre">Autre</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Téléphone *
            </label>
            <input
              type="tel"
              className="w-full bg-input border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/50"
              placeholder="+243 ..."
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Email (Optionnel)
            </label>
            <input
              type="email"
              className="w-full bg-input border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/50"
              placeholder="contact@email.com"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium text-foreground">
              Profession
            </label>
            <input
              type="text"
              className="w-full bg-input border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-6 border-t border-border mt-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-muted text-muted-foreground hover:text-foreground px-6 py-2.5 rounded-lg font-medium transition-colors"
          disabled={isSubmitting}
        >
          <ArrowLeft className="w-4 h-4" /> Retour
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`flex items-center gap-2 text-primary-foreground px-8 py-2.5 rounded-lg font-bold transition-all ${
            isSubmitting
              ? 'bg-primary/70 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg'
          }`}
        >
          {isSubmitting ? (
            <>Traitement...</>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" /> Terminer l'inscription
            </>
          )}
        </button>
      </div>
    </div>
  )
}
