import type {
  FeeSummary,
  FeeType,
  FinanceDataAdapter,
  FinanceStats,
  SchoolFee,
  StudentPayment,
} from './types'

export class ApiFinanceAdapter implements FinanceDataAdapter {
  private baseUrl = () => import.meta.env.BACKEND_URL ?? 'http://localhost:8000'

  private async fetchApi<T>(path: string): Promise<T> {
    const { getCookies } = await import('@tanstack/react-start/server')
    const cookies = getCookies()
    const cookieHeader = Object.entries(cookies)
      .map(([k, v]) => `${k}=${v}`)
      .join('; ')

    const res = await fetch(`${this.baseUrl()}${path}`, {
      headers: { cookie: cookieHeader },
    })

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`)
    }
    return res.json()
  }

  async getFeeTypes(): Promise<Array<FeeType>> {
    return this.fetchApi('/api/v1/school-admin/fee-types/')
  }

  async getSchoolFees(schoolYearId: string): Promise<Array<SchoolFee>> {
    return this.fetchApi(`/api/v1/school-years/${schoolYearId}/fees/`)
  }

  async createSchoolFee(
    data: Omit<SchoolFee, 'id' | 'created_at'>,
  ): Promise<SchoolFee> {
    const { getCookies } = await import('@tanstack/react-start/server')
    const cookies = getCookies()
    const cookieHeader = Object.entries(cookies)
      .map(([k, v]) => `${k}=${v}`)
      .join('; ')

    const res = await fetch(`${this.baseUrl()}/api/v1/school-admin/fees/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', cookie: cookieHeader },
      body: JSON.stringify(data),
    })

    if (!res.ok) throw new Error('Failed to create fee')
    return res.json()
  }

  async updateSchoolFee(
    id: string,
    updates: Partial<SchoolFee>,
  ): Promise<SchoolFee> {
    const { getCookies } = await import('@tanstack/react-start/server')
    const cookies = getCookies()
    const cookieHeader = Object.entries(cookies)
      .map(([k, v]) => `${k}=${v}`)
      .join('; ')

    const res = await fetch(
      `${this.baseUrl()}/api/v1/school-admin/fees/${id}/`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', cookie: cookieHeader },
        body: JSON.stringify(updates),
      },
    )

    if (!res.ok) throw new Error('Failed to update fee')
    return res.json()
  }

  async getStudentPayments(
    studentEnrollmentId: string,
  ): Promise<Array<StudentPayment>> {
    return this.fetchApi(
      `/api/v1/student-enrollments/${studentEnrollmentId}/payments/`,
    )
  }

  async getClassPayments(classroomId: string): Promise<Array<StudentPayment>> {
    return this.fetchApi(`/api/v1/classrooms/${classroomId}/payments/`)
  }

  async createPayment(
    data: Omit<StudentPayment, 'id' | 'created_at'>,
  ): Promise<StudentPayment> {
    const { getCookies } = await import('@tanstack/react-start/server')
    const cookies = getCookies()
    const cookieHeader = Object.entries(cookies)
      .map(([k, v]) => `${k}=${v}`)
      .join('; ')

    const res = await fetch(`${this.baseUrl()}/api/v1/school-admin/payments/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', cookie: cookieHeader },
      body: JSON.stringify(data),
    })

    if (!res.ok) throw new Error('Failed to create payment')
    return res.json()
  }

  async getFeeSummaries(
    schoolYearId: string,
    classroomId?: string,
  ): Promise<Array<FeeSummary>> {
    const params = new URLSearchParams({ school_year_id: schoolYearId })
    if (classroomId) params.set('classroom_id', classroomId)
    return this.fetchApi(`/api/v1/school-admin/fees/summaries/?${params}`)
  }

  async getFinanceStats(schoolYearId: string): Promise<FinanceStats> {
    return this.fetchApi(`/api/v1/school-years/${schoolYearId}/fees/stats/`)
  }
}
