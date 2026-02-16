import { Link } from '@tanstack/react-router'
import { useTranslation } from '@/lib/i18n'

export function LandingFooter() {
    const { t } = useTranslation()
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-muted/30 border-t border-border pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
                                <span className="text-base font-black text-primary-foreground">EV</span>
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                                EduVault
                            </span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            {t('home.heroSubtitle')}
                        </p>
                    </div>

                    {/* Links 1 */}
                    <div>
                        <h4 className="font-semibold mb-4">{t('home.footer.about')}</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-primary transition-colors">Notre Mission</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Équipe</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Carrières</a></li>
                        </ul>
                    </div>

                    {/* Links 2 */}
                    <div>
                        <h4 className="font-semibold mb-4">{t('home.footer.legal')}</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-primary transition-colors">{t('home.footer.privacy')}</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">{t('home.footer.terms')}</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-semibold mb-4">{t('home.footer.contact')}</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>Conakry, Guinée</li>
                            <li>support@eduvault.app</li>
                            <li>+224 6XX XX XX XX</li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                    <p>© {currentYear} EduVault. {t('home.footer.rights')}</p>
                    <div className="flex items-center gap-6">
                        {/* Social icons could go here */}
                    </div>
                </div>
            </div>
        </footer>
    )
}
