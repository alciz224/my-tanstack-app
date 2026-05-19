import { MOCK_STUDENTS } from './mocks'
import type { StudentsDataAdapter, StudentsFilter } from './types'
import type { Student } from './mocks'

function delay(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export class LocalStudentsAdapter implements StudentsDataAdapter {
  // Spread to prevent state leakage across hot reloads (per skill pattern)
  private students: Array<Student> = [...MOCK_STUDENTS]

  async getStudents(filter?: StudentsFilter): Promise<Array<Student>> {
    await delay(300)

    let result = this.students.map((s) => ({ ...s })) // return copies

    if (!filter) return result

    const q = filter.search?.toLowerCase() ?? ''
    if (q) {
      result = result.filter(
        (s) =>
          s.full_name.toLowerCase().includes(q) ||
          s.matricule.toLowerCase().includes(q) ||
          s.parent_name?.toLowerCase().includes(q),
      )
    }
    if (filter.academic_year)
      result = result.filter((s) => s.academic_year === filter.academic_year)
    if (filter.cycle) result = result.filter((s) => s.cycle === filter.cycle)
    if (filter.option) result = result.filter((s) => s.option === filter.option)
    if (filter.level) result = result.filter((s) => s.level === filter.level)
    if (filter.class_name)
      result = result.filter((s) => s.class_name === filter.class_name)
    if (filter.status) result = result.filter((s) => s.status === filter.status)
    if (filter.gender) result = result.filter((s) => s.gender === filter.gender)

    return result
  }

  async getStudentById(id: string): Promise<Student | undefined> {
    return MOCK_STUDENTS.find((s) => s.id === id)
  }
}
