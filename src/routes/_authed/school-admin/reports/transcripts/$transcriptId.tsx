import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowLeft, Download, FileText, Lock, Printer } from 'lucide-react'
import { getTranscriptByIdFn } from '@/server/api/reports'

export const Route = createFileRoute(
  '/_authed/school-admin/reports/transcripts/$transcriptId',
)({
  component: TranscriptDetailPage,
  loader: async ({ params }) => {
    const transcript = await getTranscriptByIdFn(params.transcriptId)
    if (!transcript) throw new Error('Transcript not found')
    return { transcript }
  },
})

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

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 max-w-4xl mx-auto print:shadow-none print:border-none">
        <div className="text-center border-b border-gray-200 pb-6 mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold">RELEVÉ DE NOTES ANNUEL</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">École Primaire Excellence</h1>
          <p className="text-gray-600">Année scolaire {transcript.school_year_name}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Élève</h3>
            <p className="text-lg font-bold text-gray-900">{transcript.student_name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Matricule</h3>
            <p className="text-lg font-medium text-gray-900">{transcript.student_matricule}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Cycle</h3>
            <p className="text-lg font-medium text-gray-900">{transcript.cycle_name}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Niveau</h3>
            <p className="text-lg font-medium text-gray-900">{transcript.level_name}</p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Historique des Trimestres</h3>
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500">
                <th className="pb-2 font-medium">Période</th>
                <th className="pb-2 font-medium text-center">Moyenne</th>
                <th className="pb-2 font-medium text-center">Rang</th>
                <th className="pb-2 font-medium text-right">Décision Trimestrielle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr>
                <td className="py-4 font-medium text-gray-900">Trimestre 1</td>
                <td className="py-4 text-center text-gray-700">14.50</td>
                <td className="py-4 text-center text-gray-700">3ème</td>
                <td className="py-4 text-right text-green-600 font-medium">Admis</td>
              </tr>
              <tr>
                <td className="py-4 font-medium text-gray-900">Trimestre 2</td>
                <td className="py-4 text-center text-gray-700">15.20</td>
                <td className="py-4 text-center text-gray-700">2ème</td>
                <td className="py-4 text-right text-green-600 font-medium">Admis</td>
              </tr>
              <tr>
                <td className="py-4 font-medium text-gray-900">Trimestre 3</td>
                <td className="py-4 text-center text-gray-700">14.85</td>
                <td className="py-4 text-center text-gray-700">2ème</td>
                <td className="py-4 text-right text-green-600 font-medium">Admis</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
           <h3 className="text-sm font-bold text-gray-700 mb-4 uppercase">Bilan Annuel</h3>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="text-center">
               <p className="text-sm text-gray-500 mb-1">Moyenne Générale</p>
               <p className="text-4xl font-bold text-primary">{transcript.average_score?.toFixed(2) || '-'}</p>
             </div>
             <div className="text-center border-l border-r border-gray-200">
               <p className="text-sm text-gray-500 mb-1">Rang Annuel</p>
               <p className="text-4xl font-bold text-gray-900">{transcript.rank ? `#${transcript.rank}` : '-'}</p>
             </div>
             <div className="text-center">
               <p className="text-sm text-gray-500 mb-1">Décision du Conseil</p>
               <p className={`text-2xl font-bold mt-2 ${
                  transcript.decision === 'PASS' ? 'text-green-600' :
                  transcript.decision === 'FAIL' ? 'text-red-600' :
                  transcript.decision === 'REPEAT' ? 'text-amber-600' : 'text-gray-600'
               }`}>
                  {transcript.decision === 'PASS' ? 'ADMIS(E) EN CLASSE SUPÉRIEURE' :
                   transcript.decision === 'FAIL' ? 'REFUSÉ(E)' :
                   transcript.decision === 'REPEAT' ? 'REDOUBLEMENT' : 'EN ATTENTE'}
               </p>
             </div>
           </div>
           
           {transcript.remarks && (
             <div className="mt-6 pt-6 border-t border-gray-200">
               <p className="text-sm text-gray-500 mb-1">Appréciation générale du directeur</p>
               <p className="text-gray-800 italic font-medium">« {transcript.remarks} »</p>
             </div>
           )}
        </div>

        <div className="grid grid-cols-2 mt-12 pt-8 border-t border-gray-200">
          <div>
            <p className="text-sm text-gray-500">Date d'émission</p>
            <p className="font-medium text-gray-900">{new Date(transcript.generated_at).toLocaleDateString('fr-FR')}</p>
            {transcript.status === 'LOCKED' && (
              <div className="flex items-center gap-1 text-sm text-success mt-2">
                <Lock className="w-4 h-4" />
                <span>Document officiel vérrouillé</span>
              </div>
            )}
          </div>
          <div className="text-right">
             <p className="text-sm text-gray-500 mb-12">Signature de la Direction</p>
             <div className="inline-block border-b border-dashed border-gray-400 w-48"></div>
          </div>
        </div>

      </div>
    </div>
  )
}
