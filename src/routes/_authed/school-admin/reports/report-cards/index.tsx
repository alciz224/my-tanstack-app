import { Link, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Download, Eye, FileText, Filter, Printer, Search } from 'lucide-react'
import { getReportCardsFn } from '@/server/api/reports'
import { GenerateReportCardsModal } from '@/components/GenerateReportCardsModal'

export const Route = createFileRoute(
  '/_authed/school-admin/reports/report-cards/',
)({
  component: ReportCardsPage,
  loader: async () => {
    const reportCards = await getReportCardsFn({})
    return { reportCards }
  },
})

function StatusBadge({ status }: { status: string }) {
  if (status === 'LOCKED')
    return (
      <span className="px-2.5 py-1 rounded-full bg-success/15 text-success text-xs font-semibold">
        Vérrouillé
      </span>
    )
  if (status === 'FINAL')
    return (
      <span className="px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-600 dark:text-blue-400 text-xs font-semibold">
        Final
      </span>
    )
  if (status === 'DRAFT')
    return (
      <span className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground text-xs font-semibold">
        Brouillon
      </span>
    )
  return null
}

function DecisionBadge({ decision }: { decision: string }) {
  const styles: Record<string, string> = {
    PASS: 'bg-success/15 text-success',
    FAIL: 'bg-destructive/15 text-destructive',
    REPEAT: 'bg-warning/15 text-warning',
    TRANSFER: 'bg-info/15 text-info',
    PENDING: 'bg-muted text-muted-foreground',
  }
  const labels: Record<string, string> = {
    PASS: 'Admis',
    FAIL: 'Refusé',
    REPEAT: 'Redouble',
    TRANSFER: 'Transféré',
    PENDING: 'En attente',
  }
  return (
    <span
      className={`px-2 py-0.5 rounded text-xs font-medium ${styles[decision] || ''}`}
    >
      {labels[decision] || decision}
    </span>
  )
}

function ReportCardsPage() {
  const { reportCards } = Route.useLoaderData()
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const filtered = reportCards.filter(
    (card) =>
      (card.student_name &&
        card.student_name.toLowerCase().includes(search.toLowerCase())) ||
      (card.student_matricule &&
        card.student_matricule.toLowerCase().includes(search.toLowerCase())) ||
      (card.classroom_name &&
        card.classroom_name.toLowerCase().includes(search.toLowerCase())),
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Bulletins Scolaires
          </h1>
          <p className="text-muted-foreground">
            Consultez et générez les bulletins de notes par trimestre.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors btn-shine hover-scale"
        >
          <FileText className="w-5 h-5" /> Générer un bulletin
        </button>
      </div>

      <div className="bg-card border border-border p-4 rounded-xl flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher par élève, matricule ou classe..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-input border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select className="bg-input border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50">
            <option value="">Tous les statuts</option>
            <option value="DRAFT">Brouillon</option>
            <option value="FINAL">Final</option>
            <option value="LOCKED">Vérrouillé</option>
          </select>
          <button className="flex items-center gap-2 px-3 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors text-sm">
            <Filter className="w-4 h-4" /> Filtres
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-muted/30 border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold">Élève</th>
                <th className="px-6 py-4 font-semibold">Classe</th>
                <th className="px-6 py-4 font-semibold">Trimestre</th>
                <th className="px-6 py-4 font-semibold">Moyenne</th>
                <th className="px-6 py-4 font-semibold">Rang</th>
                <th className="px-6 py-4 font-semibold">Décision</th>
                <th className="px-6 py-4 font-semibold">Statut</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((card) => (
                <tr
                  key={card.id}
                  className="hover:bg-muted/20 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-foreground">
                        {card.student_name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {card.student_matricule}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted text-sm font-medium">
                      {card.classroom_name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    {card.term_name}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-lg font-bold text-primary">
                      {card.average_score?.toFixed(2) || '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {card.rank ? `#${card.rank}` : '-'}
                  </td>
                  <td className="px-6 py-4">
                    <DecisionBadge decision={card.decision} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={card.status} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/school-admin/reports/report-cards/${card.id}`}
                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                        title="Voir"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        className="p-2 text-muted-foreground hover:text-blue-600 hover:bg-blue-500/10 rounded-md transition-colors"
                        title="Imprimer"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-muted-foreground hover:text-green-600 hover:bg-green-500/10 rounded-md transition-colors"
                        title="Télécharger"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    Aucun bulletin trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <GenerateReportCardsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
