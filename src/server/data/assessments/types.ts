export interface Assessment {
  id: string
  school_year_id: string
  school_year_cycle_id: string
  school_year_cycle_term_id: string
  assessment_type_id: string
  name: string
  start_date: string
  end_date: string
  status: 'DRAFT' | 'ACTIVE' | 'CLOSED' | 'ARCHIVED'
  // UI helpers
  cycle_name?: string
  term_name?: string
  type_name?: string
}

export interface AssessmentSubject {
  id: string
  assessment_id: string
  school_year_level_subject_id: string
  classroom_id: string
  teacher_assignment_id: string
  name: string
  exam_date: string
  max_score: number
  coefficient: number
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED'
  // UI helpers
  subject_name?: string
  classroom_name?: string
  teacher_name?: string
}

export interface StudentAssessment {
  id: string
  assessment_subject_id: string
  student_enrollment_id: string
  raw_score?: number
  normalized_score?: number
  status: 'DRAFT' | 'SUBMITTED' | 'VALIDATED' | 'CANCELLED'
  is_absent: boolean
  is_excused: boolean
  remark?: string
  // UI helpers
  student_name?: string
  student_last_name?: string
  student_first_name?: string
  student_matricule?: string
}

export interface AssessmentsFilter {
  school_year_cycle_id?: string
  school_year_cycle_term_id?: string
  status?: Assessment['status']
}

export interface GradeEntryData {
  assessmentSubject: AssessmentSubject
  students: Array<StudentAssessment>
  stats: {
    total: number
    present: number
    absent: number
    excused: number
    avgScore: number
  }
}

export interface AssessmentsDataAdapter {
  getAssessments: (filter?: AssessmentsFilter) => Promise<Array<Assessment>>
  getAssessmentById: (id: string) => Promise<Assessment | undefined>
  createAssessment: (data: Omit<Assessment, 'id'>) => Promise<Assessment>
  updateAssessment: (
    id: string,
    updates: Partial<Assessment>,
  ) => Promise<Assessment>

  getAssessmentSubjects: (
    assessmentId: string,
  ) => Promise<Array<AssessmentSubject>>
  getAssessmentSubjectById: (
    id: string,
  ) => Promise<AssessmentSubject | undefined>
  createAssessmentSubject: (
    data: Omit<AssessmentSubject, 'id'>,
  ) => Promise<AssessmentSubject>
  updateAssessmentSubject: (
    id: string,
    updates: Partial<AssessmentSubject>,
  ) => Promise<AssessmentSubject>

  getStudentAssessments: (
    assessmentSubjectId: string,
  ) => Promise<Array<StudentAssessment>>
  getGradeEntryData: (assessmentSubjectId: string) => Promise<GradeEntryData>
  updateStudentAssessment: (
    id: string,
    updates: Partial<StudentAssessment>,
  ) => Promise<StudentAssessment>
  bulkUpdateStudentAssessments: (
    updates: Array<{ id: string; updates: Partial<StudentAssessment> }>,
  ) => Promise<Array<StudentAssessment>>
}
