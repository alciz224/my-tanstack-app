import { getCookies } from '@tanstack/react-start/server'
import type {
  Assessment,
  AssessmentSubject,
  AssessmentsDataAdapter,
  AssessmentsFilter,
  GradeEntryData,
  StudentAssessment,
} from './types'

export class ApiAssessmentsAdapter implements AssessmentsDataAdapter {
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
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    if (response.status === 204) return {} as T

    const json = await response.json()
    return (Array.isArray(json) ? json : (json.results ?? json)) as T
  }

  async getAssessments(filter?: AssessmentsFilter): Promise<Array<Assessment>> {
    const query = new URLSearchParams()
    if (filter?.school_year_cycle_id)
      query.append('school_year_cycle_id', filter.school_year_cycle_id)
    if (filter?.status) query.append('status', filter.status)
    if (filter?.school_year_cycle_term_id)
      query.append(
        'school_year_cycle_term_id',
        filter.school_year_cycle_term_id,
      )

    const qs = query.toString()
    return this.fetchApi<Array<Assessment>>(
      `/assessments/${qs ? `?${qs}` : ''}`,
    )
  }

  async getAssessmentById(id: string): Promise<Assessment | undefined> {
    try {
      return await this.fetchApi<Assessment>(`/assessments/${id}/`)
    } catch {
      return undefined
    }
  }

  async createAssessment(data: Omit<Assessment, 'id'>): Promise<Assessment> {
    return this.fetchApi<Assessment>('/assessments/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateAssessment(
    id: string,
    updates: Partial<Assessment>,
  ): Promise<Assessment> {
    return this.fetchApi<Assessment>(`/assessments/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  }

  async getAssessmentSubjects(
    assessmentId: string,
  ): Promise<Array<AssessmentSubject>> {
    return this.fetchApi<Array<AssessmentSubject>>(
      `/assessments/${assessmentId}/subjects/`,
    )
  }

  async getAssessmentSubjectById(
    id: string,
  ): Promise<AssessmentSubject | undefined> {
    try {
      return await this.fetchApi<AssessmentSubject>(
        `/assessment-subjects/${id}/`,
      )
    } catch {
      return undefined
    }
  }

  async createAssessmentSubject(
    data: Omit<AssessmentSubject, 'id'>,
  ): Promise<AssessmentSubject> {
    return this.fetchApi<AssessmentSubject>('/assessment-subjects/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateAssessmentSubject(
    id: string,
    updates: Partial<AssessmentSubject>,
  ): Promise<AssessmentSubject> {
    return this.fetchApi<AssessmentSubject>(`/assessment-subjects/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  }

  async getStudentAssessments(
    assessmentSubjectId: string,
  ): Promise<Array<StudentAssessment>> {
    return this.fetchApi<Array<StudentAssessment>>(
      `/assessment-subjects/${assessmentSubjectId}/grades/`,
    )
  }

  async getGradeEntryData(
    assessmentSubjectId: string,
  ): Promise<GradeEntryData> {
    const [subject, students] = await Promise.all([
      this.getAssessmentSubjectById(assessmentSubjectId),
      this.getStudentAssessments(assessmentSubjectId),
    ])

    if (!subject) {
      throw new Error('Assessment subject not found')
    }

    const present = students.filter((s) => !s.is_absent)
    const absent = students.filter((s) => s.is_absent && !s.is_excused)
    const excused = students.filter((s) => s.is_excused)
    const scored = present.filter((s) => s.raw_score !== undefined)

    const avgScore =
      scored.length > 0
        ? scored.reduce((sum, s) => sum + (s.raw_score || 0), 0) / scored.length
        : 0

    return {
      assessmentSubject: subject,
      students: students.sort((a, b) =>
        (a.student_last_name || '').localeCompare(b.student_last_name || ''),
      ),
      stats: {
        total: students.length,
        present: present.length,
        absent: absent.length,
        excused: excused.length,
        avgScore: Math.round(avgScore * 100) / 100,
      },
    }
  }

  async updateStudentAssessment(
    id: string,
    updates: Partial<StudentAssessment>,
  ): Promise<StudentAssessment> {
    return this.fetchApi<StudentAssessment>(`/student-assessments/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
  }

  async bulkUpdateStudentAssessments(
    updates: Array<{ id: string; updates: Partial<StudentAssessment> }>,
  ): Promise<Array<StudentAssessment>> {
    return this.fetchApi<Array<StudentAssessment>>(
      '/student-assessments/bulk-update/',
      {
        method: 'POST',
        body: JSON.stringify({ updates }),
      },
    )
  }
}
