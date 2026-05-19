import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import {
  GraduationCap,
  Mail,
  MoreVertical,
  Phone,
  Plus,
  Search,
  Users,
} from 'lucide-react'
import type { Parent } from '@/server/data/parents/types'
import { getParentsFn } from '@/server/api/parents'
import { CreateParentModal } from '@/components/CreateParentModal'

export const Route = createFileRoute('/_authed/school-admin/parents/')({
  component: ParentsPage,
  loader: async () => {
    const parents = await getParentsFn()
    return { parents }
  },
})

function ParentsPage() {
  const { parents } = Route.useLoaderData()
  const [search, setSearch] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  const filteredParents = useMemo((): Array<Parent> => {
    if (!search) return parents
    const searchLower = search.toLowerCase()
    return parents.filter(
      (p) =>
        p.full_name.toLowerCase().includes(searchLower) ||
        (p.email && p.email.toLowerCase().includes(searchLower)) ||
        (p.phone && p.phone.includes(search)) ||
        p.children.some((c) => c.full_name.toLowerCase().includes(searchLower)),
    )
  }, [parents, search])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Parents / Tuteurs
          </h1>
          <p className="text-muted-foreground">
            Gérez les parents et tuteurs des élèves
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter un parent</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-card border border-border rounded-lg p-4 space-y-3 hover-lift">
        <div className="relative">
          <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, email, téléphone ou élève..."
            className="w-full bg-input border-none rounded-lg py-2.5 pl-10 pr-4 text-foreground focus:ring-2 focus:ring-ring focus:outline-none transition-shadow"
          />
        </div>
      </div>

      {/* Parents Grid */}
      {filteredParents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredParents.map((parent) => (
            <ParentCard key={parent.id} parent={parent} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            {search
              ? 'Aucun résultat pour cette recherche'
              : 'Aucun parent trouvé'}
          </p>
        </div>
      )}

      {/* Create Parent Modal */}
      <CreateParentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  )
}

function ParentCard({ parent }: { parent: Parent }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-300 group flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold text-lg">
            {parent.full_name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)}
          </div>
          <div>
            <h3 className="font-bold text-foreground">{parent.full_name}</h3>
            <p className="text-xs text-muted-foreground">
              {parent.children_count} enfant
              {parent.children_count > 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Contact Info */}
      <div className="space-y-2">
        {parent.email && (
          <div className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <a
              href={`mailto:${parent.email}`}
              className="text-primary hover:underline truncate"
            >
              {parent.email}
            </a>
          </div>
        )}
        {parent.phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <a
              href={`tel:${parent.phone}`}
              className="text-foreground hover:underline"
            >
              {parent.phone}
            </a>
          </div>
        )}
        {!parent.email && !parent.phone && (
          <p className="text-sm text-muted-foreground italic">Aucun contact</p>
        )}
      </div>

      {/* Children */}
      <div className="pt-3 border-t border-border/50">
        <p className="text-xs font-semibold text-muted-foreground mb-2 flex items-center gap-1">
          <Users className="w-3 h-3" /> Enfants inscrits
        </p>
        <div className="space-y-1.5">
          {parent.children.slice(0, 2).map((child) => (
            <div
              key={child.id}
              className="flex items-center justify-between text-sm bg-muted/30 rounded-md px-2 py-1.5"
            >
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-primary/60" />
                <span className="text-foreground font-medium truncate max-w-[120px]">
                  {child.full_name}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {child.class_name}
              </span>
            </div>
          ))}
          {parent.children.length > 2 && (
            <p className="text-xs text-muted-foreground text-center py-1">
              +{parent.children.length - 2} autre
              {parent.children.length - 2 > 1 ? 's' : ''}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
