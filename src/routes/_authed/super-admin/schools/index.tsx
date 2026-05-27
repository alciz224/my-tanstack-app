import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Building2,
  Edit,
  Filter,
  Globe,
  Loader2,
  MapPin,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { useState, useMemo } from 'react'
import {
  getSchoolsFn,
  createSchoolFn,
  updateSchoolFn,
  deleteSchoolFn,
} from '@/server/api/schools'
import {
  getRegionsFn,
  getAdministrativeUnitsFn,
  getLocalitiesFn,
} from '@/server/api/geography'
import { geographyKeys } from '@/lib/query-client'
import { schoolOpsKeys } from '@/lib/query-client'
import { toast } from '@/stores/toastStore'
import type { School, CreateSchoolInput } from '@/server/data/schools/types'

export const Route = createFileRoute('/_authed/super-admin/schools/')({
  component: SchoolsListPage,
})

function SchoolsListPage() {
  const queryClient = useQueryClient()
  const getSchools = useServerFn(getSchoolsFn)
  const createSchool = useServerFn(createSchoolFn)
  const updateSchool = useServerFn(updateSchoolFn)
  const deleteSchool = useServerFn(deleteSchoolFn)
  const getRegions = useServerFn(getRegionsFn)
  const getAdministrativeUnits = useServerFn(getAdministrativeUnitsFn)
  const getLocalities = useServerFn(getLocalitiesFn)

  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState<School | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<School | null>(null)
  const [search, setSearch] = useState('')
  const [regionFilter, setRegionFilter] = useState('')

  const { data: schools, isLoading } = useQuery({
    queryKey: schoolOpsKeys.schoolsList(),
    queryFn: () => getSchools(),
  })

  const { data: regions } = useQuery({
    queryKey: geographyKeys.regionsList(),
    queryFn: () => getRegions(),
  })

  const { data: administrativeUnits } = useQuery({
    queryKey: geographyKeys.administrativeUnitsList(),
    queryFn: () => getAdministrativeUnits(),
  })

  const { data: localities } = useQuery({
    queryKey: geographyKeys.localitiesList(),
    queryFn: () => getLocalities(),
  })

  const auToRegion = useMemo(
    () => new Map((administrativeUnits ?? []).map((au) => [au.id, au.region_id])),
    [administrativeUnits],
  )

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: schoolOpsKeys.schools() })

  const createMutation = useMutation({
    mutationFn: async (data: CreateSchoolInput) => {
      return await createSchool(data)
    },
    onSuccess: () => {
      invalidate()
      toast.success('École créée avec succès')
      setCreateOpen(false)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Impossible de créer l\'école')
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<School> }) => {
      return await updateSchool({ id, data })
    },
    onSuccess: () => {
      invalidate()
      toast.success('École modifiée avec succès')
      setEditing(null)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Impossible de modifier l\'école')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await deleteSchool({ id })
    },
    onSuccess: () => {
      invalidate()
      toast.success('École supprimée avec succès')
      setDeleteConfirm(null)
    },
    onError: (error: any) => {
      toast.error(error.message || 'Impossible de supprimer l\'école')
    },
  })

  const regionMap = useMemo(
    () => new Map((regions ?? []).map((r) => [r.id, r])),
    [regions],
  )
  const localityMap = useMemo(
    () => new Map((localities ?? []).map((loc) => [loc.id, loc])),
    [localities],
  )
  const auMap = useMemo(
    () => new Map((administrativeUnits ?? []).map((au) => [au.id, au])),
    [administrativeUnits],
  )

  const localityToRegion = useMemo(() => {
    const map = new Map<string, string>()
    for (const loc of localities ?? []) {
      const regionId = auToRegion.get(loc.administrative_unit_id)
      if (regionId) map.set(loc.id, regionId)
    }
    return map
  }, [localities, auToRegion])

  const filtered = (schools ?? []).filter((s) => {
    const matchSearch =
      !search ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.code.toLowerCase().includes(search.toLowerCase())
    const schoolRegionId = localityToRegion.get(s.locality_id)
    const matchRegion = !regionFilter || schoolRegionId === regionFilter
    return matchSearch && matchRegion
  })

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Gestion des Écoles
          </h1>
          <p className="text-muted-foreground mt-1">
            Supervisez les établissements scolaires à travers la Guinée.
          </p>
        </div>
        <button
          onClick={() => setCreateOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium transition-colors hover:bg-primary/90 btn-shine hover-scale"
        >
          <Plus className="w-5 h-5" />
          <span>Nouvelle École</span>
        </button>
      </div>

      <div className="bg-card border border-border rounded-lg p-4 flex flex-col sm:flex-row gap-4 hover-lift">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom d'école ou code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-input border-none rounded-lg py-2.5 pl-10 pr-4 text-foreground focus:ring-2 focus:ring-ring focus:outline-none transition-shadow"
          />
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="appearance-none bg-input border-none rounded-lg py-2.5 pl-4 pr-10 text-foreground font-medium focus:ring-2 focus:ring-ring focus:outline-none cursor-pointer h-full"
            >
              <option value="">Toutes les IRE</option>
              {(regions ?? []).map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
            <Filter className="w-4 h-4 text-muted-foreground absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {isLoading && (
          <div className="col-span-full flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        )}
        {!isLoading && filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            Aucune école trouvée.
          </div>
        )}
        {filtered.map((school) => {
          const locality = localityMap.get(school.locality_id)
          const au = locality ? auMap.get(locality.administrative_unit_id) : undefined
          const region = au ? regionMap.get(au.region_id) : undefined
          return (
            <div
              key={school.id}
              className="bg-card border border-border rounded-lg p-6 hover-lift flex flex-col group transition-all"
            >
              <Link
                to="/super-admin/schools/$schoolId"
                params={{ schoolId: school.id }}
                className="flex flex-col flex-1"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Building2 className="w-6 h-6" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                  {school.name}
                </h3>
                <p className="text-sm font-mono text-muted-foreground mb-4">
                  {school.code}
                </p>
                <div className="space-y-3 mt-auto pt-4 border-t border-border">
                  {region && (
                    <div className="flex items-center text-sm text-foreground/80">
                      <Globe className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>{region.name}{au ? ` — ${au.name}` : ''}{locality ? ` — ${locality.name}` : ''}</span>
                    </div>
                  )}
                  {school.address && (
                    <div className="flex items-center text-sm text-foreground/80">
                      <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                      <span>{school.address}</span>
                    </div>
                  )}
                  {school.email && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Email:</span>
                      <span className="font-medium text-foreground text-right truncate ml-2">
                        {school.email}
                      </span>
                    </div>
                  )}
                  {school.phone && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Téléphone:</span>
                      <span className="font-medium text-foreground">
                        {school.phone}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
              <div className="flex items-center justify-end gap-1 pt-3 border-t border-border mt-3">
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    setEditing(school)
                  }}
                  className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors hover-scale"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    setDeleteConfirm(school)
                  }}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors hover-scale"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {createOpen && (
        <CreateEditSchoolModal
          isSubmitting={createMutation.isPending}
          onClose={() => setCreateOpen(false)}
          onSubmit={(data) => createMutation.mutate(data)}
        />
      )}

      {editing && (
        <CreateEditSchoolModal
          school={editing}
          isSubmitting={updateMutation.isPending}
          onClose={() => setEditing(null)}
          onSubmit={(data) =>
            updateMutation.mutate({ id: editing.id, data })
          }
        />
      )}

      {deleteConfirm && (
        <DeleteSchoolConfirm
          school={deleteConfirm}
          isSubmitting={deleteMutation.isPending}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={() => deleteMutation.mutate(deleteConfirm.id)}
        />
      )}
    </div>
  )
}

export function CreateEditSchoolModal({
  school,
  isSubmitting,
  onClose,
  onSubmit,
}: {
  school?: School
  isSubmitting: boolean
  onSubmit: (data: CreateSchoolInput | { id: string; data: Partial<School> }) => void
  onClose: () => void
}) {
  const isEdit = !!school
  const getRegions = useServerFn(getRegionsFn)
  const getAdministrativeUnits = useServerFn(getAdministrativeUnitsFn)
  const getLocalities = useServerFn(getLocalitiesFn)

  const { data: regions } = useQuery({
    queryKey: ['geography', 'regions'],
    queryFn: () => getRegions(),
  })
  const { data: administrativeUnits } = useQuery({
    queryKey: ['geography', 'administrative-units'],
    queryFn: () => getAdministrativeUnits(),
  })
  const { data: localities } = useQuery({
    queryKey: ['geography', 'localities'],
    queryFn: () => getLocalities(),
  })

  const [name, setName] = useState(school?.name ?? '')
  const [code, setCode] = useState(school?.code ?? '')
  const [localityId, setLocalityId] = useState(school?.locality_id ?? '')
  const [address, setAddress] = useState(school?.address ?? '')
  const [phone, setPhone] = useState(school?.phone ?? '')
  const [email, setEmail] = useState(school?.email ?? '')
  const [website, setWebsite] = useState(school?.website ?? '')

  const [regionId, setRegionId] = useState('')
  const [administrativeUnitId, setAdministrativeUnitId] = useState('')

  const [errors, setErrors] = useState<Record<string, string>>({})

  const filteredRegions = regions ?? []
  const filteredAdministrativeUnits = (administrativeUnits ?? []).filter(
    (au) => !regionId || au.region_id === regionId,
  )
  const filteredLocalities = (localities ?? []).filter(
    (loc) => !administrativeUnitId || loc.administrative_unit_id === administrativeUnitId,
  )

  const inputBase =
    'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary'
  const inputError = 'border-destructive focus:ring-destructive'
  const labelClass = 'mb-1 block text-xs font-medium text-foreground'

  const validate = () => {
    const e: Record<string, string> = {}
    if (!name.trim()) e.name = 'Le nom est requis'
    if (!code.trim()) e.code = 'Le code est requis'
    if (!localityId) e.locality_id = 'Veuillez sélectionner une localité'
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Email invalide'
    if (phone && !/^[\d\s\+\(\)-]+$/.test(phone)) e.phone = 'Numéro de téléphone invalide'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    if (!validate()) return
    if (isEdit) {
      const payload: Record<string, any> = {}
      if (name !== school.name) payload.name = name.trim()
      if (code !== school.code) payload.code = code.trim()
      if (localityId !== school.locality_id) payload.locality_id = localityId
      if (address !== (school.address ?? '')) payload.address = address || undefined
      if (phone !== (school.phone ?? '')) payload.phone = phone || undefined
      if (email !== (school.email ?? '')) payload.email = email || undefined
      if (website !== (school.website ?? '')) payload.website = website || undefined
      onSubmit({ id: school.id, data: payload })
    } else {
      onSubmit({
        name: name.trim(),
        code: code.trim(),
        locality_id: localityId,
        address: address || undefined,
        phone: phone || undefined,
        email: email || undefined,
        website: website || undefined,
      })
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="school-modal-title"
    >
      <div className="w-full max-w-lg rounded-xl border border-border bg-card shadow-xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div>
            <h2
              id="school-modal-title"
              className="text-base font-semibold text-foreground"
            >
              {isEdit ? "Modifier l'école" : 'Nouvelle école'}
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {isEdit
                ? "Modifiez les informations de l'école."
                : "Créez un nouvel établissement scolaire."}
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="px-6 pb-6 pt-5 space-y-4 max-h-[70vh] overflow-y-auto"
        >
          <div>
            <label className={labelClass}>Nom de l'école *</label>
            <input
              type="text"
              value={name}
              autoFocus={!isEdit}
              onChange={(e) => { setName(e.target.value); setErrors((err) => ({ ...err, name: '' })) }}
              placeholder="Ex: Lycée Don Bosco"
              className={`${inputBase} ${errors.name ? inputError : ''}`}
            />
            {errors.name && <p className="mt-1 text-xs text-destructive">{errors.name}</p>}
          </div>

          <div>
            <label className={labelClass}>Code *</label>
            <input
              type="text"
              value={code}
              onChange={(e) => { setCode(e.target.value.toUpperCase()); setErrors((err) => ({ ...err, code: '' })) }}
              placeholder="Ex: DBC-001"
              className={`${inputBase} ${errors.code ? inputError : ''}`}
            />
            {errors.code && <p className="mt-1 text-xs text-destructive">{errors.code}</p>}
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-xs font-semibold text-foreground mb-3">Localisation géographique</p>

            <div className="space-y-3">
              <div>
                <label className={labelClass}>Région (IRE)</label>
                <select
                  value={regionId}
                  onChange={(e) => { setRegionId(e.target.value); setAdministrativeUnitId(''); setLocalityId('') }}
                  className={inputBase}
                >
                  <option value="">Sélectionnez une région</option>
                  {filteredRegions.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Unité Administrative</label>
                <select
                  value={administrativeUnitId}
                  onChange={(e) => { setAdministrativeUnitId(e.target.value); setLocalityId('') }}
                  className={inputBase}
                  disabled={!regionId}
                >
                  <option value="">Sélectionnez une unité administrative</option>
                  {filteredAdministrativeUnits.map((au) => (
                    <option key={au.id} value={au.id}>{au.name} ({au.type === 'CAPITAL' ? 'Capitale' : au.type === 'COMMUNE' ? 'Commune' : 'Ville'})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={labelClass}>Localité *</label>
                <select
                  value={localityId}
                  onChange={(e) => { setLocalityId(e.target.value); setErrors((err) => ({ ...err, locality_id: '' })) }}
                  className={`${inputBase} ${errors.locality_id ? inputError : ''}`}
                  disabled={!administrativeUnitId}
                >
                  <option value="">Sélectionnez une localité</option>
                  {filteredLocalities.map((loc) => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                  ))}
                </select>
                {errors.locality_id && <p className="mt-1 text-xs text-destructive">{errors.locality_id}</p>}
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-xs font-semibold text-foreground mb-3">Coordonnées (optionnel)</p>

            <div className="space-y-3">
              <div>
                <label className={labelClass}>Adresse</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ex: Ratoma, Conakry"
                  className={inputBase}
                />
              </div>

              <div>
                <label className={labelClass}>Téléphone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); setErrors((err) => ({ ...err, phone: '' })) }}
                  placeholder="Ex: +224 622 12 34 56"
                  className={`${inputBase} ${errors.phone ? inputError : ''}`}
                />
                {errors.phone && <p className="mt-1 text-xs text-destructive">{errors.phone}</p>}
              </div>

              <div>
                <label className={labelClass}>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors((err) => ({ ...err, email: '' })) }}
                  placeholder="Ex: contact@ecole.edu.gn"
                  className={`${inputBase} ${errors.email ? inputError : ''}`}
                />
                {errors.email && <p className="mt-1 text-xs text-destructive">{errors.email}</p>}
              </div>

              <div>
                <label className={labelClass}>Site web</label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="Ex: https://ecole.edu.gn"
                  className={inputBase}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground hover:bg-muted disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50"
            >
              {isSubmitting
                ? isEdit
                  ? 'Modification…'
                  : 'Création…'
                : isEdit
                  ? 'Modifier'
                  : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export function DeleteSchoolConfirm({
  school,
  isSubmitting,
  onClose,
  onConfirm,
}: {
  school: School
  isSubmitting: boolean
  onClose: () => void
  onConfirm: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-school-confirm-title"
    >
      <div className="w-full max-w-sm rounded-xl border border-border bg-card shadow-xl">
        <div className="p-6">
          <div className="mb-4 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-lg">
              <Trash2 className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <h3
                id="delete-school-confirm-title"
                className="text-sm font-semibold text-foreground"
              >
                Supprimer cette école ?
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">
                  {school.code} — {school.name}
                </span>{' '}
                sera définitivement supprimée.
                <span className="block mt-1 font-medium text-destructive">
                  Cette action est irréversible.
                </span>
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground hover:bg-muted disabled:opacity-50"
            >
              Annuler
            </button>
            <button
              onClick={onConfirm}
              disabled={isSubmitting}
              className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-white hover:bg-destructive/90 disabled:opacity-50"
            >
              {isSubmitting ? 'Suppression…' : 'Supprimer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
