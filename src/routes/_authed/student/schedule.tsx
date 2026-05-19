import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Calendar, BookOpen } from 'lucide-react'

export const Route = createFileRoute('/_authed/student/schedule')({
  component: StudentSchedulePage,
})

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

const TIME_SLOTS = [
  { id: 1, time: '08:00 - 08:45' },
  { id: 2, time: '08:45 - 09:30' },
  { id: 3, time: '09:45 - 10:30' },
  { id: 4, time: '10:30 - 11:15' },
  { id: 5, time: '11:15 - 12:00' },
  { id: 6, time: '13:00 - 13:45' },
  { id: 7, time: '13:45 - 14:30' },
  { id: 8, time: '14:45 - 15:30' },
]

const SCHEDULE: Record<
  string,
  Array<{ subject: string; teacher: string; room: string } | null>
> = {
  '1': [
    { subject: 'Français', teacher: 'Mme Sylla', room: 'B201' },
    { subject: 'Mathématiques', teacher: 'M. Diallo', room: 'A102' },
    null,
    { subject: 'Anglais', teacher: 'M. Barry', room: 'B105' },
    { subject: 'Histoire-Géo', teacher: 'Mme Camara', room: 'B203' },
    null,
    { subject: 'SVT', teacher: 'M. Touré', room: 'Labo 1' },
  ],
  '2': [
    { subject: 'Physique', teacher: 'M. Keita', room: 'Labo 2' },
    null,
    { subject: 'Mathématiques', teacher: 'M. Diallo', room: 'A102' },
    { subject: 'Français', teacher: 'Mme Sylla', room: 'B201' },
    { subject: 'EPS', teacher: 'M. Baldé', room: 'Gymnase' },
    { subject: 'Mathématiques', teacher: 'M. Diallo', room: 'A102' },
    null,
  ],
  '3': [],
  '4': [
    { subject: 'Anglais', teacher: 'M. Barry', room: 'B105' },
    { subject: 'Physique', teacher: 'M. Keita', room: 'Labo 2' },
    { subject: 'Histoire-Géo', teacher: 'Mme Camara', room: 'B203' },
    null,
    null,
    { subject: 'ECM', teacher: 'Mme Soumah', room: 'B101' },
    { subject: 'Mathématiques', teacher: 'M. Diallo', room: 'A102' },
  ],
  '5': [
    { subject: 'SVT', teacher: 'M. Touré', room: 'Labo 1' },
    { subject: 'Français', teacher: 'Mme Sylla', room: 'B201' },
    { subject: 'Physique', teacher: 'M. Keita', room: 'Labo 2' },
    { subject: 'Mathématiques', teacher: 'M. Diallo', room: 'A102' },
    null,
    { subject: 'Anglais', teacher: 'M. Barry', room: 'B105' },
    {},
  ],
  '6': [
    { subject: 'Mathématiques', teacher: 'M. Diallo', room: 'A102' },
    { subject: 'EPS', teacher: 'M. Baldé', room: 'Gymnase' },
    { subject: 'Français', teacher: 'Mme Sylla', room: 'B201' },
    null,
    null,
    null,
    null,
  ],
}

function StudentSchedulePage() {
  const [selectedDay, setSelectedDay] = useState(0)

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Mon Emploi du Temps
        </h1>
        <p className="text-muted-foreground mt-1">
          Classe: 6ème A - Année 2024-2025
        </p>
      </div>

      {/* Day Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {DAYS.map((day, index) => (
          <button
            key={day}
            onClick={() => setSelectedDay(index)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
              selectedDay === index
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Schedule Grid */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="grid grid-cols-[80px_1fr]">
          <div className="bg-muted/30 p-3 border-b border-r border-border">
            <span className="text-xs font-semibold uppercase">Créneau</span>
          </div>
          <div className="p-3 border-b border-border">
            <span className="text-xs font-semibold uppercase">
              {DAYS[selectedDay]}
            </span>
          </div>

          {TIME_SLOTS.map((slot) => {
            const lesson = SCHEDULE[selectedDay + 1]?.[slot.id - 1]
            return (
              <div key={slot.id} className="contents">
                <div className="p-3 border-b border-r border-border bg-muted/20">
                  <span className="text-sm text-muted-foreground">
                    {slot.time}
                  </span>
                </div>
                <div className="p-3 border-b border-border min-h-[70px]">
                  {lesson ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-primary" />
                        <span className="font-medium text-foreground">
                          {lesson.subject}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {lesson.teacher} • {lesson.room}
                      </p>
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
