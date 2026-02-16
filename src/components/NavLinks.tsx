import { Link, useRouterState } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Shield,
  Users,
  BookOpen,
  GraduationCap,
  Calendar,
  CreditCard,
  FileText,
  Activity
} from 'lucide-react'
import type { User } from '@/server/auth'
import { useTranslation } from '@/lib/i18n'

export interface NavLinkItem {
  to: string
  labelKey: string
  icon: React.ReactNode
  roles?: string[] // If undefined, visible to all (subject to protected/adminOnly flags which we are replacing with roles)
}

// Define links per role or generalized
export const navLinks: Array<NavLinkItem> = [
  // Common
  {
    to: '/dashboard',
    labelKey: 'nav.dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    roles: ['admin', 'teacher', 'student', 'parent', 'system_admin'],
  },

  // Admin
  {
    to: '/admin',
    labelKey: 'nav.admin', // "Administration"
    icon: <Shield className="w-5 h-5" />,
    roles: ['admin', 'system_admin'],
  },
  {
    to: '/admin/users',
    labelKey: 'home.userManagement', // Reusing existing key or add new
    icon: <Users className="w-5 h-5" />,
    roles: ['admin', 'system_admin'],
  },

  // Teacher
  {
    to: '/teacher',
    labelKey: 'nav.teacher', // Need to add key
    icon: <BookOpen className="w-5 h-5" />,
    roles: ['teacher'],
  },
  {
    to: '/teacher/grades',
    labelKey: 'home.academic', // "Notes"
    icon: <FileText className="w-5 h-5" />,
    roles: ['teacher'],
  },

  // Student
  {
    to: '/student',
    labelKey: 'nav.student', // Need to add key
    icon: <GraduationCap className="w-5 h-5" />,
    roles: ['student'],
  },
  {
    to: '/student/schedule',
    labelKey: 'home.communication', // Placeholder for schedule
    icon: <Calendar className="w-5 h-5" />,
    roles: ['student'],
  },

  // Parent
  {
    to: '/parent',
    labelKey: 'nav.parent', // Need to add key
    icon: <Users className="w-5 h-5" />,
    roles: ['parent'],
  },
  {
    to: '/parent/payments',
    labelKey: 'home.payments', // "Paiements"
    icon: <CreditCard className="w-5 h-5" />,
    roles: ['parent'],
  },

  // System Admin
  {
    to: '/system/logs',
    labelKey: 'nav.systemLogs', // Need to add key
    icon: <Activity className="w-5 h-5" />,
    roles: ['system_admin'],
  },
]

interface NavLinksProps {
  user: User | null
  onLinkClick?: () => void
  className?: string
}

export function NavLinks({ user, onLinkClick, className = '' }: NavLinksProps) {
  const { t } = useTranslation()
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

  // Filter links based on role
  const visibleLinks = navLinks.filter((link) => {
    if (!user) return false // Auth only links for now in this component
    if (!link.roles) return true // Visible to all auth users
    return link.roles.includes(user.role || '')
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
            className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${isActive
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'text-foreground hover:bg-muted'
              }`}
          >
            {link.icon}
            {/* Use a safe fallback for keys or improve typing later */}
            <span>{t(link.labelKey as any) || link.labelKey}</span>
          </Link>
        )
      })}
    </nav>
  )
}
