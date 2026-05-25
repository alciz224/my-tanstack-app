import { getCookies } from '@tanstack/react-start/server'
import type { AdminUser, CreateAdminUserInput, UserDetail, UsersDataAdapter } from './types'

export class ApiUsersAdapter implements UsersDataAdapter {
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

  async getUsers(): Promise<Array<AdminUser>> {
    return this.fetchApi<Array<AdminUser>>('/admin/users/')
  }

  async getUserById(id: string): Promise<UserDetail | null> {
    return this.fetchApi<UserDetail>(`/admin/users/${id}/`).catch(() => null)
  }

  async createUser(data: CreateAdminUserInput): Promise<AdminUser> {
    return this.fetchApi<AdminUser>('/admin/users/', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateUser(id: string, data: Partial<AdminUser>): Promise<AdminUser> {
    return this.fetchApi<AdminUser>(`/admin/users/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteUser(id: string): Promise<void> {
    await this.fetchApi<void>(`/admin/users/${id}/`, { method: 'DELETE' })
  }
}
