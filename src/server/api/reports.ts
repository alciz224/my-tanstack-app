import { createServerFn } from '@tanstack/react-start'
import type { ReportCard, Transcript } from '@/server/data/reports/types'

export const getReportCardsFn = createServerFn({ method: 'GET' })
  .inputValidator(
    (filter?: {
      student_enrollment_id?: string
      school_year_id?: string
      status?: ReportCard['status']
    }) => filter,
  )
  .handler(async ({ data: filter }) => {
    return (await import('@/server/data/reports/factory'))
      .getReportsService()
      .getReportCards(filter)
  })

export const getReportCardByIdFn = createServerFn({ method: 'GET' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    return (await import('@/server/data/reports/factory'))
      .getReportsService()
      .getReportCardById(id)
  })

export const createReportCardFn = createServerFn({ method: 'POST' })
  .inputValidator((data: Omit<ReportCard, 'id'>) => data)
  .handler(async ({ data }) => {
    return (await import('@/server/data/reports/factory'))
      .getReportsService()
      .createReportCard(data)
  })

export const updateReportCardFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string; updates: Partial<ReportCard> }) => data)
  .handler(async ({ data: { id, updates } }) => {
    return (await import('@/server/data/reports/factory'))
      .getReportsService()
      .updateReportCard(id, updates)
  })

export const getTranscriptsFn = createServerFn({ method: 'GET' })
  .inputValidator(
    (filter?: {
      student_enrollment_id?: string
      school_year_id?: string
      status?: Transcript['status']
    }) => filter,
  )
  .handler(async ({ data: filter }) => {
    return (await import('@/server/data/reports/factory'))
      .getReportsService()
      .getTranscripts(filter)
  })

export const getTranscriptByIdFn = createServerFn({ method: 'GET' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    return (await import('@/server/data/reports/factory'))
      .getReportsService()
      .getTranscriptById(id)
  })

export const createTranscriptFn = createServerFn({ method: 'POST' })
  .inputValidator((data: Omit<Transcript, 'id'>) => data)
  .handler(async ({ data }) => {
    return (await import('@/server/data/reports/factory'))
      .getReportsService()
      .createTranscript(data)
  })

export const updateTranscriptFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string; updates: Partial<Transcript> }) => data)
  .handler(async ({ data: { id, updates } }) => {
    return (await import('@/server/data/reports/factory'))
      .getReportsService()
      .updateTranscript(id, updates)
  })

export const getReportStatsFn = createServerFn({ method: 'GET' })
  .inputValidator((filter?: { school_year_id?: string }) => filter)
  .handler(async ({ data: filter }) => {
    return (await import('@/server/data/reports/factory'))
      .getReportsService()
      .getReportStats(filter)
  })
