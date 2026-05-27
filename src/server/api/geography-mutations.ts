import { createServerFn } from '@tanstack/react-start'
import type { AdministrativeUnit, Country, Locality, RegionAdministrative } from '@/server/data/geography/types'

export const createCountryFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as Omit<Country, 'id'>)
  .handler(async ({ data }) => {
    return (await import('@/server/data/geography/factory')).getGeographyService().createCountry(data)
  })

export const updateCountryFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as { id: string; data: Partial<Country> })
  .handler(async ({ data }) => {
    return (await import('@/server/data/geography/factory')).getGeographyService().updateCountry(data.id, data.data)
  })

export const deleteCountryFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as { id: string })
  .handler(async ({ data }) => {
    return (await import('@/server/data/geography/factory')).getGeographyService().deleteCountry(data.id)
  })

export const createRegionFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as Omit<RegionAdministrative, 'id'>)
  .handler(async ({ data }) => {
    return (await import('@/server/data/geography/factory')).getGeographyService().createRegion(data)
  })

export const updateRegionFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as { id: string; data: Partial<RegionAdministrative> })
  .handler(async ({ data }) => {
    return (await import('@/server/data/geography/factory')).getGeographyService().updateRegion(data.id, data.data)
  })

export const deleteRegionFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as { id: string })
  .handler(async ({ data }) => {
    return (await import('@/server/data/geography/factory')).getGeographyService().deleteRegion(data.id)
  })

export const createAdministrativeUnitFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as Omit<AdministrativeUnit, 'id'>)
  .handler(async ({ data }) => {
    return (await import('@/server/data/geography/factory')).getGeographyService().createAdministrativeUnit(data)
  })

export const updateAdministrativeUnitFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as { id: string; data: Partial<AdministrativeUnit> })
  .handler(async ({ data }) => {
    return (await import('@/server/data/geography/factory')).getGeographyService().updateAdministrativeUnit(data.id, data.data)
  })

export const deleteAdministrativeUnitFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as { id: string })
  .handler(async ({ data }) => {
    return (await import('@/server/data/geography/factory')).getGeographyService().deleteAdministrativeUnit(data.id)
  })

export const createLocalityFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as Omit<Locality, 'id'>)
  .handler(async ({ data }) => {
    return (await import('@/server/data/geography/factory')).getGeographyService().createLocality(data)
  })

export const updateLocalityFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as { id: string; data: Partial<Locality> })
  .handler(async ({ data }) => {
    return (await import('@/server/data/geography/factory')).getGeographyService().updateLocality(data.id, data.data)
  })

export const deleteLocalityFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as { id: string })
  .handler(async ({ data }) => {
    return (await import('@/server/data/geography/factory')).getGeographyService().deleteLocality(data.id)
  })
