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

    const csrfToken = cookies['csrftoken'] ?? cookies['XSRF-TOKEN']

    const method = options?.method ?? 'GET'

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookie,
        ...(csrfToken ? { 'X-CSRFToken': csrfToken } : {}),
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

  async getUsers(): Promise<Array<AdminUser>> {
    return this.fetchApi<Array<AdminUser>>('/admin/users/')
  }

  async getUserById(id: string): Promise<UserDetail | null> {
    try {
      return await this.fetchApi<UserDetail>(`/admin/users/${id}/`)
    } catch (error) {
      console.error(`[ApiUsersAdapter] getUserById failed for ${id}:`, error)
      return null
    }
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
