import { Link, createFileRoute, redirect, useRouter } from '@tanstack/react-router'
import * as React from 'react'
import { emitAuthEvent } from '@/auth/authEvents'
import { safeRedirectPath } from '@/auth/redirects'
import { getCurrentUserFn, loginFn } from '@/server/auth'
import { AuthCard } from '@/components/auth/AuthCard'
import { FormField } from '@/components/auth/FormField'
import { PasswordInput } from '@/components/auth/PasswordInput'
import { t } from '@/lib/i18n'

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      from: (search.from as string) || undefined,
    }
  },
  beforeLoad: async ({ search, context }) => {
    // If already authenticated, redirect away from login page
    const user = context.user ?? (await getCurrentUserFn())
    if (user) {
      const destination = safeRedirectPath(search.from, '/dashboard')
      throw redirect({ to: destination, replace: true })
    }
  },
  component: LoginPage,
})

function LoginPage() {
  const [identifier, setIdentifier] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [rememberMe, setRememberMe] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  
  // Error states
  const [globalError, setGlobalError] = React.useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({})
  const [isLocked, setIsLocked] = React.useState(false)
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
  const validateIdentifier = () => {
    if (!identifier.trim()) {
      setFieldErrors((prev) => ({
        ...prev,
        identifier: 'Please enter your email, phone, or username',
      }))
    } else {
      setFieldErrors((prev) => {
        const { identifier: _, ...rest } = prev
        return rest
      })
    }
  }

  const validatePassword = () => {
    if (!password) {
      setFieldErrors((prev) => ({ ...prev, password: 'Please enter your password' }))
    } else {
      setFieldErrors((prev) => {
        const { password: _, ...rest } = prev
        return rest
      })
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setGlobalError(null)
    setFieldErrors({})
    setIsLocked(false)

    try {
      const result = await loginFn({
        identifier,
        password,
        remember_me: rememberMe,
      })

      if (!result.success) {
        // Handle specific error codes
        if (result.errorCode === 'ACCOUNT_LOCKED' || result.error?.includes('locked')) {
          setIsLocked(true)
          setGlobalError(
            'Account temporarily locked. Please contact support or try again later.',
          )
        } else if (result.retryAfter) {
          // Rate limited
          setRateLimitSeconds(result.retryAfter)
          setGlobalError(`Too many attempts. Try again in ${result.retryAfter} seconds.`)
        } else if (result.fieldErrors) {
          // Field-level validation errors
          const mappedErrors: Record<string, string> = {}
          for (const [field, messages] of Object.entries(result.fieldErrors)) {
            mappedErrors[field] = messages.join(', ')
          }
          setFieldErrors(mappedErrors)
          setGlobalError('Please fix the highlighted fields.')
        } else if (
          result.errorCode === 'INVALID_CREDENTIALS' ||
          result.error?.includes('Invalid') ||
          result.error?.includes('Incorrect')
        ) {
          // 401 - don't reveal which field is wrong
          setGlobalError('Incorrect identifier or password.')
          setFieldErrors({
            identifier: ' ',
            password: ' ',
          })
        } else {
          // Generic error
          setGlobalError(result.error || 'Login failed. Please try again.')
        }
        return
      }

      // Success: emit event and navigate
      if (typeof window !== 'undefined') {
        emitAuthEvent('login')
      }

      const destination = safeRedirectPath(search.from, '/dashboard')
      router.navigate({ to: destination, replace: true })
    } catch (err: any) {
      setGlobalError(err?.message || 'Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const isSubmitDisabled = loading || rateLimitSeconds !== null || isLocked

  return (
    <AuthCard
      title={t('auth.signInTitle')}
      description={t('auth.welcomeBack')}
      footer={
        <div className="text-center text-sm text-muted-foreground">
          {t('auth.noAccount')}{' '}
          <Link
            to="/register"
            search={{ from: search.from }}
            className="text-primary hover:underline font-medium"
          >
            {t('auth.register')}
          </Link>
        </div>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4" aria-busy={loading}>
        <FormField
          label={t('auth.identifier')}
          htmlFor="identifier"
          required
          error={fieldErrors.identifier}
          helperText={t('auth.identifierHelper')}
        >
          <input
            id="identifier"
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            onBlur={validateIdentifier}
            disabled={loading}
            required
            autoComplete="username"
            aria-invalid={!!fieldErrors.identifier}
            aria-describedby={fieldErrors.identifier ? 'identifier-error' : undefined}
            className="w-full px-3 py-2 rounded-lg bg-background text-foreground border border-input focus:outline-none focus:ring-2 focus:ring-ring transition-colors disabled:opacity-50"
          />
        </FormField>

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
            autoComplete="current-password"
            aria-invalid={!!fieldErrors.password}
            aria-describedby={fieldErrors.password ? 'password-error' : undefined}
          />
        </FormField>

        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            disabled={loading}
            className="w-4 h-4 text-primary bg-background border-input rounded focus:ring-2 focus:ring-ring"
          />
          <label htmlFor="remember-me" className="ml-2 text-sm text-foreground">
            {t('auth.rememberMe')}
          </label>
        </div>

        {/* Global error/alert area */}
        {globalError && (
          <div
            className={`p-3 rounded-lg text-sm ${
              isLocked
                ? 'bg-warning/10 border border-warning/20 text-warning'
                : 'bg-destructive/10 border border-destructive/20 text-destructive'
            }`}
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
                  {isLocked
                    ? t('errors.accountLocked')
                    : rateLimitSeconds
                      ? t('errors.rateLimited')
                      : t('common.error')}
                </p>
                <p className="mt-1">{globalError}</p>
                {isLocked && (
                  <a
                    href="mailto:support@eduvault.app"
                    className="mt-2 inline-block text-sm underline"
                  >
                    {t('errors.contactSupport')}
                  </a>
                )}
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
            ? t('auth.signingIn')
            : rateLimitSeconds
              ? t('errors.tryAgainIn', { seconds: rateLimitSeconds })
              : t('auth.signInButton')}
        </button>
      </form>
    </AuthCard>
  )
}
