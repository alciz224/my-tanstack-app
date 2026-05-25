import { createServerFn } from '@tanstack/react-start'

export const getCountriesFn = createServerFn({ method: 'GET' }).handler(async () => {
  return (await import('@/server/data/geography/factory')).getGeographyService().getCountries()
})

export const getRegionsFn = createServerFn({ method: 'GET' }).handler(async () => {
  return (await import('@/server/data/geography/factory')).getGeographyService().getRegions()
})

export const getCitiesFn = createServerFn({ method: 'GET' }).handler(async () => {
  return (await import('@/server/data/geography/factory')).getGeographyService().getCities()
})

export const getDistrictsFn = createServerFn({ method: 'GET' }).handler(async () => {
  return (await import('@/server/data/geography/factory')).getGeographyService().getDistricts()
})
