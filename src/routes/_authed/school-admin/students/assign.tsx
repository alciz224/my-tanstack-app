import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import {
  CheckCircle2,
  ChevronRight,
  FolderOpen,
  GraduationCap,
  Search,
  UserCheck,
  UserMinus,
  Users,
} from 'lucide-react'
import {
  LEVELS_BY_CYCLE,
  MOCK_STUDENTS,
  OPTIONS_BY_CYCLE,
} from '@/server/data/students/mocks'

export const Route = createFileRoute('/_authed/school-admin/students/assign')({
  component: AssignStudentsPage,
})

const MOCK_CLASSROOMS: Record<
  string,
  Array<{ id: string; name: string; capacity: number; enrolled: number }>
> = {
  '1ère': [
    { id: 'c-1a', name: '1ère A', capacity: 30, enrolled: 22 },
    { id: 'c-1b', name: '1ère B', capacity: 30, enrolled: 18 },
  ],
  '2ème': [
    { id: 'c-2a', name: '2ème A', capacity: 30, enrolled: 25 },
    { id: 'c-2b', name: '2ème B', capacity: 30, enrolled: 20 },
  ],
  '3ème': [
    { id: 'c-3a', name: '3ème A', capacity: 30, enrolled: 28 },
    { id: 'c-3b', name: '3ème B', capacity: 30, enrolled: 15 },
  ],
  '4ème': [
    { id: 'c-4a', name: '4ème A', capacity: 30, enrolled: 24 },
    { id: 'c-4b', name: '4ème B', capacity: 30, enrolled: 26 },
  ],
  '5ème': [
    { id: 'c-5a', name: '5ème A', capacity: 30, enrolled: 20 },
    { id: 'c-5b', name: '5ème B', capacity: 30, enrolled: 22 },
  ],
  '6ème': [
    { id: 'c-6a', name: '6ème A', capacity: 30, enrolled: 25 },
    { id: 'c-6b', name: '6ème B', capacity: 30, enrolled: 28 },
    { id: 'c-6c', name: '6ème C', capacity: 30, enrolled: 15 },
  ],
  '7ème': [
    { id: 'c-7a', name: '7ème A', capacity: 30, enrolled: 22 },
    { id: 'c-7b', name: '7ème B', capacity: 30, enrolled: 18 },
  ],
  '8ème': [
    { id: 'c-8a', name: '8ème A', capacity: 30, enrolled: 25 },
    { id: 'c-8b', name: '8ème B', capacity: 30, enrolled: 20 },
  ],
  '9ème Hum A': [
    { id: 'c-9ha', name: '9ème Hum A', capacity: 30, enrolled: 18 },
  ],
  '9ème Hum B': [
    { id: 'c-9hb', name: '9ème Hum B', capacity: 30, enrolled: 20 },
  ],
  '10ème Sci A': [
    { id: 'c-10sa', name: '10ème Sci A', capacity: 30, enrolled: 24 },
    { id: 'c-10sb', name: '10ème Sci B', capacity: 30, enrolled: 20 },
  ],
  '10ème Péd B': [
    { id: 'c-10pb', name: '10ème Péd B', capacity: 30, enrolled: 18 },
  ],
  '11ème TC A': [
    { id: 'c-11tca', name: '11ème TC A', capacity: 30, enrolled: 22 },
  ],
  '12ème Sci A': [
    { id: 'c-12sa', name: '12ème Sci A', capacity: 30, enrolled: 20 },
  ],
  '12ème Hum A': [
    { id: 'c-12ha', name: '12ème Hum A', capacity: 30, enrolled: 18 },
  ],
}

function AssignStudentsPage() {
  const [selectedCycle, setSelectedCycle] = useState('Primaire')
  const [selectedLevel, setSelectedLevel] = useState('6ème')
  const [selectedOption, setSelectedOption] = useState('')
  const [search, setSearch] = useState('')

  const pendingStudents = useMemo(() => {
    return MOCK_STUDENTS.filter(
      (s) =>
        s.enrollment_status === 'PRE_REGISTERED' ||
        (s.enrollment_status === 'ACTIVE' && !s.classroom_id),
    )
  }, [])

  const groupedStudents = useMemo(() => {
    const groups: Array<{
      level: string
      option?: string
      students: typeof MOCK_STUDENTS
    }> = []
    const filtered = pendingStudents.filter((s) => {
      const matchesCycle = s.cycle === selectedCycle
      const matchesLevel = s.level === selectedLevel
      const matchesOption = !selectedOption || s.option === selectedOption
      const matchesSearch =
        !search ||
        s.full_name.toLowerCase().includes(search.toLowerCase()) ||
        s.annual_identifier.toLowerCase().includes(search.toLowerCase())
      return matchesCycle && matchesLevel && matchesOption && matchesSearch
    })

    if (selectedCycle === 'Primaire') {
      groups.push({ level: selectedLevel, students: filtered })
    } else {
      const optionGroups: Record<string, typeof filtered> = {}
      filtered.forEach((student) => {
        const key = student.option || 'default'
        if (!optionGroups[key]) optionGroups[key] = []
        optionGroups[key].push(student)
      })
      Object.entries(optionGroups).forEach(([option, students]) => {
        if (students.length > 0) {
          groups.push({ level: selectedLevel, option, students })
        }
      })
    }
    return groups
  }, [pendingStudents, selectedCycle, selectedLevel, selectedOption, search])

  const currentGroupStudents = useMemo(() => {
    if (selectedCycle === 'Secondaire' && selectedOption) {
      const group = groupedStudents.find((g) => g.option === selectedOption)
      return group?.students || []
    }
    return groupedStudents[0]?.students || []
  }, [groupedStudents, selectedOption, selectedCycle])

  const availableClassrooms = useMemo(() => {
    if (selectedCycle === 'Secondaire' && selectedOption) {
      const key = `${selectedLevel} ${selectedOption}`
      return MOCK_CLASSROOMS[key] || []
    }
    return MOCK_CLASSROOMS[selectedLevel] || []
  }, [selectedLevel, selectedOption, selectedCycle])

  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(
    new Set(),
  )
  const [selectedClassroomId, setSelectedClassroomId] = useState<string | null>(
    null,
  )
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const toggleStudent = (id: string) => {
    const next = new Set(selectedStudentIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedStudentIds(next)
  }

  const handleAssign = () => {
    if (!selectedClassroomId || selectedStudentIds.size === 0) return
    setShowConfirmModal(true)
  }

  const confirmAssignment = () => {
    const classroom = availableClassrooms.find(
      (c) => c.id === selectedClassroomId,
    )
    alert(
      `${selectedStudentIds.size} élève(s) affecté(s) à la classe ${classroom?.name}`,
    )
    setSelectedStudentIds(new Set())
    setSelectedClassroomId(null)
    setShowConfirmModal(false)
  }

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Affectation des classes
          </h1>
          <p className="text-muted-foreground">
            Répartissez les élèves pré-inscrits dans leurs classes respectives.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-card border border-border p-2 rounded-lg">
          <select
            value={selectedCycle}
            onChange={(e) => {
              setSelectedCycle(e.target.value)
              setSelectedLevel(LEVELS_BY_CYCLE[e.target.value][0])
              setSelectedOption('')
            }}
            className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer"
          >
            <option value="Primaire">Primaire</option>
            <option value="Secondaire">Secondaire</option>
          </select>
          <div className="w-px h-6 bg-border" />
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer"
          >
            {(LEVELS_BY_CYCLE[selectedCycle] || []).map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
          {selectedCycle === 'Secondaire' && (
            <>
              <div className="w-px h-6 bg-border" />
              <select
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="bg-transparent border-none text-sm font-medium focus:ring-0 cursor-pointer"
              >
                <option value="">Toutes les options</option>
                {(OPTIONS_BY_CYCLE[selectedCycle] || []).map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        <div className="flex-1 bg-card border border-border rounded-xl shadow-sm flex flex-col min-h-0 overflow-hidden relative">
          <div className="p-4 border-b border-border bg-muted/30 flex justify-between items-center">
            <h2 className="font-semibold flex items-center gap-2">
              <UserMinus className="w-4 h-4 text-primary" />
              Élèves en attente
              <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
                {currentGroupStudents.length}
              </span>
            </h2>
          </div>

          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un élève..."
                className="w-full bg-input border-none rounded-lg py-2 pl-9 pr-4 text-sm focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="flex items-center gap-2 mt-3 text-sm">
              <button
                onClick={() =>
                  setSelectedStudentIds(
                    new Set(currentGroupStudents.map((s) => s.id)),
                  )
                }
                className="text-primary hover:underline"
              >
                Tout sélectionner
              </button>
              <span className="text-muted-foreground">•</span>
              <button
                onClick={() => setSelectedStudentIds(new Set())}
                className="text-muted-foreground hover:text-foreground"
              >
                Désélectionner
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-3">
            {groupedStudents.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                Aucun élève en attente pour ce niveau.
              </div>
            ) : (
              groupedStudents.map((group) => (
                <div key={group.option || 'default'}>
                  <div className="flex items-center gap-2 px-2 py-1.5 bg-muted/30 rounded-md mb-2">
                    <FolderOpen className="w-4 h-4 text-primary" />
                    <span className="text-xs font-semibold text-primary">
                      {selectedCycle === 'Secondaire' && group.option
                        ? `${group.level} · ${group.option}`
                        : `${group.level}`}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {group.students.length} élève(s)
                    </span>
                  </div>
                  {group.students.map((student) => (
                    <div
                      key={student.id}
                      onClick={() => toggleStudent(student.id)}
                      className={`p-3 rounded-lg border flex items-center gap-3 cursor-pointer transition-all ${
                        selectedStudentIds.has(student.id)
                          ? 'bg-primary/5 border-primary/30 shadow-sm'
                          : 'bg-background border-transparent hover:border-border hover:bg-muted/50'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${
                          selectedStudentIds.has(student.id)
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'border-input bg-background'
                        }`}
                      >
                        {selectedStudentIds.has(student.id) && (
                          <CheckCircle2 className="w-3 h-3" />
                        )}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                        {student.first_name[0]}
                        {student.last_name[0]}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm text-foreground">
                          {student.full_name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {student.annual_identifier}
                        </div>
                      </div>
                      <div className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground">
                        {student.option}
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex lg:flex-col items-center justify-center gap-2">
          <button
            disabled={selectedStudentIds.size === 0 || !selectedClassroomId}
            onClick={handleAssign}
            className={`p-3 rounded-full flex items-center justify-center transition-all ${
              selectedStudentIds.size > 0 && selectedClassroomId
                ? 'bg-primary text-primary-foreground shadow-lg hover:scale-105'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            <ChevronRight className="w-6 h-6 hidden lg:block" />
          </button>
          <div className="text-center text-xs text-muted-foreground font-medium bg-background px-3 py-1 rounded-full border border-border shadow-sm">
            {selectedStudentIds.size} sélectionné(s)
          </div>
        </div>

        <div className="flex-1 bg-card border border-border rounded-xl shadow-sm flex flex-col min-h-0 overflow-hidden">
          <div className="p-4 border-b border-border bg-muted/30">
            <h2 className="font-semibold flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-primary" />
              Classes disponibles
              <span className="text-xs text-muted-foreground font-normal">
                ({selectedLevel}
                {selectedOption ? ` · ${selectedOption}` : ''})
              </span>
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {availableClassrooms.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                Aucune classe disponible pour ce niveau.
              </div>
            ) : (
              availableClassrooms.map((classroom) => {
                const isSelected = selectedClassroomId === classroom.id
                const availableSeats = classroom.capacity - classroom.enrolled
                return (
                  <div
                    key={classroom.id}
                    onClick={() => setSelectedClassroomId(classroom.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5 shadow-md scale-[1.02]'
                        : 'border-border bg-background hover:border-primary/30 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg">{classroom.name}</h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                          <Users className="w-4 h-4" /> Prof. Principal: M.
                          Diallo
                        </p>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Effectif actuel
                        </span>
                        <span className="font-medium">
                          {classroom.enrolled} / {classroom.capacity}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all ${availableSeats < 5 ? 'bg-destructive' : 'bg-success'}`}
                          style={{
                            width: `${(classroom.enrolled / classroom.capacity) * 100}%`,
                          }}
                        />
                      </div>
                      {isSelected && selectedStudentIds.size > 0 && (
                        <div className="text-xs text-primary font-medium animate-fade-in flex items-center gap-1 pt-1">
                          <UserCheck className="w-3 h-3" />
                          Effectif projeté:{' '}
                          {classroom.enrolled + selectedStudentIds.size} /{' '}
                          {classroom.capacity}
                          {classroom.enrolled + selectedStudentIds.size >
                            classroom.capacity && (
                            <span className="text-destructive ml-2">
                              (Capacité dépassée)
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <>
          <div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={() => setShowConfirmModal(false)}
          />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-card border border-border rounded-xl shadow-xl z-50 animate-scale-in">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary" />
                Confirmer l'affectation
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-muted/30 rounded-lg border border-border">
                  <p className="text-sm text-muted-foreground mb-1">
                    Classe de destination
                  </p>
                  <p className="font-semibold text-lg">
                    {
                      availableClassrooms.find(
                        (c) => c.id === selectedClassroomId,
                      )?.name
                    }
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Capacité:{' '}
                    {
                      availableClassrooms.find(
                        (c) => c.id === selectedClassroomId,
                      )?.enrolled
                    }{' '}
                    /{' '}
                    {
                      availableClassrooms.find(
                        (c) => c.id === selectedClassroomId,
                      )?.capacity
                    }{' '}
                    →{' '}
                    <span className="text-primary font-medium">
                      {(availableClassrooms.find(
                        (c) => c.id === selectedClassroomId,
                      )?.enrolled || 0) + selectedStudentIds.size}
                    </span>
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Élèves à affecter ({selectedStudentIds.size})
                  </p>
                  <div className="max-h-48 overflow-y-auto space-y-2 p-3 bg-muted/20 rounded-lg border border-border">
                    {Array.from(selectedStudentIds).map((studentId) => {
                      const student = currentGroupStudents.find(
                        (s) => s.id === studentId,
                      )
                      if (!student) return null
                      return (
                        <div
                          key={student.id}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                            {student.first_name[0]}
                            {student.last_name[0]}
                          </div>
                          <span className="font-medium">
                            {student.full_name}
                          </span>
                          <span className="text-muted-foreground text-xs ml-auto">
                            {student.annual_identifier}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmAssignment}
                  className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Confirmer l'affectation
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
