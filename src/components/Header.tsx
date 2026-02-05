import { Link, useRouterState } from '@tanstack/react-router'

import { useEffect, useRef, useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  Home,
  LogIn,
  LogOut,
  Menu,
  Network,
  Shield,
  SquareFunction,
  StickyNote,
  User as UserIcon,
  X,
} from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import type { User } from '@/server/auth'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [groupedExpanded, setGroupedExpanded] = useState<
    Record<string, boolean>
  >({})

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
      const t = window.setTimeout(() => {
        setIsAuthRefreshing(false)
        lastKnownUserRef.current = null
      }, 400)

      return () => {
        window.clearTimeout(t)
      }
    }
  }, [user])

  const displayedUser = user ?? lastKnownUserRef.current

  return (
    <>
      <header className="h-14 px-4 flex items-center bg-card text-foreground shadow-lg border-b border-border">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 hover:bg-muted rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu size={24} />
        </button>
        <h1 className="ml-4 text-xl font-semibold">
          <Link to="/" className="text-foreground hover:text-primary transition-colors">
            School Management System
          </Link>
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />

          {/* Auth Component in Navbar */}
          {displayedUser ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
              >
                {isAuthRefreshing && (
                  <span
                    className="h-2 w-2 rounded-full bg-warning animate-pulse"
                    aria-label="Refreshing auth"
                    title="Refreshing auth"
                  />
                )}
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                  {(displayedUser.first_name.charAt(0) || displayedUser.email?.charAt(0) || 'U').toUpperCase()}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-semibold text-foreground">
                    {displayedUser.full_name || displayedUser.email}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {displayedUser.role || 'User'}
                  </div>
                </div>
                <ChevronDown size={16} className={`transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-lg shadow-lg z-40 overflow-hidden">
                    <div className="p-4 border-b border-border bg-muted/50">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                          {(displayedUser.first_name.charAt(0) || displayedUser.email?.charAt(0) || 'U').toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-foreground truncate">
                            {displayedUser.full_name}
                          </div>
                          <div className="text-sm text-muted-foreground truncate">
                            {displayedUser.email || displayedUser.phone}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        {displayedUser.is_verified && (
                          <span className="text-xs px-2 py-1 bg-success/10 text-success border border-success/20 rounded-full">
                            Verified
                          </span>
                        )}
                        <span className={`text-xs px-2 py-1 rounded-full ${displayedUser.security.level === 'high'
                          ? 'bg-success/10 text-success border border-success/20'
                          : displayedUser.security.level === 'medium'
                            ? 'bg-warning/10 text-warning border border-warning/20'
                            : 'bg-destructive/10 text-destructive border border-destructive/20'
                          }`}>
                          Security: {displayedUser.security.level}
                        </span>
                      </div>
                    </div>

                    <div className="py-2">
                      <Link
                        to="/dashboard"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors"
                      >
                        <Shield size={18} />
                        <span className="text-sm font-medium">Dashboard</span>
                      </Link>

                      <Link
                        to="/logout"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors text-destructive"
                      >
                        <LogOut size={18} />
                        <span className="text-sm font-medium">Logout</span>
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              <LogIn size={18} />
              <span className="hidden md:inline">Login</span>
            </Link>
          )}
        </div>
      </header>

      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-card text-foreground shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col border-r border-border ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-bold">Navigation</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors mb-2"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors mb-2',
            }}
          >
            <Home size={20} />
            <span className="font-medium">Home</span>
          </Link>

          {/* Auth Links */}
          <Link
            to="/dashboard"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors mb-2"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors mb-2',
            }}
          >
            <Shield size={20} />
            <span className="font-medium">Protected Area</span>
          </Link>

          <Link
            to="/login"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors mb-2"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors mb-2',
            }}
          >
            <LogIn size={20} />
            <span className="font-medium">Login</span>
          </Link>

          <Link
            to="/logout"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors mb-2"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors mb-2',
            }}
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </Link>

          {/* Demo Links Start */}

          <Link
            to="/demo/start/server-funcs"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors mb-2"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors mb-2',
            }}
          >
            <SquareFunction size={20} />
            <span className="font-medium">Start - Server Functions</span>
          </Link>

          <Link
            to="/demo/start/api-request"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors mb-2"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors mb-2',
            }}
          >
            <Network size={20} />
            <span className="font-medium">Start - API Request</span>
          </Link>

          <div className="flex flex-row justify-between">
            <Link
              to="/demo/start/ssr"
              onClick={() => setIsOpen(false)}
              className="flex-1 flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors mb-2"
              activeProps={{
                className:
                  'flex-1 flex items-center gap-3 p-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors mb-2',
              }}
            >
              <StickyNote size={20} />
              <span className="font-medium">Start - SSR Demos</span>
            </Link>
            <button
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              onClick={() =>
                setGroupedExpanded((prev) => ({
                  ...prev,
                  StartSSRDemo: !prev.StartSSRDemo,
                }))
              }
            >
              {groupedExpanded.StartSSRDemo ? (
                <ChevronDown size={20} />
              ) : (
                <ChevronRight size={20} />
              )}
            </button>
          </div>
          {groupedExpanded.StartSSRDemo && (
            <div className="flex flex-col ml-4">
              <Link
                to="/demo/start/ssr/spa-mode"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors mb-2"
                activeProps={{
                  className:
                    'flex items-center gap-3 p-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors mb-2',
                }}
              >
                <StickyNote size={20} />
                <span className="font-medium">SPA Mode</span>
              </Link>

              <Link
                to="/demo/start/ssr/full-ssr"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors mb-2"
                activeProps={{
                  className:
                    'flex items-center gap-3 p-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors mb-2',
                }}
              >
                <StickyNote size={20} />
                <span className="font-medium">Full SSR</span>
              </Link>

              <Link
                to="/demo/start/ssr/data-only"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors mb-2"
                activeProps={{
                  className:
                    'flex items-center gap-3 p-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors mb-2',
                }}
              >
                <StickyNote size={20} />
                <span className="font-medium">Data Only</span>
              </Link>
            </div>
          )}

          {/* Demo Links End */}
        </nav>
      </aside>
    </>
  )
}
