import { mockStudentAssessments } from './mocks'
import type { StudentAssessmentDataAdapter } from './types'
import type { StudentAssessment } from './types'

export class LocalStudentAssessmentAdapter implements StudentAssessmentDataAdapter {
  private assessments = [...mockStudentAssessments]

  private async delay(ms = 300) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async getStudentAssessments(
    assessmentSubjectId: string,
  ): Promise<Array<StudentAssessment>> {
    await this.delay()
    return this.assessments.filter(
      (sa) => sa.assessment_subject_id === assessmentSubjectId,
    )
  }

  async getStudentAssessment(id: string): Promise<StudentAssessment | null> {
    await this.delay()
    return this.assessments.find((sa) => sa.id === id) || null
  }

  async getStudentAssessmentsByEnrollment(
    enrollmentId: string,
  ): Promise<Array<StudentAssessment>> {
    await this.delay()
    return this.assessments.filter(
      (sa) => sa.student_enrollment_id === enrollmentId,
    )
  }
}
