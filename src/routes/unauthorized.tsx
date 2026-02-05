import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/unauthorized')({
  component: Unauthorized,
})

function Unauthorized() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <div className="bg-card border border-border rounded-lg shadow-lg p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-destructive/10 p-3 rounded-lg">
              <svg className="w-8 h-8 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-foreground text-2xl font-bold">Unauthorized</h2>
          </div>
          <p className="text-muted-foreground">
            You do not have permission to view this page. Please contact your administrator if you believe this is an error.
          </p>
        </div>
      </div>
    </div>
  )
}
