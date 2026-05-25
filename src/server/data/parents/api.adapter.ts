import type { Parent, ParentsDataAdapter, ParentsFilter } from './types'

export class ApiParentsAdapter implements ParentsDataAdapter {
  async getParents(filter?: ParentsFilter): Promise<Array<Parent>> {
    const { getCookies } = await import('@tanstack/react-start/server')
    const cookies = getCookies()
    const cookieHeader = Object.entries(cookies)
      .map(([k, v]) => `${k}=${v}`)
      .join('; ')

    const baseUrl = import.meta.env.BACKEND_URL ?? 'http://localhost:8000'
    const params = new URLSearchParams()

    if (filter?.search) params.set('search', filter.search)
    if (filter?.has_email) params.set('has_email', 'true')
    if (filter?.has_phone) params.set('has_phone', 'true')

    const url = `${baseUrl}/api/v1/school-admin/parents/?${params.toString()}`

    const res = await fetch(url, {
      headers: { cookie: cookieHeader },
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch parents: ${res.status}`)
    }

    return res.json()
  }

  async getParentById(id: string): Promise<Parent | undefined> {
    const { getCookies } = await import('@tanstack/react-start/server')
    const cookies = getCookies()
    const cookieHeader = Object.entries(cookies)
      .map(([k, v]) => `${k}=${v}`)
      .join('; ')

    const baseUrl = import.meta.env.BACKEND_URL ?? 'http://localhost:8000'

    const res = await fetch(`${baseUrl}/api/v1/school-admin/parents/${id}/`, {
      headers: { cookie: cookieHeader },
    })

    if (res.status === 404) return undefined

    if (!res.ok) {
      throw new Error(`Failed to fetch parent: ${res.status}`)
    }

    return res.json()
  }
}
