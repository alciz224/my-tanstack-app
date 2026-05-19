import { getCookies } from '@tanstack/react-start/server'
import type { StudentAssessmentDataAdapter } from './types'
import type { StudentAssessment } from './types'

export class ApiStudentAssessmentAdapter implements StudentAssessmentDataAdapter {
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

  async getStudentAssessments(
    assessmentSubjectId: string,
  ): Promise<Array<StudentAssessment>> {
    return this.fetchApi<Array<StudentAssessment>>(
      `/assessments/subjects/${assessmentSubjectId}/grades/`,
    )
  }

  async getStudentAssessment(id: string): Promise<StudentAssessment | null> {
    return this.fetchApi<StudentAssessment>(`/student-assessments/${id}/`)
  }

  async getStudentAssessmentsByEnrollment(
    enrollmentId: string,
  ): Promise<Array<StudentAssessment>> {
    return this.fetchApi<Array<StudentAssessment>>(
      `/students/enrollments/${enrollmentId}/grades/`,
    )
  }
}
