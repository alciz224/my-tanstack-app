import { Link } from '@tanstack/react-router'
import { NavLinks } from './NavLinks'
import type { User } from '@/server/auth'
import { t } from '@/lib/i18n'

interface SidebarProps {
  user: User | null
}

/**
 * Desktop persistent sidebar (≥1024px)
 * Always visible on large screens
 */
export function Sidebar({ user }: SidebarProps) {
  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r lg:border-border lg:bg-card lg:fixed lg:left-0 lg:top-0 lg:h-screen">
      {/* Logo/brand */}
      <div className="p-4 border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
            <span className="text-lg font-black text-primary-foreground">
              EV
            </span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
            EduVault
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 overflow-y-auto">
        <NavLinks user={user} />
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        {user ? (
          <div className="text-xs text-muted-foreground">
            <div className="font-semibold text-foreground truncate">{user.full_name}</div>
            <div className="truncate">{user.email}</div>
          </div>
        ) : (
          <div className="space-y-2">
            <Link
              to="/login"
              className="block px-4 py-2 text-sm bg-primary text-primary-foreground text-center rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              {t('nav.signIn')}
            </Link>
            <Link
              to="/register"
              className="block px-4 py-2 text-sm bg-muted text-foreground text-center rounded-lg hover:bg-muted/80 transition-colors"
            >
              {t('nav.signUp')}
            </Link>
          </div>
        )}
      </div>
    </aside>
  )
}
