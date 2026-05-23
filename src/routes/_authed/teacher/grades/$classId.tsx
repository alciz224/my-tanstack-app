import { createFileRoute, Link, useParams } from '@tanstack/react-router'
import { useState } from 'react'
import {
  ArrowLeft,
  CheckCircle,
  Download,
  FileText,
  Printer,
  Save,
  Search,
  X,
} from 'lucide-react'

export const Route = createFileRoute('/_authed/teacher/grades/$classId')({
  component: GradeEntryPage,
})

interface StudentGrade {
  id: string
  name: string
  first_name: string
  absent: boolean
  excused: boolean
  raw_score?: number
  remark?: string
}

const MOCK_STUDENTS: StudentGrade[] = [
  {
    id: 's1',
    name: 'Barry',
    first_name: 'Mamadou',
    raw_score: 14.5,
    absent: false,
    excused: false,
  },
  {
    id: 's2',
    name: 'Camara',
    first_name: 'Fatoumata',
    raw_score: 16,
    absent: false,
    excused: false,
  },
  {
    id: 's3',
    name: 'Diallo',
    first_name: 'Alpha',
    raw_score: 12,
    absent: false,
    excused: false,
  },
  {
    id: 's4',
    name: 'Sylla',
    first_name: 'Mariama',
    absent: true,
    excused: false,
  },
  {
    id: 's5',
    name: 'Kéita',
    first_name: 'Moussa',
    raw_score: 18,
    absent: false,
    excused: false,
  },
  {
    id: 's6',
    name: 'Bangoura',
    first_name: 'Moussa',
    raw_score: 10,
    absent: false,
    excused: false,
  },
  {
    id: 's7',
    name: 'Soumah',
    first_name: 'Mamadou',
    raw_score: 15,
    absent: false,
    excused: false,
  },
  {
    id: 's8',
    name: 'Touré',
    first_name: 'Ibrahim',
    raw_score: 13.5,
    absent: false,
    excused: false,
  },
  {
    id: 's9',
    name: 'Camara',
    first_name: 'Kadiatou',
    absent: false,
    excused: true,
  },
  {
    id: 's10',
    name: 'Baldé',
    first_name: 'Oumar',
    raw_score: 11,
    absent: false,
    excused: false,
  },
]

function GradeEntryPage() {
  const params = useParams({ from: '/_authed/teacher/grades/$classId' })
  const [students, setStudents] = useState(MOCK_STUDENTS)
  const [maxScore] = useState(20)
  const [isSaving, setIsSaving] = useState(false)
  const [search, setSearch] = useState('')

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.first_name.toLowerCase().includes(search.toLowerCase()),
  )

  const handleScoreChange = (studentId: string, score: string) => {
    const numScore = parseFloat(score)
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              raw_score: isNaN(numScore)
                ? undefined
                : Math.min(Math.max(numScore, 0), maxScore),
            }
          : s,
      ),
    )
  }

  const handleAbsentToggle = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? {
              ...s,
              absent: !s.absent,
              excused: s.absent ? s.excused : false,
              raw_score: s.absent ? s.raw_score : undefined,
            }
          : s,
      ),
    )
  }

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 1000))
    setIsSaving(false)
  }

  const average =
    students
      .filter((s) => !s.absent && s.raw_score !== undefined)
      .reduce((acc, s) => acc + (s.raw_score || 0), 0) /
    students.filter((s) => !s.absent).length

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Link
            to="/teacher/classes"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux classes</span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">
            Saisie des Notes - 6ème A
          </h1>
          <p className="text-muted-foreground">
            Mathématiques - Composition du 1er Trimestre
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-md hover:bg-muted/80 transition-colors">
            <Printer className="w-4 h-4" />
            <span>Imprimer</span>
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <span className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Enregistrer</span>
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <p className="text-sm text-muted-foreground">Effectif</p>
            <p className="text-xl font-bold">{students.length}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Absents</p>
            <p className="text-xl font-bold text-orange-500">
              {students.filter((s) => s.absent).length}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Moyenne</p>
            <p className="text-xl font-bold text-primary">
              {isNaN(average) ? '-' : average.toFixed(2)}/{maxScore}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-input border-none rounded-lg py-2 pl-9 pr-4 text-foreground focus:ring-2 focus:ring-ring focus:outline-none w-48"
            />
          </div>
        </div>
      </div>

      {/* Grade Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                Élève
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide w-32">
                Note / {maxScore}
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide">
                Absent
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide">
                Excusé
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide">
                Remarque
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredStudents.map((student, index) => (
              <tr
                key={student.id}
                className={`hover:bg-muted/40 transition-colors ${
                  student.absent ? 'bg-orange-500/5' : ''
                }`}
              >
                <td className="px-4 py-3 text-sm text-muted-foreground">
                  {index + 1}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                      {student.first_name[0]}
                    </div>
                    <span className="font-medium text-foreground">
                      {student.first_name} {student.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    value={student.raw_score ?? ''}
                    onChange={(e) =>
                      handleScoreChange(student.id, e.target.value)
                    }
                    disabled={student.absent}
                    min={0}
                    max={maxScore}
                    step={0.5}
                    className={`w-20 mx-auto text-center py-2 rounded-lg border border-border bg-input focus:ring-2 focus:ring-ring focus:outline-none ${
                      student.absent ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  />
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleAbsentToggle(student.id)}
                    className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                      student.absent
                        ? 'bg-orange-500 text-white'
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                  >
                    {student.absent && <X className="w-4 h-4" />}
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    disabled={!student.absent}
                    className={`w-6 h-6 rounded flex items-center justify-center transition-colors ${
                      student.excused
                        ? 'bg-blue-500 text-white'
                        : 'bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed'
                    }`}
                    onClick={() =>
                      setStudents((prev) =>
                        prev.map((s) =>
                          s.id === student.id
                            ? { ...s, excused: !s.excused }
                            : s,
                        ),
                      )
                    }
                  >
                    {student.excused && <CheckCircle className="w-4 h-4" />}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={student.remark ?? ''}
                    onChange={(e) =>
                      setStudents((prev) =>
                        prev.map((s) =>
                          s.id === student.id
                            ? { ...s, remark: e.target.value }
                            : s,
                        ),
                      )
                    }
                    placeholder="Remarque..."
                    className="w-full py-1 px-2 text-sm rounded border border-border bg-input focus:ring-2 focus:ring-ring focus:outline-none"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
