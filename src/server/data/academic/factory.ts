import { LocalAcademicAdapter } from './local.adapter'
import { ApiAcademicAdapter } from './api.adapter'
import type { AcademicDataAdapter } from './types'

export function getAcademicService(): AcademicDataAdapter {
  return import.meta.env.VITE_LOCAL_DATA === 'true'
    ? new LocalAcademicAdapter()
    : new ApiAcademicAdapter()
}
