import { Link, createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import * as React from 'react'
import { emitAuthEvent } from '@/auth/authEvents'
import { safeRedirectPath } from '@/auth/redirects'
import { getCurrentUserFn, registerFn } from '@/server/auth'
import { AuthCard } from '@/components/auth/AuthCard'
import { FormField } from '@/components/auth/FormField'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { PasswordStrength } from '@/components/auth/PasswordStrength'
import { useTranslation } from '@/lib/i18n'
import { formatPhoneNumber } from '@/lib/validation'

export const Route = createFileRoute('/register')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      from: (search.from as string) || undefined,
    }
  },
  beforeLoad: async ({ search, context }) => {
    // If already authenticated, redirect away from register page
    const user = context.user ?? (await getCurrentUserFn())
    if (user) {
      const destination = safeRedirectPath(search.from, '/dashboard')
      throw redirect({ to: destination, replace: true })
    }
  },
  component: RegisterPage,
})

function RegisterPage() {
  const { t } = useTranslation()

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [passwordConfirm, setPasswordConfirm] = React.useState('')
  const [firstName, setFirstName] = React.useState('')
  const [lastName, setLastName] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [termsAccepted, setTermsAccepted] = React.useState(false)
  const [marketingOptIn, setMarketingOptIn] = React.useState(false)
  const [loading, setLoading] = React.useState(false)

  // Error states
  const [globalError, setGlobalError] = React.useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({})
  const [rateLimitSeconds, setRateLimitSeconds] = React.useState<number | null>(null)

  const router = useRouter()
  const search = Route.useSearch()

  // Countdown timer for rate limiting
  React.useEffect(() => {
    if (rateLimitSeconds === null || rateLimitSeconds <= 0) {
      setRateLimitSeconds(null)
      return
    }

    const timer = window.setInterval(() => {
      setRateLimitSeconds((prev) => {
        if (prev === null || prev <= 1) {
          return null
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      window.clearInterval(timer)
    }
  }, [rateLimitSeconds])

  // Validation on blur
  const validateEmail = () => {
    if (!email.trim()) {
      setFieldErrors((prev) => ({ ...prev, email: t('errors.required', { field: t('auth.email') }) }))
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldErrors((prev) => ({ ...prev, email: t('errors.invalidEmail') }))
    } else {
      setFieldErrors((prev) => {
        const { email: _, ...rest } = prev
        return rest
      })
    }
  }

  const validatePassword = () => {
    if (!password) {
      setFieldErrors((prev) => ({ ...prev, password: t('errors.required', { field: t('auth.password') }) }))
    } else if (password.length < 8) {
      setFieldErrors((prev) => ({
        ...prev,
        password: t('errors.passwordMinLength'),
      }))
    } else {
      setFieldErrors((prev) => {
        const { password: _, ...rest } = prev
        return rest
      })
    }
  }

  const validatePasswordConfirm = () => {
    if (!passwordConfirm) {
      setFieldErrors((prev) => ({ ...prev, password_confirm: t('errors.required', { field: t('auth.confirmPassword') }) }))
    } else if (password !== passwordConfirm) {
      setFieldErrors((prev) => ({
        ...prev,
        password_confirm: t('errors.passwordMismatch'),
      }))
    } else {
      setFieldErrors((prev) => {
        const { password_confirm: _, ...rest } = prev
        return rest
      })
    }
  }

  const validateFirstName = () => {
    if (!firstName.trim()) {
      setFieldErrors((prev) => ({ ...prev, first_name: t('errors.required', { field: t('auth.firstName') }) }))
    } else {
      setFieldErrors((prev) => {
        const { first_name: _, ...rest } = prev
        return rest
      })
    }
  }

  const validateLastName = () => {
    if (!lastName.trim()) {
      setFieldErrors((prev) => ({ ...prev, last_name: t('errors.required', { field: t('auth.lastName') }) }))
    } else {
      setFieldErrors((prev) => {
        const { last_name: _, ...rest } = prev
        return rest
      })
    }
  }

  const validatePhone = () => {
    if (phone && !/^\+224[0-9]{9}$/.test(phone)) {
      setFieldErrors((prev) => ({ ...prev, phone: t('errors.invalidPhone') }))
    } else {
      setFieldErrors((prev) => {
        const { phone: _, ...rest } = prev
        return rest
      })
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Client-side validation for terms
    if (!termsAccepted) {
      setFieldErrors((prev) => ({
        ...prev,
        terms_accepted: t('errors.termsRequired'),
      }))
      return
    }

    // Client-side password match check
    if (password !== passwordConfirm) {
      setFieldErrors((prev) => ({
        ...prev,
        password_confirm: t('errors.passwordMismatch'),
      }))
      return
    }

    setLoading(true)
    setGlobalError(null)
    setFieldErrors({})

    try {
      const result = await registerFn({
        email,
        password,
        password_confirm: passwordConfirm,
        first_name: firstName,
        last_name: lastName,
        phone: phone || undefined,
        terms_accepted: termsAccepted,
        marketing_opt_in: marketingOptIn,
      })

      if (!result.success) {
        // Handle specific error codes
        if (result.retryAfter) {
          // Rate limited
          setRateLimitSeconds(result.retryAfter)
          setGlobalError(t('errors.rateLimitMessage', { seconds: result.retryAfter }))
        } else if (result.fieldErrors) {
          // Field-level validation errors
          const mappedErrors: Record<string, string> = {}
          for (const [field, messages] of Object.entries(result.fieldErrors)) {
            mappedErrors[field] = messages.join(', ')
          }
          setFieldErrors(mappedErrors)
          setGlobalError(t('errors.fixFields'))
        } else {
          // Generic error
          setGlobalError(result.error || t('errors.generic'))
        }
        return
      }

      // Success: emit event and navigate
      if (typeof window !== 'undefined') {
        emitAuthEvent('login')
      }

      // Navigate to dashboard or onboarding with verification prompt
      const destination = safeRedirectPath(search.from, '/dashboard')
      router.navigate({ to: destination, replace: true })
    } catch (err: any) {
      setGlobalError(err?.message || t('errors.network'))
    } finally {
      setLoading(false)
    }
  }

  const isSubmitDisabled = loading || rateLimitSeconds !== null

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
            {t('nav.signIn')}
          </Link>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" aria-busy={loading}>
        {/* Name fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label={t('auth.firstName')}
            htmlFor="first-name"
            required
            error={fieldErrors.first_name}
          >
            <input
              id="first-name"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              onBlur={validateFirstName}
              disabled={loading}
              required
              autoComplete="given-name"
              aria-invalid={!!fieldErrors.first_name}
              className="w-full px-3 py-2 rounded-lg bg-background text-foreground border border-input focus:outline-none focus:ring-2 focus:ring-ring transition-colors disabled:opacity-50"
            />
          </FormField>

          <FormField
            label={t('auth.lastName')}
            htmlFor="last-name"
            required
            error={fieldErrors.last_name}
          >
            <input
              id="last-name"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              onBlur={validateLastName}
              disabled={loading}
              required
              autoComplete="family-name"
              aria-invalid={!!fieldErrors.last_name}
              className="w-full px-3 py-2 rounded-lg bg-background text-foreground border border-input focus:outline-none focus:ring-2 focus:ring-ring transition-colors disabled:opacity-50"
            />
          </FormField>
        </div>

        {/* Email */}
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
            onBlur={validateEmail}
            disabled={loading}
            required
            autoComplete="email"
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? 'email-error' : undefined}
            className="w-full px-3 py-2 rounded-lg bg-background text-foreground border border-input focus:outline-none focus:ring-2 focus:ring-ring transition-colors disabled:opacity-50"
          />
        </FormField>

        {/* Phone (optional) */}
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
            onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
            onBlur={validatePhone}
            disabled={loading}
            autoComplete="tel"
            placeholder="+224"
            aria-invalid={!!fieldErrors.phone}
            className="w-full px-3 py-2 rounded-lg bg-background text-foreground border border-input focus:outline-none focus:ring-2 focus:ring-ring transition-colors disabled:opacity-50"
          />
        </FormField>

        {/* Password */}
        <FormField
          label={t('auth.password')}
          htmlFor="password"
          required
          error={fieldErrors.password}
        >
          <PasswordInput
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={validatePassword}
            disabled={loading}
            required
            autoComplete="new-password"
            aria-invalid={!!fieldErrors.password}
            aria-describedby={
              fieldErrors.password ? 'password-error' : 'password-strength'
            }
          />
          {password && (
            <div id="password-strength" className="mt-2">
              <PasswordStrength password={password} showRequirements />
            </div>
          )}
        </FormField>

        {/* Password Confirm */}
        <FormField
          label={t('auth.confirmPassword')}
          htmlFor="password-confirm"
          required
          error={fieldErrors.password_confirm}
        >
          <PasswordInput
            id="password-confirm"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            onBlur={validatePasswordConfirm}
            disabled={loading}
            required
            autoComplete="new-password"
            aria-invalid={!!fieldErrors.password_confirm}
            aria-describedby={fieldErrors.password_confirm ? 'password-confirm-error' : undefined}
          />
        </FormField>

        {/* Terms & Marketing */}
        <div className="space-y-3">
          <div className="flex items-start">
            <input
              id="terms"
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => {
                setTermsAccepted(e.target.checked)
                if (e.target.checked) {
                  setFieldErrors((prev) => {
                    const { terms_accepted: _, ...rest } = prev
                    return rest
                  })
                }
              }}
              disabled={loading}
              required
              className="w-4 h-4 mt-0.5 text-primary bg-background border-input rounded focus:ring-2 focus:ring-ring"
            />
            <label htmlFor="terms" className="ml-2 text-sm text-foreground">
              {t('auth.termsAccept')}{' '}
              <a
                href="/terms"
                target="_blank"
                className="text-primary hover:underline"
              >
                {t('auth.termsService')}
              </a>{' '}
              {t('auth.and')}{' '}
              <a
                href="/privacy"
                target="_blank"
                className="text-primary hover:underline"
              >
                {t('auth.privacyPolicy')}
              </a>
              <span className="text-destructive ml-1">*</span>
            </label>
          </div>
          {fieldErrors.terms_accepted && (
            <p className="text-sm text-destructive flex items-center gap-1 ml-6">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {fieldErrors.terms_accepted}
            </p>
          )}

          <div className="flex items-start">
            <input
              id="marketing"
              type="checkbox"
              checked={marketingOptIn}
              onChange={(e) => setMarketingOptIn(e.target.checked)}
              disabled={loading}
              className="w-4 h-4 mt-0.5 text-primary bg-background border-input rounded focus:ring-2 focus:ring-ring"
            />
            <label htmlFor="marketing" className="ml-2 text-sm text-muted-foreground">
              {t('auth.marketingOptIn')}
            </label>
          </div>
        </div>

        {/* Global error/alert area */}
        {globalError && (
          <div
            className="p-3 rounded-lg text-sm bg-destructive/10 border border-destructive/20 text-destructive"
            role="alert"
          >
            <div className="flex items-start gap-2">
              <svg
                className="w-5 h-5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="font-semibold">
                  {rateLimitSeconds ? t('errors.rateLimited') : t('common.error')}
                </p>
                <p className="mt-1">{globalError}</p>
              </div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitDisabled}
          className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading
            ? t('auth.creatingAccount')
            : rateLimitSeconds
              ? t('errors.tryAgainIn', { seconds: rateLimitSeconds })
              : t('auth.signUpButton')}
        </button>
      </form>
    </AuthCard>
  )
}
