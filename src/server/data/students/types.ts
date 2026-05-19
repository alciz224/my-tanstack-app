import type { Student } from './mocks'

export interface StudentsFilter {
  search?: string
  academic_year?: string
  cycle?: string
  option?: string
  level?: string
  class_name?: string
  status?: string
  gender?: string
}

export interface StudentsDataAdapter {
  getStudents: (filter?: StudentsFilter) => Promise<Array<Student>>
  getStudentById: (id: string) => Promise<Student | undefined>
}
