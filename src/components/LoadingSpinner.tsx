import type { ReactNode } from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * Loading spinner component
 * Shows an animated spinner for loading states
 */
export function LoadingSpinner({ size = 'md', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-4',
    lg: 'h-12 w-12 border-4',
  }

  return (
    <div
      className={`inline-block animate-spin rounded-full border-solid border-primary border-r-transparent ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

/**
 * Full page loading component
 */
export function FullPageLoading({ message }: { message?: string }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center">
        <LoadingSpinner size="lg" className="mb-4" />
        {message && <p className="text-muted-foreground">{message}</p>}
      </div>
    </div>
  )
}

/**
 * Button loading state
 */
export function ButtonLoading({ children, isLoading }: { children: ReactNode; isLoading: boolean }) {
  return (
    <>
      {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
      {children}
    </>
  )
}

/**
 * Skeleton loader for content
 */
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-muted rounded ${className}`} />
  )
}

/**
 * Form skeleton loader
 */
export function FormSkeleton() {
  return (
    <div className="space-y-4">
      <div>
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div>
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div>
        <Skeleton className="h-4 w-32 mb-2" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-full mt-6" />
    </div>
  )
}

/**
 * Card skeleton loader
 */
export function CardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-4/6" />
    </div>
  )
}
