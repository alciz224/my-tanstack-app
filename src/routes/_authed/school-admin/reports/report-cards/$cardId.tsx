import { Link, createFileRoute } from '@tanstack/react-router'
import {
  ArrowLeft,
  Download,
  GraduationCap,
  Lock,
  Printer,
  School,
} from 'lucide-react'
import { getReportCardByIdFn } from '@/server/api/reports'

export const Route = createFileRoute(
  '/_authed/school-admin/reports/report-cards/$cardId',
)({
  component: ReportCardDetailPage,
  loader: async ({ params }) => {
    const reportCard = await getReportCardByIdFn({ data: params.cardId })
    if (!reportCard) throw new Error('Report card not found')
    return { reportCard }
  },
})

function ReportCardDetailPage() {
  const { reportCard } = Route.useLoaderData()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/school-admin/reports/report-cards"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux bulletins</span>
        </Link>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors text-sm">
            <Printer className="w-4 h-4" /> Imprimer
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors text-sm">
            <Download className="w-4 h-4" /> PDF
          </button>
        </div>
      </div>

      {/* A4 Document */}
      <div
        className="bg-white border border-gray-200 rounded-xl shadow-sm mx-auto print:shadow-none print:border-none"
        style={{ maxWidth: '210mm' }}
      >
        {/* ===== HEADER (two-side layout) ===== */}
        <div className="border-b-2 border-gray-300 pb-4 mb-6 pt-6 px-8">
          <div className="flex gap-4">
            {/* Left side: School */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-14 h-14 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-400 shrink-0">
                <School className="w-[1.4rem] h-[1.4rem]" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base font-bold text-gray-900 uppercase leading-tight">
                  Groupe Scolaire Excellence
                </h1>
                <p className="text-xs text-gray-500 leading-tight mt-0.5">
                  BP 1234, Conakry • Tél : +224 622 00 00 00
                </p>
                <p className="text-xs text-gray-500 leading-tight">
                  contact@groupscolaire-excellence.edu.gn
                </p>
              </div>
            </div>

            {/* Right side: Republic */}
            <div className="flex items-center gap-3 min-w-0 flex-1 text-right justify-end">
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-700 uppercase leading-tight">
                  République de Guinée
                </p>
                <p className="text-[10px] text-gray-500 leading-tight">
                  Travail – Justice – Solidarité
                </p>
                <p className="text-[10px] font-semibold text-gray-600 leading-tight mt-0.5">
                  Ministère de l'Éducation Nationale
                </p>
                <p className="text-[10px] text-gray-500 leading-tight">
                  et de l'Enseignement Technique
                </p>
              </div>
              <div className="w-14 h-14 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-400 shrink-0">
                <GraduationCap className="w-[1.4rem] h-[1.4rem]" />
              </div>
            </div>
          </div>

          {/* Title bar */}
          <div className="flex items-center gap-3 mt-3 pt-2.5 border-t border-gray-200">
            <div className="h-px flex-1 bg-gray-200" />
            <p className="text-base font-bold text-gray-800 uppercase tracking-wider shrink-0">
              Bulletin Scolaire — {reportCard.term_name}
            </p>
            <div className="h-px flex-1 bg-gray-200" />
          </div>
          <p className="text-xs text-gray-400 text-center mt-0.5">
            Année Académique 2024-2025
          </p>
        </div>

        {/* ===== STUDENT INFO ===== */}
        <div className="mb-5 px-8">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-2 bg-gray-50 font-semibold text-gray-700 w-1/4">
                    Élève
                  </td>
                  <td className="px-4 py-2 font-bold text-gray-900 w-1/4">
                    {reportCard.student_name}
                  </td>
                  <td className="px-4 py-2 bg-gray-50 font-semibold text-gray-700 w-1/4">
                    Matricule
                  </td>
                  <td className="px-4 py-2 font-medium text-gray-900 w-1/4">
                    {reportCard.student_matricule}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-2 bg-gray-50 font-semibold text-gray-700">
                    Classe
                  </td>
                  <td className="px-4 py-2 font-medium text-gray-900">
                    {reportCard.classroom_name}
                  </td>
                  <td className="px-4 py-2 bg-gray-50 font-semibold text-gray-700">
                    Niveau
                  </td>
                  <td className="px-4 py-2 font-medium text-gray-900">
                    {reportCard.classroom_name?.replace(/\s+[A-Z]$/, '')}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 bg-gray-50 font-semibold text-gray-700">
                    Trimestre
                  </td>
                  <td className="px-4 py-2 font-medium text-gray-900">
                    {reportCard.term_name}
                  </td>
                  <td className="px-4 py-2 bg-gray-50 font-semibold text-gray-700">
                    Année Scolaire
                  </td>
                  <td className="px-4 py-2 font-medium text-gray-900">
                    2024-2025
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ===== GRADES TABLE ===== */}
        <div className="mb-5 px-8">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-800 text-white uppercase tracking-wider">
                  <th className="px-4 py-3 text-left font-semibold">
                    Matières
                  </th>
                  <th className="px-4 py-3 text-center font-semibold w-16">
                    Coef.
                  </th>
                  <th className="px-4 py-3 text-center font-semibold w-20">
                    Note /20
                  </th>
                  <th className="px-4 py-3 text-center font-semibold w-20">
                    Pondérée
                  </th>
                  <th className="px-4 py-3 text-center font-semibold w-24">
                    Appréciation
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reportCard.line_items?.map((item, idx) => (
                  <tr
                    key={item.id}
                    className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                  >
                    <td className="px-4 py-2">
                      <div className="font-medium text-gray-900">
                        {item.subject_name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {item.teacher_name}
                      </div>
                    </td>
                    <td className="px-4 py-2 text-center text-gray-700">
                      {item.coefficient}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <span
                        className={`font-semibold ${item.score < 10 ? 'text-red-600' : item.score < 12 ? 'text-amber-600' : 'text-gray-900'}`}
                      >
                        {item.score.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-center font-semibold text-gray-900">
                      {item.weighted_score.toFixed(1)}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <span className="text-xs text-gray-500 italic">
                        {item.appreciation || '—'}
                      </span>
                    </td>
                  </tr>
                ))}
                {!reportCard.line_items?.length && (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-gray-500 text-sm"
                    >
                      Aucune note enregistrée.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ===== APPRECIATIONS ===== */}
        {reportCard.line_items && reportCard.line_items.length > 0 && (
          <div className="mb-4 px-8">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 border-b border-gray-200 pb-1">
              Appréciations des professeurs
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
              {reportCard.line_items.map((item) => (
                <div key={`app-${item.id}`} className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-800">
                    {item.subject_name}
                  </span>{' '}
                  —{' '}
                  <span className="italic">
                    {item.appreciation || 'Aucune appréciation.'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===== RESULTS SUMMARY ===== */}
        <div className="mb-4 px-8">
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="grid grid-cols-4 divide-x divide-gray-200">
              <div className="py-3 px-4 text-center bg-gray-50">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  Total
                </p>
                <p className="text-lg font-bold text-gray-900 mt-0.5">
                  {reportCard.line_items
                    ?.reduce((s, i) => s + i.weighted_score, 0)
                    .toFixed(1)}
                </p>
              </div>
              <div className="py-3 px-4 text-center">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  Moyenne
                </p>
                <p className="text-lg font-bold text-primary mt-0.5">
                  {reportCard.average_score?.toFixed(2) || '—'}
                </p>
              </div>
              <div className="py-3 px-4 text-center bg-gray-50">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  Rang
                </p>
                <p className="text-lg font-bold text-gray-900 mt-0.5">
                  {reportCard.rank ? `#${reportCard.rank}` : '—'}
                </p>
              </div>
              <div className="py-3 px-4 text-center">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  Décision
                </p>
                <p
                  className={`text-base font-bold mt-0.5 ${reportCard.decision === 'PASS' ? 'text-green-600' : reportCard.decision === 'FAIL' ? 'text-red-600' : 'text-amber-600'}`}
                >
                  {reportCard.decision === 'PASS'
                    ? 'ADMIS(E)'
                    : reportCard.decision === 'FAIL'
                      ? 'REFUSÉ(E)'
                      : reportCard.decision === 'REPEAT'
                        ? 'REDOUBLE'
                        : 'EN ATTENTE'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ===== OBSERVATIONS ===== */}
        <div className="mb-4 px-8">
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 border-b border-gray-200 pb-1">
            Observations du conseil de classe
          </h3>
          <p className="text-sm text-gray-600 min-h-[1.5rem]">
            {reportCard.decision === 'PASS'
              ? 'Passage en classe supérieure. Félicitations du conseil de classe.'
              : reportCard.decision === 'FAIL'
                ? "L'élève n'a pas atteint le seuil requis. Un accompagnement supplémentaire est recommandé."
                : reportCard.decision === 'REPEAT'
                  ? 'Redoublement recommandé par le conseil de classe après étude du dossier.'
                  : 'Décision en attente du conseil de classe.'}
          </p>
        </div>

        {/* ===== SIGNATURES ===== */}
        <div className="border-t border-gray-200 pt-4 mb-4 px-8">
          <div className="grid grid-cols-3 gap-4 text-center text-xs text-gray-500">
            <div>
              <p className="font-semibold text-gray-700 mb-3">Le Directeur</p>
              <div className="h-8" />
              <div className="border-t border-gray-300 pt-0.5 text-[10px]">
                Nom et signature
              </div>
            </div>
            <div>
              <p className="font-semibold text-gray-700 mb-3">
                Le Professeur Principal
              </p>
              <div className="h-8" />
              <div className="border-t border-gray-300 pt-0.5 text-[10px]">
                Nom et signature
              </div>
            </div>
            <div>
              <p className="font-semibold text-gray-700 mb-3">
                Visa de l'Inspecteur
              </p>
              <div className="h-8" />
              <div className="border-t border-gray-300 pt-0.5 text-[10px]">
                Cachet et signature
              </div>
            </div>
          </div>
        </div>

        {/* ===== FOOTER ===== */}
        <div className="border-t border-gray-200 pt-2.5 pb-6 px-8 flex justify-between items-center text-xs text-gray-400">
          <div>
            <p>
              Généré le{' '}
              {new Date(reportCard.generated_at).toLocaleDateString('fr-FR')}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {reportCard.status === 'LOCKED' && (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Document officiel verrouillé</span>
              </>
            )}
            {reportCard.status === 'DRAFT' && (
              <span className="italic">Document provisoire</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
