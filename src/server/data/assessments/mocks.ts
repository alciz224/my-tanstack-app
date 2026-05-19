import type { Assessment, AssessmentSubject, StudentAssessment } from './types'

export const mockAssessments: Array<Assessment> = [
  {
    id: 'ass-1',
    school_year_id: 'sy-2',
    school_year_cycle_id: 'syc-1',
    school_year_cycle_term_id: 'term-1',
    assessment_type_id: 'type-1',
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
    assessment_type_id: 'type-2',
    name: 'Examen Trimestriel 1',
    start_date: '2024-12-10',
    end_date: '2024-12-20',
    status: 'DRAFT',
    cycle_name: 'Primaire',
    term_name: 'Trimestre 1',
    type_name: 'Examen',
  },
  {
    id: 'ass-3',
    school_year_id: 'sy-2',
    school_year_cycle_id: 'syc-2',
    school_year_cycle_term_id: 'term-1',
    assessment_type_id: 'type-1',
    name: 'Composition du 1er Trimestre',
    start_date: '2024-11-15',
    end_date: '2024-11-25',
    status: 'ACTIVE',
    cycle_name: 'Collège',
    term_name: 'Trimestre 1',
    type_name: 'Composition',
  },
]

export const mockAssessmentSubjects: Array<AssessmentSubject> = [
  {
    id: 'asub-1',
    assessment_id: 'ass-1',
    school_year_level_subject_id: 'syls-1',
    classroom_id: 'c1',
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
    school_year_level_subject_id: 'syls-2',
    classroom_id: 'c1',
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
  {
    id: 'asub-3',
    assessment_id: 'ass-3',
    school_year_level_subject_id: 'syls-10',
    classroom_id: 'c2',
    teacher_assignment_id: 'ta-1',
    name: 'Mathématiques - Géométrie',
    exam_date: '2024-11-18',
    max_score: 20,
    coefficient: 4,
    status: 'PUBLISHED',
    subject_name: 'Mathématiques',
    classroom_name: '5ème A',
    teacher_name: 'Mamadou Diallo',
  },
]

const generateStudentAssessments = (
  assessmentSubjectId: string,
  classroomId: string,
): Array<StudentAssessment> => {
  const studentNames = [
    { last: 'Barry', first: 'Mamadou' },
    { last: 'Camara', first: 'Fatoumata' },
    { last: 'Diallo', first: 'Alpha' },
    { last: 'Sylla', first: 'Mariama' },
    { last: 'Kéita', first: 'Moussa' },
    { last: 'Bangoura', first: 'Moussa' },
    { last: 'Soumah', first: 'Mamadou' },
    { last: 'Touré', first: 'Ibrahim' },
    { last: 'Camara', first: 'Kadiatou' },
    { last: 'Baldé', first: 'Oumar' },
    { last: 'Fofana', first: 'Aminata' },
    { last: 'Condé', first: 'Moussa' },
    { last: 'Doumbouya', first: 'Mamadou' },
    { last: 'Yansané', first: 'Aïssatou' },
    { last: 'Koulibaly', first: 'Abdou' },
  ]

  return studentNames.map((student, index) => {
    const isAbsent = index === 3
    const isExcused = index === 8
    const hasScore = !isAbsent && !isExcused
    const scores = [
      14.5, 16, 12, 18, 10, 15, 13.5, 11, 17, 9, 14, 12.5, 16.5, 10.5, 13,
    ]
    const rawScore = hasScore ? scores[index % scores.length] : undefined

    return {
      id: `${assessmentSubjectId}-stu-${index + 1}`,
      assessment_subject_id: assessmentSubjectId,
      student_enrollment_id: `${classroomId}-stu-${index + 1}`,
      raw_score: rawScore,
      status: rawScore ? ('SUBMITTED' as const) : ('DRAFT' as const),
      is_absent: isAbsent,
      is_excused: isExcused,
      remark: isExcused ? 'Certificat médical fourni' : undefined,
      student_name: `${student.first} ${student.last}`,
      student_last_name: student.last,
      student_first_name: student.first,
      student_matricule: `EXC-2025-${String(index + 1).padStart(3, '0')}`,
    }
  })
}

export const mockStudentAssessments: Array<StudentAssessment> = [
  ...generateStudentAssessments('asub-1', 'c1'),
  ...generateStudentAssessments('asub-3', 'c2'),
]

export function getStudentAssessmentsBySubject(
  assessmentSubjectId: string,
): Array<StudentAssessment> {
  return mockStudentAssessments.filter(
    (g) => g.assessment_subject_id === assessmentSubjectId,
  )
}
