import * as React from 'react'
import { Link } from '@tanstack/react-router'
import { LogOut, User as UserIcon } from 'lucide-react'
import type { User } from '@/server/auth'

interface UserMenuProps {
  user: User
  isAuthRefreshing: boolean
}

/**
 * User dropdown menu (extracted from Header)
 * Works across all viewport sizes
 */
export function UserMenu({ user, isAuthRefreshing }: UserMenuProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
        aria-label="User menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {isAuthRefreshing && (
          <span
            className="h-2 w-2 rounded-full bg-warning animate-pulse"
            aria-label="Refreshing auth"
            title="Refreshing auth"
          />
        )}
        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
          {(
            user.first_name.charAt(0) ||
            user.email?.charAt(0) ||
            'U'
          ).toUpperCase()}
        </div>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg z-[70] overflow-hidden">
            {/* User info header */}
            <div className="p-4 border-b border-border bg-muted/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  {(
                    user.first_name.charAt(0) ||
                    user.email?.charAt(0) ||
                    'U'
                  ).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-foreground truncate">
                    {user.full_name}
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    {user.email || user.phone}
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                {user.is_verified && (
                  <span className="text-xs px-2 py-1 bg-success/10 text-success border border-success/20 rounded-full">
                    Verified
                  </span>
                )}
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    user.security.level === 'high'
                      ? 'bg-success/10 text-success border border-success/20'
                      : user.security.level === 'medium'
                        ? 'bg-warning/10 text-warning border border-warning/20'
                        : 'bg-destructive/10 text-destructive border border-destructive/20'
                  }`}
                >
                  Security: {user.security.level}
                </span>
              </div>
            </div>

            {/* Menu items */}
            <div className="p-2">
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors text-foreground"
              >
                <UserIcon className="w-4 h-4" />
                <span>Profile</span>
              </Link>
              <Link
                to="/logout"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors text-foreground"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign out</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
