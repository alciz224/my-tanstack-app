import { Link, Outlet, createFileRoute, redirect, useMatch } from '@tanstack/react-router'
import * as React from 'react'
import { requestPasswordResetFn } from '@/lib/auth-client'
import { AuthCard } from '@/components/auth/AuthCard'
import { FormField } from '@/components/auth/FormField'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { toast } from '@/stores/toastStore'

export const Route = createFileRoute('/_auth/password/reset')({
  beforeLoad: async ({ context }) => {
    if (context.user) {
      throw redirect({ to: '/dashboard', replace: true })
    }
  },
  component: PasswordResetPage,
})

function PasswordResetPage() {
  const isConfirm = useMatch({ from: '/_auth/password/reset/confirm', shouldThrow: false })

  if (isConfirm) {
    return <Outlet />
  }
  const [identifier, setIdentifier] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [globalError, setGlobalError] = React.useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({})
  const [submitted, setSubmitted] = React.useState(false)

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!identifier.trim()) {
      errors.identifier = 'Ce champ est requis'
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGlobalError(null)
    if (!validateForm()) return

    setLoading(true)
    try {
      await requestPasswordResetFn({ identifier: identifier.trim() })
      setSubmitted(true)
      toast.success('Code envoyé', 'Si ce compte existe, un code de réinitialisation a été envoyé.')
    } catch (err) {
      setGlobalError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <AuthCard
        title="Vérifiez vos notifications"
        description="Si un compte associé à cet identifiant existe, un code de réinitialisation a été envoyé."
      >
        <div className="text-center space-y-4">
          <div className="text-muted-foreground">
            Entrez le code reçu pour définir un nouveau mot de passe.
          </div>
          <Link
            to="/password/reset/confirm"
            search={{ identifier: identifier.trim() }}
            className="inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Entrer le code
          </Link>
          <div>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="text-sm text-primary hover:underline"
            >
              Essayer avec un autre identifiant
            </button>
          </div>
        </div>
      </AuthCard>
    )
  }

  return (
    <AuthCard
      title="Réinitialisation du mot de passe"
      description="Entrez votre email ou numéro de téléphone pour recevoir un code de réinitialisation."
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {globalError && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {globalError}
          </div>
        )}

        <FormField
          label="Email ou téléphone"
          htmlFor="identifier"
          error={fieldErrors.identifier}
          required
        >
          <input
            id="identifier"
            type="text"
            inputMode="email"
            autoComplete="username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-background text-foreground border border-input focus:outline-none focus:ring-2 focus:ring-ring transition-colors disabled:opacity-50"
            placeholder="exemple@email.com"
            disabled={loading}
          />
        </FormField>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          {loading && <LoadingSpinner size="sm" className="mr-2" />}
          Envoyer le code
        </button>

        <div className="text-center text-sm text-muted-foreground">
          <Link to="/login" search={{ from: undefined }} className="text-primary hover:underline">
            Retour à la connexion
          </Link>
        </div>
      </form>
    </AuthCard>
  )
}
