import {
  mockClassrooms,
  mockSchoolYearCycles,
  mockSchoolYearLevelSubjects,
  mockSchoolYearLevels,
  mockSchoolYears,
  mockTimeSlots,
} from './mocks'
import type { SchoolYearDataAdapter } from './types'
import type {
  Classroom,
  SchoolYear,
  SchoolYearCycle,
  SchoolYearCycleTimeSlot,
  SchoolYearLevel,
  SchoolYearLevelSubject,
} from './types'

export class LocalSchoolYearAdapter implements SchoolYearDataAdapter {
  private schoolYears = [...mockSchoolYears]
  private schoolYearCycles = [...mockSchoolYearCycles]
  private schoolYearLevels = [...mockSchoolYearLevels]
  private schoolYearLevelSubjects = [...mockSchoolYearLevelSubjects]
  private classrooms = [...mockClassrooms]
  private timeSlots = [...mockTimeSlots]

  private async delay(ms = 300) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async getSchoolYears(schoolId?: string): Promise<Array<SchoolYear>> {
    await this.delay()
    if (schoolId) {
      return this.schoolYears.filter((sy) => sy.school_id === schoolId)
    }
    return this.schoolYears.map((s) => ({ ...s }))
  }

  async getSchoolYear(id: string): Promise<SchoolYear | null> {
    await this.delay()
    return this.schoolYears.find((sy) => sy.id === id) || null
  }

  async getSchoolYearCycles(
    schoolYearId: string,
  ): Promise<Array<SchoolYearCycle>> {
    await this.delay()
    return this.schoolYearCycles.filter(
      (syc) => syc.school_year_id === schoolYearId,
    )
  }

  async getSchoolYearLevels(
    schoolYearCycleId: string,
  ): Promise<Array<SchoolYearLevel>> {
    await this.delay()
    return this.schoolYearLevels.filter(
      (syl) => syl.school_year_cycle_id === schoolYearCycleId,
    )
  }

  async getSchoolYearLevelSubjects(
    schoolYearLevelId: string,
  ): Promise<Array<SchoolYearLevelSubject>> {
    await this.delay()
    return this.schoolYearLevelSubjects.filter(
      (syls) => syls.school_year_level_id === schoolYearLevelId,
    )
  }

  async getClassrooms(schoolYearLevelId: string): Promise<Array<Classroom>> {
    await this.delay()
    return this.classrooms.filter(
      (c) => c.school_year_level_id === schoolYearLevelId,
    )
  }

  async getTimeSlots(
    schoolYearCycleId: string,
  ): Promise<Array<SchoolYearCycleTimeSlot>> {
    await this.delay()
    return this.timeSlots.filter(
      (ts) => ts.school_year_cycle_id === schoolYearCycleId,
    )
  }
}
