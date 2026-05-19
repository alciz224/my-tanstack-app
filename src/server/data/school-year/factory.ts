import { LocalSchoolYearAdapter } from './local.adapter'
import { ApiSchoolYearAdapter } from './api.adapter'
import type { SchoolYearDataAdapter } from './types'

export function getSchoolYearService(): SchoolYearDataAdapter {
  if (
    process.env.VITE_LOCAL_DATA === 'true' ||
    process.env.NODE_ENV !== 'production'
  ) {
    return new LocalSchoolYearAdapter()
  }
  return new ApiSchoolYearAdapter()
}
