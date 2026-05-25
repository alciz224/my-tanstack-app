import { createServerFn } from '@tanstack/react-start'
import type { Cycle, Level, Track, Subject, TermType, Term, AssessmentType } from '@/server/data/academic/types'

export const createCycleFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as Omit<Cycle, 'id'>)
  .handler(async ({ data }) => {
    const { getAcademicService } = await import('@/server/data/academic/factory')
    return getAcademicService().createCycle(data)
  })

export const updateCycleFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as { id: string; data: Partial<Cycle> })
  .handler(async ({ data }) => {
    const { getAcademicService } = await import('@/server/data/academic/factory')
    return getAcademicService().updateCycle(data.id, data.data)
  })

export const deleteCycleFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as { id: string })
  .handler(async ({ data }) => {
    const { getAcademicService } = await import('@/server/data/academic/factory')
    return getAcademicService().deleteCycle(data.id)
  })

export const createLevelFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as Omit<Level, 'id'>)
  .handler(async ({ data }) => {
    const { getAcademicService } = await import('@/server/data/academic/factory')
    return getAcademicService().createLevel(data)
  })

export const updateLevelFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as { id: string; data: Partial<Level> })
  .handler(async ({ data }) => {
    const { getAcademicService } = await import('@/server/data/academic/factory')
    return getAcademicService().updateLevel(data.id, data.data)
  })

export const deleteLevelFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as { id: string })
  .handler(async ({ data }) => {
    const { getAcademicService } = await import('@/server/data/academic/factory')
    return getAcademicService().deleteLevel(data.id)
  })

export const createTrackFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as Omit<Track, 'id'>)
  .handler(async ({ data }) => {
    const { getAcademicService } = await import('@/server/data/academic/factory')
    return getAcademicService().createTrack(data)
  })

export const updateTrackFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as { id: string; data: Partial<Track> })
  .handler(async ({ data }) => {
    const { getAcademicService } = await import('@/server/data/academic/factory')
    return getAcademicService().updateTrack(data.id, data.data)
  })

export const deleteTrackFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as { id: string })
  .handler(async ({ data }) => {
    const { getAcademicService } = await import('@/server/data/academic/factory')
    return getAcademicService().deleteTrack(data.id)
  })

export const createSubjectFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as Omit<Subject, 'id'>)
  .handler(async ({ data }) => {
    const { getAcademicService } = await import('@/server/data/academic/factory')
    return getAcademicService().createSubject(data)
  })

export const updateSubjectFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as { id: string; data: Partial<Subject> })
  .handler(async ({ data }) => {
    const { getAcademicService } = await import('@/server/data/academic/factory')
    return getAcademicService().updateSubject(data.id, data.data)
  })

export const deleteSubjectFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as { id: string })
  .handler(async ({ data }) => {
    const { getAcademicService } = await import('@/server/data/academic/factory')
    return getAcademicService().deleteSubject(data.id)
  })

export const createTermTypeFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as Omit<TermType, 'id'>)
  .handler(async ({ data }) => {
    const { getAcademicService } = await import('@/server/data/academic/factory')
    return getAcademicService().createTermType(data)
  })

export const updateTermTypeFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as { id: string; data: Partial<TermType> })
  .handler(async ({ data }) => {
    const { getAcademicService } = await import('@/server/data/academic/factory')
    return getAcademicService().updateTermType(data.id, data.data)
  })

export const deleteTermTypeFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as { id: string })
  .handler(async ({ data }) => {
    const { getAcademicService } = await import('@/server/data/academic/factory')
    return getAcademicService().deleteTermType(data.id)
  })

export const createTermFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as Omit<Term, 'id'>)
  .handler(async ({ data }) => {
    const { getAcademicService } = await import('@/server/data/academic/factory')
    return getAcademicService().createTerm(data)
  })

export const updateTermFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as { id: string; data: Partial<Term> })
  .handler(async ({ data }) => {
    const { getAcademicService } = await import('@/server/data/academic/factory')
    return getAcademicService().updateTerm(data.id, data.data)
  })

export const deleteTermFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as { id: string })
  .handler(async ({ data }) => {
    const { getAcademicService } = await import('@/server/data/academic/factory')
    return getAcademicService().deleteTerm(data.id)
  })

export const createAssessmentTypeFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as Omit<AssessmentType, 'id'>)
  .handler(async ({ data }) => {
    const { getAcademicService } = await import('@/server/data/academic/factory')
    return getAcademicService().createAssessmentType(data)
  })

export const updateAssessmentTypeFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as { id: string; data: Partial<AssessmentType> })
  .handler(async ({ data }) => {
    const { getAcademicService } = await import('@/server/data/academic/factory')
    return getAcademicService().updateAssessmentType(data.id, data.data)
  })

export const deleteAssessmentTypeFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as { id: string })
  .handler(async ({ data }) => {
    const { getAcademicService } = await import('@/server/data/academic/factory')
    return getAcademicService().deleteAssessmentType(data.id)
  })