import { Link, createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  Calendar,
  Clock,
  Users,
} from 'lucide-react'
import { getTeacherAssignmentsFn } from '@/server/api/teachers'

export const Route = createFileRoute(
  '/_authed/school-admin/teachers/$teacherId/workload',
)({
  component: TeacherWorkloadPage,
  loader: async ({ params }) => {
    const assignments = await getTeacherAssignmentsFn({
      data: params.teacherId,
    })
    return {
      teacherId: params.teacherId,
      teacherName: 'M. Alpha Condé',
      assignments,
    }
  },
})

const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']

const TIME_SLOTS = [
  { id: 'ts1', time: '08:00 - 08:45', order: 1 },
  { id: 'ts2', time: '08:45 - 09:30', order: 2 },
  { id: 'ts3', time: '09:45 - 10:30', order: 3 },
  { id: 'ts4', time: '10:30 - 11:15', order: 4 },
  { id: 'ts5', time: '11:15 - 12:00', order: 5 },
  { id: 'ts6', time: '13:00 - 13:45', order: 6 },
  { id: 'ts7', time: '13:45 - 14:30', order: 7 },
  { id: 'ts8', time: '14:45 - 15:30', order: 8 },
  { id: 'ts9', time: '15:30 - 16:15', order: 9 },
]

const MOCK_SCHEDULE: Record<
  string,
  Array<{ subject: string; class: string; color: string }>
> = {
  Lundi: [
    { subject: 'Mathématiques', class: '6ème A', color: 'bg-blue-500' },
    { subject: 'Mathématiques', class: '5ème B', color: 'bg-indigo-500' },
    { subject: '', class: '', color: '' },
    { subject: 'Mathématiques', class: '4ème A', color: 'bg-purple-500' },
  ],
  Mardi: [
    { subject: 'Mathématiques', class: '6ème B', color: 'bg-cyan-500' },
    { subject: '', class: '', color: '' },
    { subject: 'Mathématiques', class: '5ème A', color: 'bg-violet-500' },
    { subject: 'Mathématiques', class: '3ème B', color: 'bg-fuchsia-500' },
  ],
  Mercredi: [
    { subject: '', class: '', color: '' },
    { subject: '', class: '', color: '' },
    { subject: '', class: '', color: '' },
    { subject: '', class: '', color: '' },
  ],
  Jeudi: [
    { subject: 'Mathématiques', class: '6ème A', color: 'bg-blue-500' },
    { subject: 'Mathématiques', class: '5ème B', color: 'bg-indigo-500' },
    { subject: '', class: '', color: '' },
    { subject: '', class: '', color: '' },
  ],
  Vendredi: [
    { subject: 'Mathématiques', class: '4ème B', color: 'bg-teal-500' },
    { subject: 'Mathématiques', class: '3ème A', color: 'bg-emerald-500' },
    { subject: 'Mathématiques', class: '5ème A', color: 'bg-violet-500' },
    { subject: '', class: '', color: '' },
  ],
  Samedi: [
    { subject: 'Mathématiques', class: '6ème B', color: 'bg-cyan-500' },
    { subject: '', class: '', color: '' },
    { subject: '', class: '', color: '' },
    { subject: '', class: '', color: '' },
  ],
}

function TeacherWorkloadPage() {
  const { teacherId, teacherName } = Route.useLoaderData()
  const [selectedWeek, setSelectedWeek] = useState(1)

  const stats = {
    totalHours: 18,
    totalClasses: 6,
    totalStudents: 142,
    avgClassSize: 24,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/school-admin/teachers"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux enseignants</span>
          </Link>
        </div>

        <select
          value={selectedWeek}
          onChange={(e) => setSelectedWeek(Number(e.target.value))}
          className="bg-input border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/50"
        >
          <option value={1}>Semaine 1</option>
          <option value={2}>Semaine 2</option>
          <option value={3}>Semaine 3</option>
          <option value={4}>Semaine 4</option>
        </select>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Charge Horaire</h1>
          <p className="text-muted-foreground">
            Emploi du temps de {teacherName}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-sm">Heures/ semaine</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {stats.totalHours}h
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm">Classes</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {stats.totalClasses}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Users className="w-4 h-4" />
            <span className="text-sm">Total élèves</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {stats.totalStudents}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <BarChart3 className="w-4 h-4" />
            <span className="text-sm">Moy. classe</span>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {stats.avgClassSize}
          </p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider w-24">
                  Créneau
                </th>
                {DAYS.map((day) => (
                  <th
                    key={day}
                    className="px-4 py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {TIME_SLOTS.map((slot, idx) => (
                <tr key={slot.id} className="hover:bg-muted/20">
                  <td className="px-4 py-3 text-sm text-muted-foreground font-mono">
                    {slot.time}
                  </td>
                  {DAYS.map((day) => {
                    const lesson = MOCK_SCHEDULE[day]?.[idx]
                    return (
                      <td key={day} className="px-2 py-2">
                        {lesson?.subject ? (
                          <div
                            className={`${lesson.color} text-white text-xs font-medium rounded px-2 py-1.5 text-center`}
                          >
                            <div className="font-semibold truncate">
                              {lesson.subject}
                            </div>
                            <div className="opacity-80 text-[10px]">
                              {lesson.class}
                            </div>
                          </div>
                        ) : (
                          <div className="h-full min-h-[40px]" />
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="font-semibold text-foreground mb-4">
          Répartition par classe
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { name: '6ème A', hours: 2, students: 32 },
            { name: '6ème B', hours: 2, students: 28 },
            { name: '5ème A', hours: 2, students: 31 },
            { name: '5ème B', hours: 2, students: 29 },
            { name: '4ème A', hours: 2, students: 33 },
            { name: '4ème B', hours: 2, students: 29 },
            { name: '3ème A', hours: 2, students: 31 },
            { name: '3ème B', hours: 2, students: 37 },
          ].map((c) => (
            <div
              key={c.name}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
            >
              <div>
                <p className="font-medium text-foreground text-sm">{c.name}</p>
                <p className="text-xs text-muted-foreground">
                  {c.students} élèves
                </p>
              </div>
              <span className="text-sm font-semibold text-primary">
                {c.hours}h
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
