import { getCookies } from '@tanstack/react-start/server'
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

export class ApiSchoolsAdapter implements SchoolsDataAdapter {
  private baseUrl = `${process.env.BACKEND_URL ?? 'http://localhost:8000'}/api/v1`

  private async fetchApi<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<T> {
    const cookies = getCookies()
    const cookie = Object.entries(cookies)
      .map(([k, v]) => `${k}=${v}`)
      .join('; ')

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookie,
        ...options?.headers,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API Error on ${endpoint}:`, errorText)
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    const json = await response.json()
    return (Array.isArray(json) ? json : (json.results ?? json)) as T
  }

  async getSchools(): Promise<Array<School>> {
    return this.fetchApi<Array<School>>('/schools/')
  }

  async getSchoolById(id: string): Promise<School | null> {
    return this.fetchApi<School>(`/schools/${id}/`).catch(() => null)
  }

  async createSchool(data: CreateSchoolInput): Promise<School> {
    return this.fetchApi<School>('/schools/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateSchool(id: string, data: Partial<School>): Promise<School> {
    return this.fetchApi<School>(`/schools/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteSchool(id: string): Promise<void> {
    await this.fetchApi<void>(`/schools/${id}/`, { method: 'DELETE' })
  }

  async getSchoolYears(schoolId: string): Promise<Array<SchoolYear>> {
    return this.fetchApi<Array<SchoolYear>>(`/schools/${schoolId}/years/`)
  }

  async getSchoolYearById(id: string): Promise<SchoolYear | null> {
    return this.fetchApi<SchoolYear>(`/school-years/${id}/`).catch(() => null)
  }

  async createSchoolYear(
    data: Omit<SchoolYear, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<SchoolYear> {
    return this.fetchApi<SchoolYear>('/school-years/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateSchoolYear(
    id: string,
    data: Partial<SchoolYear>,
  ): Promise<SchoolYear> {
    return this.fetchApi<SchoolYear>(`/school-years/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async getSchoolYearCycles(
    schoolYearId: string,
  ): Promise<Array<SchoolYearCycle>> {
    return this.fetchApi<Array<SchoolYearCycle>>(
      `/school-years/${schoolYearId}/cycles/`,
    )
  }

  async getSchoolYearLevels(
    schoolYearCycleId: string,
  ): Promise<Array<SchoolYearLevel>> {
    return this.fetchApi<Array<SchoolYearLevel>>(
      `/school-year-cycles/${schoolYearCycleId}/levels/`,
    )
  }

  async getSchoolYearLevelSubjects(
    schoolYearLevelId: string,
  ): Promise<Array<SchoolYearLevelSubject>> {
    return this.fetchApi<Array<SchoolYearLevelSubject>>(
      `/school-year-levels/${schoolYearLevelId}/subjects/`,
    )
  }

  async getClassrooms(schoolYearLevelId: string): Promise<Array<Classroom>> {
    return this.fetchApi<Array<Classroom>>(
      `/school-year-levels/${schoolYearLevelId}/classrooms/`,
    )
  }

  async createClassroom(
    data: Omit<Classroom, 'id' | 'created_at'>,
  ): Promise<Classroom> {
    return this.fetchApi<Classroom>('/school-admin/classrooms/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
}
