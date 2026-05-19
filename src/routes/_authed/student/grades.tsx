import { createFileRoute } from '@tanstack/react-router'
import { BookOpen, Calendar, Search, TrendingUp } from 'lucide-react'

export const Route = createFileRoute('/_authed/student/grades')({
  component: StudentGradesPage,
})

const MOCK_GRADES = [
  {
    term: 'Trimestre 1',
    subject: 'Mathématiques',
    type: 'Composition',
    score: 14,
    max: 20,
    date: '2024-10-15',
  },
  {
    term: 'Trimestre 1',
    subject: 'Mathématiques',
    type: 'Devoir',
    score: 16,
    max: 20,
    date: '2024-09-28',
  },
  {
    term: 'Trimestre 1',
    subject: 'Français',
    type: 'Composition',
    score: 12,
    max: 20,
    date: '2024-10-18',
  },
  {
    term: 'Trimestre 1',
    subject: 'Français',
    type: 'Devoir',
    score: 14,
    max: 20,
    date: '2024-10-05',
  },
  {
    term: 'Trimestre 1',
    subject: 'Anglais',
    type: 'Composition',
    score: 15,
    max: 20,
    date: '2024-10-20',
  },
  {
    term: 'Trimestre 1',
    subject: 'Physique',
    type: 'Devoir',
    score: 13,
    max: 20,
    date: '2024-10-12',
  },
  {
    term: 'Trimestre 1',
    subject: 'SVT',
    type: 'Composition',
    score: 11,
    max: 20,
    date: '2024-10-22',
  },
  {
    term: 'Trimestre 1',
    subject: 'Histoire-Géo',
    type: 'Devoir',
    score: 14,
    max: 20,
    date: '2024-10-08',
  },
]

const TERM_GROUPS = ['Trimestre 1', 'Trimestre 2', 'Trimestre 3']

function StudentGradesPage() {
  const [selectedTerm, setSelectedTerm] = useState('Trimestre 1')

  const filteredGrades = MOCK_GRADES.filter((g) => g.term === selectedTerm)
  const average =
    filteredGrades.reduce((acc, g) => acc + (g.score / g.max) * 20, 0) /
    filteredGrades.length

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mes Notes</h1>
        <p className="text-muted-foreground mt-1">
          Consultez vos résultats scolaires
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Moyenne</p>
              <p className="text-2xl font-bold text-foreground">
                {average.toFixed(2)}/20
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Évaluations</p>
              <p className="text-2xl font-bold text-foreground">
                {filteredGrades.length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rang</p>
              <p className="text-2xl font-bold text-foreground">5 / 32</p>
            </div>
          </div>
        </div>
      </div>

      {/* Term Selector */}
      <div className="flex gap-2">
        {TERM_GROUPS.map((term) => (
          <button
            key={term}
            onClick={() => setSelectedTerm(term)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedTerm === term
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {term}
          </button>
        ))}
      </div>

      {/* Grades Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
                Matière
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase">
                Type
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase">
                Note
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredGrades.map((grade, i) => (
              <tr key={i} className="hover:bg-muted/40">
                <td className="px-4 py-3 font-medium text-foreground">
                  {grade.subject}
                </td>
                <td className="px-4 py-3 text-muted-foreground text-sm">
                  {grade.type}
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      grade.score >= 14
                        ? 'bg-success/15 text-success'
                        : grade.score >= 10
                          ? 'bg-warning/15 text-warning'
                          : 'bg-destructive/15 text-destructive'
                    }`}
                  >
                    {grade.score}/{grade.max}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-sm text-muted-foreground">
                  {new Date(grade.date).toLocaleDateString('fr-FR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

import { useState } from 'react'
