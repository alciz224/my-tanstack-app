import { LocalSchoolsAdapter } from './local.adapter'
import { ApiSchoolsAdapter } from './api.adapter'
import type { SchoolsDataAdapter } from './types'

export function getSchoolsService(): SchoolsDataAdapter {
  if (
    process.env.VITE_LOCAL_DATA === 'true' ||
    process.env.NODE_ENV !== 'production'
  ) {
    return new LocalSchoolsAdapter()
  }
  return new ApiSchoolsAdapter()
}
