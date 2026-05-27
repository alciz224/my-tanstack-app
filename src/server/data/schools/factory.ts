import { LocalSchoolsAdapter } from './local.adapter'
import { ApiSchoolsAdapter } from './api.adapter'
import type { SchoolsDataAdapter } from './types'

export function getSchoolsService(): SchoolsDataAdapter {
  if (import.meta.env.VITE_LOCAL_DATA === 'true') {
    return new LocalSchoolsAdapter()
  }
  return new ApiSchoolsAdapter()
}
