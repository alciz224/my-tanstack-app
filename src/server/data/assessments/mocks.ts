import type { Assessment, AssessmentSubject, StudentAssessment } from './types'

export const mockAssessments: Array<Assessment> = [
  {
    id: 'ass-1',
    school_year_id: 'sy-2', // 2024-2025
    school_year_cycle_id: 'syc-1', // Primaire
    school_year_cycle_term_id: 'term-1', // Premier Trimestre
    assessment_type_id: 'type-1', // Interrogation
    name: 'Interrogation de Mi-Trimestre 1',
    start_date: '2024-10-15',
    end_date: '2024-10-20',
    status: 'ACTIVE',
    cycle_name: 'Primaire',
    term_name: 'Trimestre 1',
    type_name: 'Interrogation',
  },
  {
    id: 'ass-2',
    school_year_id: 'sy-2',
    school_year_cycle_id: 'syc-1',
    school_year_cycle_term_id: 'term-1',
    assessment_type_id: 'type-2', // Examen
    name: 'Examen Trimestriel 1',
    start_date: '2024-12-10',
    end_date: '2024-12-20',
    status: 'DRAFT',
    cycle_name: 'Primaire',
    term_name: 'Trimestre 1',
    type_name: 'Examen',
  },
]

export const mockAssessmentSubjects: Array<AssessmentSubject> = [
  {
    id: 'asub-1',
    assessment_id: 'ass-1',
    school_year_level_subject_id: 'syls-1', // Math
    classroom_id: 'c1', // 6ème A
    teacher_assignment_id: 'ta-1',
    name: 'Mathématiques - Algèbre Base',
    exam_date: '2024-10-16',
    max_score: 20,
    coefficient: 3,
    status: 'PUBLISHED',
    subject_name: 'Mathématiques',
    classroom_name: '6ème A',
    teacher_name: 'Mamadou Diallo',
  },
  {
    id: 'asub-2',
    assessment_id: 'ass-1',
    school_year_level_subject_id: 'syls-2', // Français
    classroom_id: 'c1', // 6ème A
    teacher_assignment_id: 'ta-2',
    name: 'Français - Dictée et Grammaire',
    exam_date: '2024-10-17',
    max_score: 20,
    coefficient: 3,
    status: 'DRAFT',
    subject_name: 'Français',
    classroom_name: '6ème A',
    teacher_name: 'Aïssatou Bah',
  },
]

export const mockStudentAssessments: Array<StudentAssessment> = [
  {
    id: 'sass-1',
    assessment_subject_id: 'asub-1',
    student_enrollment_id: 'st-1',
    raw_score: 16.5,
    status: 'VALIDATED',
    is_absent: false,
    is_excused: false,
    student_name: 'Amadou Bah',
    student_matricule: 'MAT-2024-001',
  },
  {
    id: 'sass-2',
    assessment_subject_id: 'asub-1',
    student_enrollment_id: 'st-2',
    status: 'SUBMITTED',
    is_absent: true,
    is_excused: true,
    remark: 'Certificat médical fourni',
    student_name: 'Mariama Sylla',
    student_matricule: 'MAT-2024-002',
  },
  {
    id: 'sass-3',
    assessment_subject_id: 'asub-1',
    student_enrollment_id: 'st-3',
    raw_score: 8,
    status: 'SUBMITTED',
    is_absent: false,
    is_excused: false,
    student_name: 'Ibrahima Sory Keita',
    student_matricule: 'MAT-2024-003',
  },
]
