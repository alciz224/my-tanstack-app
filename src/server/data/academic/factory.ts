import { LocalAcademicAdapter } from './local.adapter'
import { ApiAcademicAdapter } from './api.adapter'
import type { AcademicDataAdapter } from './types'

export function getAcademicService(): AcademicDataAdapter {
  if (
    process.env.VITE_LOCAL_DATA === 'true' ||
    process.env.NODE_ENV !== 'production'
  ) {
    return new LocalAcademicAdapter()
  }
  return new ApiAcademicAdapter()
}
