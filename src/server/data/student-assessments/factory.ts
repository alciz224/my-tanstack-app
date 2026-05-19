import { LocalStudentAssessmentAdapter } from './local.adapter'
import { ApiStudentAssessmentAdapter } from './api.adapter'
import type { StudentAssessmentDataAdapter } from './types'

export function getStudentAssessmentService(): StudentAssessmentDataAdapter {
  if (
    process.env.VITE_LOCAL_DATA === 'true' ||
    process.env.NODE_ENV !== 'production'
  ) {
    return new LocalStudentAssessmentAdapter()
  }
  return new ApiStudentAssessmentAdapter()
}
