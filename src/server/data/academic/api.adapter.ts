import { getCookies } from '@tanstack/react-start/server'
import type {
  AcademicDataAdapter,
  Cycle,
  Level,
  Period,
  Subject,
  Track,
} from './types'

export class ApiAcademicAdapter implements AcademicDataAdapter {
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

  async getPeriods(): Promise<Array<Period>> {
    return this.fetchApi<Array<Period>>('/academic/periods/')
  }
}
