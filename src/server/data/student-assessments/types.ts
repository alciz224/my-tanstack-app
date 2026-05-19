export interface StudentAssessment {
  id: string
  assessment_subject_id: string
  student_enrollment_id: string
  raw_score?: number | null
  normalized_score?: number | null
  status: 'DRAFT' | 'SUBMITTED' | 'VALIDATED' | 'CANCELLED'
  is_absent: boolean
  is_excused: boolean
  remark?: string | null
}

export interface StudentAssessmentWithDetails extends StudentAssessment {
  student_name: string
  student_identifier: string
  subject_name: string
  max_score: number
}

export interface StudentAssessmentDataAdapter {
  getStudentAssessments: (
    assessmentSubjectId: string,
  ) => Promise<Array<StudentAssessment>>
  getStudentAssessment: (id: string) => Promise<StudentAssessment | null>
  getStudentAssessmentsByEnrollment: (
    enrollmentId: string,
  ) => Promise<Array<StudentAssessment>>
}
