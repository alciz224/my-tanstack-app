import { Link, createFileRoute } from '@tanstack/react-router'
import { Lock, Shield, Users } from 'lucide-react'
import { t } from '@/lib/i18n'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  const features = [
    {
      icon: <Users className="w-6 h-6 text-secondary" />,
      title: t('home.userManagement'),
      description: t('home.userManagementDesc'),
    },
    {
      icon: <Shield className="w-6 h-6 text-secondary" />,
      title: t('home.enterpriseSecurity'),
      description: t('home.enterpriseSecurityDesc'),
    },
    {
      icon: <Lock className="w-6 h-6 text-secondary" />,
      title: t('home.dataPrivacy'),
      description: t('home.dataPrivacyDesc'),
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-16 md:py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10" />

        <div className="relative max-w-5xl mx-auto">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
              <span className="text-3xl md:text-4xl font-black text-primary-foreground">
                EV
              </span>
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-foreground [letter-spacing:-0.06em]">
                <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                  EduVault
                </span>
              </h1>
              <p className="text-muted-foreground mt-2 text-lg md:text-xl">
                {t('brandDescription')}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              to="/login"
              className="px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-lg transition-colors text-center"
            >
              {t('home.getStarted')}
            </Link>
            <Link
              to="/register"
              className="px-6 py-3 bg-card text-foreground border border-border hover:bg-muted font-semibold rounded-lg transition-colors text-center"
            >
              {t('home.signUpFree')}
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-10 md:py-12 px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <h3 className="text-foreground text-2xl font-bold">{t('home.features')}</h3>
            <p className="text-muted-foreground">
              {t('home.featuresSubtitle')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((item, idx) => (
            <div
              key={idx}
              className="group bg-card backdrop-blur-sm border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="flex items-center gap-3">
                <div className="shrink-0">{item.icon}</div>
                <h4 className="text-xl font-semibold text-card-foreground">
                  {item.title}
                </h4>
              </div>
              <p className="text-muted-foreground mt-3 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
