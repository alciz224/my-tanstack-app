import { Component, type ReactNode, type ErrorInfo } from 'react'
import { useRouter } from '@tanstack/react-router'
import { useTranslation } from '@/lib/i18n'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: (error: Error, reset: () => void) => ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * Error Boundary component for catching React errors
 * Provides a fallback UI when errors occur
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (import.meta.env.MODE !== 'production') {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }
    
    // In production, you might want to log to an error tracking service
    // logErrorToService(error, errorInfo)
  }

  reset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.reset)
      }
      return <DefaultErrorFallback error={this.state.error} reset={this.reset} />
    }

    return this.props.children
  }
}

/**
 * Default error fallback UI
 */
function DefaultErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  const { t } = useTranslation()
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
              <svg
                className="w-8 h-8 text-destructive"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {t('errors.somethingWentWrong') || 'Something went wrong'}
            </h1>
            <p className="text-muted-foreground mb-4">
              {t('errors.unexpectedError') || 'An unexpected error occurred'}
            </p>
            
            {import.meta.env.MODE !== 'production' && (
              <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-left">
                <p className="text-sm font-mono text-destructive break-all">
                  {error.message}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <button
              onClick={reset}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              {t('actions.tryAgain') || 'Try Again'}
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
            >
              {t('actions.goHome') || 'Go to Home'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Auth-specific error fallback
 * Shows when authentication errors occur
 */
export function AuthErrorFallback({ error, reset }: { error: Error; reset: () => void }) {
  const { t } = useTranslation()
  const router = useRouter()

  const handleLoginRedirect = () => {
    router.navigate({ to: '/login', search: { from: undefined }, replace: true })
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg shadow-lg p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
              <svg
                className="w-8 h-8 text-destructive"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {t('errors.authError') || 'Authentication Error'}
            </h1>
            <p className="text-muted-foreground mb-4">
              {t('errors.authErrorMessage') || 'Your session may have expired or you may not have permission to access this page.'}
            </p>
            
            {import.meta.env.MODE !== 'production' && (
              <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-left">
                <p className="text-sm font-mono text-destructive break-all">
                  {error.message}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <button
              onClick={handleLoginRedirect}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              {t('nav.signIn') || 'Sign In'}
            </button>
            <button
              onClick={reset}
              className="w-full px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors"
            >
              {t('actions.tryAgain') || 'Try Again'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
