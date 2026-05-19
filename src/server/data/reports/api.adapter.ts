import type { ReportCard, ReportsDataAdapter, Transcript } from './types'
import { serverFetch } from '@/lib/api-client'

export const apiReportsAdapter: ReportsDataAdapter = {
  async getReportCards(filter) {
    const params = new URLSearchParams()
    if (filter?.student_enrollment_id)
      params.set('student_enrollment_id', filter.student_enrollment_id)
    if (filter?.school_year_id)
      params.set('school_year_id', filter.school_year_id)
    if (filter?.status) params.set('status', filter.status)
    const res = await serverFetch(`/api/report-cards?${params}`)
    return res.json()
  },

  async getReportCardById(id) {
    const res = await serverFetch(`/api/report-cards/${id}`)
    if (!res.ok) return undefined
    return res.json()
  },

  async createReportCard(data) {
    const res = await serverFetch('/api/report-cards', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return res.json()
  },

  async updateReportCard(id, updates) {
    const res = await serverFetch(`/api/report-cards/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
    return res.json()
  },

  async getTranscripts(filter) {
    const params = new URLSearchParams()
    if (filter?.student_enrollment_id)
      params.set('student_enrollment_id', filter.student_enrollment_id)
    if (filter?.school_year_id)
      params.set('school_year_id', filter.school_year_id)
    if (filter?.status) params.set('status', filter.status)
    const res = await serverFetch(`/api/transcripts?${params}`)
    return res.json()
  },

  async getTranscriptById(id) {
    const res = await serverFetch(`/api/transcripts/${id}`)
    if (!res.ok) return undefined
    return res.json()
  },

  async createTranscript(data) {
    const res = await serverFetch('/api/transcripts', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    return res.json()
  },

  async updateTranscript(id, updates) {
    const res = await serverFetch(`/api/transcripts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
    return res.json()
  },

  async getReportStats(filter) {
    throw new Error('Not implemented')
  },
}
