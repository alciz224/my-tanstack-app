import { Link, createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import * as React from 'react'
import { emitAuthEvent } from '@/auth/authEvents'
import { safeRedirectPath } from '@/auth/redirects'
import { registerFn } from '@/server/auth'
import { AuthCard } from '@/components/auth/AuthCard'
import { FormField } from '@/components/auth/FormField'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { useTranslation } from '@/lib/i18n'

export const Route = createFileRoute('/_auth/register')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      from: (search.from as string) || undefined,
    }
  },
  beforeLoad: async ({ search, context }) => {
    // If already authenticated, redirect away
    const user = context.user
    if (user) {
      const destination = safeRedirectPath(search.from, '/dashboard')
      throw redirect({ to: destination, replace: true })
    }
  },
  component: RegisterPage,
})

function RegisterPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const search = Route.useSearch()

  // Form State
  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [termsAccepted, setTermsAccepted] = React.useState(false)
  const [marketingOptIn, setMarketingOptIn] = React.useState(false)

  const [loading, setLoading] = React.useState(false)

  // Error State
  const [globalError, setGlobalError] = React.useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({})

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!firstName.trim()) errors.first_name = t('errors.required', { field: t('auth.firstName') })
    if (!lastName.trim()) errors.last_name = t('errors.required', { field: t('auth.lastName') })

    if (!email.trim()) {
      errors.email = t('errors.required', { field: t('auth.email') })
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = t('errors.invalidEmail')
    }

    if (!password) {
      errors.password = t('errors.required', { field: t('auth.password') })
    } else if (password.length < 8) {
      errors.password = t('errors.passwordMinLength')
    }

    if (password !== confirmPassword) {
      errors.password_confirm = t('errors.passwordMismatch')
    }

    if (!termsAccepted) {
      // Logic for terms error if submitted
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setGlobalError(null)
    setFieldErrors({})

    if (!termsAccepted) {
      setGlobalError(t('errors.termsRequired'))
      return
    }

    if (!validateForm()) {
      setGlobalError(t('errors.fixFields'))
      return
    }

    setLoading(true)

    try {
      const result = await registerFn({
        email,
        phone: phone || undefined,
        first_name: firstName,
        last_name: lastName,
        password,
        password_confirm: confirmPassword,
        terms_accepted: termsAccepted,
        marketing_opt_in: marketingOptIn,
      })

      if (!result.success) {
        if (result.fieldErrors) {
          const mappedErrors: Record<string, string> = {}
          for (const [field, messages] of Object.entries(result.fieldErrors)) {
            mappedErrors[field] = messages.join(', ')
          }
          setFieldErrors(mappedErrors)
          setGlobalError(t('errors.fixFields'))
        } else {
          setGlobalError(result.error || t('errors.generic'))
        }
        return
      }

      // Success
      if (typeof window !== 'undefined') {
        emitAuthEvent('login') // Assuming auto-login after register, or distinct event
      }

      const destination = safeRedirectPath(search.from, '/dashboard')
      router.navigate({ to: destination, replace: true })

    } catch (err: any) {
      setGlobalError(err?.message || t('errors.network'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard
      title={t('auth.signUpTitle')}
      description={t('auth.joinToday')}
      footer={
        <div className="text-center text-sm text-muted-foreground">
          {t('auth.hasAccount')}{' '}
          <Link
            to="/login"
            search={{ from: search.from }}
            className="text-primary hover:underline font-medium"
          >
            {t('auth.signIn' as any)}
          </Link>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" aria-busy={loading}>
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label={t('auth.firstName')}
            htmlFor="firstName"
            required
            error={fieldErrors.first_name}
          >
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={loading}
              required
              autoComplete="given-name"
              className="w-full px-3 py-2 rounded-lg bg-background text-foreground border border-input focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            />
          </FormField>

          <FormField
            label={t('auth.lastName')}
            htmlFor="lastName"
            required
            error={fieldErrors.last_name}
          >
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={loading}
              required
              autoComplete="family-name"
              className="w-full px-3 py-2 rounded-lg bg-background text-foreground border border-input focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
            />
          </FormField>
        </div>

        {/* Contact Fields */}
        <FormField
          label={t('auth.email')}
          htmlFor="email"
          required
          error={fieldErrors.email}
        >
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
            autoComplete="email"
            className="w-full px-3 py-2 rounded-lg bg-background text-foreground border border-input focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          />
        </FormField>

        <FormField
          label={t('auth.phone')}
          htmlFor="phone"
          error={fieldErrors.phone}
          helperText={t('auth.phoneHelper')}
        >
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={loading}
            autoComplete="tel"
            className="w-full px-3 py-2 rounded-lg bg-background text-foreground border border-input focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          />
        </FormField>

        {/* Password Fields */}
        <FormField
          label={t('auth.password')}
          htmlFor="password"
          required
          error={fieldErrors.password}
          helperText={t('errors.passwordMinLength')}
        >
          <PasswordInput
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
            autoComplete="new-password"
          />
        </FormField>

        <FormField
          label={t('auth.confirmPassword')}
          htmlFor="confirmPassword"
          required
          error={fieldErrors.password_confirm}
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

        {/* Terms & Marketing */}
        <div className="space-y-3 pt-2">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                disabled={loading}
                required
                className="w-4 h-4 text-primary bg-background border-input rounded focus:ring-2 focus:ring-ring disabled:opacity-50"
              />
            </div>
            <div className="ml-2 text-sm">
              <label htmlFor="terms" className="text-foreground">
                {t('auth.termsAccept')}{' '}
                <a href="#" className="text-primary hover:underline font-medium">
                  {t('auth.termsService')}
                </a>{' '}
                {t('auth.and')}{' '}
                <a href="#" className="text-primary hover:underline font-medium">
                  {t('auth.privacyPolicy')}
                </a>
              </label>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="marketing"
                type="checkbox"
                checked={marketingOptIn}
                onChange={(e) => setMarketingOptIn(e.target.checked)}
                disabled={loading}
                className="w-4 h-4 text-primary bg-background border-input rounded focus:ring-2 focus:ring-ring disabled:opacity-50"
              />
            </div>
            <div className="ml-2 text-sm">
              <label htmlFor="marketing" className="text-foreground">
                {t('auth.marketingOptIn')}
              </label>
            </div>
          </div>
        </div>

        {/* Global Error */}
        {globalError && (
          <div className="p-3 rounded-lg text-sm bg-destructive/10 border border-destructive/20 text-destructive flex gap-2">
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{globalError}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
          {loading ? t('auth.creatingAccount') : t('auth.signUpButton')}
        </button>
      </form>
    </AuthCard>
  )
}
