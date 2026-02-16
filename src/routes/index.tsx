import { Link, createFileRoute } from '@tanstack/react-router'
import {
  Smartphone,
  MessageSquare,
  FileText,
  PieChart,
  Zap,
  Headphones,
  ArrowRight,
  TrendingUp,
  School,
  Users
} from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { LandingNavbar } from '@/components/LandingNavbar'
import { LandingFooter } from '@/components/LandingFooter'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  const { t } = useTranslation()

  const features = [
    {
      icon: <Smartphone className="w-6 h-6 text-primary" />,
      title: t('home.payments'),
      description: t('home.paymentsDesc'),
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-primary" />,
      title: t('home.communication'),
      description: t('home.communicationDesc'),
    },
    {
      icon: <FileText className="w-6 h-6 text-primary" />,
      title: t('home.academic'),
      description: t('home.academicDesc'),
    },
    {
      icon: <PieChart className="w-6 h-6 text-primary" />,
      title: t('home.finance'),
      description: t('home.financeDesc'),
    },
    {
      icon: <Zap className="w-6 h-6 text-primary" />,
      title: t('home.reliability'),
      description: t('home.reliabilityDesc'),
    },
    {
      icon: <Headphones className="w-6 h-6 text-primary" />,
      title: t('home.support'),
      description: t('home.supportDesc'),
    },
  ]

  const stats = [
    {
      label: t('home.stats.schools'),
      value: t('home.stats.schoolsValue'),
      icon: <School className="w-6 h-6 text-primary" />
    },
    {
      label: t('home.stats.students'),
      value: t('home.stats.studentsValue'),
      icon: <Users className="w-6 h-6 text-primary" />
    },
    {
      label: t('home.stats.efficiency'),
      value: t('home.stats.efficiencyValue'),
      icon: <TrendingUp className="w-6 h-6 text-primary" />
    },
  ]

  const steps = [
    { title: t('home.steps.step1'), desc: t('home.steps.step1Desc') },
    { title: t('home.steps.step2'), desc: t('home.steps.step2Desc') },
    { title: t('home.steps.step3'), desc: t('home.steps.step3Desc') },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <LandingNavbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />

          <div className="relative max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center justify-center p-2 mb-8 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/10 shadow-sm animate-fade-in-up">
              <span className="text-sm font-semibold text-primary px-2">
                🇬🇳 {t('home.heroTitle')}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight mb-6 animate-fade-in-up delay-100">
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                EduVault
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed animate-fade-in-up delay-200">
              {t('home.heroSubtitle')}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-300">
              <Link
                to="/login"
                search={{ from: undefined }}
                className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground hover:bg-primary/90 font-bold rounded-xl transition-all shadow-lg hover:shadow-primary/25 text-lg"
              >
                {t('home.getStarted')}
              </Link>
              <Link
                to="/register"
                search={{ from: undefined }}
                className="w-full sm:w-auto px-8 py-4 bg-card text-foreground border border-border hover:bg-muted font-bold rounded-xl transition-colors text-lg"
              >
                {t('home.signUpFree')}
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-muted/30 border-y border-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    {stat.icon}
                  </div>
                  <span className="text-4xl font-black text-foreground mb-2">{stat.value}</span>
                  <span className="text-muted-foreground font-medium">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t('home.features')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('home.featuresSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((item, idx) => (
              <div
                key={idx}
                className="group bg-card hover:bg-muted/50 border border-border rounded-2xl p-8 transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 px-6 bg-muted/30 border-t border-border">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {t('home.howItWorks')}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connector Line (Desktop) */}
              <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-border -z-0" />

              {steps.map((step, idx) => (
                <div key={idx} className="relative z-10 flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-center mb-6 text-2xl font-bold text-primary">
                    {idx + 1}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground max-w-xs">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-24 px-6">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl p-10 md:p-16 border border-primary/10 text-center">
            <div className="mb-8 flex justify-center text-primary">
              {[1, 2, 3, 4, 5].map(i => <Zap key={i} className="w-5 h-5 fill-current" />)}
            </div>
            <blockquote className="text-2xl md:text-3xl font-medium text-foreground mb-8 leading-relaxed">
              {t('home.testimonial1')}
            </blockquote>
            <cite className="not-italic flex flex-col items-center">
              <span className="font-bold text-lg text-foreground">{t('home.testimonial1Author')}</span>
              <span className="text-muted-foreground">{t('home.testimonial1Role')}</span>
            </cite>
          </div>
        </section>

        {/* FAQ Preview */}
        <section className="py-24 px-6 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('home.faq')}</h2>
          </div>

          <div className="space-y-6">
            {[1, 2].map(i => (
              <div key={i} className="bg-card border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
                <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  {t(`home.faq${i}` as any)}
                </h3>
                <p className="text-muted-foreground ml-4">
                  {t(`home.faq${i}Ans` as any)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-6 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-black mb-8 tracking-tight">
              Prêt à transformer votre établissement ?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-10 max-w-2xl mx-auto">
              Rejoignez les 50+ écoles qui nous font confiance en Guinée.
            </p>
            <Link
              to="/register"
              search={{ from: undefined }}
              className="inline-flex items-center gap-2 bg-background text-foreground px-8 py-4 rounded-xl font-bold hover:bg-background/90 transition-colors text-lg shadow-xl"
            >
              Créer un compte maintenant <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  )
}
