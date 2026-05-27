import {
  mockClassrooms,
  mockSchoolYearCycles,
  mockSchoolYearLevelSubjects,
  mockSchoolYearLevels,
  mockSchoolYears,
  mockSchools,
} from './mocks'
import type {
  Classroom,
  CreateSchoolInput,
  School,
  SchoolYear,
  SchoolYearCycle,
  SchoolYearLevel,
  SchoolYearLevelSubject,
  SchoolsDataAdapter,
} from './types'

export class LocalSchoolsAdapter implements SchoolsDataAdapter {
  private schools = [...mockSchools]
  private schoolYears = [...mockSchoolYears]
  private schoolYearCycles = [...mockSchoolYearCycles]
  private schoolYearLevels = [...mockSchoolYearLevels]
  private schoolYearLevelSubjects = [...mockSchoolYearLevelSubjects]
  private classrooms = [...mockClassrooms]

  async getSchools(): Promise<Array<School>> {
    return this.schools
  }

  async getSchoolById(id: string): Promise<School | null> {
    return this.schools.find((s) => s.id === id) || null
  }

  async createSchool(data: CreateSchoolInput): Promise<School> {
    const nameExists = this.schools.some((s) => s.name === data.name)
    if (nameExists) throw new Error('Une école avec ce nom existe déjà')

    const codeExists = this.schools.some((s) => s.code === data.code)
    if (codeExists) throw new Error('Une école avec ce code existe déjà')

    const newSchool: School = {
      id: `school-${Date.now()}`,
      name: data.name,
      code: data.code,
      locality_id: data.locality_id,
      address: data.address,
      phone: data.phone,
      email: data.email,
      website: data.website,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    this.schools.push(newSchool)
    return newSchool
  }

  async updateSchool(id: string, data: Partial<School>): Promise<School> {
    const index = this.schools.findIndex((s) => s.id === id)
    if (index === -1) throw new Error('École non trouvée')

    if (data.name) {
      const nameExists = this.schools.some(
        (s) => s.name === data.name && s.id !== id,
      )
      if (nameExists) throw new Error('Une école avec ce nom existe déjà')
    }

    if (data.code) {
      const codeExists = this.schools.some(
        (s) => s.code === data.code && s.id !== id,
      )
      if (codeExists) throw new Error('Une école avec ce code existe déjà')
    }

    this.schools[index] = {
      ...this.schools[index],
      ...data,
      updated_at: new Date().toISOString(),
    }
    return this.schools[index]
  }

  async deleteSchool(id: string): Promise<void> {
    const index = this.schools.findIndex((s) => s.id === id)
    if (index === -1) throw new Error('École non trouvée')
    this.schools.splice(index, 1)
  }

  async getSchoolYears(schoolId: string): Promise<Array<SchoolYear>> {
    return this.schoolYears.filter((sy) => sy.school_id === schoolId)
  }

  async getSchoolYearById(id: string): Promise<SchoolYear | null> {
    return this.schoolYears.find((sy) => sy.id === id) || null
  }

  async createSchoolYear(
    data: Omit<SchoolYear, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<SchoolYear> {
    const newYear: SchoolYear = {
      ...data,
      id: `sy-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    this.schoolYears.push(newYear)
    return newYear
  }

  async updateSchoolYear(
    id: string,
    data: Partial<SchoolYear>,
  ): Promise<SchoolYear> {
    const index = this.schoolYears.findIndex((sy) => sy.id === id)
    if (index === -1) throw new Error(`SchoolYear ${id} not found`)

    this.schoolYears[index] = {
      ...this.schoolYears[index],
      ...data,
      updated_at: new Date().toISOString(),
    }
    return this.schoolYears[index]
  }

  async getSchoolYearCycles(
    schoolYearId: string,
  ): Promise<Array<SchoolYearCycle>> {
    return this.schoolYearCycles.filter(
      (c) => c.school_year_id === schoolYearId,
    )
  }

  async getSchoolYearLevels(
    schoolYearCycleId: string,
  ): Promise<Array<SchoolYearLevel>> {
    return this.schoolYearLevels.filter(
      (l) => l.school_year_cycle_id === schoolYearCycleId,
    )
  }

  async getSchoolYearLevelSubjects(
    schoolYearLevelId: string,
  ): Promise<Array<SchoolYearLevelSubject>> {
    return this.schoolYearLevelSubjects.filter(
      (s) => s.school_year_level_id === schoolYearLevelId,
    )
  }

  async getClassrooms(schoolYearLevelId: string): Promise<Array<Classroom>> {
    return this.classrooms.filter(
      (c) => c.school_year_level_id === schoolYearLevelId,
    )
  }

  async createClassroom(
    data: Omit<Classroom, 'id' | 'created_at'>,
  ): Promise<Classroom> {
    // ERD: (school_year_level_id, name) UNIQUE
    const exists = this.classrooms.some(
      (c) =>
        c.school_year_level_id === data.school_year_level_id &&
        c.name === data.name,
    )
    if (exists) {
      throw new Error(`Une classe "${data.name}" existe déjà pour ce niveau`)
    }

    // ERD: capacity must be ≥ 0
    if (data.capacity !== undefined && data.capacity < 0) {
      throw new Error('La capacité doit être positive')
    }

    const newClassroom: Classroom = {
      id: `class-${Date.now()}`,
      ...data,
      created_at: new Date().toISOString(),
    }
    this.classrooms.push(newClassroom)
    return newClassroom
  }
}
