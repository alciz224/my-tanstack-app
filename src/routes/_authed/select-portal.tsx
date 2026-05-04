import {
  GraduationCap,
  BookOpen,
  Users,
  Settings,
  Building2,
  Shield
} from 'lucide-react'
import { createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { selectRoleFn } from '@/server/auth'
import { toast } from '@/stores/toastStore'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { PORTAL_LABELS, PORTAL_ROUTES, type UserRole, isValidRole } from '@/types/roles'


/**
 * Role Selection Page
 * 
 * Allows users with multiple available roles to select which portal they want to access.
 * Auto-redirects if user only has one role available.
 */
export const Route = createFileRoute('/_authed/select-portal')({
  beforeLoad: ({ context }) => {
    const user = context.user

    // Ensure user is authenticated (should be guaranteed by _authed layout)
    if (!user) {
      throw redirect({ to: '/login', search: { from: undefined } })
    }

    // Note: We don't auto-redirect users with only one role anymore.
    // This was causing issues because user.role is still null until they explicitly select.
    // Let them click even if they only have one option - it's more explicit and safer.

    return { user }
  },
  component: SelectPortalPage,
})

/**
 * Icon mapping for each role
 */
const ROLE_ICONS: Record<UserRole, React.ComponentType<{ className?: string }>> = {
  student: GraduationCap,
  teacher: BookOpen,
  parent: Users,
  admin: Settings,
  school_admin: Building2,
  super_admin: Shield,
}

/**
 * Color schemes for portal cards
 */
const ROLE_COLORS: Record<UserRole, { bg: string; border: string; icon: string; hover: string }> = {
  student: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    icon: 'text-blue-600',
    hover: 'hover:border-blue-500/60',
  },
  teacher: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/30',
    icon: 'text-green-600',
    hover: 'hover:border-green-500/60',
  },
  parent: {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    icon: 'text-purple-600',
    hover: 'hover:border-purple-500/60',
  },
  admin: {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    icon: 'text-orange-600',
    hover: 'hover:border-orange-500/60',
  },
  school_admin: {
    bg: 'bg-indigo-500/10',
    border: 'border-indigo-500/30',
    icon: 'text-indigo-600',
    hover: 'hover:border-indigo-500/60',
  },
  super_admin: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/30',
    icon: 'text-red-600',
    hover: 'hover:border-red-500/60',
  },
}

function SelectPortalPage() {
  const { user } = Route.useRouteContext()
  const router = useRouter()
  const [selecting, setSelecting] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)

  // Filter available roles to only valid ones
  const validRoles = user.available_roles?.filter(isValidRole) || []

  /**
   * Handle role selection
   */
  const handleSelectRole = async (role: UserRole) => {
    setSelecting(true)
    setSelectedRole(role)

    if (import.meta.env.DEV) {
      console.debug('[select-portal] Selecting role:', role)
    }

    try {
      const result = await selectRoleFn({ role })

      if (import.meta.env.DEV) {
        console.debug('[select-portal] selectRoleFn result:', result)
      }

      if (!result.success) {
        toast.error(
          'Erreur de sélection',
          result.error || 'Impossible de sélectionner ce rôle. Veuillez réessayer.'
        )
        setSelecting(false)
        setSelectedRole(null)
        return
      }

      toast.success(
        'Portail sélectionné',
        `Bienvenue dans le ${PORTAL_LABELS[role].title}`
      )

      // Invalidate the router so __root.tsx re-runs beforeLoad with a fresh
      // getCurrentUserFn() call.  The backend session already has the updated
      // role thanks to the successful selectRoleFn() above.
      await router.invalidate()

      if (import.meta.env.DEV) {
        console.debug('[select-portal] router invalidated, navigating to:', PORTAL_ROUTES[role])
      }

      // Navigate to the portal — root beforeLoad will fetch the fresh user
      // with the role set, so _authed guard will pass.
      const destination = PORTAL_ROUTES[role]
      await router.navigate({ to: destination, replace: true })
    } catch (err: any) {
      if (import.meta.env.DEV) {
        console.error('[select-portal] Error during role selection:', err)
      }
      toast.error(
        'Erreur réseau',
        err?.message || 'Une erreur est survenue lors de la sélection du portail.'
      )
      setSelecting(false)
      setSelectedRole(null)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-secondary mb-6 shadow-lg">
            <span className="text-3xl font-black text-primary-foreground">EV</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Sélectionnez votre portail
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Bonjour <span className="font-semibold text-foreground">{user.full_name}</span>,
            vous avez accès à plusieurs portails. Veuillez choisir celui que vous souhaitez utiliser.
          </p>
          {user.role && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-lg text-sm text-muted-foreground">
              <span>Portail actuel:</span>
              <span className="font-semibold text-foreground">
                {PORTAL_LABELS[user.role as UserRole]?.title || user.role}
              </span>
            </div>
          )}
        </div>

        {/* Portal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {validRoles.map((role) => {
            const Icon = ROLE_ICONS[role]
            const colors = ROLE_COLORS[role]
            const labels = PORTAL_LABELS[role]
            const isSelecting = selecting && selectedRole === role

            return (
              <button
                key={role}
                onClick={() => handleSelectRole(role)}
                disabled={selecting}
                className={`
                  relative p-6 rounded-xl border-2 transition-all duration-300
                  ${colors.bg} ${colors.border} ${colors.hover}
                  hover:shadow-lg hover:scale-105
                  disabled:opacity-50 disabled:cursor-not-allowed
                  disabled:hover:scale-100
                  focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                  text-left
                  ${isSelecting ? 'scale-105 shadow-lg' : ''}
                `}
              >
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-lg bg-background/60 mb-4`}>
                  <Icon className={`w-8 h-8 ${colors.icon}`} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {labels.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-4">
                  {labels.description}
                </p>

                {/* Action button */}
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-semibold ${colors.icon}`}>
                    {isSelecting ? 'Chargement...' : 'Accéder'}
                  </span>
                  {isSelecting ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <svg
                      className={`w-5 h-5 ${colors.icon} transition-transform group-hover:translate-x-1`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                </div>

                {/* Selection overlay */}
                {isSelecting && (
                  <div className="absolute inset-0 bg-background/50 rounded-xl flex items-center justify-center">
                    <LoadingSpinner size="lg" />
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* No roles available fallback */}
        {validRoles.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Shield className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Aucun portail disponible
            </h3>
            <p className="text-muted-foreground">
              Aucun rôle n'est actuellement attribué à votre compte.
              Veuillez contacter l'administrateur.
            </p>
          </div>
        )}

        {/* Help text */}
        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            Vous pourrez changer de portail à tout moment depuis le menu utilisateur.
          </p>
        </div>
      </div>
    </div>
  )
}
