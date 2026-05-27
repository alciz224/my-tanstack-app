import { LocalStudentAssessmentAdapter } from './local.adapter'
import { ApiStudentAssessmentAdapter } from './api.adapter'
import type { StudentAssessmentDataAdapter } from './types'

export function getStudentAssessmentService(): StudentAssessmentDataAdapter {
  if (import.meta.env.VITE_LOCAL_DATA === 'true') {
    return new LocalStudentAssessmentAdapter()
  }
  return new ApiStudentAssessmentAdapter()
}
