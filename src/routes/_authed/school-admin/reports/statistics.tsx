import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  AlertCircle,
  Award,
  BarChart3,
  FileText,
  PieChart,
  TrendingUp,
  Users,
} from 'lucide-react'

import { getReportStatsFn } from '@/server/api/reports'

export const Route = createFileRoute(
  '/_authed/school-admin/reports/statistics',
)({
  component: StatisticsPage,
  loader: async () => {
    // For now we'll fetch stats without a filter, or pass a default filter
    const statsData = await getReportStatsFn({})
    return { statsData }
  },
})

function StatisticsPage() {
  const { statsData } = Route.useLoaderData()
  const [selectedYear, setSelectedYear] = useState('2024-2025')

  const stats = {
    totalStudents: statsData.totalStudents,
    totalClasses: statsData.totalClasses,
    averageScore: statsData.averageScore,
    passRate: statsData.passRate,
    repeatRate: statsData.repeatRate,
    dropOutRate: statsData.dropOutRate,
  }

  const subjectStats = statsData.subjectStats
  const classStats = statsData.classStats

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Statistiques Scolaires
          </h1>
          <p className="text-muted-foreground">
            Analysez les performances et tendances de l&apos;établissement.
          </p>
        </div>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="bg-input border-none rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary/50"
        >
          <option value="2024-2025">2024-2025</option>
          <option value="2023-2024">2023-2024</option>
          <option value="2022-2023">2022-2023</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +5%
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {stats.totalStudents}
          </p>
          <p className="text-sm text-muted-foreground">Élèves inscrits</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +2%
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {stats.totalClasses}
          </p>
          <p className="text-sm text-muted-foreground">Classes</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-600">
              <BarChart3 className="w-5 h-5" />
            </div>
            <span className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +0.5
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {stats.averageScore.toFixed(1)}
          </p>
          <p className="text-sm text-muted-foreground">Moyenne générale</p>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-green-500/10 rounded-lg text-green-600">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-xs text-green-600 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> +3%
            </span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {stats.passRate}%
          </p>
          <p className="text-sm text-muted-foreground">Taux de réussite</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Notes par matière
          </h2>
          <div className="space-y-4">
            {subjectStats.map((subject) => (
              <div key={subject.name} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground font-medium">
                    {subject.name}
                  </span>
                  <span className="text-muted-foreground">
                    {subject.average.toFixed(1)} ({subject.passRate}%)
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{ width: `${subject.passRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <PieChart className="w-5 h-5 text-blue-500" />
            Performance par classe
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/30 text-muted-foreground">
                <tr>
                  <th className="text-left py-3 px-4 font-medium rounded-tl-lg">
                    Classe
                  </th>
                  <th className="text-center py-3 px-4 font-medium">Élèves</th>
                  <th className="text-center py-3 px-4 font-medium">Moyenne</th>
                  <th className="text-center py-3 px-4 font-medium rounded-tr-lg">
                    Réussite
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {classStats.map((c) => (
                  <tr
                    key={c.name}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="py-3 px-4 font-medium text-foreground">
                      {c.name}
                    </td>
                    <td className="py-3 px-4 text-center text-muted-foreground">
                      {c.students}
                    </td>
                    <td className="py-3 px-4 text-center font-medium text-foreground">
                      {c.average.toFixed(1)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide ${
                          c.passRate >= 80
                            ? 'bg-green-500/15 text-green-700 dark:text-green-400'
                            : c.passRate >= 70
                              ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400'
                              : 'bg-red-500/15 text-red-700 dark:text-red-400'
                        }`}
                      >
                        {c.passRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-foreground mb-4">
            Répartition des décisions
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Admis</span>
              <span className="text-sm font-medium text-green-600">78.5%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: '78.5%' }}
              />
            </div>

            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-muted-foreground">Redouble</span>
              <span className="text-sm font-medium text-amber-600">8.2%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full"
                style={{ width: '8.2%' }}
              />
            </div>

            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-muted-foreground">Abandon</span>
              <span className="text-sm font-medium text-red-600">2.1%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-red-500 rounded-full"
                style={{ width: '2.1%' }}
              />
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm lg:col-span-2">
          <h3 className="font-bold text-foreground mb-4">
            Alertes et notifications
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-4 bg-amber-500/5 dark:bg-amber-500/10 rounded-xl border border-amber-500/20">
              <div className="p-2 bg-amber-500/15 rounded-lg">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  3 classes avec taux de réussite &lt; 75%
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                  Surveiller de près ces classes
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-blue-500/5 dark:bg-blue-500/10 rounded-xl border border-blue-500/20">
              <div className="p-2 bg-blue-500/15 rounded-lg">
                <Award className="w-5 h-5 text-blue-600 dark:text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  12 élèves avec moyenne &gt; 16
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-400 mt-0.5">
                  Candidats pour distinction
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
