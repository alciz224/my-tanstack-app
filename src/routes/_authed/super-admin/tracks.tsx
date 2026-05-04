import { createFileRoute } from '@tanstack/react-router'
import { Plus, Search, Filter, Edit, Compass, GraduationCap, Users, BookOpen, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { getTracksFn } from '@/server/api/academic'

export const Route = createFileRoute('/_authed/super-admin/tracks')({
  component: TracksPage,
})

function TracksPage() {
  const getTracks = useServerFn(getTracksFn)
  
  const { data: tracks, isLoading } = useQuery({
    queryKey: ['academic', 'tracks', 'list'],
    queryFn: () => getTracks(),
  })

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des Profils & Options</h1>
          <p className="text-muted-foreground mt-1">Configurez les séries d'études (ex: SM, SE, SS) pour les lycées et collèges.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium transition-colors hover:bg-primary/90 btn-shine hover-scale">
          <Plus className="w-5 h-5" />
          <span>Nouveau Profil</span>
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg p-4 flex flex-col sm:flex-row gap-4 hover-lift">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input type="text" placeholder="Rechercher un profil (SM, SS)..." className="w-full bg-input border-none rounded-lg py-2.5 pl-10 pr-4 text-foreground focus:ring-2 focus:ring-ring focus:outline-none transition-shadow" />
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <select className="appearance-none bg-input border-none rounded-lg py-2.5 pl-4 pr-10 text-foreground font-medium focus:ring-2 focus:ring-ring focus:outline-none cursor-pointer h-full">
              <option value="">Tous les cycles</option>
              <option value="Lycée">Lycée</option>
              <option value="Collège">Collège</option>
            </select>
            <Filter className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading && (
          <div className="col-span-full flex justify-center py-12 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        )}
        {tracks?.map((track) => (
          <div key={track.id} className="bg-card border border-border rounded-lg p-6 hover-lift flex flex-col group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono font-bold bg-muted text-foreground px-3 py-1 rounded border border-border">
                {/* Fallback to first letters if code not present */}
                {(track as any).code || track.name.substring(0, 2).toUpperCase()}
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">{track.name}</h3>
            <p className="text-sm text-muted-foreground mb-6 line-clamp-2 leading-relaxed">{track.description}</p>
            
            <div className="space-y-3 mt-auto pt-4 border-t border-border">
              <div className="flex items-center text-sm text-foreground/80">
                <GraduationCap className="w-4 h-4 mr-2 text-muted-foreground" />
                <span>Cycle concerné : <span className="font-semibold text-foreground">{track.cycle_id}</span></span>
              </div>
              <div className="flex items-center text-sm text-foreground/80">
                <BookOpen className="w-4 h-4 mr-2 text-muted-foreground" />
                <span>Matières au programme : <span className="font-semibold text-foreground">{(track as any).subjectsCount || 10}</span></span>
              </div>
              <div className="flex items-center text-sm text-foreground/80">
                <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                <span>Élèves inscrits (Global) : <span className="font-semibold text-foreground">{((track as any).studentsCount || 450).toLocaleString('fr-FR')}</span></span>
              </div>
            </div>

            <div className="border-t border-border pt-4 mt-5 flex justify-end">
              <button className="flex items-center text-sm text-primary hover:underline gap-1 transition-all hover-scale">
                <Edit className="w-4 h-4" />
                Modifier le profil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
