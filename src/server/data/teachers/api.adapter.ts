import { getCookies } from '@tanstack/react-start/server'
import type {
  SchoolYearTeacher,
  Teacher,
  TeacherAssignment,
  TeachersDataAdapter,
} from './types'

export class ApiTeachersAdapter implements TeachersDataAdapter {
  private baseUrl = process.env.VITE_API_URL || 'http://localhost:8000/api/v2'

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

  async getTeachers(): Promise<Array<Teacher>> {
    return this.fetchApi<Array<Teacher>>('/teachers/')
  }

  async getSchoolYearTeachers(
    schoolYearId: string,
  ): Promise<Array<SchoolYearTeacher>> {
    return this.fetchApi<Array<SchoolYearTeacher>>(
      `/school-years/${schoolYearId}/teachers/`,
    )
  }

  async getTeacherAssignments(
    schoolYearTeacherId: string,
  ): Promise<Array<TeacherAssignment>> {
    return this.fetchApi<Array<TeacherAssignment>>(
      `/school-year-teachers/${schoolYearTeacherId}/assignments/`,
    )
  }

  async assignTeacherToSchoolYear(
    data: Omit<SchoolYearTeacher, 'id'>,
  ): Promise<SchoolYearTeacher> {
    return this.fetchApi<SchoolYearTeacher>('/school-year-teachers/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateSchoolYearTeacher(
    id: string,
    updates: Partial<SchoolYearTeacher>,
  ): Promise<SchoolYearTeacher> {
    return this.fetchApi<SchoolYearTeacher>(`/school-year-teachers/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  }

  async createTeacherAssignment(
    data: Omit<TeacherAssignment, 'id'>,
  ): Promise<TeacherAssignment> {
    return this.fetchApi<TeacherAssignment>('/teacher-assignments/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateTeacherAssignment(
    id: string,
    updates: Partial<TeacherAssignment>,
  ): Promise<TeacherAssignment> {
    return this.fetchApi<TeacherAssignment>(`/teacher-assignments/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  }
}
