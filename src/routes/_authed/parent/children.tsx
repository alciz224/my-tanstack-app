import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  BookOpen,
  Calendar,
  ChevronDown,
  FileText,
  GraduationCap,
  Users,
} from 'lucide-react'

export const Route = createFileRoute('/_authed/parent/children')({
  component: ChildrenPage,
})

const MOCK_CHILDREN = [
  {
    id: 'child-1',
    first_name: 'Mamadou',
    last_name: 'Barry',
    level: '6ème A',
    school_year: '2024-2025',
    status: 'ACTIVE',
    avatar: 'M',
    average: 13.85,
  },
  {
    id: 'child-2',
    first_name: 'Fatoumata',
    last_name: 'Barry',
    level: '3ème B',
    school_year: '2024-2025',
    status: 'ACTIVE',
    avatar: 'F',
    average: 15.2,
  },
]

function ChildrenPage() {
  const [selectedChildId, setSelectedChildId] = useState(MOCK_CHILDREN[0].id)
  const selectedChild = MOCK_CHILDREN.find((c) => c.id === selectedChildId)

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mes Enfants</h1>
        <p className="text-muted-foreground mt-1">
          Suivez la scolarité de vos enfants
        </p>
      </div>

      {/* Child Selector */}
      <div className="bg-card border border-border rounded-lg p-4">
        <label className="text-sm font-medium text-foreground mb-2 block">
          Sélectionner un enfant
        </label>
        <div className="relative">
          <select
            value={selectedChildId}
            onChange={(e) => setSelectedChildId(e.target.value)}
            className="w-full appearance-none bg-input border-none rounded-lg py-3 pl-4 pr-10 text-foreground font-medium focus:ring-2 focus:ring-ring focus:outline-none cursor-pointer"
          >
            {MOCK_CHILDREN.map((child) => (
              <option key={child.id} value={child.id}>
                {child.first_name} {child.last_name} - {child.level}
              </option>
            ))}
          </select>
          <ChevronDown className="w-5 h-5 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Selected Child Card */}
      {selectedChild && (
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
              {selectedChild.avatar}
            </div>
            <div>
              <h2 className="text-2xl font-bold">
                {selectedChild.first_name} {selectedChild.last_name}
              </h2>
              <p className="text-white/80">{selectedChild.level}</p>
              <div className="flex items-center gap-4 mt-2 text-sm">
                <span>Moyenne: {selectedChild.average.toFixed(2)}/20</span>
                <span>
                  Statut:{' '}
                  {selectedChild.status === 'ACTIVE' ? 'Actif' : 'Inactif'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/parent/children/$childId/grades"
          params={{ childId: selectedChildId }}
          className="bg-card border border-border rounded-lg p-6 hover-lift hover:border-primary/50 transition-all"
        >
          <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6 text-blue-500" />
          </div>
          <h3 className="font-bold text-foreground mb-1">Notes</h3>
          <p className="text-sm text-muted-foreground">Voir les résultats</p>
        </Link>

        <Link
          to="/parent/children/$childId/report-cards"
          params={{ childId: selectedChildId }}
          className="bg-card border border-border rounded-lg p-6 hover-lift hover:border-primary/50 transition-all"
        >
          <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
            <FileText className="w-6 h-6 text-green-500" />
          </div>
          <h3 className="font-bold text-foreground mb-1">Bulletins</h3>
          <p className="text-sm text-muted-foreground">
            Consulter les bulletins
          </p>
        </Link>

        <Link
          to="/parent/children/$childId/schedule"
          params={{ childId: selectedChildId }}
          className="bg-card border border-border rounded-lg p-6 hover-lift hover:border-primary/50 transition-all"
        >
          <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6 text-purple-500" />
          </div>
          <h3 className="font-bold text-foreground mb-1">Emploi du temps</h3>
          <p className="text-sm text-muted-foreground">Horaire hebdomadaire</p>
        </Link>
      </div>

      {/* Children List */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-foreground">Tous mes enfants</h3>
        </div>
        <div className="divide-y divide-border">
          {MOCK_CHILDREN.map((child) => (
            <div
              key={child.id}
              className={`p-4 flex items-center justify-between hover:bg-muted/40 cursor-pointer transition-colors ${
                selectedChildId === child.id ? 'bg-primary/5' : ''
              }`}
              onClick={() => setSelectedChildId(child.id)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-medium">
                  {child.avatar}
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {child.first_name} {child.last_name}
                  </p>
                  <p className="text-sm text-muted-foreground">{child.level}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-foreground">
                  {child.average.toFixed(2)}/20
                </span>
                <p className="text-xs text-muted-foreground">Moyenne</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
