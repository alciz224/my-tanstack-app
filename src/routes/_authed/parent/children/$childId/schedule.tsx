import { createFileRoute, useParams } from '@tanstack/react-router'
import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, BookOpen, Calendar } from 'lucide-react'

export const Route = createFileRoute(
  '/_authed/parent/children/$childId/schedule',
)({
  component: ChildSchedulePage,
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
  Array<{ subject: string; teacher: string } | null>
> = {
  '1': [
    { subject: 'Français', teacher: 'Mme Sylla' },
    { subject: 'Mathématiques', teacher: 'M. Diallo' },
    null,
    { subject: 'Anglais', teacher: 'M. Barry' },
    { subject: 'Histoire-Géo', teacher: 'Mme Camara' },
    null,
    { subject: 'SVT', teacher: 'M. Touré' },
  ],
  '2': [
    { subject: 'Physique', teacher: 'M. Keita' },
    null,
    { subject: 'Mathématiques', teacher: 'M. Diallo' },
    { subject: 'Français', teacher: 'Mme Sylla' },
    { subject: 'EPS', teacher: 'M. Baldé' },
    { subject: 'Mathématiques', teacher: 'M. Diallo' },
    null,
  ],
  '3': [],
  '4': [
    { subject: 'Anglais', teacher: 'M. Barry' },
    { subject: 'Physique', teacher: 'M. Keita' },
    { subject: 'Histoire-Géo', teacher: 'Mme Camara' },
    null,
    null,
    { subject: 'ECM', teacher: 'Mme Soumah' },
    { subject: 'Mathématiques', teacher: 'M. Diallo' },
  ],
  '5': [
    { subject: 'SVT', teacher: 'M. Touré' },
    { subject: 'Français', teacher: 'Mme Sylla' },
    { subject: 'Physique', teacher: 'M. Keita' },
    { subject: 'Mathématiques', teacher: 'M. Diallo' },
    null,
    { subject: 'Anglais', teacher: 'M. Barry' },
    {},
  ],
  '6': [
    { subject: 'Mathématiques', teacher: 'M. Diallo' },
    { subject: 'EPS', teacher: 'M. Baldé' },
    { subject: 'Français', teacher: 'Mme Sylla' },
    null,
    null,
    null,
    null,
  ],
}

function ChildSchedulePage() {
  const params = useParams({
    from: '/_authed/parent/children/$childId/schedule',
  })
  const [selectedDay, setSelectedDay] = useState(0)

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <Link
          to="/parent/children"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux enfants</span>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">
          Emploi du temps de Mamadou Barry
        </h1>
        <p className="text-muted-foreground mt-1">6ème A - 2024-2025</p>
      </div>

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
                <div className="p-3 border-b border-border min-h-[60px]">
                  {lesson ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-primary" />
                        <span className="font-medium text-foreground">
                          {lesson.subject}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {lesson.teacher}
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
