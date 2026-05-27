import { getCookies } from '@tanstack/react-start/server'
import type {
  AcademicDataAdapter,
  AcademicYear,
  AssessmentType,
  Cycle,
  Level,
  Subject,
  Term,
  TermType,
  Track,
} from './types'

export class ApiAcademicAdapter implements AcademicDataAdapter {
  private baseUrl = process.env.VITE_API_URL || 'http://localhost:8000/api/v1'

  private async fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
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
      throw new Error(`API Error: ${response.status} on ${endpoint}`)
    }

    const json = await response.json()
    if (json && typeof json === 'object' && 'success' in json && 'data' in json) {
      return json.data as T
    }
    return (Array.isArray(json) ? json : (json.results ?? json)) as T
  }

  async getAcademicYears(): Promise<Array<AcademicYear>> {
    return this.fetchApi<Array<AcademicYear>>('/academic/academic-years/')
  }

  async getCycles(): Promise<Array<Cycle>> {
    return this.fetchApi<Array<Cycle>>('/academic/cycles/')
  }

  async getLevels(): Promise<Array<Level>> {
    return this.fetchApi<Array<Level>>('/academic/levels/')
  }

  async getTracks(): Promise<Array<Track>> {
    return this.fetchApi<Array<Track>>('/academic/tracks/')
  }

  async getSubjects(): Promise<Array<Subject>> {
    return this.fetchApi<Array<Subject>>('/academic/subjects/')
  }

  async getTermTypes(): Promise<Array<TermType>> {
    return this.fetchApi<Array<TermType>>('/academic/term-types/')
  }

  async getTerms(): Promise<Array<Term>> {
    return this.fetchApi<Array<Term>>('/academic/terms/')
  }

  async getAssessmentTypes(): Promise<Array<AssessmentType>> {
    return this.fetchApi<Array<AssessmentType>>('/academic/assessment-types/')
  }

  async createCycle(data: Omit<Cycle, 'id'>): Promise<Cycle> {
    return this.fetchApi<Cycle>('/academic/cycles/', { method: 'POST', body: JSON.stringify(data) })
  }
  async updateCycle(id: string, data: Partial<Cycle>): Promise<Cycle> {
    return this.fetchApi<Cycle>(`/academic/cycles/${id}/`, { method: 'PATCH', body: JSON.stringify(data) })
  }
  async deleteCycle(id: string): Promise<void> {
    return this.fetchApi<void>(`/academic/cycles/${id}/`, { method: 'DELETE' })
  }

  async createLevel(data: Omit<Level, 'id'>): Promise<Level> {
    return this.fetchApi<Level>('/academic/levels/', { method: 'POST', body: JSON.stringify(data) })
  }
  async updateLevel(id: string, data: Partial<Level>): Promise<Level> {
    return this.fetchApi<Level>(`/academic/levels/${id}/`, { method: 'PATCH', body: JSON.stringify(data) })
  }
  async deleteLevel(id: string): Promise<void> {
    return this.fetchApi<void>(`/academic/levels/${id}/`, { method: 'DELETE' })
  }

  async createTrack(data: Omit<Track, 'id'>): Promise<Track> {
    return this.fetchApi<Track>('/academic/tracks/', { method: 'POST', body: JSON.stringify(data) })
  }
  async updateTrack(id: string, data: Partial<Track>): Promise<Track> {
    return this.fetchApi<Track>(`/academic/tracks/${id}/`, { method: 'PATCH', body: JSON.stringify(data) })
  }
  async deleteTrack(id: string): Promise<void> {
    return this.fetchApi<void>(`/academic/tracks/${id}/`, { method: 'DELETE' })
  }

  async createSubject(data: Omit<Subject, 'id'>): Promise<Subject> {
    return this.fetchApi<Subject>('/academic/subjects/', { method: 'POST', body: JSON.stringify(data) })
  }
  async updateSubject(id: string, data: Partial<Subject>): Promise<Subject> {
    return this.fetchApi<Subject>(`/academic/subjects/${id}/`, { method: 'PATCH', body: JSON.stringify(data) })
  }
  async deleteSubject(id: string): Promise<void> {
    return this.fetchApi<void>(`/academic/subjects/${id}/`, { method: 'DELETE' })
  }

  async createTermType(data: Omit<TermType, 'id'>): Promise<TermType> {
    return this.fetchApi<TermType>('/academic/term-types/', { method: 'POST', body: JSON.stringify(data) })
  }
  async updateTermType(id: string, data: Partial<TermType>): Promise<TermType> {
    return this.fetchApi<TermType>(`/academic/term-types/${id}/`, { method: 'PATCH', body: JSON.stringify(data) })
  }
  async deleteTermType(id: string): Promise<void> {
    return this.fetchApi<void>(`/academic/term-types/${id}/`, { method: 'DELETE' })
  }

  async createTerm(data: Omit<Term, 'id'>): Promise<Term> {
    return this.fetchApi<Term>('/academic/terms/', { method: 'POST', body: JSON.stringify(data) })
  }
  async updateTerm(id: string, data: Partial<Term>): Promise<Term> {
    return this.fetchApi<Term>(`/academic/terms/${id}/`, { method: 'PATCH', body: JSON.stringify(data) })
  }
  async deleteTerm(id: string): Promise<void> {
    return this.fetchApi<void>(`/academic/terms/${id}/`, { method: 'DELETE' })
  }

  async createAssessmentType(data: Omit<AssessmentType, 'id'>): Promise<AssessmentType> {
    return this.fetchApi<AssessmentType>('/academic/assessment-types/', { method: 'POST', body: JSON.stringify(data) })
  }
  async updateAssessmentType(id: string, data: Partial<AssessmentType>): Promise<AssessmentType> {
    return this.fetchApi<AssessmentType>(`/academic/assessment-types/${id}/`, { method: 'PATCH', body: JSON.stringify(data) })
  }
  async deleteAssessmentType(id: string): Promise<void> {
    return this.fetchApi<void>(`/academic/assessment-types/${id}/`, { method: 'DELETE' })
  }
}
