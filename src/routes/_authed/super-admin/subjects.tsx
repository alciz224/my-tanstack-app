import { createFileRoute } from '@tanstack/react-router'
import { BookOpen, Plus, Search, Filter, Edit, Layers, GraduationCap, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { getSubjectsFn } from '@/server/api/academic'

export const Route = createFileRoute('/_authed/super-admin/subjects')({
  component: SubjectsPage,
})

function SubjectsPage() {
  const getSubjects = useServerFn(getSubjectsFn)
  
  const { data: subjects, isLoading } = useQuery({
    queryKey: ['academic', 'subjects', 'list'],
    queryFn: () => getSubjects(),
  })

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des Matières</h1>
          <p className="text-muted-foreground mt-1">Gérez le catalogue global des matières enseignées et leurs affectations.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium transition-colors hover:bg-primary/90 btn-shine hover-scale">
          <Plus className="w-5 h-5" />
          <span>Nouvelle Matière</span>
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg p-4 flex flex-col sm:flex-row gap-4 hover-lift">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input type="text" placeholder="Rechercher une matière..." className="w-full bg-input border-none rounded-lg py-2.5 pl-10 pr-4 text-foreground focus:ring-2 focus:ring-ring focus:outline-none transition-shadow" />
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <select className="appearance-none bg-input border-none rounded-lg py-2.5 pl-4 pr-10 text-foreground font-medium focus:ring-2 focus:ring-ring focus:outline-none cursor-pointer h-full">
              <option value="">Tous les types</option>
              <option value="Scientifique">Scientifique</option>
              <option value="Littéraire">Littéraire</option>
              <option value="Général">Général</option>
            </select>
            <Filter className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading && (
          <div className="col-span-full flex justify-center py-12 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        )}
        {subjects?.map((sub) => (
          <div key={sub.id} className="bg-card border border-border rounded-lg p-5 hover-lift flex flex-col group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xs font-mono bg-muted text-foreground px-2 py-1 rounded border border-border">{sub.code}</span>
            </div>
            
            <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{sub.name}</h3>
            <span className={`inline-flex self-start text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full mb-4
              ${(sub as any).type === 'Scientifique' ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400' :
                (sub as any).type === 'Littéraire' ? 'bg-orange-500/15 text-orange-600 dark:text-orange-400' :
                'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
              }
            `}>
              {(sub as any).type || 'Général'}
            </span>
            
            <div className="space-y-3 mt-auto pt-4 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1.5 uppercase font-semibold tracking-wide">
                  <Layers className="w-3.5 h-3.5" />
                  Dispensée au :
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {sub.cycle_ids?.map(c => (
                    <span key={c} className="text-xs bg-muted text-foreground/80 px-2 py-1 rounded-md">{c}</span>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1.5 uppercase font-semibold tracking-wide">
                  <GraduationCap className="w-3.5 h-3.5" />
                  Profils / Séries :
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(sub.track_id ? [sub.track_id] : ['Toutes Séries']).map(t => (
                    <span key={t} className="text-[11px] font-medium text-secondary bg-secondary/15 border border-secondary/20 px-2 py-0.5 rounded-md">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-4 mt-4 flex justify-end">
              <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors hover-scale">
                <Edit className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
