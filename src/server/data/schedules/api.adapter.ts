import { getCookies } from '@tanstack/react-start/server'
import type {
  Schedule,
  SchedulesDataAdapter,
  SchoolYearCycleTimeSlot,
} from './types'

export class ApiSchedulesAdapter implements SchedulesDataAdapter {
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
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    // For DELETE operations, response might be empty
    if (response.status === 204) return {} as T

    const json = await response.json()
    if (json && typeof json === 'object' && 'success' in json && 'data' in json) {
      return json.data as T
    }
    return (Array.isArray(json) ? json : (json.results ?? json)) as T
  }

  async getTimeSlots(
    schoolYearCycleId: string,
  ): Promise<Array<SchoolYearCycleTimeSlot>> {
    return this.fetchApi<Array<SchoolYearCycleTimeSlot>>(
      `/school-year-cycles/${schoolYearCycleId}/time-slots/`,
    )
  }

  async createTimeSlot(
    data: Omit<SchoolYearCycleTimeSlot, 'id'>,
  ): Promise<SchoolYearCycleTimeSlot> {
    return this.fetchApi<SchoolYearCycleTimeSlot>('/time-slots/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateTimeSlot(
    id: string,
    updates: Partial<SchoolYearCycleTimeSlot>,
  ): Promise<SchoolYearCycleTimeSlot> {
    return this.fetchApi<SchoolYearCycleTimeSlot>(`/time-slots/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  }

  async deleteTimeSlot(id: string): Promise<void> {
    await this.fetchApi(`/time-slots/${id}/`, { method: 'DELETE' })
  }

  async getClassroomSchedule(classroomId: string): Promise<Array<Schedule>> {
    return this.fetchApi<Array<Schedule>>(
      `/classrooms/${classroomId}/schedule/`,
    )
  }

  async getTeacherSchedule(
    teacherAssignmentId: string,
  ): Promise<Array<Schedule>> {
    return this.fetchApi<Array<Schedule>>(
      `/teacher-assignments/${teacherAssignmentId}/schedule/`,
    )
  }

  async createScheduleBlock(data: Omit<Schedule, 'id'>): Promise<Schedule> {
    return this.fetchApi<Schedule>('/schedules/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateScheduleBlock(
    id: string,
    updates: Partial<Schedule>,
  ): Promise<Schedule> {
    return this.fetchApi<Schedule>(`/schedules/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  }

  async deleteScheduleBlock(id: string): Promise<void> {
    await this.fetchApi(`/schedules/${id}/`, { method: 'DELETE' })
  }
}
