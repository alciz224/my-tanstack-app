import { createFileRoute } from '@tanstack/react-router'
import {
  CheckCircle2,
  XCircle,
  GraduationCap,
  Calendar,
  ShieldCheck,
  Phone,
  Mail,
  Home,
} from 'lucide-react'
import { getPublicStudentCardInfoFn } from '@/server/api/students'
import { generateStudentAvatar } from '@/lib/utils'
import { LandingNavbar } from '@/components/LandingNavbar'
import { LandingFooter } from '@/components/LandingFooter'

export const Route = createFileRoute('/verify-student/$studentId')({
  component: VerifyStudentPage,
  loader: async ({ params }) => {
    const student = await getPublicStudentCardInfoFn({ data: params.studentId })
    return { student }
  },
})

function VerifyStudentPage() {
  const { student } = Route.useLoaderData()

  if (!student) {
    return (
      <>
        <LandingNavbar />
        <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4 pt-20">
          <div className="bg-card border border-border rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-12 h-12 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Carte Invalide
            </h1>
            <p className="text-muted-foreground">
              Cet identifiant ne correspond à aucun élève enregistré dans notre
              système.
            </p>
          </div>
        </div>
        <LandingFooter />
      </>
    )
  }

  const isActive = student.enrollment_status === 'ACTIVE'
  const avatarUrl =
    student.photo_url ||
    generateStudentAvatar(
      student.full_name.split(' ')[0],
      student.full_name.split(' ')[1] || '',
      'M',
    )

  return (
    <div className="min-h-screen flex flex-col">
      <LandingNavbar />
      
      <main className="flex-1 bg-gradient-to-b from-primary/5 to-background flex items-center justify-center p-4 pt-24 pb-12">
        <div className="max-w-md w-full animate-fade-in-up">
          {/* Verification Status Header */}
          <div
            className={`flex items-center justify-center gap-2 mb-6 px-4 py-2 rounded-full mx-auto w-fit font-bold uppercase tracking-wider text-xs ${
              isActive
                ? 'bg-success/10 text-success border border-success/20'
                : 'bg-warning/10 text-warning border border-warning/20'
            }`}
          >
            {isActive ? (
              <>
                <CheckCircle2 className="w-4 h-4" /> Statut Vérifié
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" /> Statut:{' '}
                {student.enrollment_status}
              </>
            )}
          </div>

          <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
            {/* Top Banner */}
            <div className="h-24 bg-primary relative">
              <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                <img
                  src={avatarUrl}
                  alt={student.full_name}
                  className="w-24 h-24 rounded-full border-4 border-card shadow-lg object-cover"
                />
              </div>
            </div>

            <div className="pt-16 pb-8 px-6 text-center">
              <h1 className="text-2xl font-bold text-foreground mb-1">
                {student.full_name}
              </h1>
              <p className="text-sm font-mono text-muted-foreground mb-6">
                {student.annual_identifier}
              </p>

              <div className="space-y-4 text-left">
                <div className="bg-muted/40 rounded-xl p-4 flex items-center gap-4 border border-border/50">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    <Home className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">
                      Établissement
                    </p>
                    <p className="font-bold text-foreground">
                      {student.school_name}
                    </p>
                  </div>
                </div>

                <div className="bg-muted/40 rounded-xl p-4 flex items-center gap-4 border border-border/50">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">
                      Classe & Niveau
                    </p>
                    <p className="font-bold text-foreground">
                      {student.class_name} · {student.level}
                    </p>
                  </div>
                </div>

                <div className="bg-muted/40 rounded-xl p-4 flex items-center gap-4 border border-border/50">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">
                      Année Scolaire
                    </p>
                    <p className="font-bold text-foreground">
                      {student.academic_year}
                    </p>
                  </div>
                </div>

                {/* Parent Contact */}
                <div className="bg-muted/40 rounded-xl p-4 flex items-center gap-4 border border-border/50">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-semibold">
                      Contact Parent/Tuteur
                    </p>
                    <p className="font-bold text-foreground">
                      {student.parent_phone || 'Non renseigné'}
                    </p>
                  </div>
                </div>

                {/* School Contact */}
                <div className="bg-muted/40 rounded-xl p-4 flex flex-col gap-3 border border-border/50">
                  <p className="text-xs text-muted-foreground uppercase font-semibold border-b border-border/50 pb-2">
                    Contact Établissement
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      <Phone className="w-4 h-4" />
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      {student.school_phone}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                      <Mail className="w-4 h-4" />
                    </div>
                    <p className="text-sm font-medium text-foreground truncate">
                      {student.school_email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <div className="flex items-center justify-center gap-2 text-primary font-bold">
                  <ShieldCheck className="w-5 h-5" />
                  <span>GuiSchool Officiel</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Plateforme de Gestion Académique de Guinée
                </p>
              </div>
            </div>
          </div>

          <p className="text-center text-muted-foreground text-xs mt-6">
            Ce lien de vérification expire à la fin de l&apos;année scolaire en
            cours.
          </p>
        </div>
      </main>

      <LandingFooter />
    </div>
  )
}
