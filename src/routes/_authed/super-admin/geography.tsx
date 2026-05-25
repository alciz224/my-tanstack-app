import { createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import { Edit, Globe, Loader2, Map, MapPin, Plus, Search, Trash2 } from 'lucide-react'
import {
  getCitiesFn, getCountriesFn, getDistrictsFn, getRegionsFn,
} from '@/server/api/geography'
import {
  createCountryFn, updateCountryFn, deleteCountryFn,
  createRegionFn, updateRegionFn, deleteRegionFn,
  createCityFn, updateCityFn, deleteCityFn,
  createDistrictFn, updateDistrictFn, deleteDistrictFn,
} from '@/server/api/geography-mutations'
import { geographyKeys } from '@/lib/query-client'
import { toast } from '@/stores/toastStore'
import type { City, Country, District, RegionAdministrative } from '@/server/data/geography/types'

export const Route = createFileRoute('/_authed/super-admin/geography')({
  component: GeographyPage,
})

type TabType = 'countries' | 'regions' | 'cities' | 'districts'

function GeographyPage() {
  const [activeTab, setActiveTab] = useState<TabType>('countries')
  const queryClient = useQueryClient()
  const getCountries = useServerFn(getCountriesFn)
  const getRegions = useServerFn(getRegionsFn)
  const getCities = useServerFn(getCitiesFn)
  const getDistricts = useServerFn(getDistrictsFn)

  const { data: countries, isLoading: loadingCountries } = useQuery({
    queryKey: geographyKeys.countriesList(),
    queryFn: () => getCountries(),
  })
  const { data: regions, isLoading: loadingRegions } = useQuery({
    queryKey: geographyKeys.regionsList(),
    queryFn: () => getRegions(),
  })
  const { data: cities, isLoading: loadingCities } = useQuery({
    queryKey: geographyKeys.citiesList(),
    queryFn: () => getCities(),
  })
  const { data: districts, isLoading: loadingDistricts } = useQuery({
    queryKey: geographyKeys.districtsList(),
    queryFn: () => getDistricts(),
  })

  const [editing, setEditing] = useState<{ type: TabType; item: any } | null>(null)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: TabType; id: string } | null>(null)

  const crud = {
    countries: {
      create: useServerFn(createCountryFn), update: useServerFn(updateCountryFn), delete: useServerFn(deleteCountryFn),
    },
    regions: {
      create: useServerFn(createRegionFn), update: useServerFn(updateRegionFn), delete: useServerFn(deleteRegionFn),
    },
    cities: {
      create: useServerFn(createCityFn), update: useServerFn(updateCityFn), delete: useServerFn(deleteCityFn),
    },
    districts: {
      create: useServerFn(createDistrictFn), update: useServerFn(updateDistrictFn), delete: useServerFn(deleteDistrictFn),
    },
  }

  const currentCrud = crud[activeTab]
  const keyMap = { countries: geographyKeys.countries(), regions: geographyKeys.regions(), cities: geographyKeys.cities(), districts: geographyKeys.districts() }
  const invalidate = () => queryClient.invalidateQueries({ queryKey: keyMap[activeTab] })

  const createMut = useMutation({
    mutationFn: async (data: any) => { await currentCrud.create({ data }); invalidate() },
    onSuccess: () => { toast.success('Créé avec succès'); setIsCreateOpen(false) },
    onError: (e: any) => toast.error(e.message),
  })
  const updateMut = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => { await currentCrud.update({ data: { id, data } }); invalidate() },
    onSuccess: () => { toast.success('Modifié avec succès'); setEditing(null) },
    onError: (e: any) => toast.error(e.message),
  })
  const deleteMut = useMutation({
    mutationFn: async (id: string) => { await currentCrud.delete({ data: { id } }); invalidate() },
    onSuccess: () => { toast.success('Supprimé avec succès'); setDeleteConfirm(null) },
    onError: (e: any) => { toast.error(e.message); setDeleteConfirm(null) },
  })

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Découpage Administratif</h1>
          <p className="text-muted-foreground mt-1">Hiérarchie: Pays → Région → Ville → District/Quartier</p>
        </div>
        <button onClick={() => setIsCreateOpen(true)} className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium transition-colors hover:bg-primary/90 btn-shine hover-scale">
          <Plus className="w-5 h-5" /> <span>Nouveau</span>
        </button>
      </div>

      <div className="flex w-fit bg-muted p-1 rounded-lg">
        {(['countries', 'regions', 'cities', 'districts'] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
          >
            {tab === 'countries' && <Globe className="w-4 h-4" />}
            {tab === 'regions' && <Globe className="w-4 h-4" />}
            {tab === 'cities' && <Map className="w-4 h-4" />}
            {tab === 'districts' && <MapPin className="w-4 h-4" />}
            {tab === 'countries' && 'Pays'} {tab === 'regions' && 'Régions'}
            {tab === 'cities' && 'Villes / Communes'} {tab === 'districts' && 'Districts / Quartiers'}
          </button>
        ))}
      </div>

      <div className="bg-card border border-border rounded-lg p-4 flex flex-col sm:flex-row gap-4 hover-lift">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input type="text" placeholder="Rechercher..." className="w-full bg-input border-none rounded-lg py-2.5 pl-10 pr-4 text-foreground focus:ring-2 focus:ring-ring focus:outline-none transition-shadow" />
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover-lift">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wide text-foreground/80">Code</th>
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wide text-foreground/80">Nom</th>
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wide text-foreground/80">Rattachement</th>
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wide text-foreground/80 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {activeTab === 'countries' && (loadingCountries ? <SkeletonRow /> : !countries?.length ? <EmptyRow /> : countries.map((c) => (
              <Row key={c.id} code={c.code} name={c.name} meta="Pays" icon={<Globe className="w-4 h-4" />}
                onEdit={() => setEditing({ type: 'countries', item: c })}
                onDelete={() => setDeleteConfirm({ type: 'countries', id: c.id })}
              />
            )))}
            {activeTab === 'regions' && (loadingRegions ? <SkeletonRow /> : !regions?.length ? <EmptyRow /> : regions.map((r) => (
              <Row key={r.id} code={r.code} name={r.name} meta={r.description || 'Région'} icon={<Globe className="w-4 h-4" />}
                onEdit={() => setEditing({ type: 'regions', item: r })}
                onDelete={() => setDeleteConfirm({ type: 'regions', id: r.id })}
              />
            )))}
            {activeTab === 'cities' && (loadingCities ? <SkeletonRow /> : !cities?.length ? <EmptyRow /> : cities.map((c) => {
              const region = regions?.find((r) => r.id === c.region_id)
              return (
                <Row key={c.id} code={c.code} name={c.name}
                  meta={region ? `${region.name} — ${c.type === 'CAPITAL' ? 'Capitale' : c.type === 'COMMUNE' ? 'Commune' : 'Ville'}` : c.type}
                  icon={<Map className="w-4 h-4" />}
                  onEdit={() => setEditing({ type: 'cities', item: c })}
                  onDelete={() => setDeleteConfirm({ type: 'cities', id: c.id })}
                />
              )
            }))}
            {activeTab === 'districts' && (loadingDistricts ? <SkeletonRow /> : !districts?.length ? <EmptyRow /> : districts.map((d) => {
              const city = cities?.find((c) => c.id === d.city_id)
              const region = city ? regions?.find((r) => r.id === city.region_id) : undefined
              return (
                <Row key={d.id} code={d.code} name={d.name}
                  meta={[region?.name, city?.name].filter(Boolean).join(' — ') || `${d.type === 'QUARTIER' ? 'Quartier' : 'District'}`}
                  icon={<MapPin className="w-4 h-4" />}
                  onEdit={() => setEditing({ type: 'districts', item: d })}
                  onDelete={() => setDeleteConfirm({ type: 'districts', id: d.id })}
                />
              )
            }))}
          </tbody>
        </table>
      </div>

      {isCreateOpen && (
        <EntityModal type={activeTab} regions={regions} cities={cities}
          isSubmitting={createMut.isPending}
          onClose={() => setIsCreateOpen(false)}
          onSubmit={(data) => createMut.mutate(data)}
        />
      )}
      {editing && (
        <EntityModal type={editing.type} regions={regions} cities={cities}
          initial={editing.item} isSubmitting={updateMut.isPending}
          onClose={() => setEditing(null)}
          onSubmit={(data) => updateMut.mutate({ id: editing.item.id, data })}
        />
      )}
      {deleteConfirm && (
        <ConfirmDelete isSubmitting={deleteMut.isPending}
          onCancel={() => setDeleteConfirm(null)}
          onConfirm={() => deleteMut.mutate(deleteConfirm.id)}
        />
      )}
    </div>
  )
}

function Row({ code, name, meta, icon, onEdit, onDelete }: { code: string; name: string; meta: string; icon: React.ReactNode; onEdit: () => void; onDelete: () => void }) {
  return (
    <tr className="hover:bg-muted/40 transition-colors group">
      <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{code}</td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">{icon}</div>
          <span className="font-semibold text-foreground">{name}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-muted-foreground">{meta}</td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <button onClick={onEdit} className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors hover-scale"><Edit className="w-4 h-4" /></button>
          <button onClick={onDelete} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors hover-scale"><Trash2 className="w-4 h-4" /></button>
        </div>
      </td>
    </tr>
  )
}

function SkeletonRow() {
  return (
    <tr><td colSpan={4} className="px-6 py-12 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" /></td></tr>
  )
}

function EmptyRow() {
  return (
    <tr><td colSpan={4} className="px-6 py-12 text-center text-sm text-muted-foreground">Aucun élément</td></tr>
  )
}

function EntityModal({ type: entityType, regions, cities, initial, isSubmitting, onClose, onSubmit }: {
  type: TabType; regions?: RegionAdministrative[]; cities?: City[];
  initial?: any; isSubmitting: boolean; onClose: () => void; onSubmit: (data: any) => void
}) {
  const isEdit = !!initial
  const [code, setCode] = useState(initial?.code || '')
  const [name, setName] = useState(initial?.name || '')
  const [description, setDescription] = useState(initial?.description || '')
  const [regionId, setRegionId] = useState(initial?.region_id || '')
  const [cityId, setCityId] = useState(initial?.city_id || '')
  const [cityType, setCityType] = useState(initial?.type || 'VILLE')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let payload: any = { code, name }
    if (entityType === 'countries') payload.description = description
    if (entityType === 'regions') { payload.country_id = 'GN'; payload.description = description }
    if (entityType === 'cities') { payload.region_id = regionId; payload.type = cityType }
    if (entityType === 'districts') payload.city_id = cityId
    onSubmit(payload)
  }

  const inputBase = 'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-xl border border-border bg-card shadow-xl">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold text-foreground">
            {isEdit ? 'Modifier' : 'Nouveau'}{' '}
            {entityType === 'countries' ? 'Pays' : entityType === 'regions' ? 'Région' : entityType === 'cities' ? 'Ville / Commune' : 'District / Quartier'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} noValidate className="px-6 pb-6 pt-5 space-y-4">
          {entityType === 'countries' && (
            <>
              <Field label="Code"><input className={inputBase} value={code} onChange={(e) => setCode(e.target.value)} required /></Field>
              <Field label="Nom"><input className={inputBase} value={name} onChange={(e) => setName(e.target.value)} required /></Field>
              <Field label="Description"><input className={inputBase} value={description} onChange={(e) => setDescription(e.target.value)} /></Field>
            </>
          )}
          {entityType === 'regions' && (
            <>
              <Field label="Code"><input className={inputBase} value={code} onChange={(e) => setCode(e.target.value)} required /></Field>
              <Field label="Nom"><input className={inputBase} value={name} onChange={(e) => setName(e.target.value)} required /></Field>
              <Field label="Description"><input className={inputBase} value={description} onChange={(e) => setDescription(e.target.value)} /></Field>
            </>
          )}
          {entityType === 'cities' && (
            <>
              <Field label="Région">
                <select className={inputBase} value={regionId} onChange={(e) => setRegionId(e.target.value)} required>
                  <option value="">Sélectionner...</option>
                  {regions?.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                </select>
              </Field>
              <Field label="Type">
                <select className={inputBase} value={cityType} onChange={(e) => setCityType(e.target.value)}>
                  <option value="VILLE">Ville</option>
                  <option value="COMMUNE">Commune</option>
                  <option value="CAPITAL">Capitale</option>
                </select>
              </Field>
              <Field label="Code"><input className={inputBase} value={code} onChange={(e) => setCode(e.target.value)} required /></Field>
              <Field label="Nom"><input className={inputBase} value={name} onChange={(e) => setName(e.target.value)} required /></Field>
            </>
          )}
          {entityType === 'districts' && (
            <>
              <Field label="Ville / Commune">
                <select className={inputBase} value={cityId} onChange={(e) => setCityId(e.target.value)} required>
                  <option value="">Sélectionner...</option>
                  {cities?.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </Field>
              <Field label="Code"><input className={inputBase} value={code} onChange={(e) => setCode(e.target.value)} required /></Field>
              <Field label="Nom"><input className={inputBase} value={name} onChange={(e) => setName(e.target.value)} required /></Field>
            </>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground hover:bg-muted disabled:opacity-50">Annuler</button>
            <button type="submit" disabled={isSubmitting} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">{isSubmitting ? 'En cours...' : isEdit ? 'Modifier' : 'Créer'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-foreground">{label}</label>
      {children}
    </div>
  )
}

function ConfirmDelete({ isSubmitting, onCancel, onConfirm }: { isSubmitting: boolean; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card shadow-xl p-6">
        <h3 className="text-sm font-semibold text-foreground mb-2">Confirmer la suppression</h3>
        <p className="text-xs text-muted-foreground mb-4">Cette action est irréversible.</p>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} disabled={isSubmitting} className="rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground hover:bg-muted disabled:opacity-50">Annuler</button>
          <button onClick={onConfirm} disabled={isSubmitting} className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-white hover:bg-destructive/90 disabled:opacity-50">{isSubmitting ? 'Suppression...' : 'Supprimer'}</button>
        </div>
      </div>
    </div>
  )
}
