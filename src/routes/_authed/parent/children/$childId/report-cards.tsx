import { createFileRoute, useParams } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, FileText, Printer } from 'lucide-react'

export const Route = createFileRoute(
  '/_authed/parent/children/$childId/report-cards',
)({
  component: ChildReportCardsPage,
})

const MOCK_REPORT_CARDS = [
  {
    id: 'rc-1',
    term: 'Trimestre 1',
    average: 13.85,
    rank: 5,
    total: 32,
    decision: 'PASS',
    date: '2024-12-15',
  },
  {
    id: 'rc-2',
    term: 'Trimestre 2',
    average: 14.2,
    rank: 3,
    total: 30,
    decision: 'PASS',
    date: '2025-03-20',
  },
]

function ChildReportCardsPage() {
  const params = useParams({
    from: '/_authed/parent/children/$childId/report-cards',
  })

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <Link
          to="/parent/children"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux enfants</span>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">
          Bulletins de Mamadou Barry
        </h1>
        <p className="text-muted-foreground mt-1">6ème A - 2024-2025</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_REPORT_CARDS.map((card) => (
          <div
            key={card.id}
            className="bg-card border border-border rounded-lg p-6 hover-lift"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-success/15 text-success">
                {card.decision === 'PASS' ? 'Admis' : 'Recalé'}
              </span>
            </div>

            <h3 className="text-xl font-bold text-foreground mb-1">
              {card.term}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Émis le {new Date(card.date).toLocaleDateString('fr-FR')}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-muted-foreground">Moyenne</p>
                <p className="text-lg font-bold">
                  {card.average.toFixed(2)}/20
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Rang</p>
                <p className="text-lg font-bold">
                  {card.rank} / {card.total}
                </p>
              </div>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors w-full justify-center">
              <FileText className="w-4 h-4" />
              <span>Voir le bulletin</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
