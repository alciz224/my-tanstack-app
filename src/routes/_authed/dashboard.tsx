import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authed/dashboard')({
  component: AuthedHome,
})

function AuthedHome() {
  // Access user from parent loader via useLoaderData
  // In TanStack Router v1, we can use useMatch to get parent loader data
  // But here we keep it simple and just render a message
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card border border-border rounded-lg p-6 shadow-lg">
          <h2 className="text-foreground text-2xl font-semibold mb-4">Welcome to the protected area</h2>
          <p className="text-muted-foreground mt-2">You're authenticated and can access this protected content.</p>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted rounded-lg p-4 border border-border">
              <h3 className="font-semibold text-foreground mb-2">Primary Color</h3>
              <div className="h-12 bg-primary rounded flex items-center justify-center">
                <span className="text-primary-foreground font-medium">Primary</span>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-4 border border-border">
              <h3 className="font-semibold text-foreground mb-2">Secondary Color</h3>
              <div className="h-12 bg-secondary rounded flex items-center justify-center">
                <span className="text-secondary-foreground font-medium">Secondary</span>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-4 border border-border">
              <h3 className="font-semibold text-foreground mb-2">Accent Color</h3>
              <div className="h-12 bg-accent rounded flex items-center justify-center">
                <span className="text-accent-foreground font-medium">Accent</span>
              </div>
            </div>

            <div className="bg-muted rounded-lg p-4 border border-border">
              <h3 className="font-semibold text-foreground mb-2">Muted Background</h3>
              <div className="h-12 bg-muted rounded flex items-center justify-center border border-border">
                <span className="text-muted-foreground font-medium">Muted</span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-sm text-foreground">
              💡 <strong>Tip:</strong> Try toggling the theme using the button in the header to see all colors change dynamically!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
