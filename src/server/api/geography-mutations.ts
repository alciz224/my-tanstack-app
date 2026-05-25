import { createServerFn } from '@tanstack/react-start'
import type { City, Country, District, RegionAdministrative } from '@/server/data/geography/types'

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

export const createCityFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as Omit<City, 'id'>)
  .handler(async ({ data }) => {
    return (await import('@/server/data/geography/factory')).getGeographyService().createCity(data)
  })

export const updateCityFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as { id: string; data: Partial<City> })
  .handler(async ({ data }) => {
    return (await import('@/server/data/geography/factory')).getGeographyService().updateCity(data.id, data.data)
  })

export const deleteCityFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as { id: string })
  .handler(async ({ data }) => {
    return (await import('@/server/data/geography/factory')).getGeographyService().deleteCity(data.id)
  })

export const createDistrictFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as Omit<District, 'id'>)
  .handler(async ({ data }) => {
    return (await import('@/server/data/geography/factory')).getGeographyService().createDistrict(data)
  })

export const updateDistrictFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as { id: string; data: Partial<District> })
  .handler(async ({ data }) => {
    return (await import('@/server/data/geography/factory')).getGeographyService().updateDistrict(data.id, data.data)
  })

export const deleteDistrictFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as { id: string })
  .handler(async ({ data }) => {
    return (await import('@/server/data/geography/factory')).getGeographyService().deleteDistrict(data.id)
  })
