import { Link, createFileRoute, useRouteContext } from '@tanstack/react-router'
import { Lock, Shield, Mail, Phone, Calendar, CheckCircle, XCircle } from 'lucide-react'

export const Route = createFileRoute('/_authed/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const { user } = useRouteContext({ from: '/_authed' })

  return (
    <div className="mx-auto max-w-2xl py-8 px-4 space-y-6">
      {/* User info card */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-lg space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-2xl">
            {(user.first_name.charAt(0) || user.email?.charAt(0) || 'U').toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{user.full_name}</h1>
            <p className="text-sm text-muted-foreground capitalize">{user.role ?? 'Aucun portail sélectionné'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Mail className="w-3 h-3" /> Email
            </span>
            <p className="text-sm text-foreground">{user.email_masked ?? user.email ?? '—'}</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Phone className="w-3 h-3" /> Téléphone
            </span>
            <p className="text-sm text-foreground">{user.phone_masked ?? user.phone ?? '—'}</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Inscrit depuis
            </span>
            <p className="text-sm text-foreground">
              {user.date_joined ? new Date(user.date_joined).toLocaleDateString('fr-FR') : '—'}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Dernière connexion
            </span>
            <p className="text-sm text-foreground">
              {user.last_login ? new Date(user.last_login).toLocaleDateString('fr-FR') : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Verification status */}
      {user.verification && (
        <div className="bg-card border border-border rounded-lg p-6 shadow-lg space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Vérification</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Email</span>
              <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                user.verification.email_verified
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {user.verification.email_verified ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                {user.verification.email_verified ? 'Vérifié' : 'Non vérifié'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground">Téléphone</span>
              <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
                user.verification.phone_verified
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {user.verification.phone_verified ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                {user.verification.phone_verified ? 'Vérifié' : 'Non vérifié'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="bg-card border border-border rounded-lg p-6 shadow-lg space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Link
            to="/password/change"
            className="flex items-center gap-3 rounded-lg border border-border p-4 hover:bg-muted transition-colors"
          >
            <Lock className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">Changer le mot de passe</p>
              <p className="text-xs text-muted-foreground">Mettre à jour votre mot de passe</p>
            </div>
          </Link>
          <Link
            to="/verify"
            className="flex items-center gap-3 rounded-lg border border-border p-4 hover:bg-muted transition-colors"
          >
            <Shield className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-medium text-foreground">Vérifier mon compte</p>
              <p className="text-xs text-muted-foreground">Confirmer votre email et téléphone</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
