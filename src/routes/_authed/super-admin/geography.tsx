import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import { 
  getRegionsFn, 
  getAdministrativeUnitsFn, 
  getLocalitiesFn 
} from '@/server/api/geography'
import { geographyKeys } from '@/lib/query-client'
import { Map, MapPin, Globe, Compass, Plus, Search, Filter, Edit } from 'lucide-react'

export const Route = createFileRoute('/_authed/super-admin/geography')({
  component: GeographyPage,
})

function GeographyPage() {
  const [activeTab, setActiveTab] = useState<'regions' | 'adminUnits' | 'localities'>('regions')
  
  const getRegions = useServerFn(getRegionsFn)
  const getAdminUnits = useServerFn(getAdministrativeUnitsFn)
  const getLocalities = useServerFn(getLocalitiesFn)

  const { data: regions, isLoading: loadingRegions } = useQuery({ 
    queryKey: geographyKeys.regionsList(), 
    queryFn: () => getRegions() 
  })
  const { data: adminUnits, isLoading: loadingAdminUnits } = useQuery({ 
    queryKey: geographyKeys.administrativeUnitsList(), 
    queryFn: () => getAdminUnits() 
  })
  const { data: localities, isLoading: loadingLocalities } = useQuery({ 
    queryKey: geographyKeys.localitiesList(), 
    queryFn: () => getLocalities() 
  })

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Découpage Administratif</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les régions (IRE), préfectures/communes (DPE) et localités du pays.
          </p>
        </div>
        <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium transition-colors hover:bg-primary/90 btn-shine hover-scale">
          <Plus className="w-5 h-5" />
          <span>Nouvelle Entité</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex w-fit bg-muted p-1 rounded-lg">
        <button 
          onClick={() => setActiveTab('regions')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'regions' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Globe className="w-4 h-4" /> Régions (IRE)
        </button>
        <button 
          onClick={() => setActiveTab('adminUnits')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'adminUnits' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <Map className="w-4 h-4" /> Préfectures / Communes (DPE)
        </button>
        <button 
          onClick={() => setActiveTab('localities')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'localities' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
        >
          <MapPin className="w-4 h-4" /> Localités
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-card border border-border rounded-lg p-4 flex flex-col sm:flex-row gap-4 hover-lift">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input type="text" placeholder="Rechercher..." className="w-full bg-input border-none rounded-lg py-2.5 pl-10 pr-4 text-foreground focus:ring-2 focus:ring-ring focus:outline-none transition-shadow" />
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <select className="appearance-none bg-input border-none rounded-lg py-2.5 pl-4 pr-10 text-foreground font-medium focus:ring-2 focus:ring-ring focus:outline-none cursor-pointer h-full">
              <option value="">Tous les types</option>
            </select>
            <Filter className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover-lift">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wide text-foreground/80">Code</th>
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wide text-foreground/80">Nom</th>
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wide text-foreground/80">Type / Description</th>
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wide text-foreground/80 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {activeTab === 'regions' && loadingRegions && <SkeletonRow />}
            {activeTab === 'regions' && regions?.map(r => (
              <tr key={r.id} className="hover:bg-muted/40 transition-colors group">
                <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{r.code}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <Globe className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-foreground">{r.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{r.description || 'Région'}</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors hover-scale">
                    <Edit className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}

            {activeTab === 'adminUnits' && loadingAdminUnits && <SkeletonRow />}
            {activeTab === 'adminUnits' && adminUnits?.map(a => (
              <tr key={a.id} className="hover:bg-muted/40 transition-colors group">
                <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{a.code}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors">
                      <Map className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-foreground">{a.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide bg-secondary/15 text-secondary">
                    {a.type}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors hover-scale">
                    <Edit className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}

            {activeTab === 'localities' && loadingLocalities && <SkeletonRow />}
            {activeTab === 'localities' && localities?.map(l => (
              <tr key={l.id} className="hover:bg-muted/40 transition-colors group">
                <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{l.code}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="font-semibold text-foreground">{l.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">Localité / Quartier</td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors hover-scale">
                    <Edit className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SkeletonRow() {
  return (
    <tr>
      <td className="px-6 py-4"><div className="h-4 w-12 bg-muted animate-pulse rounded" /></td>
      <td className="px-6 py-4"><div className="h-4 w-32 bg-muted animate-pulse rounded" /></td>
      <td className="px-6 py-4"><div className="h-4 w-24 bg-muted animate-pulse rounded" /></td>
      <td className="px-6 py-4"><div className="h-4 w-8 bg-muted animate-pulse rounded ml-auto" /></td>
    </tr>
  )
}
