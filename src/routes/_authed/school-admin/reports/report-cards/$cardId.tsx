import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, Download, FileText, Lock, Printer } from 'lucide-react'
import { getReportCardByIdFn } from '@/server/api/reports'

export const Route = createFileRoute(
  '/_authed/school-admin/reports/report-cards/$cardId',
)({
  component: ReportCardDetailPage,
  loader: async ({ params }) => {
    const reportCard = await getReportCardByIdFn(params.cardId)
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

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 max-w-3xl mx-auto print:shadow-none print:border-none">
        <div className="text-center border-b border-gray-200 pb-6 mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold">BULLETIN SCOLAIRE</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            École Primaire Excellence
          </h1>
          <p className="text-gray-600">Année scolaire 2024-2025</p>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Élève</h3>
            <p className="text-lg font-bold text-gray-900">
              {reportCard.student_name}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Matricule
            </h3>
            <p className="text-lg font-medium text-gray-900">
              {reportCard.student_matricule}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Classe</h3>
            <p className="text-lg font-medium text-gray-900">
              {reportCard.classroom_name}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">
              Trimestre
            </h3>
            <p className="text-lg font-medium text-gray-900">
              {reportCard.term_name}
            </p>
          </div>
        </div>

        <div className="border-t border-b border-gray-200 py-6 mb-6">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500">
                <th className="pb-2 font-medium">Matière</th>
                <th className="pb-2 font-medium text-center">Coefficient</th>
                <th className="pb-2 font-medium text-center">Note</th>
                <th className="pb-2 font-medium text-right">Note pondérée</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reportCard.line_items?.map((item) => (
                <tr key={item.id}>
                  <td className="py-2">
                    <div className="font-medium text-gray-900">{item.subject_name}</div>
                    <div className="text-xs text-gray-500">{item.teacher_name}</div>
                  </td>
                  <td className="py-2 text-center">{item.coefficient}</td>
                  <td className="py-2 text-center">
                    <span className={`font-medium ${item.score < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                      {item.score.toFixed(1)}
                    </span>
                  </td>
                  <td className="py-2 text-right font-medium">{item.weighted_score.toFixed(1)}</td>
                </tr>
              ))}
              {!reportCard.line_items?.length && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-gray-500">
                    Aucune note enregistrée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {reportCard.line_items && reportCard.line_items.length > 0 && (
          <div className="mb-6 border border-gray-200 rounded-lg p-4 bg-gray-50">
             <h3 className="text-sm font-bold text-gray-700 mb-3">Appréciations des professeurs</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {reportCard.line_items.map((item) => (
                 <div key={`app-${item.id}`} className="text-sm">
                   <span className="font-semibold text-gray-800">{item.subject_name} : </span>
                   <span className="text-gray-600 italic">{item.appreciation || 'Aucune appréciation.'}</span>
                 </div>
               ))}
             </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">Moyenne</p>
            <p className="text-3xl font-bold text-primary">
              {reportCard.average_score?.toFixed(2)}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">Rang</p>
            <p className="text-3xl font-bold text-gray-900">
              #{reportCard.rank}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <p className="text-sm text-gray-500 mb-1">Décision</p>
            <p
              className={`text-xl font-bold ${
                reportCard.decision === 'PASS'
                  ? 'text-green-600'
                  : reportCard.decision === 'FAIL'
                    ? 'text-red-600'
                    : 'text-amber-600'
              }`}
            >
              {reportCard.decision === 'PASS'
                ? 'ADMIS'
                : reportCard.decision === 'FAIL'
                  ? 'REFUSÉ'
                  : reportCard.decision === 'REPEAT'
                    ? 'REDOUBLE'
                    : 'EN ATTENTE'}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-4 flex justify-between items-center text-sm text-gray-500">
          <div>
            <p>
              Généré le:{' '}
              {new Date(reportCard.generated_at).toLocaleDateString('fr-FR')}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {reportCard.status === 'LOCKED' && (
              <>
                <Lock className="w-4 h-4" />
                <span>Document vérrouillé</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
