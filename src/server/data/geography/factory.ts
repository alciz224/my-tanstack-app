import { LocalGeographyAdapter } from './local.adapter'
import { ApiGeographyAdapter } from './api.adapter'
import type { GeographyDataAdapter } from './types'

export function getGeographyService(): GeographyDataAdapter {
  if (import.meta.env.VITE_LOCAL_DATA === 'true') {
    return new LocalGeographyAdapter()
  }
  return new ApiGeographyAdapter()
}
