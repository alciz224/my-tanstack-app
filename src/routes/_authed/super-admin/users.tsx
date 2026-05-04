import { createFileRoute } from '@tanstack/react-router'
import { Users, Plus, Search, MoreVertical, Shield, User, Mail, Filter, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { getUsersFn } from '@/server/api/users'

export const Route = createFileRoute('/_authed/super-admin/users')({
  component: AdminUsersPage,
})

function AdminUsersPage() {
  const getUsers = useServerFn(getUsersFn)
  
  const { data: users, isLoading } = useQuery({
    queryKey: ['users', 'list'],
    queryFn: () => getUsers(),
  })

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des Utilisateurs</h1>
          <p className="text-muted-foreground mt-1">Consultez, modifiez et gérez les accès des utilisateurs du système.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium transition-colors hover:bg-primary/90 btn-shine hover-scale">
          <Plus className="w-5 h-5" />
          <span>Nouvel utilisateur</span>
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-card border border-border rounded-lg p-4 flex flex-col sm:flex-row gap-4 hover-lift">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Rechercher par nom, identifiant ou email..." 
            className="w-full bg-input border-none rounded-lg py-2.5 pl-10 pr-4 text-foreground focus:ring-2 focus:ring-ring focus:outline-none transition-shadow"
          />
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <select className="appearance-none bg-input border-none rounded-lg py-2.5 pl-4 pr-10 text-foreground font-medium focus:ring-2 focus:ring-ring focus:outline-none cursor-pointer h-full">
              <option value="">Tous les rôles</option>
              <option value="admin">Administrateur</option>
              <option value="teacher">Enseignant</option>
              <option value="student">Étudiant</option>
              <option value="parent">Parent</option>
            </select>
            <Filter className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <button className="px-4 py-2.5 text-foreground/80 hover:text-foreground hover:bg-muted/70 rounded-lg transition-colors font-medium">
            Réinitialiser
          </button>
        </div>
      </div>

      {/* Users Data Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover-lift">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wide text-foreground/80">Utilisateur</th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wide text-foreground/80">Contact</th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wide text-foreground/80">Rôle</th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wide text-foreground/80">Statut</th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wide text-foreground/80 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                  </td>
                </tr>
              )}
              {users?.map((user) => (
                <tr key={user.id} className="hover:bg-muted/40 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary group-hover:bg-primary/20 transition-colors">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{user.name}</div>
                        <div className="text-xs text-muted-foreground font-mono mt-0.5">{user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-foreground/80">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-secondary" />
                      <span className="text-sm font-medium capitalize text-foreground">{user.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide
                      ${user.status === 'Active' 
                        ? 'bg-success/15 text-success' 
                        : user.status === 'Pending'
                        ? 'bg-warning/15 text-warning'
                        : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors hover-scale">
                      <MoreVertical className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="p-4 border-t border-border flex items-center justify-between bg-muted/10">
          <span className="text-sm text-muted-foreground">Affichage de <span className="font-medium text-foreground">{users?.length ? 1 : 0}</span> à <span className="font-medium text-foreground">{users?.length || 0}</span> sur <span className="font-medium text-foreground">{users?.length || 0}</span> utilisateurs</span>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 text-sm rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" disabled>
              Précédent
            </button>
            <button className="px-3 py-1.5 text-sm rounded-md bg-primary text-primary-foreground font-medium shadow-sm transition-colors btn-shine hover-scale">
              1
            </button>
            <button className="px-3 py-1.5 text-sm rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors hover-scale">
              2
            </button>
            <button className="px-3 py-1.5 text-sm rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors hover-scale">
              3
            </button>
            <button className="px-3 py-1.5 text-sm rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              Suivant
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
