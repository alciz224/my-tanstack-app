import { Link, createFileRoute } from '@tanstack/react-router'
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Download,
  FileText,
  Filter,
  Save,
  Search,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import type { StudentAssessment } from '@/server/data/assessments/types'
import {
  getAssessmentByIdFn,
  getAssessmentSubjectsFn,
  getStudentAssessmentsFn,
} from '@/server/api/assessments'

export const Route = createFileRoute(
  '/_authed/school-admin/assessments/$assessmentId/validate',
)({
  component: GradeValidationPage,
  loader: async ({ params }) => {
    const [assessment, subjects] = await Promise.all([
      getAssessmentByIdFn({ data: params.assessmentId }),
      getAssessmentSubjectsFn({ data: params.assessmentId }),
    ])
    if (!assessment) throw new Error('Assessment not found')
    return { assessment, subjects }
  },
})

function GradeValidationPage() {
  const { assessment, subjects } = Route.useLoaderData()
  const [selectedSubjectId, setSelectedSubjectId] = useState(
    subjects[0]?.id || '',
  )
  const [grades, setGrades] = useState<Array<StudentAssessment>>([])
  const [isLoadingGrades, setIsLoadingGrades] = useState(false)
  const [search, setSearch] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const selectedSubject = subjects.find((s) => s.id === selectedSubjectId)

  useEffect(() => {
    if (!selectedSubjectId) return
    setIsLoadingGrades(true)
    getStudentAssessmentsFn({ data: selectedSubjectId })
      .then((data) => setGrades(data))
      .catch((err) => console.error(err))
      .finally(() => setIsLoadingGrades(false))
  }, [selectedSubjectId])

  const filteredGrades = grades.filter(
    (g) =>
      g.student_name?.toLowerCase().includes(search.toLowerCase()) ||
      g.student_matricule?.toLowerCase().includes(search.toLowerCase()),
  )

  const handleGradeChange = (id: string, value: string) => {
    const num = parseFloat(value)
    const newGrades = grades.map((g) => {
      if (g.id === id) {
        return {
          ...g,
          raw_score: isNaN(num) ? undefined : num,
          status: 'DRAFT' as const,
        }
      }
      return g
    })
    setGrades(newGrades)
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      alert('Notes enregistrées avec succès!')
    }, 800)
  }

  return (
    <div className="space-y-6 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              to="/school-admin/assessments"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" /> Retour
            </Link>
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Saisie & Validation des Notes
          </h1>
          <p className="text-muted-foreground">
            {assessment.name} ({assessment.cycle_name})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors">
            <Download className="w-4 h-4" /> Exporter grille
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm"
          >
            {isSaving ? (
              'Enregistrement...'
            ) : (
              <>
                <Save className="w-4 h-4" /> Enregistrer
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Left Sidebar: Subjects List */}
        <div className="w-full lg:w-80 bg-card border border-border rounded-xl shadow-sm flex flex-col min-h-0 overflow-hidden flex-shrink-0">
          <div className="p-4 border-b border-border bg-muted/30">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Épreuves ({subjects.length})
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {subjects.map((subject) => (
              <button
                key={subject.id}
                onClick={() => setSelectedSubjectId(subject.id)}
                className={`w-full text-left p-3 rounded-lg transition-all border ${
                  selectedSubjectId === subject.id
                    ? 'bg-primary/5 border-primary/30 shadow-sm'
                    : 'bg-transparent border-transparent hover:bg-muted/50'
                }`}
              >
                <div className="font-medium text-sm text-foreground mb-1">
                  {subject.name}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="bg-muted px-2 py-0.5 rounded">
                    {subject.classroom_name}
                  </span>
                  <span>
                    {subject.status === 'CLOSED' ? 'Clôturée' : 'En cours'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel: Grades Grid */}
        <div className="flex-1 bg-card border border-border rounded-xl shadow-sm flex flex-col min-h-0 overflow-hidden">
          {selectedSubject ? (
            <>
              {/* Toolbar */}
              <div className="p-4 border-b border-border bg-muted/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="font-bold text-foreground">
                      {selectedSubject.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Classe: {selectedSubject.classroom_name} · Enseignant:{' '}
                      {selectedSubject.teacher_name}
                    </p>
                  </div>
                  <div className="h-8 w-px bg-border hidden sm:block" />
                  <div className="text-center px-4 py-1.5 bg-muted/50 rounded-lg border border-border">
                    <span className="text-xs text-muted-foreground uppercase tracking-wider block mb-0.5">
                      Barème
                    </span>
                    <span className="font-mono font-bold text-foreground">
                      /{selectedSubject.max_score}
                    </span>
                  </div>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Rechercher un élève..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-input border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              {/* Grid */}
              <div className="flex-1 overflow-auto">
                {isLoadingGrades ? (
                  <div className="p-12 text-center text-muted-foreground animate-pulse">
                    Chargement des notes...
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-muted/50 sticky top-0 z-10 shadow-sm">
                      <tr>
                        <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Matricule
                        </th>
                        <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Nom de l'élève
                        </th>
                        <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground w-32">
                          Note (/ {selectedSubject.max_score})
                        </th>
                        <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-center">
                          Absence
                        </th>
                        <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Statut
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredGrades.map((grade) => {
                        const isInvalid =
                          grade.raw_score !== undefined &&
                          (grade.raw_score < 0 ||
                            grade.raw_score > selectedSubject.max_score)

                        return (
                          <tr
                            key={grade.id}
                            className="hover:bg-muted/30 transition-colors"
                          >
                            <td className="px-6 py-3 font-mono text-sm text-muted-foreground">
                              {grade.student_matricule}
                            </td>
                            <td className="px-6 py-3 font-medium text-foreground">
                              {grade.student_name}
                            </td>
                            <td className="px-6 py-3">
                              <div className="relative">
                                <input
                                  type="number"
                                  step="0.5"
                                  min="0"
                                  max={selectedSubject.max_score}
                                  value={grade.raw_score ?? ''}
                                  onChange={(e) =>
                                    handleGradeChange(grade.id, e.target.value)
                                  }
                                  disabled={grade.is_absent}
                                  className={`w-24 px-3 py-1.5 text-right font-mono font-bold rounded-md border focus:ring-2 transition-colors ${
                                    grade.is_absent
                                      ? 'bg-muted border-transparent text-muted-foreground cursor-not-allowed'
                                      : isInvalid
                                        ? 'bg-destructive/10 border-destructive text-destructive focus:ring-destructive/50'
                                        : 'bg-input border-transparent text-foreground focus:ring-primary/50 focus:border-primary/50'
                                  }`}
                                />
                                {isInvalid && (
                                  <AlertTriangle
                                    className="absolute -right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-destructive"
                                    title="Note invalide (dépasse le barème)"
                                  />
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-3 text-center">
                              <input
                                type="checkbox"
                                checked={grade.is_absent}
                                onChange={() => {
                                  const newGrades = grades.map((g) =>
                                    g.id === grade.id
                                      ? {
                                          ...g,
                                          is_absent: !g.is_absent,
                                          raw_score: !g.is_absent
                                            ? undefined
                                            : g.raw_score,
                                        }
                                      : g,
                                  )
                                  setGrades(newGrades)
                                }}
                                className="w-4 h-4 rounded text-primary focus:ring-primary/50 border-input"
                              />
                            </td>
                            <td className="px-6 py-3">
                              {grade.status === 'VALIDATED' && (
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-success">
                                  <CheckCircle2 className="w-3 h-3" /> Validée
                                </span>
                              )}
                              {grade.status === 'SUBMITTED' && (
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-500">
                                  Soumise
                                </span>
                              )}
                              {grade.status === 'DRAFT' && (
                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                                  Brouillon
                                </span>
                              )}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-12">
              <FileText className="w-12 h-12 mb-4 opacity-20" />
              <p>
                Sélectionnez une épreuve dans la liste de gauche pour saisir les
                notes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
