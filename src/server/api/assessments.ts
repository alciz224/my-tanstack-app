import { createServerFn } from '@tanstack/react-start'
import type {
  Assessment,
  AssessmentSubject,
  AssessmentsFilter,
  GradeEntryData,
  StudentAssessment,
} from '@/server/data/assessments/types'

export const getAssessmentsFn = createServerFn({ method: 'GET' })
  .inputValidator((filter: AssessmentsFilter | undefined) => filter)
  .handler(async ({ data: filter }): Promise<Array<Assessment>> => {
    return (await import('@/server/data/assessments/factory')).getAssessmentsService().getAssessments(filter)
  })

export const getAssessmentByIdFn = createServerFn({ method: 'GET' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }): Promise<Assessment | undefined> => {
    return (await import('@/server/data/assessments/factory')).getAssessmentsService().getAssessmentById(id)
  })

export const createAssessmentFn = createServerFn({ method: 'POST' })
  .inputValidator((data: Omit<Assessment, 'id'>) => data)
  .handler(async ({ data }): Promise<Assessment> => {
    return (await import('@/server/data/assessments/factory')).getAssessmentsService().createAssessment(data)
  })

export const updateAssessmentFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string; updates: Partial<Assessment> }) => data)
  .handler(async ({ data: { id, updates } }): Promise<Assessment> => {
    return (await import('@/server/data/assessments/factory')).getAssessmentsService().updateAssessment(id, updates)
  })

export const getAssessmentSubjectsFn = createServerFn({ method: 'GET' })
  .inputValidator((assessmentId: string) => assessmentId)
  .handler(
    async ({ data: assessmentId }): Promise<Array<AssessmentSubject>> => {
      return (await import('@/server/data/assessments/factory')).getAssessmentsService().getAssessmentSubjects(assessmentId)
    },
  )

export const getAssessmentSubjectByIdFn = createServerFn({ method: 'GET' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }): Promise<AssessmentSubject | undefined> => {
    return (await import('@/server/data/assessments/factory')).getAssessmentsService().getAssessmentSubjectById(id)
  })

export const createAssessmentSubjectFn = createServerFn({ method: 'POST' })
  .inputValidator((data: Omit<AssessmentSubject, 'id'>) => data)
  .handler(async ({ data }): Promise<AssessmentSubject> => {
    return (await import('@/server/data/assessments/factory')).getAssessmentsService().createAssessmentSubject(data)
  })

export const updateAssessmentSubjectFn = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { id: string; updates: Partial<AssessmentSubject> }) => data,
  )
  .handler(async ({ data: { id, updates } }): Promise<AssessmentSubject> => {
    return (await import('@/server/data/assessments/factory')).getAssessmentsService().updateAssessmentSubject(id, updates)
  })

export const getStudentAssessmentsFn = createServerFn({ method: 'GET' })
  .inputValidator((assessmentSubjectId: string) => assessmentSubjectId)
  .handler(
    async ({
      data: assessmentSubjectId,
    }): Promise<Array<StudentAssessment>> => {
      return (await import('@/server/data/assessments/factory')).getAssessmentsService().getStudentAssessments(assessmentSubjectId)
    },
  )

export const getGradeEntryDataFn = createServerFn({ method: 'GET' })
  .inputValidator((assessmentSubjectId: string) => assessmentSubjectId)
  .handler(async ({ data: assessmentSubjectId }): Promise<GradeEntryData> => {
    return (await import('@/server/data/assessments/factory')).getAssessmentsService().getGradeEntryData(assessmentSubjectId)
  })

export const updateStudentAssessmentFn = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { id: string; updates: Partial<StudentAssessment> }) => data,
  )
  .handler(async ({ data: { id, updates } }): Promise<StudentAssessment> => {
    return (await import('@/server/data/assessments/factory')).getAssessmentsService().updateStudentAssessment(id, updates)
  })

export const bulkUpdateStudentAssessmentsFn = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: Array<{ id: string; updates: Partial<StudentAssessment> }>) => data,
  )
  .handler(async ({ data: updates }): Promise<Array<StudentAssessment>> => {
    return (await import('@/server/data/assessments/factory')).getAssessmentsService().bulkUpdateStudentAssessments(updates)
  })
