import { createServerFn } from '@tanstack/react-start'
import type { StudentsFilter } from '@/server/data/students/types'
import type { Student } from '@/server/data/students/mocks'
import { getStudentsService } from '@/server/data/students/factory'

export type { Student }

export const getStudentsFn = createServerFn({ method: 'GET' })
  .inputValidator((d: unknown) => d as StudentsFilter | undefined)
  .handler(async ({ data: filter }): Promise<Array<Student>> => {
    // Per skill pattern: call getStudentsService() inside handler, never at module top-level
    const service = getStudentsService()
    return service.getStudents(filter ?? undefined)
  })

export const getStudentByIdFn = createServerFn({ method: 'GET' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }): Promise<Student | undefined> => {
    return getStudentsService().getStudentById(id)
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
    const allStudents = await getStudentsService().getStudents(filter)

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
