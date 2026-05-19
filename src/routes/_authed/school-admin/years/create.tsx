import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import {
  BookOpen,
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  GraduationCap,
  LayoutGrid,
  Plus,
  Save,
  Users,
  X,
} from 'lucide-react'
import { createSchoolYearFn } from '@/server/api/schools'
import {
  mockCycles,
  mockLevels,
  mockSubjects,
  mockTracks,
} from '@/server/data/academic/mocks'

export const Route = createFileRoute('/_authed/school-admin/years/create')({
  component: SchoolYearWizard,
})

const STEPS = [
  { id: 1, title: 'Informations', description: 'Nom et dates' },
  { id: 2, title: 'Cycles', description: 'Sélection' },
  { id: 3, title: 'Niveaux', description: 'Classes' },
  { id: 4, title: 'Matières', description: 'Programmes' },
  { id: 5, title: 'Salles', description: 'Capacité' },
  { id: 6, title: 'Horaires', description: 'Créneaux' },
  { id: 7, title: 'Validation', description: 'Résumé' },
]

const TERM_TYPES = [
  { id: 'TRIMESTER', name: 'Trimestre', period_count: 3 },
  { id: 'SEMESTER', name: 'Semestre', period_count: 2 },
]

const CYCLE_OPTIONS = mockCycles.filter((c) => c.name !== 'Préscolaire')

interface CycleConfig {
  cycle_id: string
  cycle_name: string
  term_type_id: string
  enabled: boolean
}

interface LevelConfig {
  level_id: string
  level_name: string
  track_id: string | null
  enabled: boolean
}

interface SubjectConfig {
  subject_id: string
  subject_name: string
  coefficient: number
  enabled: boolean
}

interface ClassroomConfig {
  name: string
  capacity: number
  room_number: string
}

interface TimeSlotConfig {
  name: string
  start_time: string
  end_time: string
  duration_minutes: number
  order: number
}

function SchoolYearWizard() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Step 1: Basic info
  const [formData, setFormData] = useState({
    name: '2025-2026',
    start_date: '2025-09-01',
    end_date: '2026-06-30',
  })

  // Step 2: Cycles
  const [cycles, setCycles] = useState<Array<CycleConfig>>(
    CYCLE_OPTIONS.map((c) => ({
      cycle_id: c.id,
      cycle_name: c.name,
      term_type_id: 'TRIMESTER',
      enabled: c.name === 'Primaire' || c.name === 'Collège',
    })),
  )

  // Step 3: Levels
  const [levels, setLevels] = useState<Array<LevelConfig>>(() => {
    const allLevels: Array<LevelConfig> = []
    cycles
      .filter((c) => c.enabled)
      .forEach((cycle) => {
        mockLevels
          .filter((l) => l.cycle_id === cycle.cycle_id)
          .forEach((l) => {
            allLevels.push({
              level_id: l.id,
              level_name: l.name,
              track_id: null,
              enabled: true,
            })
          })
      })
    return allLevels
  })

  // Step 4: Subjects
  const [subjects, setSubjects] = useState<Array<SubjectConfig>>(() => {
    const allSubjects: Array<SubjectConfig> = []
    levels
      .filter((l) => l.enabled)
      .forEach((level) => {
        const levelObj = mockLevels.find((l) => l.id === level.level_id)
        if (levelObj) {
          mockSubjects
            .filter((s) => s.cycle_ids.includes(levelObj.cycle_id))
            .forEach((s) => {
              allSubjects.push({
                subject_id: s.id,
                subject_name: s.name,
                coefficient: s.coefficient,
                enabled: true,
              })
            })
        }
      })
    return allSubjects
  })

  // Step 5: Classrooms
  const [classrooms, setClassrooms] = useState<
    Record<string, Array<ClassroomConfig>>
  >({})

  // Step 6: Time slots
  const [timeSlots, setTimeSlots] = useState<
    Record<string, Array<TimeSlotConfig>>
  >({})

  // Update levels when cycles change
  const updateLevelsForCycles = (newCycles: Array<CycleConfig>) => {
    const enabledCycles = newCycles
      .filter((c) => c.enabled)
      .map((c) => c.cycle_id)
    const newLevels = levels.filter((l) => {
      const levelObj = mockLevels.find((level) => level.id === l.level_id)
      return levelObj && enabledCycles.includes(levelObj.cycle_id)
    })

    // Add new levels for newly enabled cycles
    newCycles
      .filter((c) => c.enabled)
      .forEach((cycle) => {
        mockLevels
          .filter((l) => l.cycle_id === cycle.cycle_id)
          .forEach((l) => {
            if (!newLevels.find((nl) => nl.level_id === l.id)) {
              newLevels.push({
                level_id: l.id,
                level_name: l.name,
                track_id: null,
                enabled: true,
              })
            }
          })
      })
    setLevels(newLevels)
  }

  // Update subjects when levels change
  const updateSubjectsForLevels = (newLevels: Array<LevelConfig>) => {
    const enabledLevels = newLevels.filter((l) => l.enabled)
    const newSubjects: Array<SubjectConfig> = []

    enabledLevels.forEach((level) => {
      const levelObj = mockLevels.find((l) => l.id === level.level_id)
      if (levelObj) {
        mockSubjects
          .filter((s) => s.cycle_ids.includes(levelObj.cycle_id))
          .forEach((s) => {
            if (!newSubjects.find((ns) => ns.subject_id === s.id)) {
              newSubjects.push({
                subject_id: s.id,
                subject_name: s.name,
                coefficient: s.coefficient,
                enabled: true,
              })
            }
          })
      }
    })
    setSubjects(newSubjects)
  }

  const handleNext = async () => {
    if (currentStep === 1) {
      setIsSubmitting(true)
      try {
        const year = await createSchoolYearFn({
          data: {
            school_id: 'school-1',
            name: formData.name,
            start_date: formData.start_date,
            end_date: formData.end_date,
            status: 'FUTURE',
          },
        })
        // Continue to step 2
        setCurrentStep(2)
      } catch (error) {
        console.error('Error creating year:', error)
      } finally {
        setIsSubmitting(false)
      }
    } else if (currentStep < 7) {
      setCurrentStep((s) => s + 1)
    } else {
      // Finish - in real app would save all config
      navigate({ to: '/school-admin/years' })
    }
  }

  const handleCycleToggle = (cycleId: string) => {
    const newCycles = cycles.map((c) =>
      c.cycle_id === cycleId ? { ...c, enabled: !c.enabled } : c,
    )
    setCycles(newCycles)
    updateLevelsForCycles(newCycles)
  }

  const handleCycleTermChange = (cycleId: string, termTypeId: string) => {
    setCycles(
      cycles.map((c) =>
        c.cycle_id === cycleId ? { ...c, term_type_id: termTypeId } : c,
      ),
    )
  }

  const handleLevelToggle = (levelId: string) => {
    const newLevels = levels.map((l) =>
      l.level_id === levelId ? { ...l, enabled: !l.enabled } : l,
    )
    setLevels(newLevels)
    updateSubjectsForLevels(newLevels)
  }

  const handleSubjectToggle = (subjectId: string) => {
    setSubjects(
      subjects.map((s) =>
        s.subject_id === subjectId ? { ...s, enabled: !s.enabled } : s,
      ),
    )
  }

  const handleSubjectCoefficientChange = (
    subjectId: string,
    coefficient: number,
  ) => {
    setSubjects(
      subjects.map((s) =>
        s.subject_id === subjectId ? { ...s, coefficient } : s,
      ),
    )
  }

  // Initialize classrooms for enabled levels
  const handleAddClassroom = (levelId: string) => {
    const level = levels.find((l) => l.level_id === levelId)
    if (!level) return

    const current = classrooms[levelId] || []
    const count = current.length + 1
    setClassrooms({
      ...classrooms,
      [levelId]: [
        ...current,
        {
          name: `${level.level_name} ${String.fromCharCode(64 + count)}`,
          capacity: 30,
          room_number: `Salle ${count}`,
        },
      ],
    })
  }

  const handleClassroomChange = (
    levelId: string,
    index: number,
    field: keyof ClassroomConfig,
    value: string | number,
  ) => {
    const current = classrooms[levelId] || []
    const updated = current.map((c, i) =>
      i === index ? { ...c, [field]: value } : c,
    )
    setClassrooms({ ...classrooms, [levelId]: updated })
  }

  const handleRemoveClassroom = (levelId: string, index: number) => {
    const current = classrooms[levelId] || []
    setClassrooms({
      ...classrooms,
      [levelId]: current.filter((_, i) => i !== index),
    })
  }

  // Initialize time slots for enabled cycles
  const handleAddTimeSlot = (cycleId: string) => {
    const current = timeSlots[cycleId] || []
    const order = current.length + 1
    setTimeSlots({
      ...timeSlots,
      [cycleId]: [
        ...current,
        {
          name: `Créneau ${order}`,
          start_time: '08:00',
          end_time: '08:55',
          duration_minutes: 55,
          order,
        },
      ],
    })
  }

  const handleTimeSlotChange = (
    cycleId: string,
    index: number,
    field: keyof TimeSlotConfig,
    value: string | number,
  ) => {
    const current = timeSlots[cycleId] || []
    const updated = current.map((t, i) =>
      i === index ? { ...t, [field]: value } : t,
    )
    setTimeSlots({ ...timeSlots, [cycleId]: updated })
  }

  const handleRemoveTimeSlot = (cycleId: string, index: number) => {
    const current = timeSlots[cycleId] || []
    setTimeSlots({
      ...timeSlots,
      [cycleId]: current.filter((_, i) => i !== index),
    })
  }

  // Add new level from master data to a cycle
  const [showLevelSelector, setShowLevelSelector] = useState<string | null>(
    null,
  )

  const handleAddLevel = (cycleId: string) => {
    setShowLevelSelector(cycleId)
  }

  const handleSelectMasterLevel = (
    levelId: string,
    levelName: string,
    cycleId: string,
  ) => {
    // Check if already added
    if (levels.find((l) => l.level_id === levelId)) {
      setShowLevelSelector(null)
      return
    }
    setLevels([
      ...levels,
      {
        level_id: levelId,
        level_name: levelName,
        track_id: null,
        enabled: true,
      },
    ])
    setShowLevelSelector(null)
  }

  // Remove a level
  const handleRemoveLevel = (levelId: string) => {
    setLevels(levels.filter((l) => l.level_id !== levelId))
  }

  // Check if level needs track (11th, 12th, Terminale for Lycée)
  const needsTrack = (levelName: string, cycleId: string) => {
    const isLycee = cycleId === 'CYC-04' // Lycée
    const isUpperLevel =
      levelName.includes('11') ||
      levelName.includes('12') ||
      levelName.toLowerCase().includes('terminale')
    return isLycee && isUpperLevel
  }

  // Get unique levels grouped by cycle for subjects display
  const subjectsByLevel = useMemo(() => {
    const result: Record<string, Array<SubjectConfig>> = {}
    levels
      .filter((l) => l.enabled)
      .forEach((level) => {
        result[level.level_id] = subjects.filter((s) => s.enabled)
      })
    return result
  }, [levels, subjects])

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Nouvelle Année Scolaire
        </h1>
        <p className="text-muted-foreground">
          Configuration étape par étape de l'année
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-card border border-border rounded-lg p-4 space-y-1">
            {STEPS.map((step) => (
              <button
                key={step.id}
                disabled={step.id > currentStep}
                onClick={() =>
                  step.id <= currentStep && setCurrentStep(step.id)
                }
                className={`w-full flex items-start gap-3 p-3 rounded-md text-left transition-colors ${
                  currentStep === step.id
                    ? 'bg-primary/10 text-primary'
                    : step.id < currentStep
                      ? 'text-foreground hover:bg-muted'
                      : 'text-muted-foreground opacity-50 cursor-not-allowed'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-medium ${
                    currentStep === step.id
                      ? 'bg-primary text-primary-foreground'
                      : step.id < currentStep
                        ? 'bg-green-500 text-white'
                        : 'bg-muted-foreground/20 text-muted-foreground'
                  }`}
                >
                  {step.id < currentStep ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    step.id
                  )}
                </div>
                <div>
                  <div className="font-medium text-sm">{step.title}</div>
                  <div className="text-[11px] opacity-70">
                    {step.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-card border border-border rounded-lg p-6 min-h-[450px] flex flex-col">
            {/* Step 1: Informations */}
            {currentStep === 1 && (
              <div className="flex-1 space-y-6">
                <h2 className="text-lg font-semibold border-b pb-2">
                  Informations Générales
                </h2>
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Nom de l'année scolaire
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-background border border-input rounded-md"
                      placeholder="ex: 2024-2025"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">
                        Date de début
                      </label>
                      <input
                        type="date"
                        value={formData.start_date}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            start_date: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 bg-background border border-input rounded-md"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date de fin</label>
                      <input
                        type="date"
                        value={formData.end_date}
                        onChange={(e) =>
                          setFormData({ ...formData, end_date: e.target.value })
                        }
                        className="w-full px-3 py-2 bg-background border border-input rounded-md"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Cycles */}
            {currentStep === 2 && (
              <div className="flex-1 space-y-6">
                <h2 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  Cycles Scolaires
                </h2>
                <p className="text-sm text-muted-foreground">
                  Sélectionnez les cycles actifs pour cette année scolaire et le
                  type de période.
                </p>
                <div className="grid gap-4">
                  {cycles.map((cycle) => (
                    <div
                      key={cycle.cycle_id}
                      className={`p-4 rounded-lg border-2 transition-all ${cycle.enabled ? 'border-primary bg-primary/5' : 'border-border'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={cycle.enabled}
                            onChange={() => handleCycleToggle(cycle.cycle_id)}
                            className="w-5 h-5 rounded border-input"
                          />
                          <span className="font-medium">
                            {cycle.cycle_name}
                          </span>
                        </div>
                        {cycle.enabled && (
                          <select
                            value={cycle.term_type_id}
                            onChange={(e) =>
                              handleCycleTermChange(
                                cycle.cycle_id,
                                e.target.value,
                              )
                            }
                            className="px-3 py-1.5 bg-background border border-input rounded-md text-sm"
                          >
                            {TERM_TYPES.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.name} ({t.period_count} périodes)
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Niveaux */}
            {currentStep === 3 && (
              <div className="flex-1 space-y-6">
                <h2 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5 text-primary" />
                  Niveaux Scolaires
                </h2>
                <p className="text-sm text-muted-foreground">
                  Ajoutez les niveaux pour chaque cycle. Pour le lycée,
                  Choisissez la filière pour les classes de terminale.
                </p>
                <div className="space-y-6">
                  {cycles
                    .filter((c) => c.enabled)
                    .map((cycle) => {
                      const cycleLevels = levels.filter((l) => {
                        const levelObj = mockLevels.find(
                          (level) => level.id === l.level_id,
                        )
                        return levelObj && levelObj.cycle_id === cycle.cycle_id
                      })

                      return (
                        <div key={cycle.cycle_id} className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-primary">
                              {cycle.cycle_name}
                            </h3>
                            <button
                              onClick={() => handleAddLevel(cycle.cycle_id)}
                              className="flex items-center gap-1 text-xs text-primary hover:underline"
                            >
                              <Plus className="w-3 h-3" /> Ajouter un niveau
                            </button>
                          </div>

                          {cycleLevels.length === 0 ? (
                            <p className="text-sm text-muted-foreground italic py-4 text-center">
                              Aucun niveau ajouté. Cliquez sur "Ajouter un
                              niveau".
                            </p>
                          ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                              {cycleLevels.map((level) => {
                                const isTrackLevel = needsTrack(
                                  level.level_name,
                                  cycle.cycle_id,
                                )

                                return (
                                  <div
                                    key={level.level_id}
                                    className="p-3 rounded-lg border-2 border-primary bg-primary/5 relative"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium">
                                        {level.level_name}
                                      </span>
                                      <button
                                        onClick={() =>
                                          handleRemoveLevel(level.level_id)
                                        }
                                        className="ml-auto p-0.5 text-muted-foreground hover:text-destructive"
                                      >
                                        <X className="w-3 h-3" />
                                      </button>
                                    </div>

                                    {/* Track selector for Lycée terminal levels */}
                                    {isTrackLevel && (
                                      <div className="mt-3 pt-2 border-t border-border/50">
                                        <label className="text-xs text-muted-foreground block mb-1">
                                          Filière
                                        </label>
                                        <div className="flex flex-wrap gap-1">
                                          {mockTracks
                                            .filter(
                                              (t) => t.cycle_id === 'CYC-04',
                                            )
                                            .map((track) => (
                                              <button
                                                key={track.id}
                                                onClick={() =>
                                                  setLevels(
                                                    levels.map((l) =>
                                                      l.level_id ===
                                                      level.level_id
                                                        ? {
                                                            ...l,
                                                            track_id:
                                                              l.track_id ===
                                                              track.id
                                                                ? null
                                                                : track.id,
                                                          }
                                                        : l,
                                                    ),
                                                  )
                                                }
                                                className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                                                  level.track_id === track.id
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                                                }`}
                                              >
                                                {track.name}
                                              </button>
                                            ))}
                                        </div>
                                        {level.track_id && (
                                          <button
                                            onClick={() =>
                                              setLevels(
                                                levels.map((l) =>
                                                  l.level_id === level.level_id
                                                    ? { ...l, track_id: null }
                                                    : l,
                                                ),
                                              )
                                            }
                                            className="text-xs text-muted-foreground hover:text-destructive mt-1 flex items-center gap-1"
                                          >
                                            <X className="w-3 h-3" /> Annuler la
                                            filière
                                          </button>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    })}
                </div>

                {/* Level Selector Modal */}
                {showLevelSelector && (
                  <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">Ajouter un niveau</h3>
                        <button
                          onClick={() => setShowLevelSelector(null)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {mockLevels
                          .filter((l) => {
                            const cycle = cycles.find(
                              (c) => c.cycle_id === showLevelSelector,
                            )
                            return cycle && l.cycle_id === cycle.cycle_id
                          })
                          .filter(
                            (l) =>
                              !levels.find((added) => added.level_id === l.id),
                          )
                          .map((level) => (
                            <button
                              key={level.id}
                              onClick={() =>
                                handleSelectMasterLevel(
                                  level.id,
                                  level.name,
                                  showLevelSelector,
                                )
                              }
                              className="w-full p-3 text-left rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                            >
                              <span className="font-medium">{level.name}</span>
                              <span className="text-xs text-muted-foreground ml-2">
                                ({level.code})
                              </span>
                            </button>
                          ))}
                        {mockLevels
                          .filter((l) => {
                            const cycle = cycles.find(
                              (c) => c.cycle_id === showLevelSelector,
                            )
                            return cycle && l.cycle_id === cycle.cycle_id
                          })
                          .filter(
                            (l) =>
                              !levels.find((added) => added.level_id === l.id),
                          ).length === 0 && (
                          <p className="text-center text-muted-foreground py-4">
                            Tous les niveaux ont déjà été ajoutés
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Matières */}
            {currentStep === 4 && (
              <div className="flex-1 space-y-6">
                <h2 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Matières et Coefficients
                </h2>
                <p className="text-sm text-muted-foreground">
                  Sélectionnez les matières enseignées et leur coefficient.
                </p>
                <div className="space-y-6">
                  {levels
                    .filter((l) => l.enabled)
                    .map((level) => {
                      const levelSubjects = subjects.filter((s) => {
                        const levelObj = mockLevels.find(
                          (l) => l.id === level.level_id,
                        )
                        const subject = mockSubjects.find(
                          (sub) => sub.id === s.subject_id,
                        )
                        return (
                          levelObj &&
                          subject &&
                          subject.cycle_ids.includes(levelObj.cycle_id)
                        )
                      })
                      return (
                        <div key={level.level_id} className="space-y-3">
                          <h3 className="font-medium text-primary">
                            {level.level_name}
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {levelSubjects.map((subject) => (
                              <div
                                key={subject.subject_id}
                                className={`p-3 rounded-lg border-2 transition-all ${subject.enabled ? 'border-primary bg-primary/5' : 'border-border'}`}
                              >
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    checked={subject.enabled}
                                    onChange={() =>
                                      handleSubjectToggle(subject.subject_id)
                                    }
                                    className="w-4 h-4 rounded border-input"
                                  />
                                  <span className="text-sm">
                                    {subject.subject_name}
                                  </span>
                                </div>
                                {subject.enabled && (
                                  <div className="mt-2 flex items-center gap-2">
                                    <label className="text-xs text-muted-foreground">
                                      Coeff:
                                    </label>
                                    <input
                                      type="number"
                                      min="1"
                                      max="10"
                                      value={subject.coefficient}
                                      onChange={(e) =>
                                        handleSubjectCoefficientChange(
                                          subject.subject_id,
                                          parseInt(e.target.value) || 1,
                                        )
                                      }
                                      className="w-16 px-2 py-1 bg-background border border-input rounded text-sm"
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            )}

            {/* Step 5: Salles */}
            {currentStep === 5 && (
              <div className="flex-1 space-y-6">
                <h2 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Salles de Classe
                </h2>
                <p className="text-sm text-muted-foreground">
                  Créez les classes pour chaque niveau.
                </p>
                <div className="space-y-6">
                  {levels
                    .filter((l) => l.enabled)
                    .map((level) => (
                      <div key={level.level_id} className="space-y-3">
                        <h3 className="font-medium text-primary">
                          {level.level_name}
                        </h3>
                        <div className="space-y-2">
                          {(classrooms[level.level_id] || []).map(
                            (classroom, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg"
                              >
                                <input
                                  type="text"
                                  value={classroom.name}
                                  onChange={(e) =>
                                    handleClassroomChange(
                                      level.level_id,
                                      idx,
                                      'name',
                                      e.target.value,
                                    )
                                  }
                                  className="flex-1 px-2 py-1 bg-background border border-input rounded text-sm"
                                  placeholder="Nom de la classe"
                                />
                                <input
                                  type="number"
                                  value={classroom.capacity}
                                  onChange={(e) =>
                                    handleClassroomChange(
                                      level.level_id,
                                      idx,
                                      'capacity',
                                      parseInt(e.target.value) || 30,
                                    )
                                  }
                                  className="w-20 px-2 py-1 bg-background border border-input rounded text-sm"
                                  placeholder="Capacité"
                                />
                                <input
                                  type="text"
                                  value={classroom.room_number}
                                  onChange={(e) =>
                                    handleClassroomChange(
                                      level.level_id,
                                      idx,
                                      'room_number',
                                      e.target.value,
                                    )
                                  }
                                  className="w-24 px-2 py-1 bg-background border border-input rounded text-sm"
                                  placeholder="Salle"
                                />
                                <button
                                  onClick={() =>
                                    handleRemoveClassroom(level.level_id, idx)
                                  }
                                  className="p-1 text-destructive hover:bg-destructive/10 rounded"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ),
                          )}
                          <button
                            onClick={() => handleAddClassroom(level.level_id)}
                            className="flex items-center gap-1 text-sm text-primary hover:underline"
                          >
                            <Plus className="w-4 h-4" /> Ajouter une classe
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Step 6: Horaires */}
            {currentStep === 6 && (
              <div className="flex-1 space-y-6">
                <h2 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Créneaux Horaires
                </h2>
                <p className="text-sm text-muted-foreground">
                  Définissez les créneaux de cours pour chaque cycle.
                </p>
                <div className="space-y-6">
                  {cycles
                    .filter((c) => c.enabled)
                    .map((cycle) => (
                      <div key={cycle.cycle_id} className="space-y-3">
                        <h3 className="font-medium text-primary">
                          {cycle.cycle_name}
                        </h3>
                        <div className="space-y-2">
                          {(timeSlots[cycle.cycle_id] || []).map(
                            (slot, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg"
                              >
                                <input
                                  type="text"
                                  value={slot.name}
                                  onChange={(e) =>
                                    handleTimeSlotChange(
                                      cycle.cycle_id,
                                      idx,
                                      'name',
                                      e.target.value,
                                    )
                                  }
                                  className="flex-1 px-2 py-1 bg-background border border-input rounded text-sm"
                                  placeholder="Nom du créneau"
                                />
                                <input
                                  type="time"
                                  value={slot.start_time}
                                  onChange={(e) =>
                                    handleTimeSlotChange(
                                      cycle.cycle_id,
                                      idx,
                                      'start_time',
                                      e.target.value,
                                    )
                                  }
                                  className="w-28 px-2 py-1 bg-background border border-input rounded text-sm"
                                />
                                <span className="text-muted-foreground">-</span>
                                <input
                                  type="time"
                                  value={slot.end_time}
                                  onChange={(e) =>
                                    handleTimeSlotChange(
                                      cycle.cycle_id,
                                      idx,
                                      'end_time',
                                      e.target.value,
                                    )
                                  }
                                  className="w-28 px-2 py-1 bg-background border border-input rounded text-sm"
                                />
                                <button
                                  onClick={() =>
                                    handleRemoveTimeSlot(cycle.cycle_id, idx)
                                  }
                                  className="p-1 text-destructive hover:bg-destructive/10 rounded"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ),
                          )}
                          <button
                            onClick={() => handleAddTimeSlot(cycle.cycle_id)}
                            className="flex items-center gap-1 text-sm text-primary hover:underline"
                          >
                            <Plus className="w-4 h-4" /> Ajouter un créneau
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Step 7: Validation */}
            {currentStep === 7 && (
              <div className="flex-1 space-y-6 overflow-y-auto">
                <h2 className="text-lg font-semibold border-b pb-2 flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary" />
                  Résumé de la Configuration
                </h2>

                <div className="space-y-4">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h3 className="font-medium mb-2">Informations</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <span className="text-muted-foreground">Nom:</span>
                      <span>{formData.name}</span>
                      <span className="text-muted-foreground">Dates:</span>
                      <span>
                        {formData.start_date} - {formData.end_date}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h3 className="font-medium mb-2">
                      Cycles ({cycles.filter((c) => c.enabled).length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {cycles
                        .filter((c) => c.enabled)
                        .map((c) => (
                          <span
                            key={c.cycle_id}
                            className="px-2 py-1 bg-primary/10 text-primary rounded text-sm"
                          >
                            {c.cycle_name} (
                            {
                              TERM_TYPES.find((t) => t.id === c.term_type_id)
                                ?.name
                            }
                            )
                          </span>
                        ))}
                    </div>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h3 className="font-medium mb-2">
                      Niveaux ({levels.filter((l) => l.enabled).length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {levels
                        .filter((l) => l.enabled)
                        .map((l) => (
                          <span
                            key={l.level_id}
                            className="px-2 py-1 bg-primary/10 text-primary rounded text-sm"
                          >
                            {l.level_name}
                          </span>
                        ))}
                    </div>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h3 className="font-medium mb-2">
                      Matières ({subjects.filter((s) => s.enabled).length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {subjects
                        .filter((s) => s.enabled)
                        .slice(0, 10)
                        .map((s) => (
                          <span
                            key={s.subject_id}
                            className="px-2 py-1 bg-primary/10 text-primary rounded text-sm"
                          >
                            {s.subject_name} ({s.coefficient})
                          </span>
                        ))}
                      {subjects.filter((s) => s.enabled).length > 10 && (
                        <span className="px-2 py-1 text-muted-foreground text-sm">
                          +{subjects.filter((s) => s.enabled).length - 10}{' '}
                          autres
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h3 className="font-medium mb-2">
                      Salles ({Object.values(classrooms).flat().length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(classrooms).flatMap(
                        ([levelId, classes]) =>
                          classes.map((c, i) => (
                            <span
                              key={`${levelId}-${i}`}
                              className="px-2 py-1 bg-primary/10 text-primary rounded text-sm"
                            >
                              {c.name}
                            </span>
                          )),
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <h3 className="font-medium mb-2">
                      Créneaux ({Object.values(timeSlots).flat().length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {Object.values(timeSlots)
                        .flat()
                        .map((slot, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-primary/10 text-primary rounded text-sm"
                          >
                            {slot.name}: {slot.start_time}-{slot.end_time}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Footer */}
            <div className="border-t pt-4 mt-8 flex justify-between">
              <button
                disabled={currentStep === 1 || isSubmitting}
                onClick={() => setCurrentStep((s) => s - 1)}
                className="flex items-center gap-2 px-4 py-2 text-foreground bg-muted hover:bg-muted/80 rounded-md font-medium disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4" />
                Précédent
              </button>
              <button
                onClick={handleNext}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Enregistrement...</span>
                ) : currentStep === 7 ? (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Terminer</span>
                  </>
                ) : (
                  <>
                    <span>Continuer</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
