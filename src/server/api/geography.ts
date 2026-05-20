import { createServerFn } from '@tanstack/react-start'

export const getCountriesFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    return (await import('@/server/data/geography/factory')).getGeographyService().getCountries()
  },
)

export const getRegionsFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    return (await import('@/server/data/geography/factory')).getGeographyService().getRegions()
  },
)

export const getAdministrativeUnitsFn = createServerFn({
  method: 'GET',
}).handler(async () => {
  return (await import('@/server/data/geography/factory')).getGeographyService().getAdministrativeUnits()
})

export const getLocalitiesFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    return (await import('@/server/data/geography/factory')).getGeographyService().getLocalities()
  },
)
