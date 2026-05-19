import type { StudentAssessment } from './types'

export const mockStudentAssessments: Array<StudentAssessment> = [
  // Assessment Subject 1 - Math exam for class 7-1
  {
    id: 'sa-1',
    assessment_subject_id: 'as-1',
    student_enrollment_id: 'enroll-1',
    raw_score: 14.5,
    normalized_score: 14.5,
    status: 'VALIDATED',
    is_absent: false,
    is_excused: false,
  },
  {
    id: 'sa-2',
    assessment_subject_id: 'as-1',
    student_enrollment_id: 'enroll-2',
    raw_score: 16,
    normalized_score: 16,
    status: 'VALIDATED',
    is_absent: false,
    is_excused: false,
  },
  {
    id: 'sa-3',
    assessment_subject_id: 'as-1',
    student_enrollment_id: 'enroll-3',
    raw_score: 12,
    normalized_score: 12,
    status: 'VALIDATED',
    is_absent: false,
    is_excused: false,
  },
  {
    id: 'sa-4',
    assessment_subject_id: 'as-1',
    student_enrollment_id: 'enroll-4',
    raw_score: null,
    normalized_score: null,
    status: 'SUBMITTED',
    is_absent: true,
    is_excused: false,
    remark: 'Absent maladie',
  },
  {
    id: 'sa-5',
    assessment_subject_id: 'as-1',
    student_enrollment_id: 'enroll-5',
    raw_score: 18,
    normalized_score: 18,
    status: 'DRAFT',
    is_absent: false,
    is_excused: false,
  },
  {
    id: 'sa-6',
    assessment_subject_id: 'as-1',
    student_enrollment_id: 'enroll-6',
    raw_score: 10,
    normalized_score: 10,
    status: 'VALIDATED',
    is_absent: false,
    is_excused: false,
  },
]

export type { StudentAssessment } from './types'
