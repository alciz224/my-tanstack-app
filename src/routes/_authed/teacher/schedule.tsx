import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Calendar, Clock, BookOpen } from 'lucide-react'

export const Route = createFileRoute('/_authed/teacher/schedule')({
  component: TeacherSchedulePage,
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

const SCHEDULE_DATA: Record<
  string,
  Array<{ subject: string; class: string; color: string }>
> = {
  '1': [
    { subject: 'Mathématiques', class: '6ème A', color: 'bg-blue-500' },
    { subject: 'Mathématiques', class: '5ème B', color: 'bg-indigo-500' },
    {},
    { subject: 'Mathématiques', class: '4ème A', color: 'bg-purple-500' },
    { subject: 'Mathématiques', class: '3ème A', color: 'bg-pink-500' },
    {},
    { subject: 'Mathématiques', class: '2nde SM', color: 'bg-cyan-500' },
  ],
  '2': [
    { subject: 'Mathématiques', class: '2nde SM', color: 'bg-cyan-500' },
    {},
    { subject: 'Mathématiques', class: '6ème A', color: 'bg-blue-500' },
    { subject: 'Mathématiques', class: '5ème A', color: 'bg-violet-500' },
    { subject: 'Mathématiques', class: '4ème B', color: 'bg-fuchsia-500' },
    { subject: 'Mathématiques', class: '3ème A', color: 'bg-pink-500' },
    {},
  ],
  '3': [],
  '4': [
    { subject: 'Mathématiques', class: '5ème B', color: 'bg-indigo-500' },
    { subject: 'Mathématiques', class: '6ème B', color: 'bg-sky-500' },
    { subject: 'Mathématiques', class: '2nde SM', color: 'bg-cyan-500' },
    {},
    {},
    { subject: 'Mathématiques', class: '1ère ES', color: 'bg-emerald-500' },
    { subject: 'Mathématiques', class: 'Tale S', color: 'bg-lime-500' },
  ],
  '5': [
    { subject: 'Mathématiques', class: '4ème A', color: 'bg-purple-500' },
    { subject: 'Mathématiques', class: '3ème B', color: 'bg-rose-500' },
    { subject: 'Mathématiques', class: '6ème A', color: 'bg-blue-500' },
    { subject: 'Mathématiques', class: '5ème A', color: 'bg-violet-500' },
    {},
    { subject: 'Mathématiques', class: '2nde SE', color: 'bg-teal-500' },
    {},
  ],
  '6': [
    { subject: 'Mathématiques', class: '6ème A', color: 'bg-blue-500' },
    { subject: 'Mathématiques', class: '5ème B', color: 'bg-indigo-500' },
    { subject: 'Mathématiques', class: '4ème A', color: 'bg-purple-500' },
    {},
    {},
    {},
    {},
  ],
}

function TeacherSchedulePage() {
  const [selectedDay, setSelectedDay] = useState(0)

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Mon Emploi du Temps
        </h1>
        <p className="text-muted-foreground mt-1">
          Consultez votre planning hebdomadaire
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
          {/* Header */}
          <div className="bg-muted/30 p-3 border-b border-r border-border">
            <span className="text-xs font-semibold uppercase">Créneau</span>
          </div>
          <div className="p-3 border-b border-border">
            <span className="text-xs font-semibold uppercase">
              {DAYS[selectedDay]}
            </span>
          </div>

          {/* Time Slots */}
          {TIME_SLOTS.map((slot) => {
            const scheduleItem = SCHEDULE_DATA[selectedDay + 1]?.[slot.id - 1]
            const hasClass = scheduleItem && scheduleItem.subject

            return (
              <div key={slot.id} className="contents">
                <div className="p-3 border-b border-r border-border bg-muted/20">
                  <span className="text-sm text-muted-foreground">
                    {slot.time}
                  </span>
                </div>
                <div className="p-2 border-b border-border min-h-[60px]">
                  {hasClass ? (
                    <div
                      className={`${scheduleItem.color} text-white rounded-lg p-2 text-sm font-medium`}
                    >
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        <span>{scheduleItem.subject}</span>
                      </div>
                      <div className="text-white/80 text-xs mt-0.5">
                        {scheduleItem.class}
                      </div>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Légende des classes
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            { color: 'bg-blue-500', label: '6ème A' },
            { color: 'bg-indigo-500', label: '5ème B' },
            { color: 'bg-purple-500', label: '4ème A' },
            { color: 'bg-pink-500', label: '3ème A' },
            { color: 'bg-cyan-500', label: '2nde SM' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded ${item.color}`} />
              <span className="text-sm text-muted-foreground">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
