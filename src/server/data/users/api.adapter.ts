import { getCookies } from '@tanstack/react-start/server'
import type { AdminUser, UsersDataAdapter } from './types'

export class ApiUsersAdapter implements UsersDataAdapter {
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

  async getUsers(): Promise<Array<AdminUser>> {
    return this.fetchApi<Array<AdminUser>>('/users/')
  }
}
