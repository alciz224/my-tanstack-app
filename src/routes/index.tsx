import { Link, createFileRoute } from '@tanstack/react-router'
import { Network, SquareFunction, StickyNote } from 'lucide-react'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  const quickLinks = [
    {
      to: '/demo/start/server-funcs',
      icon: <SquareFunction className="w-6 h-6 text-secondary" />,
      title: 'Start: Server Functions',
      description: 'See how Start server functions work end-to-end.',
    },
    {
      to: '/demo/start/api-request',
      icon: <Network className="w-6 h-6 text-secondary" />,
      title: 'Start: API Request',
      description: 'Client-side requests + data handling patterns.',
    },
    {
      to: '/demo/start/ssr',
      icon: <StickyNote className="w-6 h-6 text-secondary" />,
      title: 'Start: SSR Demos',
      description: 'SPA mode vs full SSR vs data-only SSR demos.',
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative py-16 md:py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10" />

        <div className="relative max-w-5xl mx-auto">
          <div className="flex items-center gap-6 mb-6">
            <img
              src="/tanstack-circle-logo.png"
              alt="TanStack Logo"
              className="w-16 h-16 md:w-20 md:h-20"
            />
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-foreground [letter-spacing:-0.06em]">
                <span className="text-muted-foreground">TanStack Start</span>{' '}
                <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                  Playground
                </span>
              </h1>
              <p className="text-muted-foreground mt-2 text-lg md:text-xl">
                Demos + integration notes for TanStack Start.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a
              href="https://tanstack.com/start"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold rounded-lg transition-colors"
            >
              TanStack Start docs
            </a>
            <a
              href="https://tanstack.com/router"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold rounded-lg transition-colors"
            >
              TanStack Router docs
            </a>
          </div>
        </div>
      </section>

      {/* Quick links */}
      <section className="py-10 md:py-12 px-6 max-w-7xl mx-auto">
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <h3 className="text-foreground text-2xl font-bold">Quick links</h3>
            <p className="text-muted-foreground">
              Jump straight into the demos already wired into the sidebar.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
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
              <div className="text-secondary mt-4 font-medium opacity-90 group-hover:opacity-100">
                Open →
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
