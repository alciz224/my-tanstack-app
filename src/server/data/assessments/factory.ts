import { LocalAssessmentsAdapter } from './local.adapter'
import { ApiAssessmentsAdapter } from './api.adapter'
import type { AssessmentsDataAdapter } from './types'

export function getAssessmentsService(): AssessmentsDataAdapter {
  if (
    process.env.VITE_LOCAL_DATA === 'true' ||
    process.env.NODE_ENV !== 'production'
  ) {
    return new LocalAssessmentsAdapter()
  }
  return new ApiAssessmentsAdapter()
}
