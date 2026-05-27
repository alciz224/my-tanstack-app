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
    if (json && typeof json === 'object' && 'success' in json && 'data' in json) {
      return json.data as T
    }
    return (Array.isArray(json) ? json : (json.results ?? json)) as T
  }

  async getSchools(): Promise<Array<School>> {
    return this.fetchApi<Array<School>>('/school-operations/schools/')
  }

  async getSchoolById(id: string): Promise<School | null> {
    return this.fetchApi<School>(`/school-operations/schools/${id}/`).catch(() => null)
  }

  async createSchool(data: CreateSchoolInput): Promise<School> {
    return this.fetchApi<School>('/school-operations/schools/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateSchool(id: string, data: Partial<School>): Promise<School> {
    return this.fetchApi<School>(`/school-operations/schools/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteSchool(id: string): Promise<void> {
    await this.fetchApi<void>(`/school-operations/schools/${id}/`, { method: 'DELETE' })
  }

  async getSchoolYears(schoolId: string): Promise<Array<SchoolYear>> {
    return this.fetchApi<Array<SchoolYear>>(`/school-operations/school-years/by-school/${schoolId}/`)
  }

  async getSchoolYearById(id: string): Promise<SchoolYear | null> {
    return this.fetchApi<SchoolYear>(`/school-operations/school-years/${id}/`).catch(() => null)
  }

  async createSchoolYear(
    data: Omit<SchoolYear, 'id' | 'created_at' | 'updated_at'>,
  ): Promise<SchoolYear> {
    return this.fetchApi<SchoolYear>('/school-operations/school-years/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateSchoolYear(
    id: string,
    data: Partial<SchoolYear>,
  ): Promise<SchoolYear> {
    return this.fetchApi<SchoolYear>(`/school-operations/school-years/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async getSchoolYearCycles(
    schoolYearId: string,
  ): Promise<Array<SchoolYearCycle>> {
    return this.fetchApi<Array<SchoolYearCycle>>(
      `/school-operations/school-year-cycles/by-school-year/${schoolYearId}/`,
    )
  }

  async getSchoolYearLevels(
    schoolYearCycleId: string,
  ): Promise<Array<SchoolYearLevel>> {
    return this.fetchApi<Array<SchoolYearLevel>>(
      `/school-operations/school-year-levels/by-school-year-cycle/${schoolYearCycleId}/`,
    )
  }

  async getSchoolYearLevelSubjects(
    schoolYearLevelId: string,
  ): Promise<Array<SchoolYearLevelSubject>> {
    return this.fetchApi<Array<SchoolYearLevelSubject>>(
      `/school-operations/school-year-level-subjects/?school_year_level=${schoolYearLevelId}`,
    )
  }

  async getClassrooms(schoolYearLevelId: string): Promise<Array<Classroom>> {
    return this.fetchApi<Array<Classroom>>(
      `/enrollment/classrooms/?school_year_level=${schoolYearLevelId}`,
    )
  }

  async createClassroom(
    data: Omit<Classroom, 'id' | 'created_at'>,
  ): Promise<Classroom> {
    return this.fetchApi<Classroom>('/enrollment/classrooms/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
}
