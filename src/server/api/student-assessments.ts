/**
 * Student Assessment API Server Functions
 *
 * Server functions for Student Assessment (grades) data endpoints.
 */

import { createServerFn } from '@tanstack/react-start'
import { getStudentAssessmentService } from '@/server/data/student-assessments/factory'

export const getStudentAssessmentsFn = createServerFn({ method: 'GET' })
  .inputValidator((assessmentSubjectId: string) => assessmentSubjectId)
  .handler(async ({ data: assessmentSubjectId }) => {
    return getStudentAssessmentService().getStudentAssessments(
      assessmentSubjectId,
    )
  })

export const getStudentAssessmentFn = createServerFn({ method: 'GET' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    return getStudentAssessmentService().getStudentAssessment(id)
  })

export const getStudentAssessmentsByEnrollmentFn = createServerFn({
  method: 'GET',
})
  .inputValidator((enrollmentId: string) => enrollmentId)
  .handler(async ({ data: enrollmentId }) => {
    return getStudentAssessmentService().getStudentAssessmentsByEnrollment(
      enrollmentId,
    )
  })
