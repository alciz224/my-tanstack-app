import { createServerFn } from '@tanstack/react-start'
import type { ReportCard, Transcript } from '@/server/data/reports/types'
import { getReportsService } from '@/server/data/reports/factory'

export const getReportCardsFn = createServerFn({ method: 'GET' })
  .inputValidator(
    (filter?: {
      student_enrollment_id?: string
      school_year_id?: string
      status?: ReportCard['status']
    }) => filter,
  )
  .handler(async ({ data: filter }) => {
    return getReportsService().getReportCards(filter)
  })

export const getReportCardByIdFn = createServerFn({ method: 'GET' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    return getReportsService().getReportCardById(id)
  })

export const createReportCardFn = createServerFn({ method: 'POST' })
  .inputValidator((data: Omit<ReportCard, 'id'>) => data)
  .handler(async ({ data }) => {
    return getReportsService().createReportCard(data)
  })

export const updateReportCardFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string; updates: Partial<ReportCard> }) => data)
  .handler(async ({ data: { id, updates } }) => {
    return getReportsService().updateReportCard(id, updates)
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
    return getReportsService().getTranscripts(filter)
  })

export const getTranscriptByIdFn = createServerFn({ method: 'GET' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }) => {
    return getReportsService().getTranscriptById(id)
  })

export const createTranscriptFn = createServerFn({ method: 'POST' })
  .inputValidator((data: Omit<Transcript, 'id'>) => data)
  .handler(async ({ data }) => {
    return getReportsService().createTranscript(data)
  })

export const updateTranscriptFn = createServerFn({ method: 'POST' })
  .inputValidator((data: { id: string; updates: Partial<Transcript> }) => data)
  .handler(async ({ data: { id, updates } }) => {
    return getReportsService().updateTranscript(id, updates)
  })

export const getReportStatsFn = createServerFn({ method: 'GET' })
  .inputValidator((filter?: { school_year_id?: string }) => filter)
  .handler(async ({ data: filter }) => {
    return getReportsService().getReportStats(filter)
  })
