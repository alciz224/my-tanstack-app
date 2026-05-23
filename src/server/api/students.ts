import { createServerFn } from '@tanstack/react-start'
import type { StudentsFilter } from '@/server/data/students/types'
import type { EnrollmentStatus, Student } from '@/server/data/students/mocks'

export type { Student }

export interface PublicStudent {
  id: string
  annual_identifier: string
  full_name: string
  photo_url: string | null
  academic_year: string
  cycle: string
  level: string
  class_name: string
  enrollment_status: EnrollmentStatus
  parent_phone?: string | null
  school_phone?: string | null
  school_email?: string | null
}

export const getPublicStudentCardInfoFn = createServerFn({ method: 'GET' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }): Promise<PublicStudent | undefined> => {
    const student = await (await import('@/server/data/students/factory'))
      .getStudentsService()
      .getStudentById(id)

    if (!student) return undefined

    // For now we use the first school's info as default for mock data
    // In a real multi-tenant app, we would look up the school associated with the student
    const schoolPhone = '+224 622 12 34 56'
    const schoolEmail = 'contact@excellence.edu.gn'

    return {
      id: student.id,
      annual_identifier: student.annual_identifier,
      full_name: student.full_name,
      photo_url: student.photo_url,
      academic_year: student.academic_year,
      cycle: student.cycle,
      level: student.level,
      class_name: student.class_name,
      enrollment_status: student.enrollment_status,
      parent_phone: student.parent_phone,
      school_phone: schoolPhone,
      school_email: schoolEmail,
    }
  })

export const getStudentsFn = createServerFn({ method: 'GET' })
  .inputValidator((d: unknown) => d as StudentsFilter | undefined)
  .handler(async ({ data: filter }): Promise<Array<Student>> => {
    // Per skill pattern: call (await import('@/server/data/students/factory')).getStudentsService() inside handler, never at module top-level
    const service = (
      await import('@/server/data/students/factory')
    ).getStudentsService()
    return service.getStudents(filter ?? undefined)
  })

export const getStudentByIdFn = createServerFn({ method: 'GET' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }): Promise<Student | undefined> => {
    return (await import('@/server/data/students/factory'))
      .getStudentsService()
      .getStudentById(id)
  })

export const findSimilarStudentsFn = createServerFn({ method: 'GET' })
  .inputValidator(
    (d: unknown) =>
      d as { firstName: string; lastName: string; currentYear?: string },
  )
  .handler(async ({ data }): Promise<Array<Student>> => {
    const { firstName, lastName, currentYear } = data
    if (!firstName && !lastName) return []

    const filter: StudentsFilter = currentYear
      ? { academic_year: currentYear }
      : {}
    const allStudents = await (await import('@/server/data/students/factory'))
      .getStudentsService()
      .getStudents(filter)

    const searchLower = (firstName || '').toLowerCase().trim()
    const lastSearchLower = (lastName || '').toLowerCase().trim()

    const similarityThreshold = 0.7

    const calculateSimilarity = (str1: string, str2: string): number => {
      if (str1 === str2) return 1
      if (str1.length < 2 || str2.length < 2) return 0

      const longer = str1.length > str2.length ? str1 : str2
      const shorter = str1.length > str2.length ? str2 : str1

      const editDistance = (s1: string, s2: string): number => {
        const matrix: Array<Array<number>> = []
        for (let i = 0; i <= s2.length; i++) matrix[i] = [i]
        for (let j = 0; j <= s1.length; j++) matrix[0][j] = j
        for (let i = 1; i <= s2.length; i++) {
          for (let j = 1; j <= s1.length; j++) {
            if (s2[i - 1] === s1[j - 1]) {
              matrix[i][j] = matrix[i - 1][j - 1]
            } else {
              matrix[i][j] = Math.min(
                matrix[i - 1][j - 1] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j] + 1,
              )
            }
          }
        }
        return matrix[s2.length][s1.length]
      }

      return (longer.length - editDistance(longer, shorter)) / longer.length
    }

    return allStudents
      .filter((student) => {
        const firstNameSim = searchLower
          ? calculateSimilarity(student.first_name.toLowerCase(), searchLower)
          : 0

        const lastNameSim = lastSearchLower
          ? calculateSimilarity(
              student.last_name.toLowerCase(),
              lastSearchLower,
            )
          : 0

        const startsWithMatch =
          searchLower &&
          student.first_name.toLowerCase().startsWith(searchLower)

        return (
          firstNameSim >= similarityThreshold ||
          lastNameSim >= similarityThreshold ||
          (startsWithMatch &&
            lastSearchLower &&
            student.last_name.toLowerCase().startsWith(lastSearchLower))
        )
      })
      .slice(0, 5)
  })
