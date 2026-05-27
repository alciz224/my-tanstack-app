import { createFileRoute, useRouter } from '@tanstack/react-router'
import * as React from 'react'
import { changePasswordFn } from '@/lib/auth-client'
import { FormField } from '@/components/auth/FormField'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { PasswordStrength } from '@/components/auth/PasswordStrength'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { toast } from '@/stores/toastStore'

export const Route = createFileRoute('/_authed/password/change')({
  component: PasswordChangePage,
})

function PasswordChangePage() {
  const router = useRouter()

  const [currentPassword, setCurrentPassword] = React.useState('')
  const [newPassword, setNewPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [globalError, setGlobalError] = React.useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({})

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (!currentPassword) errors.currentPassword = 'Ce champ est requis'
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
      await changePasswordFn({
        current_password: currentPassword,
        new_password: newPassword,
        new_password_confirm: confirmPassword,
      })
      toast.success('Mot de passe modifié', 'Votre mot de passe a été mis à jour avec succès.')
      router.navigate({ to: '/dashboard' })
    } catch (err) {
      setGlobalError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg py-12 px-4">
      <div className="bg-card border border-border rounded-lg p-6 shadow-lg space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Changer le mot de passe
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Saisissez votre mot de passe actuel et un nouveau mot de passe.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {globalError && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {globalError}
            </div>
          )}

          <FormField
            label="Mot de passe actuel"
            htmlFor="currentPassword"
            error={fieldErrors.currentPassword}
            required
          >
            <PasswordInput
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={loading}
              required
              autoComplete="current-password"
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

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              {loading && <LoadingSpinner size="sm" className="mr-2" />}
              Modifier le mot de passe
            </button>
            <button
              type="button"
              onClick={() => router.navigate({ to: '/dashboard' })}
              className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
