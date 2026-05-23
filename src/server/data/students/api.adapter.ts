import type { StudentsDataAdapter, StudentsFilter } from './types'
import type { Student } from './mocks'

export class ApiStudentsAdapter implements StudentsDataAdapter {
  async getStudents(filter?: StudentsFilter): Promise<Array<Student>> {
    // Dynamic import to keep server-only utilities out of the client bundle
    const { getCookies } = await import('@tanstack/react-start/server')
    const cookies = getCookies()
    const cookieHeader = Object.entries(cookies)
      .map(([k, v]) => `${k}=${v}`)
      .join('; ')

    const baseUrl = import.meta.env.BACKEND_URL ?? 'http://localhost:8000'
    const params = new URLSearchParams()

    if (filter?.search) params.set('search', filter.search)
    if (filter?.academic_year) params.set('academic_year', filter.academic_year)
    if (filter?.cycle) params.set('cycle', filter.cycle)
    if (filter?.option) params.set('option', filter.option)
    if (filter?.level) params.set('level', filter.level)
    if (filter?.class_name) params.set('class_name', filter.class_name)
    if (filter?.status) params.set('status', filter.status)
    if (filter?.gender) params.set('gender', filter.gender)

    const url = `${baseUrl}/api/v2/school-admin/students/?${params.toString()}`

    const res = await fetch(url, {
      headers: { cookie: cookieHeader },
    })

    if (!res.ok) {
      if (import.meta.env.DEV) {
        console.error(
          '[ApiStudentsAdapter.getStudents] Error:',
          res.status,
          res.statusText,
        )
      }
      return []
    }

    const data = await res.json()
    // Handle both paginated { results: [] } and plain []
    return Array.isArray(data) ? data : (data.results ?? [])
  }

  async getStudentById(id: string): Promise<Student | undefined> {
    try {
      const { getCookies } = await import('@tanstack/react-start/server')
      const cookies = getCookies()
      const cookieHeader = Object.entries(cookies)
        .map(([k, v]) => `${k}=${v}`)
        .join('; ')

      const baseUrl = import.meta.env.BACKEND_URL ?? 'http://localhost:8000'
      const url = `${baseUrl}/api/v2/school-admin/students/${id}/`
      const res = await fetch(url, { headers: { cookie: cookieHeader } })
      if (!res.ok) return undefined
      return await res.json()
    } catch (e) {
      return undefined
    }
  }
}
