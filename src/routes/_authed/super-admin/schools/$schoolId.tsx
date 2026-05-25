import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowLeft,
  BookOpen,
  Building2,
  Edit,
  Globe,
  GraduationCap,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Trash2,
  Users,
} from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { useState, useMemo } from 'react'
import { getSchoolByIdFn, updateSchoolFn, deleteSchoolFn } from '@/server/api/schools'
import {
  getRegionsFn,
  getCitiesFn,
  getDistrictsFn,
} from '@/server/api/geography'
import { geographyKeys } from '@/lib/query-client'
import { schoolOpsKeys } from '@/lib/query-client'
import { toast } from '@/stores/toastStore'
import type { School } from '@/server/data/schools/types'
import { CreateEditSchoolModal, DeleteSchoolConfirm } from './index'

export const Route = createFileRoute('/_authed/super-admin/schools/$schoolId')({
  component: SchoolDetailPage,
})

function SchoolDetailPage() {
  const { schoolId } = Route.useParams()
  const queryClient = useQueryClient()
  const getSchool = useServerFn(getSchoolByIdFn)
  const getRegions = useServerFn(getRegionsFn)
  const getCities = useServerFn(getCitiesFn)
  const getDistricts = useServerFn(getDistrictsFn)

  const [editing, setEditing] = useState<School | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<School | null>(null)

  const { data: school, isLoading } = useQuery({
    queryKey: schoolOpsKeys.school(schoolId),
    queryFn: () => getSchool({ data: schoolId }),
  })

  const { data: regions } = useQuery({
    queryKey: geographyKeys.regionsList(),
    queryFn: () => getRegions(),
  })
  const { data: cities } = useQuery({
    queryKey: geographyKeys.citiesList(),
    queryFn: () => getCities(),
  })
  const { data: districts } = useQuery({
    queryKey: geographyKeys.districtsList(),
    queryFn: () => getDistricts(),
  })

  const regionAndCity = useMemo(() => {
    if (!districts || !cities || !regions || !school) return null
    const district = districts.find((d) => d.id === school.district_id)
    if (!district) return null
    const city = cities.find((c) => c.id === district.city_id)
    if (!city) return null
    const region = regions.find((r) => r.id === city.region_id)
    return { region: region?.name ?? null, city: city.name }
  }, [districts, cities, regions, school])

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: schoolOpsKeys.schools() })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<School> }) => {
      return await updateSchoolFn({ id, data })
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
      await deleteSchoolFn({ id })
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!school) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        École non trouvée.
        <br />
        <Link to="/super-admin/schools" className="text-primary hover:underline mt-2 inline-block">
          Retour à la liste
        </Link>
      </div>
    )
  }

  const setDeleteSchool = () => setDeleteConfirm(school)

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <Link
          to="/super-admin/schools"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour à la liste des écoles
        </Link>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-lg">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white/20 flex items-center justify-center text-white border border-white/20 shadow-sm backdrop-blur-sm">
            <Building2 className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                {school.name}
              </h1>
            </div>
            <p className="text-white/80 font-mono text-sm mb-2">{school.code}</p>
            {school.address && (
              <span className="flex items-center text-sm text-white/90">
                <MapPin className="w-4 h-4 mr-1.5 text-white/70" /> {school.address}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={() => setEditing(school)}
            className="flex-1 sm:flex-none items-center justify-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white border border-white/20 rounded-lg font-medium transition-colors hover-scale flex backdrop-blur-sm"
          >
            <Edit className="w-4 h-4" />
            <span>Modifier</span>
          </button>
          <button
            onClick={setDeleteSchool}
            className="flex-1 sm:flex-none items-center justify-center gap-2 px-4 py-2 bg-red-500/30 hover:bg-red-500/50 text-white border border-white/20 rounded-lg font-medium transition-colors hover-scale flex backdrop-blur-sm"
          >
            <Trash2 className="w-4 h-4" />
            <span>Supprimer</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-card border border-border rounded-lg p-5 flex flex-col items-center justify-center text-center hover-lift">
              <Users className="w-6 h-6 text-primary mb-2" />
              <span className="text-2xl font-bold text-foreground mb-1">—</span>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Élèves</span>
            </div>
            <div className="bg-card border border-border rounded-lg p-5 flex flex-col items-center justify-center text-center hover-lift">
              <GraduationCap className="w-6 h-6 text-secondary mb-2" />
              <span className="text-2xl font-bold text-foreground mb-1">—</span>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Enseignants</span>
            </div>
            <div className="bg-card border border-border rounded-lg p-5 flex flex-col items-center justify-center text-center hover-lift">
              <BookOpen className="w-6 h-6 text-accent mb-2" />
              <span className="text-2xl font-bold text-foreground mb-1">—</span>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Salles</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 hover-lift">
            <h2 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">
              Informations
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Code</p>
                <p className="font-medium text-foreground">{school.code}</p>
              </div>
              {regionAndCity && (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Région</p>
                    <p className="font-medium text-foreground flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-muted-foreground" /> {regionAndCity.region}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Ville / Commune</p>
                    <p className="font-medium text-foreground">{regionAndCity.city}</p>
                  </div>
                </>
              )}
              {school.website && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Site web</p>
                  <p className="font-medium text-foreground">{school.website}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-lg p-6 hover-lift">
            <h2 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">
              Coordonnées
            </h2>
            <div className="space-y-4">
              {school.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Adresse</p>
                    <p className="text-sm text-muted-foreground">{school.address}</p>
                  </div>
                </div>
              )}
              {school.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Téléphone</p>
                    <p className="text-sm text-muted-foreground">{school.phone}</p>
                  </div>
                </div>
              )}
              {school.email && (
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Email</p>
                    <a href={`mailto:${school.email}`} className="text-sm text-primary hover:underline">
                      {school.email}
                    </a>
                  </div>
                </div>
              )}
              {!school.address && !school.phone && !school.email && (
                <p className="text-sm text-muted-foreground">Aucune coordonnée renseignée.</p>
              )}
            </div>
          </div>

          <div className="bg-card border border-border rounded-lg p-6 hover-lift">
            <h2 className="text-lg font-semibold text-foreground mb-4 border-b border-border pb-2">
              Accès Rapide
            </h2>
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors group cursor-not-allowed opacity-70">
                <div className="flex items-center gap-3 text-foreground/80 group-hover:text-foreground">
                  <Users className="w-4 h-4" />
                  <span className="text-sm font-medium">Gérer le personnel</span>
                </div>
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors group cursor-not-allowed opacity-70">
                <div className="flex items-center gap-3 text-foreground/80 group-hover:text-foreground">
                  <GraduationCap className="w-4 h-4" />
                  <span className="text-sm font-medium">Gérer les élèves</span>
                </div>
              </button>
              <button className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors group cursor-not-allowed opacity-70">
                <div className="flex items-center gap-3 text-foreground/80 group-hover:text-foreground">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm font-medium">Programmes académiques</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {editing && (
        <CreateEditSchoolModal
          school={editing}
          isSubmitting={updateMutation.isPending}
          onClose={() => setEditing(null)}
          onSubmit={(data) =>
            updateMutation.mutate(data as { id: string; data: Partial<School> })
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
