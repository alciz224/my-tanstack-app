import { Link, useRouterState } from '@tanstack/react-router'
import { Home, Layers, LayoutDashboard, Shield } from 'lucide-react'
import type { User } from '@/server/auth'
import { t } from '@/lib/i18n'

export interface NavLinkItem {
  to: string
  labelKey: string
  icon: React.ReactNode
  protected?: boolean
  adminOnly?: boolean
}

export const navLinks: Array<NavLinkItem> = [
  {
    to: '/',
    labelKey: 'nav.home',
    icon: <Home className="w-5 h-5" />,
    protected: false,
  },
  {
    to: '/dashboard',
    labelKey: 'nav.dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    protected: true,
  },
  {
    to: '/admin',
    labelKey: 'nav.admin',
    icon: <Shield className="w-5 h-5" />,
    protected: true,
    adminOnly: true,
  },
  {
    to: '/demo/start/ssr',
    labelKey: 'nav.demos',
    icon: <Layers className="w-5 h-5" />,
    protected: false,
  },
]

interface NavLinksProps {
  user: User | null
  onLinkClick?: () => void
  className?: string
}

/**
 * Shared navigation links component
 * Used in both Sidebar (desktop) and NavDrawer (mobile/tablet)
 */
export function NavLinks({ user, onLinkClick, className = '' }: NavLinksProps) {
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  // Filter links based on auth state and role
  const visibleLinks = navLinks.filter((link) => {
    if (link.protected && !user) return false
    if (link.adminOnly && user?.role !== 'admin') return false
    return true
  })

  return (
    <nav className={`space-y-1 ${className}`}>
      {visibleLinks.map((link) => {
        const isActive = currentPath === link.to || currentPath.startsWith(`${link.to}/`)

        return (
          <Link
            key={link.to}
            to={link.to}
            onClick={onLinkClick}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'text-foreground hover:bg-muted'
            }`}
          >
            {link.icon}
            <span>{t(link.labelKey as any)}</span>
          </Link>
        )
      })}
    </nav>
  )
}
