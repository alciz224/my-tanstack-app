/**
 * Student Assessment API Server Functions
 *
 * Server functions for Student Assessment (grades) data endpoints.
 */

import { createServerFn } from '@tanstack/react-start'

export const getStudentAssessmentsFn = createServerFn({ method: 'GET' })
  .inputValidator((assessmentSubjectId: string) => assessmentSubjectId)
  .handler(async ({ data: assessmentSubjectId }) => {
    return (await import('@/server/data/student-assessments/factory')).getStudentAssessmentService().getStudentAssessments(
      assessmentSubjectId,
    )
  })

export const getStudentAssessmentFn = createServerFn({ method: 'GET' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    return (await import('@/server/data/student-assessments/factory')).getStudentAssessmentService().getStudentAssessment(id)
  })

export const getStudentAssessmentsByEnrollmentFn = createServerFn({
  method: 'GET',
})
  .inputValidator((enrollmentId: string) => enrollmentId)
  .handler(async ({ data: enrollmentId }) => {
    return (await import('@/server/data/student-assessments/factory')).getStudentAssessmentService().getStudentAssessmentsByEnrollment(
      enrollmentId,
    )
  })
