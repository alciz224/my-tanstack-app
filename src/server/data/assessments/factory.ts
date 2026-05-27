import { LocalAssessmentsAdapter } from './local.adapter'
import { ApiAssessmentsAdapter } from './api.adapter'
import type { AssessmentsDataAdapter } from './types'

export function getAssessmentsService(): AssessmentsDataAdapter {
  if (import.meta.env.VITE_LOCAL_DATA === 'true') {
    return new LocalAssessmentsAdapter()
  }
  return new ApiAssessmentsAdapter()
}
