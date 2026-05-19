import { createServerFn } from '@tanstack/react-start'
import { getGeographyService } from '@/server/data/geography/factory'

export const getCountriesFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    return getGeographyService().getCountries()
  },
)

export const getRegionsFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    return getGeographyService().getRegions()
  },
)

export const getAdministrativeUnitsFn = createServerFn({
  method: 'GET',
}).handler(async () => {
  return getGeographyService().getAdministrativeUnits()
})

export const getLocalitiesFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    return getGeographyService().getLocalities()
  },
)
