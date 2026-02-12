import { Link, useRouterState } from '@tanstack/react-router'
import { useEffect, useRef, useState } from 'react'
import { Menu } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { LanguageToggle } from './LanguageToggle'
import { UserMenu } from './UserMenu'
import { NavDrawer } from './NavDrawer'
import type { User } from '@/server/auth'
import { useTranslation } from '@/lib/i18n'

export default function Header() {
  const { t } = useTranslation()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Get user from router context (root route provides it for public + protected pages)
  const routerState = useRouterState()

  // Prefer the deepest match that has a `user` in context, falling back to root.
  const user: User | null = (() => {
    for (const match of routerState.matches.slice().reverse()) {
      const ctx = match.context as unknown
      if (ctx && typeof ctx === 'object' && 'user' in ctx) {
        return (ctx as { user?: User | null }).user ?? null
      }
    }
    return null
  })()

  // No-flicker auth UI:
  // When routes revalidate (router.invalidate), `user` can briefly be `null`.
  // Keep rendering the last known user for a short grace period.
  const lastKnownUserRef = useRef<User | null>(null)
  const [isAuthRefreshing, setIsAuthRefreshing] = useState(false)

  useEffect(() => {
    if (user) {
      lastKnownUserRef.current = user
      setIsAuthRefreshing(false)
      return
    }

    // user became null: start a small grace period before switching to "logged out"
    if (lastKnownUserRef.current) {
      setIsAuthRefreshing(true)
      const timer = window.setTimeout(() => {
        setIsAuthRefreshing(false)
        lastKnownUserRef.current = null
      }, 400)

      return () => {
        window.clearTimeout(timer)
      }
    }
  }, [user])

  const displayedUser = user ?? lastKnownUserRef.current

  return (
    <>
      <header className="h-14 px-4 flex items-center bg-card text-foreground shadow-lg border-b border-border z-40 sticky top-0">
        <div className="w-full flex items-center justify-between gap-4">
          {/* Left: Hamburger (mobile/tablet) + Logo */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 hover:bg-muted rounded-lg lg:hidden transition-colors"
              aria-label={t('nav.openMenu')}
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Logo visible on mobile/tablet, hidden on desktop (sidebar shows it) */}
            <Link
              to="/"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity lg:hidden"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
                <span className="text-base font-black text-primary-foreground">EV</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                EduVault
              </span>
            </Link>
          </div>

          {/* Right: Theme toggle + User menu or Login */}
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />

            {displayedUser ? (
              <UserMenu user={displayedUser} isAuthRefreshing={isAuthRefreshing} />
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-colors text-sm"
              >
                {t('nav.signIn')}
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Mobile/tablet navigation drawer */}
      <NavDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        user={displayedUser}
      />
    </>
  )
}
