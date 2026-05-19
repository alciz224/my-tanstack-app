import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, Shield } from 'lucide-react'

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
              <svg
                className="w-8 h-8 text-destructive"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-foreground text-2xl font-bold">
              Accès Non Autorisé
            </h2>
          </div>
          <p className="text-muted-foreground mb-6">
            Vous n'avez pas la permission d'accéder à cette page. Le portail
            demandé nécessite un rôle différent de celui actuellement
            sélectionné.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/select-portal"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              <Shield className="w-4 h-4" />
              Retour à la sélection de portail
            </Link>
            <Link
              to="/"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              Page d'accueil
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm text-muted-foreground text-center">
              Si vous pensez qu'il s'agit d'une erreur, veuillez contacter votre
              administrateur.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
