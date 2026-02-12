import * as React from 'react'
import { X } from 'lucide-react'
import { NavLinks } from './NavLinks'
import type { User } from '@/server/auth'
import { useTranslation } from '@/lib/i18n'

interface NavDrawerProps {
  isOpen: boolean
  onClose: () => void
  user: User | null
}

/**
 * Mobile/tablet navigation drawer
 * Overlay with blur backdrop, slide-in animation, focus trap
 */
export function NavDrawer({ isOpen, onClose, user }: NavDrawerProps) {
  const { t } = useTranslation()
  const drawerRef = React.useRef<HTMLDivElement>(null)

  // Focus trap: focus first link when opened
  React.useEffect(() => {
    if (isOpen && drawerRef.current) {
      const firstLink = drawerRef.current.querySelector('a')
      firstLink?.focus()
    }
  }, [isOpen])

  // Keyboard: Escape to close
  React.useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  // Prevent body scroll when drawer is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop with blur */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={t('nav.openMenu')}
        className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-card border-r border-border shadow-2xl z-[60] overflow-y-auto animate-slide-in-left"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
              <span className="text-base font-black text-primary-foreground">
                EV
              </span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              EduVault
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label={t('nav.closeMenu')}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation links */}
        <div className="p-4">
          <NavLinks user={user} onLinkClick={onClose} />
        </div>

        {/* Footer (user info or login prompt) */}
        <div className="p-4 border-t border-border mt-auto">
          {user ? (
            <div className="text-sm text-muted-foreground">
              {t('user.signedInAs')} <span className="font-semibold text-foreground">{user.email}</span>
            </div>
          ) : (
            <div className="space-y-2">
              <a
                href="/login"
                className="block px-4 py-2 bg-primary text-primary-foreground text-center rounded-lg hover:bg-primary/90 transition-colors font-semibold"
              >
                {t('nav.signIn')}
              </a>
              <a
                href="/register"
                className="block px-4 py-2 bg-muted text-foreground text-center rounded-lg hover:bg-muted/80 transition-colors"
              >
                {t('nav.signUp')}
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
