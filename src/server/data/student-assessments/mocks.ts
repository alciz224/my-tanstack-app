import type { StudentAssessment } from './types'

const CLASSROOMS = [
  'c1',
  'c2',
  'c3',
  'c4',
  'c5',
  'c7',
  'c8',
  'c9',
  'c11',
  'c13',
]
const SCORES = [
  14.5, 16, 12, 18, 10, 15, 13.5, 11, 17, 9, 14, 12.5, 16.5, 10.5, 13,
]
const STATUSES: Array<'VALIDATED' | 'SUBMITTED' | 'DRAFT'> = [
  'VALIDATED',
  'SUBMITTED',
  'DRAFT',
]

function generateStudentAssessments(): Array<StudentAssessment> {
  const results: Array<StudentAssessment> = []
  let idCounter = 1

  for (const classroomId of CLASSROOMS) {
    for (let i = 1; i <= 15; i++) {
      const isAbsent = i === 4 || i === 12
      const isExcused = i === 9
      const hasScore = !isAbsent && !isExcused
      const scoreIndex = (i - 1) % SCORES.length

      results.push({
        id: `sa-${idCounter++}`,
        assessment_subject_id: `as-${classroomId === 'c1' ? '1' : classroomId === 'c2' ? '2' : classroomId === 'c3' ? '3' : classroomId === 'c4' ? '4' : classroomId === 'c5' ? '5' : classroomId === 'c7' ? '6' : classroomId === 'c8' ? '7' : classroomId === 'c9' ? '8' : classroomId === 'c11' ? '9' : '10'}`,
        student_enrollment_id: `${classroomId}-stu-${i}`,
        raw_score: hasScore ? SCORES[scoreIndex] : null,
        normalized_score: hasScore ? SCORES[scoreIndex] : null,
        status: isAbsent ? 'SUBMITTED' : pick(STATUSES),
        is_absent: isAbsent,
        is_excused: isExcused,
        remark: isAbsent
          ? 'Absent maladie'
          : isExcused
            ? 'Certificat médical fourni'
            : undefined,
      })
    }
  }

  return results
}

function pick<T>(arr: Array<T>): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export const mockStudentAssessments: Array<StudentAssessment> =
  generateStudentAssessments()

export type { StudentAssessment } from './types'
