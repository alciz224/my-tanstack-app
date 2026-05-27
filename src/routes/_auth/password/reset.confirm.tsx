import { Link, createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import * as React from 'react'
import { confirmPasswordResetFn } from '@/lib/auth-client'
import { AuthCard } from '@/components/auth/AuthCard'
import { FormField } from '@/components/auth/FormField'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { PasswordStrength } from '@/components/auth/PasswordStrength'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { toast } from '@/stores/toastStore'

export const Route = createFileRoute('/_auth/password/reset/confirm')({
  validateSearch: (search: Record<string, unknown>) => ({
    identifier: (search.identifier as string) || undefined,
  }),
  beforeLoad: async ({ context }) => {
    if (context.user) {
      throw redirect({ to: '/dashboard', replace: true })
    }
  },
  component: PasswordResetConfirmPage,
})

function PasswordResetConfirmPage() {
  const router = useRouter()
  const search = Route.useSearch()

  const [code, setCode] = React.useState('')
  const [newPassword, setNewPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [globalError, setGlobalError] = React.useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({})

  const identifier = search.identifier || ''

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!code.trim()) errors.code = 'Ce champ est requis'
    if (!newPassword) errors.newPassword = 'Ce champ est requis'
    else if (newPassword.length < 8) errors.newPassword = 'Minimum 8 caractères'
    if (!confirmPassword) errors.confirmPassword = 'Ce champ est requis'
    else if (newPassword !== confirmPassword) errors.confirmPassword = 'Les mots de passe ne correspondent pas'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setGlobalError(null)
    if (!validateForm()) return

    setLoading(true)
    try {
      await confirmPasswordResetFn({
        identifier: identifier || '',
        code: code.trim(),
        new_password: newPassword,
        new_password_confirm: confirmPassword,
      })
      toast.success('Mot de passe réinitialisé', 'Votre mot de passe a été modifié avec succès.')
      router.navigate({ to: '/login', search: { from: undefined } })
    } catch (err) {
      setGlobalError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard
      title="Définir un nouveau mot de passe"
      description="Entrez le code reçu et votre nouveau mot de passe."
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {globalError && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {globalError}
          </div>
        )}

        <FormField
          label="Code de réinitialisation"
          htmlFor="code"
          error={fieldErrors.code}
          required
        >
          <input
            id="code"
            type="text"
            autoComplete="one-time-code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-background text-foreground border border-input focus:outline-none focus:ring-2 focus:ring-ring transition-colors disabled:opacity-50"
            placeholder="000000"
            disabled={loading}
          />
        </FormField>

        <FormField
          label="Nouveau mot de passe"
          htmlFor="newPassword"
          error={fieldErrors.newPassword}
          required
        >
          <PasswordInput
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={loading}
            required
            autoComplete="new-password"
          />
        </FormField>

        <PasswordStrength password={newPassword} />

        <FormField
          label="Confirmer le mot de passe"
          htmlFor="confirmPassword"
          error={fieldErrors.confirmPassword}
          required
        >
          <PasswordInput
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            disabled={loading}
            required
            autoComplete="new-password"
          />
        </FormField>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          {loading && <LoadingSpinner size="sm" className="mr-2" />}
          Réinitialiser le mot de passe
        </button>

        <div className="text-center text-sm text-muted-foreground">
          <Link to="/password/reset" className="text-primary hover:underline">
            Renvoyer le code
          </Link>
          {' | '}
          <Link to="/login" search={{ from: undefined }} className="text-primary hover:underline">
            Retour à la connexion
          </Link>
        </div>
      </form>
    </AuthCard>
  )
}
