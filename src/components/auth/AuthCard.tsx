import * as React from 'react'

export interface AuthCardProps {
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
}

/**
 * Simple centered card used for auth pages.
 */
export function AuthCard({ title, description, children, footer }: AuthCardProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <h2 className="text-foreground text-2xl font-bold">{title}</h2>
            {description && (
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            )}
          </div>

          {children}

          {footer && <div className="mt-6">{footer}</div>}
        </div>
      </div>
    </div>
  )
}
