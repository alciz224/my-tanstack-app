import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import {
  Calendar as CalendarIcon,
  Check,
  Clock,
  Plus,
  Trash2,
  Users,
  X,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import {
  createScheduleBlockFn,
  deleteScheduleBlockFn,
  getClassroomScheduleFn,
  getTimeSlotsFn,
} from '@/server/api/schedules'
import type { Schedule } from '@/server/data/schedules/types'

// Hardcoded for demo - would come from current school year context
const CURRENT_SCHOOL_YEAR_ID = 'sy-2'
const CURRENT_CYCLE_ID = 'syc-1'

// Mock teacher assignments available for scheduling
const MOCK_TEACHER_ASSIGNMENTS = [
  { id: 'ta-1', teacher_name: 'Mamadou Diallo',   subject_name: 'Mathématiques', subject_color: '#6366f1' },
  { id: 'ta-2', teacher_name: 'Fatoumata Sylla',  subject_name: 'Français',      subject_color: '#10b981' },
  { id: 'ta-3', teacher_name: 'Ibrahim Barry',    subject_name: 'Anglais',       subject_color: '#f59e0b' },
  { id: 'ta-4', teacher_name: 'Kadiatou Camara',  subject_name: 'Histoire-Géo',  subject_color: '#ec4899' },
  { id: 'ta-5', teacher_name: 'Moussa Touré',     subject_name: 'Sciences',      subject_color: '#14b8a6' },
]

const MOCK_CLASSROOMS = [
  { id: 'c1', name: '6ème A', level: 'Primaire' },
  { id: 'c2', name: '6ème B', level: 'Primaire' },
  { id: 'c3', name: '5ème A', level: 'Primaire' },
]

export const Route = createFileRoute('/_authed/school-admin/schedule/')({
  component: TimetableBuilderPage,
  loader: async () => {
    const [schedule, timeSlots] = await Promise.all([
      getClassroomScheduleFn({ data: 'c1' }),
      getTimeSlotsFn({ data: CURRENT_CYCLE_ID }),
    ])
    return { schedule, timeSlots, classrooms: MOCK_CLASSROOMS }
  },
})

const DAYS = [
  { id: 'MON', label: 'Lundi' },
  { id: 'TUE', label: 'Mardi' },
  { id: 'WED', label: 'Mercredi' },
  { id: 'THU', label: 'Jeudi' },
  { id: 'FRI', label: 'Vendredi' },
  { id: 'SAT', label: 'Samedi' },
] as const

type DayOfWeek = (typeof DAYS)[number]['id']

type ScheduleModalState =
  | { mode: 'closed' }
  | { mode: 'create'; day: DayOfWeek; slotId: string; slotName: string }
  | { mode: 'view'; block: Schedule }

function TimetableBuilderPage() {
  const loaderData = Route.useLoaderData()
  const [scheduleBlocks, setScheduleBlocks] = useState<Schedule[]>(loaderData.schedule)
  const [selectedClassId, setSelectedClassId] = useState('c1')
  const [viewMode, setViewMode] = useState<'class' | 'teacher'>('class')
  const [modal, setModal] = useState<ScheduleModalState>({ mode: 'closed' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedAssignment, setSelectedAssignment] = useState(MOCK_TEACHER_ASSIGNMENTS[0].id)
  const { timeSlots, classrooms } = loaderData

  const selectedClass = classrooms.find((c) => c.id === selectedClassId)

  const scheduleMap = useMemo(() => {
    const map: Record<string, Record<string, Schedule>> = {}
    DAYS.forEach((d) => { map[d.id] = {} })
    scheduleBlocks.forEach((block) => {
      if (map[block.day_of_week]) {
        map[block.day_of_week][block.time_slot_id] = block
      }
    })
    return map
  }, [scheduleBlocks])

  const handleCellClick = (day: DayOfWeek, slotId: string, slotName: string) => {
    setError(null)
    setModal({ mode: 'create', day, slotId, slotName })
  }

  const handleBlockClick = (block: Schedule) => {
    setModal({ mode: 'view', block })
  }

  const handleCreate = async () => {
    if (modal.mode !== 'create') return
    setError(null)
    setIsSubmitting(true)
    const assignment = MOCK_TEACHER_ASSIGNMENTS.find((a) => a.id === selectedAssignment)!
    const slot = timeSlots.find((t) => t.id === modal.slotId)!
    try {
      const newBlock = await createScheduleBlockFn({
        data: {
          school_year_id: CURRENT_SCHOOL_YEAR_ID,
          school_year_cycle_id: CURRENT_CYCLE_ID,
          classroom_id: selectedClassId,
          teacher_assignment_id: assignment.id,
          day_of_week: modal.day,
          time_slot_id: modal.slotId,
          start_time: slot.start_time,
          end_time: slot.end_time,
          effective_from: new Date().toISOString().split('T')[0],
          status: 'ACTIVE',
          teacher_name: assignment.teacher_name,
          subject_name: assignment.subject_name,
          subject_color: assignment.subject_color,
        },
      })
      setScheduleBlocks((prev) => [...prev, newBlock])
      setModal({ mode: 'closed' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (blockId: string) => {
    try {
      await deleteScheduleBlockFn({ data: blockId })
      setScheduleBlocks((prev) => prev.filter((b) => b.id !== blockId))
      setModal({ mode: 'closed' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression')
    }
  }

  return (
    <div className="space-y-4 flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Emploi du temps</h1>
          <p className="text-muted-foreground">
            Construisez et visualisez les plannings de l'établissement.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            to="/school-admin/schedule/time-slots"
            className="flex items-center gap-2 px-3 py-2 bg-muted text-foreground rounded-lg font-medium transition-colors hover:bg-muted/80 text-sm"
          >
            <Clock className="w-4 h-4" /> Créneaux
          </Link>

          {/* View mode toggle */}
          <div className="bg-card border border-border rounded-lg p-1 flex">
            <button
              onClick={() => setViewMode('class')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'class' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted/50'}`}
            >
              Par Classe
            </button>
            <button
              onClick={() => setViewMode('teacher')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${viewMode === 'teacher' ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted/50'}`}
            >
              Par Prof.
            </button>
          </div>

          {/* Class selector */}
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="bg-card border border-border rounded-lg px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-primary/50 focus:outline-none"
          >
            {classrooms.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 flex-wrap flex-shrink-0">
        {MOCK_TEACHER_ASSIGNMENTS.map((a) => (
          <div key={a.id} className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: a.subject_color }} />
            {a.subject_name}
          </div>
        ))}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="w-2.5 h-2.5 rounded bg-amber-500/30 flex-shrink-0" />
          Pause
        </div>
      </div>

      {/* Grid */}
      <div className="bg-card border border-border rounded-xl shadow-sm flex-1 min-h-0 flex flex-col overflow-hidden">
        {/* Days header */}
        <div className="flex border-b border-border bg-muted/30 flex-shrink-0">
          <div className="w-20 flex-shrink-0 border-r border-border p-3 flex items-center justify-center">
            <Clock className="w-4 h-4 text-muted-foreground" />
          </div>
          {DAYS.map((day) => (
            <div
              key={day.id}
              className={`flex-1 border-r border-border last:border-r-0 p-3 text-center font-bold text-sm ${day.id === 'SAT' ? 'text-muted-foreground' : 'text-foreground'}`}
            >
              {day.label}
              {day.id === 'SAT' && <span className="block text-[10px] font-normal text-muted-foreground/70">optionnel</span>}
            </div>
          ))}
        </div>

        {/* Rows */}
        <div className="flex-1 overflow-y-auto">
          {timeSlots.map((slot) => {
            const isBreak = slot.name.toLowerCase().includes('réc') || slot.name.toLowerCase().includes('pause')
            return (
              <div
                key={slot.id}
                className={`flex border-b border-border last:border-b-0 ${isBreak ? 'min-h-[48px]' : 'min-h-[100px]'} group/row`}
              >
                {/* Time label */}
                <div className={`w-20 flex-shrink-0 border-r border-border p-2 flex flex-col items-center justify-center ${isBreak ? 'bg-amber-500/5' : 'bg-muted/5'} relative`}>
                  {isBreak ? (
                    <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">{slot.name}</span>
                  ) : (
                    <>
                      <span className="font-bold text-xs text-foreground">{slot.start_time}</span>
                      <span className="text-[10px] text-muted-foreground my-0.5">{slot.name}</span>
                      <span className="font-bold text-xs text-foreground">{slot.end_time}</span>
                    </>
                  )}
                  {isBreak && <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500 rounded-r" />}
                </div>

                {/* Day cells */}
                {DAYS.map((day) => {
                  const block = scheduleMap[day.id]?.[slot.id]
                  if (isBreak) {
                    return (
                      <div key={`${day.id}-${slot.id}`} className="flex-1 border-r border-border last:border-r-0 bg-amber-500/5 flex items-center justify-center">
                        <span className="text-xs text-amber-600/50 dark:text-amber-400/40 font-medium">—</span>
                      </div>
                    )
                  }
                  return (
                    <div
                      key={`${day.id}-${slot.id}`}
                      className="flex-1 border-r border-border last:border-r-0 p-1.5 relative group/cell"
                    >
                      {block ? (
                        <button
                          onClick={() => handleBlockClick(block)}
                          className="w-full h-full rounded-lg p-2.5 flex flex-col justify-between hover:brightness-95 transition-all cursor-pointer text-left relative overflow-hidden shadow-sm"
                          style={{ backgroundColor: `${block.subject_color}18`, borderLeft: `3px solid ${block.subject_color}` }}
                        >
                          <div>
                            <h4 className="font-bold text-foreground text-xs leading-tight">{block.subject_name}</h4>
                            <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                              <Users className="w-2.5 h-2.5" /> {block.teacher_name}
                            </p>
                          </div>
                          <div
                            className="absolute bottom-1.5 right-1.5 w-2 h-2 rounded-full opacity-60"
                            style={{ backgroundColor: block.subject_color }}
                          />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleCellClick(day.id, slot.id, slot.name)}
                          className="w-full h-full rounded-lg border-2 border-dashed border-transparent group-hover/cell:border-border flex items-center justify-center bg-transparent group-hover/cell:bg-muted/20 transition-all cursor-pointer"
                          title={`Ajouter un cours — ${day.label}, ${slot.name}`}
                        >
                          <Plus className="w-5 h-5 text-muted-foreground opacity-0 group-hover/cell:opacity-60 transition-opacity" />
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>

      {/* CREATE modal */}
      {modal.mode === 'create' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-background rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="bg-primary px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CalendarIcon className="w-5 h-5 text-primary-foreground" />
                <h2 className="text-white font-bold text-lg">Ajouter un cours</h2>
              </div>
              <button onClick={() => setModal({ mode: 'closed' })} className="p-2 rounded-full hover:bg-white/20 text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-600 dark:text-red-400 flex items-start gap-2">
                  <X className="w-4 h-4 flex-shrink-0 mt-0.5" />{error}
                </div>
              )}

              <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg text-sm">
                <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                <span className="text-foreground font-medium">
                  {DAYS.find((d) => d.id === modal.day)?.label} — {modal.slotName}
                </span>
                <span className="ml-auto text-muted-foreground">{selectedClass?.name}</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Choisir le cours / professeur <span className="text-red-500">*</span>
                </label>
                <div className="space-y-2">
                  {MOCK_TEACHER_ASSIGNMENTS.map((a) => (
                    <label
                      key={a.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${selectedAssignment === a.id ? 'border-primary bg-primary/5' : 'border-border hover:border-border/80 hover:bg-muted/20'}`}
                    >
                      <input
                        type="radio"
                        name="assignment"
                        value={a.id}
                        checked={selectedAssignment === a.id}
                        onChange={() => setSelectedAssignment(a.id)}
                        className="sr-only"
                      />
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: a.subject_color }} />
                      <div className="flex-1">
                        <div className="font-semibold text-sm text-foreground">{a.subject_name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Users className="w-3 h-3" /> {a.teacher_name}
                        </div>
                      </div>
                      {selectedAssignment === a.id && <Check className="w-4 h-4 text-primary" />}
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-1">
                <button
                  onClick={() => setModal({ mode: 'closed' })}
                  className="px-4 py-2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isSubmitting}
                >
                  Annuler
                </button>
                <button
                  onClick={handleCreate}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <><span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> Ajout...</>
                  ) : (
                    <><Plus className="w-4 h-4" /> Ajouter</>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW/DELETE modal */}
      {modal.mode === 'view' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-background rounded-xl shadow-2xl max-w-sm w-full overflow-hidden">
            <div className="px-6 py-4 flex items-center justify-between border-b border-border" style={{ borderLeftWidth: 4, borderLeftColor: modal.block.subject_color }}>
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: modal.block.subject_color }} />
                <h2 className="font-bold text-lg text-foreground">{modal.block.subject_name}</h2>
              </div>
              <button onClick={() => { setModal({ mode: 'closed' }); setError(null) }} className="p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-600">{error}</div>
              )}
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground font-medium">{modal.block.teacher_name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{modal.block.start_time} – {modal.block.end_time}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{DAYS.find((d) => d.id === modal.block.day_of_week)?.label}</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border">
                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${modal.block.status === 'ACTIVE' ? 'bg-green-500/15 text-green-700 dark:text-green-400' : 'bg-muted text-muted-foreground'}`}>
                  {modal.block.status}
                </span>
                <button
                  onClick={() => handleDelete(modal.block.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-500/10 rounded-lg transition-colors font-medium"
                >
                  <Trash2 className="w-4 h-4" /> Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
