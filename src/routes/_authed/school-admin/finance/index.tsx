import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import {
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  FileText,
  PieChart,
  Plus,
  Receipt,
  Search,
  TrendingUp,
  Users,
} from 'lucide-react'
import type {
  FeeSummary,
  FeeType,
  FinanceStats,
  SchoolFee,
  StudentPayment,
} from '@/server/data/finance/types'
import {
  getFeeSummariesFn,
  getFeeTypesFn,
  getFinanceStatsFn,
  getSchoolFeesFn,
} from '@/server/api/finance'
import { RecordPaymentModal } from '@/components/RecordPaymentModal'
import { mockStudentPayments } from '@/server/data/finance/mocks'

export const Route = createFileRoute('/_authed/school-admin/finance/')({
  component: FinancePage,
  loader: async () => {
    const [stats, summaries, feeTypes, schoolFees] = await Promise.all([
      getFinanceStatsFn({ data: 'sy-2' }),
      getFeeSummariesFn({ data: { schoolYearId: 'sy-2' } }),
      getFeeTypesFn(),
      getSchoolFeesFn({ data: 'sy-2' }),
    ])
    return {
      stats,
      summaries,
      feeTypes,
      schoolFees,
      transactions: mockStudentPayments,
    }
  },
})

type TabType = 'overview' | 'transactions' | 'fees' | 'reports'

function FinancePage() {
  const data = Route.useLoaderData()

  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)

  const filteredSummaries = useMemo(() => {
    return data.summaries.filter((s) => {
      const matchesSearch =
        !search ||
        s.student_name.toLowerCase().includes(search.toLowerCase()) ||
        s.class_name.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = !statusFilter || s.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [data.summaries, search, statusFilter])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-GN', {
      style: 'currency',
      currency: 'GNF',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const tabs = [
    { id: 'overview', label: 'Aperçu', icon: DollarSign },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'fees', label: 'Frais', icon: FileText },
    { id: 'reports', label: 'Rapports', icon: PieChart },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Finance</h1>
          <p className="text-muted-foreground">
            Gestion des finances scolaires
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-colors">
            <Download className="w-4 h-4" />
            Exporter
          </button>
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Enregistrer paiement
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card border border-border rounded-xl p-1 flex gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content based on active tab */}
      {activeTab === 'overview' && (
        <OverviewTab
          stats={data.stats}
          summaries={filteredSummaries}
          feeTypes={data.feeTypes}
          formatCurrency={formatCurrency}
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onEncaisser={() => setIsPaymentModalOpen(true)}
        />
      )}

      {activeTab === 'transactions' && (
        <TransactionsTab
          transactions={data.transactions}
          formatCurrency={formatCurrency}
        />
      )}

      {activeTab === 'fees' && (
        <FeesTab
          schoolFees={data.schoolFees}
          feeTypes={data.feeTypes}
          formatCurrency={formatCurrency}
        />
      )}

      {activeTab === 'reports' && (
        <ReportsTab
          stats={data.stats}
          summaries={data.summaries}
          formatCurrency={formatCurrency}
        />
      )}

      {/* Payment Modal */}
      <RecordPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />
    </div>
  )
}

function OverviewTab({
  stats,
  summaries,
  feeTypes,
  formatCurrency,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
}: {
  stats: FinanceStats
  summaries: Array<FeeSummary>
  feeTypes: Array<FeeType>
  formatCurrency: (n: number) => string
  search: string
  setSearch: (s: string) => void
  statusFilter: string
  setStatusFilter: (s: string) => void
  onEncaisser: (studentId: string) => void
}) {
  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      PAID: 'bg-success/15 text-success',
      PARTIAL: 'bg-amber-500/15 text-amber-600',
      PENDING: 'bg-blue-500/15 text-blue-600',
      OVERDUE: 'bg-red-500/15 text-red-600',
    }
    const labels: Record<string, string> = {
      PAID: 'Payé',
      PARTIAL: 'Partiel',
      PENDING: 'Attente',
      OVERDUE: 'Retard',
    }
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-semibold ${styles[status]}`}
      >
        {labels[status]}
      </span>
    )
  }

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total attendu"
          value={formatCurrency(stats.total_expected)}
          icon={DollarSign}
          color="text-primary"
        />
        <StatCard
          title="Total collectées"
          value={formatCurrency(stats.total_collected)}
          icon={TrendingUp}
          color="text-success"
        />
        <StatCard
          title="En attente"
          value={formatCurrency(stats.total_pending)}
          icon={Clock}
          color="text-amber-500"
        />
        <StatCard
          title="Taux collecte"
          value={`${stats.collection_rate}%`}
          icon={CheckCircle}
          color={stats.collection_rate >= 50 ? 'text-success' : 'text-red-500'}
        />
      </div>

      {/* Quick Stats */}
      <div className="bg-card border border-border rounded-xl p-4 flex flex-wrap gap-6">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Élèves:</span>
          <span className="font-semibold">{stats.students_count}</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-success" />
          <span className="text-sm text-muted-foreground">Payés:</span>
          <span className="font-semibold text-success">
            {stats.students_paid}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-500" />
          <span className="text-sm text-muted-foreground">En attente:</span>
          <span className="font-semibold text-amber-500">
            {stats.students_pending}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ArrowDownRight className="w-5 h-5 text-red-500" />
          <span className="text-sm text-muted-foreground">En retard:</span>
          <span className="font-semibold text-red-500">
            {formatCurrency(stats.total_overdue)}
          </span>
        </div>
      </div>

      {/* Student Payments Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4 justify-between">
          <h2 className="font-semibold text-foreground">Suivi des paiements</h2>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 bg-input rounded-lg text-sm"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-input rounded-lg text-sm"
            >
              <option value="">Tous</option>
              <option value="PAID">Payé</option>
              <option value="PARTIAL">Partiel</option>
              <option value="PENDING">Attente</option>
              <option value="OVERDUE">Retard</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-muted/30 text-muted-foreground text-sm">
              <tr>
                <th className="px-4 py-3 font-medium">Élève</th>
                <th className="px-4 py-3 font-medium">Classe</th>
                <th className="px-4 py-3 font-medium text-right">Dû</th>
                <th className="px-4 py-3 font-medium text-right">Payé</th>
                <th className="px-4 py-3 font-medium text-right">Reste</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {summaries.map((s) => (
                <tr key={s.student_id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{s.student_name}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {s.class_name}
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {formatCurrency(s.total_due)}
                  </td>
                  <td className="px-4 py-3 text-right text-success">
                    {formatCurrency(s.total_paid)}
                  </td>
                  <td
                    className={`px-4 py-3 text-right font-medium ${s.balance > 0 ? 'text-amber-600' : 'text-success'}`}
                  >
                    {formatCurrency(s.balance)}
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(s.status)}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEncaisser(s.student_id)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${s.balance > 0 ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'bg-muted text-muted-foreground opacity-50 cursor-not-allowed'}`}
                        disabled={s.balance <= 0}
                      >
                        Encaisser
                      </button>
                      {s.status === 'OVERDUE' && (
                        <button
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500/10 text-amber-600 hover:bg-amber-500/20 transition-colors"
                          title="Envoyer un rappel de paiement"
                        >
                          Rappel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

function TransactionsTab({
  transactions,
  formatCurrency,
}: {
  transactions: Array<StudentPayment>
  formatCurrency: (n: number) => string
}) {
  const getMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      CASH: 'Espèces',
      BANK_TRANSFER: 'Virement',
      MOBILE_MONEY: 'Mobile Money',
      CHECK: 'Chèque',
    }
    return labels[method] || method
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-foreground">
          Historique des transactions
        </h2>
        <p className="text-sm text-muted-foreground">
          {transactions.length} transactions enregistrées
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-muted/30 text-muted-foreground text-sm">
            <tr>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Élève</th>
              <th className="px-4 py-3 font-medium">Frais</th>
              <th className="px-4 py-3 font-medium">Mode</th>
              <th className="px-4 py-3 font-medium">Référence</th>
              <th className="px-4 py-3 font-medium text-right">Montant</th>
              <th className="px-4 py-3 font-medium text-right">Reçu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-muted/30">
                <td className="px-4 py-3 text-sm">
                  {new Date(t.payment_date).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-4 py-3 font-medium">
                  <div>
                    <div className="text-foreground">
                      {t.student_name || 'Élève inconnu'}
                    </div>
                    <div className="text-xs text-muted-foreground font-normal">
                      {t.student_enrollment_id}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  <div>
                    <div className="font-medium text-foreground">
                      {t.fee_name || 'Frais inconnu'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t.school_fee_id}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm">
                  {getMethodLabel(t.payment_method)}
                </td>
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {t.reference_number || '—'}
                </td>
                <td className="px-4 py-3 text-right font-bold text-success">
                  {formatCurrency(t.amount_paid)}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors inline-flex"
                    title="Télécharger le reçu"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function FeesTab({
  schoolFees,
  feeTypes,
  formatCurrency,
}: {
  schoolFees: Array<SchoolFee>
  feeTypes: Array<FeeType>
  formatCurrency: (n: number) => string
}) {
  const feesByLevel = useMemo(() => {
    const grouped = new Map<string, Array<SchoolFee>>()
    schoolFees.forEach((f) => {
      const level = f.level_name || f.school_year_level_id
      if (!grouped.has(level)) {
        grouped.set(level, [])
      }
      grouped.get(level)!.push(f)
    })
    return Array.from(grouped.entries())
  }, [schoolFees])

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <div>
          <h2 className="font-semibold text-foreground">Frais scolaires</h2>
          <p className="text-sm text-muted-foreground">
            Configurez les frais par niveau
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" /> Ajouter frais
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-muted/30 text-muted-foreground text-sm">
            <tr>
              <th className="px-4 py-3 font-medium">Type de frais</th>
              <th className="px-4 py-3 font-medium">Périodicité</th>
              <th className="px-4 py-3 font-medium text-right">Montant</th>
              <th className="px-4 py-3 font-medium">Échéance</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          {feesByLevel.map(([level, fees]) => (
            <tbody key={level} className="divide-y divide-border">
              {/* Group Header */}
              <tr className="bg-muted/10 border-t-2 border-border/50">
                <td colSpan={6} className="px-4 py-3 font-bold text-foreground">
                  Niveau : {level}
                  <span className="ml-2 text-xs font-normal text-muted-foreground">
                    ({fees.length} frais configuré{fees.length > 1 ? 's' : ''})
                  </span>
                </td>
              </tr>
              {fees.map((f) => {
                const type = feeTypes.find((t) => t.id === f.fee_type_id)
                const freqLabel =
                  type?.payment_frequency === 'ANNUAL'
                    ? 'Annuel'
                    : type?.payment_frequency === 'TERM'
                      ? 'Trimestriel'
                      : type?.payment_frequency === 'MONTHLY'
                        ? 'Mensuel'
                        : 'Unique'

                return (
                  <tr key={f.id} className="hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">
                        {f.fee_name || f.fee_type_id}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {f.id}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground">
                        {freqLabel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-bold">
                      {formatCurrency(f.amount)}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {new Date(f.due_date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${f.is_mandatory ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'}`}
                      >
                        {f.is_mandatory ? 'Obligatoire' : 'Optionnel'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="text-primary hover:text-primary/80 transition-colors text-sm font-medium">
                          Modifier
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          ))}
        </table>
      </div>
    </div>
  )
}

function ReportsTab({
  stats,
  summaries,
  formatCurrency,
}: {
  stats: FinanceStats
  summaries: Array<FeeSummary>
  formatCurrency: (n: number) => string
}) {
  const byStatus = {
    paid: summaries.filter((s) => s.status === 'PAID').length,
    partial: summaries.filter((s) => s.status === 'PARTIAL').length,
    pending: summaries.filter((s) => s.status === 'PENDING').length,
    overdue: summaries.filter((s) => s.status === 'OVERDUE').length,
  }

  const totalStudents = summaries.length
  const paidPercent = Math.round((byStatus.paid / totalStudents) * 100) || 0
  const partialPercent =
    Math.round((byStatus.partial / totalStudents) * 100) || 0
  const pendingPercent =
    Math.round((byStatus.pending / totalStudents) * 100) || 0
  const overduePercent =
    Math.round((byStatus.overdue / totalStudents) * 100) || 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Collection Rate */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold text-foreground mb-4">Taux de collecte</h3>
        <div className="relative h-48 w-full flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">
                {stats.collection_rate}%
              </p>
              <p className="text-sm text-muted-foreground">Collecté</p>
            </div>
          </div>
          <svg className="w-48 h-48 -rotate-90" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              className="text-muted/20"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${stats.collection_rate}, 100`}
              className="text-success"
            />
          </svg>
        </div>
      </div>

      {/* Status Distribution */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold text-foreground mb-4">
          Répartition par statut
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm">Payés</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">{byStatus.paid}</span>
              <span className="text-sm text-muted-foreground">
                ({paidPercent}%)
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-sm">Partiel</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">{byStatus.partial}</span>
              <span className="text-sm text-muted-foreground">
                ({partialPercent}%)
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm">En attente</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">{byStatus.pending}</span>
              <span className="text-sm text-muted-foreground">
                ({pendingPercent}%)
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm">En retard</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold">{byStatus.overdue}</span>
              <span className="text-sm text-muted-foreground">
                ({overduePercent}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-card border border-border rounded-xl p-6 md:col-span-2">
        <h3 className="font-semibold text-foreground mb-4">Résumé financier</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-muted/30 rounded-lg text-center">
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(stats.total_expected)}
            </p>
            <p className="text-sm text-muted-foreground">Total attendu</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg text-center">
            <p className="text-2xl font-bold text-success">
              {formatCurrency(stats.total_collected)}
            </p>
            <p className="text-sm text-muted-foreground">Total collectées</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg text-center">
            <p className="text-2xl font-bold text-amber-500">
              {formatCurrency(stats.total_pending)}
            </p>
            <p className="text-sm text-muted-foreground">En attente</p>
          </div>
          <div className="p-4 bg-muted/30 rounded-lg text-center">
            <p className="text-2xl font-bold text-red-500">
              {formatCurrency(stats.total_overdue)}
            </p>
            <p className="text-sm text-muted-foreground">En retard</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string
  value: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 hover-lift">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className={`text-2xl font-bold mt-1 ${color}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-muted/30 ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}
