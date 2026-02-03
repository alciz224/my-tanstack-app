import { Link, createFileRoute } from '@tanstack/react-router'
import { Network, SquareFunction, StickyNote } from 'lucide-react'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  const quickLinks = [
    {
      to: '/demo/start/server-funcs',
      icon: <SquareFunction className="w-6 h-6 text-cyan-400" />,
      title: 'Start: Server Functions',
      description: 'See how Start server functions work end-to-end.',
    },
    {
      to: '/demo/start/api-request',
      icon: <Network className="w-6 h-6 text-cyan-400" />,
      title: 'Start: API Request',
      description: 'Client-side requests + data handling patterns.',
    },
    {
      to: '/demo/start/ssr',
      icon: <StickyNote className="w-6 h-6 text-cyan-400" />,
      title: 'Start: SSR Demos',
      description: 'SPA mode vs full SSR vs data-only SSR demos.',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Hero */}
      <section className="relative py-16 md:py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10" />

        <div className="relative max-w-5xl mx-auto">
          <div className="flex items-center gap-6 mb-6">
            <img
              src="/tanstack-circle-logo.png"
              alt="TanStack Logo"
              className="w-16 h-16 md:w-20 md:h-20"
            />
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-white [letter-spacing:-0.06em]">
                <span className="text-gray-300">TanStack Start</span>{' '}
                <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Playground
                </span>
              </h1>
              <p className="text-gray-300 mt-2 text-lg md:text-xl">
                Demos + integration notes for TanStack Start.
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <a
              href="https://tanstack.com/start"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
            >
              TanStack Start docs
            </a>
            <a
              href="https://tanstack.com/router"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
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
            <h3 className="text-white text-2xl font-bold">Quick links</h3>
            <p className="text-gray-400">
              Jump straight into the demos already wired into the sidebar.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
            >
              <div className="flex items-center gap-3">
                <div className="shrink-0">{item.icon}</div>
                <h4 className="text-xl font-semibold text-white">
                  {item.title}
                </h4>
              </div>
              <p className="text-gray-400 mt-3 leading-relaxed">
                {item.description}
              </p>
              <div className="text-cyan-300 mt-4 font-medium opacity-90 group-hover:opacity-100">
                Open →
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
