import { getCookies } from '@tanstack/react-start/server'
import type { SchoolYearDataAdapter } from './types'
import type {
  Classroom,
  SchoolYear,
  SchoolYearCycle,
  SchoolYearCycleTimeSlot,
  SchoolYearLevel,
  SchoolYearLevelSubject,
} from './types'

export class ApiSchoolYearAdapter implements SchoolYearDataAdapter {
  private baseUrl = process.env.VITE_API_URL || 'http://localhost:8000/api/v2'

  private async fetchApi<T>(endpoint: string): Promise<T> {
    const cookies = getCookies()
    const cookie = Object.entries(cookies)
      .map(([k, v]) => `${k}=${v}`)
      .join('; ')

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookie,
      },
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} on ${endpoint}`)
    }

    const json = await response.json()
    return (Array.isArray(json) ? json : (json.results ?? [])) as T
  }

  async getSchoolYears(schoolId?: string): Promise<Array<SchoolYear>> {
    const endpoint = schoolId
      ? `/schools/${schoolId}/school-years/`
      : '/schools/school-years/'
    return this.fetchApi<Array<SchoolYear>>(endpoint)
  }

  async getSchoolYear(id: string): Promise<SchoolYear | null> {
    return this.fetchApi<SchoolYear>(`/schools/school-years/${id}/`)
  }

  async getSchoolYearCycles(
    schoolYearId: string,
  ): Promise<Array<SchoolYearCycle>> {
    return this.fetchApi<Array<SchoolYearCycle>>(
      `/schools/school-years/${schoolYearId}/cycles/`,
    )
  }

  async getSchoolYearLevels(
    schoolYearCycleId: string,
  ): Promise<Array<SchoolYearLevel>> {
    return this.fetchApi<Array<SchoolYearLevel>>(
      `/schools/school-year-cycles/${schoolYearCycleId}/levels/`,
    )
  }

  async getSchoolYearLevelSubjects(
    schoolYearLevelId: string,
  ): Promise<Array<SchoolYearLevelSubject>> {
    return this.fetchApi<Array<SchoolYearLevelSubject>>(
      `/schools/school-year-levels/${schoolYearLevelId}/subjects/`,
    )
  }

  async getClassrooms(schoolYearLevelId: string): Promise<Array<Classroom>> {
    return this.fetchApi<Array<Classroom>>(
      `/schools/school-year-levels/${schoolYearLevelId}/classrooms/`,
    )
  }

  async getTimeSlots(
    schoolYearCycleId: string,
  ): Promise<Array<SchoolYearCycleTimeSlot>> {
    return this.fetchApi<Array<SchoolYearCycleTimeSlot>>(
      `/schools/school-year-cycles/${schoolYearCycleId}/time-slots/`,
    )
  }
}
