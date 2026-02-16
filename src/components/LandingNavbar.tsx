import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { LanguageToggle } from './LanguageToggle'
import { useTranslation } from '@/lib/i18n'

export function LandingNavbar() {
    const { t } = useTranslation()
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const navLinks = [
        { label: t('home.features'), href: '#features' },
        // Add more anchors if we implement sections
    ]

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border h-16 transition-all duration-200">
            <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Link
                        to="/"
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                    >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
                            <span className="text-base font-black text-primary-foreground">EV</span>
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                            EduVault
                        </span>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                {/* Desktop Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <div className="flex items-center gap-2 mr-2">
                        <LanguageToggle />
                        <ThemeToggle />
                    </div>
                    <Link
                        to="/login"
                        search={{ from: undefined }}
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {t('nav.signIn')}
                    </Link>
                    <Link
                        to="/register"
                        search={{ from: undefined }}
                        className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 font-semibold transition-colors text-sm shadow-sm hover:shadow-md"
                    >
                        {t('nav.signUp')}
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <div className="flex md:hidden items-center gap-2">
                    <LanguageToggle />
                    <ThemeToggle />
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="p-2 -mr-2 text-muted-foreground hover:text-foreground"
                        aria-label={t('nav.openMenu')}
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* Mobile Drawer */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    <div
                        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                        onClick={() => setIsMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-0 bottom-0 w-3/4 max-w-xs bg-card border-l border-border shadow-2xl p-6 animate-slide-in-right">
                        <div className="flex items-center justify-between mb-8">
                            <span className="font-bold text-lg">Menu</span>
                            <button
                                onClick={() => setIsMenuOpen(false)}
                                className="p-2 -mr-2 text-muted-foreground hover:text-foreground"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex flex-col gap-6">
                            <nav className="flex flex-col gap-4">
                                {navLinks.map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                            </nav>

                            <div className="h-px bg-border" />

                            <div className="flex flex-col gap-3">
                                <Link
                                    to="/login"
                                    search={{ from: undefined }}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="w-full px-4 py-3 rounded-lg border border-border text-center font-medium hover:bg-muted transition-colors"
                                >
                                    {t('nav.signIn')}
                                </Link>
                                <Link
                                    to="/register"
                                    search={{ from: undefined }}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="w-full px-4 py-3 rounded-lg bg-primary text-primary-foreground text-center font-bold hover:bg-primary/90 transition-colors shadow-sm"
                                >
                                    {t('nav.signUp')}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    )
}
