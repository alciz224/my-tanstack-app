import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  DoorOpen,
  Edit2,
  GraduationCap,
  LayoutGrid,
  Plus,
  Search,
  Trash2,
  Users,
} from 'lucide-react'
import { getSchoolYearLevelsFn } from '@/server/api/schools'
import { CreateClassroomModal } from '@/components/CreateClassroomModal'

export const Route = createFileRoute('/_authed/school-admin/classrooms/')({
  component: ClassroomsPage,
  loader: async () => {
    // Hardcoded cycle ID for demo - would come from current school year
    const levels = await getSchoolYearLevelsFn({ data: 'syc-1' })
    return {
      classrooms: [],
      schoolYearLevels: levels.map((l) => ({
        id: l.id,
        level_name: l.level_name || 'Niveau',
        cycle_name:
          l.school_year_cycle_id === 'syc-1' ? 'Primaire' : 'Secondaire',
      })),
    }
  },
})

const mockClassrooms = [
  {
    id: 'c1',
    name: '6ème A',
    capacity: 35,
    level_name: '6ème Année',
    cycle_name: 'Primaire',
    students_count: 32,
    teacher_name: 'M. Diallo',
  },
  {
    id: 'c2',
    name: '6ème B',
    capacity: 35,
    level_name: '6ème Année',
    cycle_name: 'Primaire',
    students_count: 28,
    teacher_name: 'Mme Bâ',
  },
  {
    id: 'c3',
    name: '5ème A',
    capacity: 35,
    level_name: '5ème Année',
    cycle_name: 'Primaire',
    students_count: 31,
    teacher_name: 'M. Condé',
  },
  {
    id: 'c4',
    name: '5ème B',
    capacity: 35,
    level_name: '5ème Année',
    cycle_name: 'Primaire',
    students_count: 29,
    teacher_name: 'Mme Touré',
  },
  {
    id: 'c5',
    name: '4ème A',
    capacity: 40,
    level_name: '4ème Année',
    cycle_name: 'Collège',
    students_count: 38,
    teacher_name: 'M. Baldé',
  },
  {
    id: 'c6',
    name: '4ème B',
    capacity: 40,
    level_name: '4ème Année',
    cycle_name: 'Collège',
    students_count: 35,
    teacher_name: 'Mme Sy',
  },
  {
    id: 'c7',
    name: '3ème A',
    capacity: 40,
    level_name: '3ème Année',
    cycle_name: 'Collège',
    students_count: 40,
    teacher_name: 'M. Camara',
  },
  {
    id: 'c8',
    name: '3ème B',
    capacity: 40,
    level_name: '3ème Année',
    cycle_name: 'Collège',
    students_count: 37,
    teacher_name: 'Mme Barry',
  },
]

function ClassroomsPage() {
  const { schoolYearLevels } = Route.useLoaderData()
  const [search, setSearch] = useState('')
  const [selectedCycle, setSelectedCycle] = useState<string>('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const cycles = ['Primaire', 'Collège', 'Lycée']

  const filteredClassrooms = mockClassrooms.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.level_name.toLowerCase().includes(search.toLowerCase())
    const matchesCycle = !selectedCycle || c.cycle_name === selectedCycle
    return matchesSearch && matchesCycle
  })

  const groupedByCycle = cycles.reduce(
    (acc, cycle) => {
      const classroomsInCycle = filteredClassrooms.filter(
        (c) => c.cycle_name === cycle,
      )
      if (classroomsInCycle.length > 0) {
        acc[cycle] = classroomsInCycle
      }
      return acc
    },
    {} as Record<string, typeof mockClassrooms>,
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Gestion des Classes
          </h1>
          <p className="text-muted-foreground">
            Gérez les classes par niveau et suivez les effectifs.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors btn-shine hover-scale"
        >
          <Plus className="w-5 h-5" /> Nouvelle Classe
        </button>
      </div>

      <div className="bg-card border border-border p-4 rounded-xl flex flex-col md:flex-row gap-4 justify-between items-center shadow-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher une classe..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-input border-none rounded-lg text-sm focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select
            value={selectedCycle}
            onChange={(e) => setSelectedCycle(e.target.value)}
            className="bg-input border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50"
          >
            <option value="">Tous les cycles</option>
            <option value="Primaire">Primaire</option>
            <option value="Collège">Collège</option>
            <option value="Lycée">Lycée</option>
          </select>
        </div>
      </div>

      {Object.entries(groupedByCycle).map(([cycle, cycleClassrooms]) => (
        <div key={cycle} className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <GraduationCap className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold text-foreground">{cycle}</h2>
            <span className="text-sm text-muted-foreground">
              ({cycleClassrooms.length} classe
              {cycleClassrooms.length > 1 ? 's' : ''})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {cycleClassrooms.map((classroom) => (
              <div
                key={classroom.id}
                className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600">
                      <DoorOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground">
                        {classroom.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {classroom.level_name}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>Effectif</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium text-foreground">
                        {classroom.students_count}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        / {classroom.capacity}
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        classroom.students_count / classroom.capacity >= 0.9
                          ? 'bg-red-500'
                          : classroom.students_count / classroom.capacity >= 0.7
                            ? 'bg-amber-500'
                            : 'bg-green-500'
                      }`}
                      style={{
                        width: `${(classroom.students_count / classroom.capacity) * 100}%`,
                      }}
                    />
                  </div>

                  <div className="pt-3 border-t border-border">
                    <p className="text-xs text-muted-foreground">Titulaire</p>
                    <p className="text-sm font-medium text-foreground">
                      {classroom.teacher_name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {filteredClassrooms.length === 0 && (
        <div className="p-12 text-center text-muted-foreground bg-card border border-border rounded-xl">
          <LayoutGrid className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p>Aucune classe trouvée.</p>
        </div>
      )}

      {/* Create Classroom Modal */}
      <CreateClassroomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        schoolYearLevels={
          schoolYearLevels.length > 0
            ? schoolYearLevels
            : [
                { id: 'syl-1', level_name: '6ème', cycle_name: 'Primaire' },
                { id: 'syl-2', level_name: '5ème', cycle_name: 'Primaire' },
                { id: 'syl-3', level_name: '4ème', cycle_name: 'Collège' },
                { id: 'syl-4', level_name: '3ème', cycle_name: 'Collège' },
              ]
        }
      />
    </div>
  )
}
