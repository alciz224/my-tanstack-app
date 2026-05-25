import { Link, createFileRoute } from '@tanstack/react-router'
import { useState, useMemo } from 'react'
import { Download, Eye, FileText, Printer, Search, X } from 'lucide-react'
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

function parseLevel(classroomName?: string): string {
  if (!classroomName) return ''
  const parts = classroomName.trim().split(/\s+/)
  return parts.slice(0, -1).join(' ') || parts[0] || ''
}

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
  const [statusFilter, setStatusFilter] = useState('')
  const [levelFilter, setLevelFilter] = useState('')
  const [classroomFilter, setClassroomFilter] = useState('')
  const [termFilter, setTermFilter] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const allLevels = useMemo(() => {
    const set = new Set<string>()
    for (const c of reportCards) {
      const l = parseLevel(c.classroom_name)
      if (l) set.add(l)
    }
    return [...set].sort()
  }, [reportCards])

  const allClassrooms = useMemo(() => {
    let list = [
      ...new Set(
        reportCards.map((c) => c.classroom_name ?? '').filter(Boolean),
      ),
    ].sort()
    if (levelFilter) {
      list = list.filter((name) => parseLevel(name) === levelFilter)
    }
    return list
  }, [reportCards, levelFilter])

  const allTerms = useMemo(() => {
    return [
      ...new Set(reportCards.map((c) => c.term_name ?? '').filter(Boolean)),
    ].sort()
  }, [reportCards])

  const filtered = reportCards.filter((card) => {
    const matchesSearch =
      !search ||
      (card.student_name ?? '').toLowerCase().includes(search.toLowerCase()) ||
      (card.student_matricule ?? '')
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (card.classroom_name ?? '').toLowerCase().includes(search.toLowerCase())
    const matchesStatus = !statusFilter || card.status === statusFilter
    const matchesLevel =
      !levelFilter || parseLevel(card.classroom_name) === levelFilter
    const matchesClassroom =
      !classroomFilter || card.classroom_name === classroomFilter
    const matchesTerm = !termFilter || card.term_name === termFilter
    return (
      matchesSearch &&
      matchesStatus &&
      matchesLevel &&
      matchesClassroom &&
      matchesTerm
    )
  })

  const hasActiveFilters =
    statusFilter || levelFilter || classroomFilter || termFilter

  const clearFilters = () => {
    setLevelFilter('')
    setClassroomFilter('')
    setTermFilter('')
    setStatusFilter('')
  }

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

      <div className="bg-card border border-border p-4 rounded-xl flex flex-col gap-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher par élève, matricule ou classe..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-input border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/50"
            />
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" /> Réinitialiser
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={levelFilter}
            onChange={(e) => {
              setLevelFilter(e.target.value)
              setClassroomFilter('')
            }}
            className="bg-input border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 min-w-[120px]"
          >
            <option value="">Niveau</option>
            {allLevels.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          <select
            value={classroomFilter}
            onChange={(e) => setClassroomFilter(e.target.value)}
            className="bg-input border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 min-w-[120px]"
          >
            <option value="">Classe</option>
            {allClassrooms.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <select
            value={termFilter}
            onChange={(e) => setTermFilter(e.target.value)}
            className="bg-input border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 min-w-[130px]"
          >
            <option value="">Trimestre</option>
            {allTerms.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-input border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50 min-w-[120px]"
          >
            <option value="">Statut</option>
            <option value="DRAFT">Brouillon</option>
            <option value="FINAL">Final</option>
            <option value="LOCKED">Vérrouillé</option>
          </select>
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
                        to="/school-admin/reports/report-cards/$cardId"
                        params={{ cardId: card.id }}
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
