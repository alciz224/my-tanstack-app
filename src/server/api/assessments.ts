import { createServerFn } from '@tanstack/react-start'
import type {
  Assessment,
  AssessmentSubject,
  AssessmentsFilter,
  StudentAssessment,
} from '@/server/data/assessments/types'
import { getAssessmentsService } from '@/server/data/assessments/factory'

export const getAssessmentsFn = createServerFn({ method: 'GET' })
  .inputValidator((filter: AssessmentsFilter | undefined) => filter)
  .handler(async ({ data: filter }): Promise<Array<Assessment>> => {
    return getAssessmentsService().getAssessments(filter)
  })

export const getAssessmentByIdFn = createServerFn({ method: 'GET' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }): Promise<Assessment | undefined> => {
    return getAssessmentsService().getAssessmentById(id)
  })

export const createAssessmentFn = createServerFn({ method: 'POST' })
  .inputValidator((data: Omit<Assessment, 'id'>) => data)
  .handler(async ({ data }): Promise<Assessment> => {
    return getAssessmentsService().createAssessment(data)
  })

export const updateAssessmentFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string; updates: Partial<Assessment> }) => data)
  .handler(async ({ data: { id, updates } }): Promise<Assessment> => {
    return getAssessmentsService().updateAssessment(id, updates)
  })

export const getAssessmentSubjectsFn = createServerFn({ method: 'GET' })
  .inputValidator((assessmentId: string) => assessmentId)
  .handler(
    async ({ data: assessmentId }): Promise<Array<AssessmentSubject>> => {
      return getAssessmentsService().getAssessmentSubjects(assessmentId)
    },
  )

export const createAssessmentSubjectFn = createServerFn({ method: 'POST' })
  .inputValidator((data: Omit<AssessmentSubject, 'id'>) => data)
  .handler(async ({ data }): Promise<AssessmentSubject> => {
    return getAssessmentsService().createAssessmentSubject(data)
  })

export const updateAssessmentSubjectFn = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { id: string; updates: Partial<AssessmentSubject> }) => data,
  )
  .handler(async ({ data: { id, updates } }): Promise<AssessmentSubject> => {
    return getAssessmentsService().updateAssessmentSubject(id, updates)
  })

export const getStudentAssessmentsFn = createServerFn({ method: 'GET' })
  .inputValidator((assessmentSubjectId: string) => assessmentSubjectId)
  .handler(
    async ({
      data: assessmentSubjectId,
    }): Promise<Array<StudentAssessment>> => {
      return getAssessmentsService().getStudentAssessments(assessmentSubjectId)
    },
  )

export const updateStudentAssessmentFn = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { id: string; updates: Partial<StudentAssessment> }) => data,
  )
  .handler(async ({ data: { id, updates } }): Promise<StudentAssessment> => {
    return getAssessmentsService().updateStudentAssessment(id, updates)
  })
