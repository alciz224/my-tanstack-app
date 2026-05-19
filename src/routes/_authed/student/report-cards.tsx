import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { FileText, Printer, Download } from 'lucide-react'

export const Route = createFileRoute('/_authed/student/report-cards')({
  component: StudentReportCardsPage,
})

const MOCK_REPORT_CARDS = [
  {
    id: 'rc-1',
    term: 'Trimestre 1',
    average: 13.85,
    rank: 5,
    total: 32,
    status: 'FINAL',
    decision: 'PASS',
    date: '2024-12-15',
  },
  {
    id: 'rc-2',
    term: 'Trimestre 2',
    average: 14.2,
    rank: 3,
    total: 30,
    status: 'FINAL',
    decision: 'PASS',
    date: '2025-03-20',
  },
]

function StudentReportCardsPage() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mes Bulletins</h1>
        <p className="text-muted-foreground mt-1">
          Consultez vos bulletins scolaires
        </p>
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
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  card.status === 'LOCKED'
                    ? 'bg-success/15 text-success'
                    : 'bg-blue-500/15 text-blue-600'
                }`}
              >
                {card.status === 'LOCKED' ? 'Vérrouillé' : 'Final'}
              </span>
            </div>

            <h3 className="text-xl font-bold text-foreground mb-1">
              {card.term}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Émis le {new Date(card.date).toLocaleDateString('fr-FR')}
            </p>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-xs text-muted-foreground">Moyenne</p>
                <p className="text-lg font-bold text-foreground">
                  {card.average.toFixed(2)}/20
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Rang</p>
                <p className="text-lg font-bold text-foreground">
                  {card.rank} / {card.total}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Décision</p>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    card.decision === 'PASS'
                      ? 'bg-success/15 text-success'
                      : 'bg-destructive/15 text-destructive'
                  }`}
                >
                  {card.decision === 'PASS' ? 'Admis' : 'Recalé'}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Link
                to="/student/report-cards/$cardId"
                params={{ cardId: card.id }}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <FileText className="w-4 h-4" />
                <span>Voir</span>
              </Link>
              <button className="p-2 border border-border rounded-lg hover:bg-muted transition-colors">
                <Printer className="w-4 h-4" />
              </button>
              <button className="p-2 border border-border rounded-lg hover:bg-muted transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {MOCK_REPORT_CARDS.length === 0 && (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <FileText className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-foreground mb-1">
            Aucun bulletin disponible
          </h3>
          <p className="text-muted-foreground">
            Les bulletins seront disponibles après la clôture des évaluations
          </p>
        </div>
      )}
    </div>
  )
}
