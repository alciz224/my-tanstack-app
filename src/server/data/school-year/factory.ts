import { LocalSchoolYearAdapter } from './local.adapter'
import { ApiSchoolYearAdapter } from './api.adapter'
import type { SchoolYearDataAdapter } from './types'

export function getSchoolYearService(): SchoolYearDataAdapter {
  if (import.meta.env.VITE_LOCAL_DATA === 'true') {
    return new LocalSchoolYearAdapter()
  }
  return new ApiSchoolYearAdapter()
}
