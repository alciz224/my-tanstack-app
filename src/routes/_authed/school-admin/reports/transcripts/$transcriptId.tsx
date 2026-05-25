import { Link, createFileRoute } from '@tanstack/react-router'
import {
  ArrowLeft,
  Download,
  GraduationCap,
  Lock,
  Printer,
  School,
} from 'lucide-react'
import { getTranscriptByIdFn } from '@/server/api/reports'

export const Route = createFileRoute(
  '/_authed/school-admin/reports/transcripts/$transcriptId',
)({
  component: TranscriptDetailPage,
  loader: async ({ params }) => {
    const transcript = await getTranscriptByIdFn({ data: params.transcriptId })
    if (!transcript) throw new Error('Transcript not found')
    return { transcript }
  },
})

const trimesterHistory = [
  { period: 'Trimestre 1', average: 14.5, rank: '3ème', decision: 'Admis' },
  { period: 'Trimestre 2', average: 15.2, rank: '2ème', decision: 'Admis' },
  { period: 'Trimestre 3', average: 14.85, rank: '2ème', decision: 'Admis' },
]

function DecisionBadge({ decision }: { decision: string }) {
  const styles: Record<string, string> = {
    Admis: 'bg-success/15 text-success',
    REFUSÉ: 'bg-destructive/15 text-destructive',
    REDOUBLE: 'bg-warning/15 text-warning',
    'EN ATTENTE': 'bg-muted text-muted-foreground',
  }
  return (
    <span
      className={`inline-block px-2.5 py-1 rounded text-xs font-semibold ${styles[decision] || 'bg-muted text-muted-foreground'}`}
    >
      {decision}
    </span>
  )
}

function TranscriptDetailPage() {
  const { transcript } = Route.useLoaderData()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to="/school-admin/reports/transcripts"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux relevés</span>
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
              Relevé de Notes Annuel
            </p>
            <div className="h-px flex-1 bg-gray-200" />
          </div>
          <p className="text-xs text-gray-400 text-center mt-0.5">
            Année Académique {transcript.school_year_name}
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
                    {transcript.student_name}
                  </td>
                  <td className="px-4 py-2 bg-gray-50 font-semibold text-gray-700 w-1/4">
                    Matricule
                  </td>
                  <td className="px-4 py-2 font-medium text-gray-900 w-1/4">
                    {transcript.student_matricule}
                  </td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="px-4 py-2 bg-gray-50 font-semibold text-gray-700">
                    Cycle
                  </td>
                  <td className="px-4 py-2 font-medium text-gray-900">
                    {transcript.cycle_name}
                  </td>
                  <td className="px-4 py-2 bg-gray-50 font-semibold text-gray-700">
                    Niveau
                  </td>
                  <td className="px-4 py-2 font-medium text-gray-900">
                    {transcript.level_name}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-2 bg-gray-50 font-semibold text-gray-700">
                    Année Scolaire
                  </td>
                  <td className="px-4 py-2 font-medium text-gray-900">
                    {transcript.school_year_name}
                  </td>
                  <td className="px-4 py-2 bg-gray-50 font-semibold text-gray-700" />
                  <td className="px-4 py-2 font-medium text-gray-900" />
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ===== TRIMESTER HISTORY TABLE ===== */}
        <div className="mb-5 px-8">
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Historique des Trimestres
          </h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-800 text-white uppercase tracking-wider">
                  <th className="px-4 py-3 text-left font-semibold">Période</th>
                  <th className="px-4 py-3 text-center font-semibold w-28">
                    Moyenne
                  </th>
                  <th className="px-4 py-3 text-center font-semibold w-24">
                    Rang
                  </th>
                  <th className="px-4 py-3 text-center font-semibold w-36">
                    Décision
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {trimesterHistory.map((t, idx) => (
                  <tr
                    key={t.period}
                    className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}
                  >
                    <td className="px-4 py-2.5 font-medium text-gray-900">
                      {t.period}
                    </td>
                    <td className="px-4 py-2.5 text-center font-semibold text-gray-900">
                      {t.average.toFixed(2)}
                    </td>
                    <td className="px-4 py-2.5 text-center text-gray-700">
                      {t.rank}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <DecisionBadge decision={t.decision} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ===== RESULTS SUMMARY ===== */}
        <div className="mb-4 px-8">
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Bilan Annuel
          </h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="grid grid-cols-3 divide-x divide-gray-200">
              <div className="py-3 px-4 text-center bg-gray-50">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  Moyenne Générale
                </p>
                <p className="text-lg font-bold text-primary mt-0.5">
                  {transcript.average_score?.toFixed(2) || '—'}
                </p>
              </div>
              <div className="py-3 px-4 text-center">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  Rang Annuel
                </p>
                <p className="text-lg font-bold text-gray-900 mt-0.5">
                  {transcript.rank ? `#${transcript.rank}` : '—'}
                </p>
              </div>
              <div className="py-3 px-4 text-center bg-gray-50">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                  Décision du Conseil
                </p>
                <p
                  className={`text-base font-bold mt-0.5 ${transcript.decision === 'PASS' ? 'text-green-600' : transcript.decision === 'FAIL' ? 'text-red-600' : transcript.decision === 'REPEAT' ? 'text-amber-600' : 'text-gray-600'}`}
                >
                  {transcript.decision === 'PASS'
                    ? 'ADMIS(E)'
                    : transcript.decision === 'FAIL'
                      ? 'REFUSÉ(E)'
                      : transcript.decision === 'REPEAT'
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
            Appréciation générale du directeur
          </h3>
          <p className="text-sm text-gray-600 min-h-[1.5rem] italic">
            {transcript.remarks
              ? `« ${transcript.remarks} »`
              : 'Aucune appréciation.'}
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
              {new Date(transcript.generated_at).toLocaleDateString('fr-FR')}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {transcript.status === 'LOCKED' && (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Document officiel verrouillé</span>
              </>
            )}
            {transcript.status === 'DRAFT' && (
              <span className="italic">Document provisoire</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
