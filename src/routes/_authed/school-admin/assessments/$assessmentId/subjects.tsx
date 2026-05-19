import { Link, createFileRoute, useRouter } from '@tanstack/react-router'
import { useState, useTransition } from 'react'
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Edit2,
  Plus,
  Save,
  Search,
  Trash2,
  Users,
  X,
} from 'lucide-react'
import type { BulkSubjectData } from '@/components/BulkCreateSubjectsModal'
import {
  createAssessmentSubjectFn,
  getAssessmentByIdFn,
  getAssessmentSubjectsFn,
} from '@/server/api/assessments'
import { BulkCreateSubjectsModal } from '@/components/BulkCreateSubjectsModal'

export const Route = createFileRoute(
  '/_authed/school-admin/assessments/$assessmentId/subjects',
)({
  component: AssessmentSubjectsPage,
  loader: async ({ params }) => {
    const [assessment, subjects] = await Promise.all([
      getAssessmentByIdFn({ data: params.assessmentId }),
      getAssessmentSubjectsFn({ data: params.assessmentId }),
    ])
    if (!assessment) throw new Error('Assessment not found')
    return { assessment, subjects }
  },
})

function AssessmentSubjectsPage() {
  const { assessment, subjects } = Route.useLoaderData()
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false)
  const [isSingleModalOpen, setIsSingleModalOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const filtered = subjects.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.classroom_name &&
        s.classroom_name.toLowerCase().includes(search.toLowerCase())),
  )

  const handleBulkCreate = (bulkSubjects: Array<BulkSubjectData>) => {
    startTransition(async () => {
      for (const subject of bulkSubjects) {
        await createAssessmentSubjectFn({
          data: {
            assessment_id: assessment.id,
            ...subject,
            status: 'DRAFT',
          },
        })
      }
      setIsBulkModalOpen(false)
      router.invalidate()
    })
  }

  const [singleForm, setSingleForm] = useState({
    name: '',
    classroom_id: '',
    school_year_level_subject_id: '',
    teacher_assignment_id: '',
    exam_date: '',
    max_score: 20,
    coefficient: 1,
  })

  const handleSingleSubmit = () => {
    if (!singleForm.name || !singleForm.classroom_id || !singleForm.exam_date)
      return
    startTransition(async () => {
      await createAssessmentSubjectFn({
        data: {
          assessment_id: assessment.id,
          ...singleForm,
          status: 'DRAFT',
        },
      })
      setIsSingleModalOpen(false)
      setSingleForm({
        name: '',
        classroom_id: '',
        school_year_level_subject_id: '',
        teacher_assignment_id: '',
        exam_date: '',
        max_score: 20,
        coefficient: 1,
      })
      router.invalidate()
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <Link
          to="/school-admin/assessments"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux évaluations</span>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Épreuves : {assessment.name}
          </h1>
          <p className="text-muted-foreground">
            Gérez les matières et les épreuves associées à cette session.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors"
          >
            Importer en masse
          </button>
          <button
            onClick={() => setIsSingleModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors btn-shine hover-scale"
          >
            <Plus className="w-4 h-4" /> Ajouter une épreuve
          </button>
        </div>
      </div>

      <div className="bg-card border border-border p-4 rounded-xl flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher par classe ou matière..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-input border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-muted/30 border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold">Épreuve</th>
                <th className="px-6 py-4 font-semibold">Classe</th>
                <th className="px-6 py-4 font-semibold">Enseignant</th>
                <th className="px-6 py-4 font-semibold">Date prévue</th>
                <th className="px-6 py-4 font-semibold">Barème / Coef</th>
                <th className="px-6 py-4 font-semibold">Statut</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((subject) => (
                <tr
                  key={subject.id}
                  className="hover:bg-muted/20 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-md bg-primary/10 text-primary">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <span className="font-semibold text-foreground">
                        {subject.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted text-sm font-medium">
                      {subject.classroom_name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 opacity-50" />
                      {subject.teacher_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 opacity-50" />
                      {new Date(subject.exam_date).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="font-bold">{subject.max_score} pts</span>
                    <span className="text-muted-foreground ml-2">
                      (Coef: {subject.coefficient})
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {subject.status === 'PUBLISHED' && (
                      <span className="px-2 py-1 bg-success/15 text-success text-xs font-semibold rounded-full">
                        Publiée
                      </span>
                    )}
                    {subject.status === 'DRAFT' && (
                      <span className="px-2 py-1 bg-muted text-muted-foreground text-xs font-semibold rounded-full">
                        Brouillon
                      </span>
                    )}
                    {subject.status === 'CLOSED' && (
                      <span className="px-2 py-1 bg-blue-500/15 text-blue-600 text-xs font-semibold rounded-full">
                        Clôturée
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors"
                        title="Modifier"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    Aucune épreuve configurée pour cette évaluation.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <BulkCreateSubjectsModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onSubmit={handleBulkCreate}
        assessmentId={assessment.id}
        isLoading={isPending}
      />

      {isSingleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsSingleModalOpen(false)}
          />
          <div className="relative w-full max-w-md bg-card border border-border rounded-xl shadow-xl animate-fade-in-up">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-foreground">
                  Nouvelle Épreuve
                </h2>
              </div>
              <button
                onClick={() => setIsSingleModalOpen(false)}
                className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Nom de l'épreuve
                </label>
                <input
                  type="text"
                  value={singleForm.name}
                  onChange={(e) =>
                    setSingleForm({ ...singleForm, name: e.target.value })
                  }
                  placeholder="Ex: Mathématiques - Contrôle 1"
                  className="w-full bg-input border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Classe
                  </label>
                  <select
                    value={singleForm.classroom_id}
                    onChange={(e) =>
                      setSingleForm({
                        ...singleForm,
                        classroom_id: e.target.value,
                      })
                    }
                    className="w-full bg-input border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="c1">6ème A</option>
                    <option value="c2">6ème B</option>
                    <option value="c3">5ème A</option>
                    <option value="c4">5ème B</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Matière
                  </label>
                  <select
                    value={singleForm.school_year_level_subject_id}
                    onChange={(e) =>
                      setSingleForm({
                        ...singleForm,
                        school_year_level_subject_id: e.target.value,
                      })
                    }
                    className="w-full bg-input border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Sélectionner...</option>
                    <option value="syls-1">Mathématiques</option>
                    <option value="syls-2">Français</option>
                    <option value="syls-3">Anglais</option>
                    <option value="syls-4">Histoire-Géo</option>
                    <option value="syls-5">Sciences</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Date
                  </label>
                  <input
                    type="date"
                    value={singleForm.exam_date}
                    onChange={(e) =>
                      setSingleForm({
                        ...singleForm,
                        exam_date: e.target.value,
                      })
                    }
                    className="w-full bg-input border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Note max
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={singleForm.max_score}
                    onChange={(e) =>
                      setSingleForm({
                        ...singleForm,
                        max_score: parseInt(e.target.value) || 20,
                      })
                    }
                    className="w-full bg-input border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Coefficient
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={singleForm.coefficient}
                  onChange={(e) =>
                    setSingleForm({
                      ...singleForm,
                      coefficient: parseInt(e.target.value) || 1,
                    })
                  }
                  className="w-full bg-input border-none rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-primary/50"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-border">
              <button
                onClick={() => setIsSingleModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleSingleSubmit}
                disabled={
                  isPending ||
                  !singleForm.name ||
                  !singleForm.classroom_id ||
                  !singleForm.exam_date
                }
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Créer l'épreuve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
