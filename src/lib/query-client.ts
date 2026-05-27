/**
 * TanStack Query Client Configuration
 *
 * Centralized configuration for React Query with SSR-friendly defaults
 * - Configured for TanStack Start (SSR + client-side hydration)
 * - Default staleTime to reduce unnecessary refetches
 * - Retry logic for network errors
 * - Error handling defaults
 */

import { QueryClient, defaultShouldDehydrateQuery } from '@tanstack/react-query'

/**
 * Create a new QueryClient instance
 * Called per-request on the server, singleton on the client
 */
export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is considered fresh for 5 minutes
        staleTime: 5 * 60 * 1000,

        // Cache data for 10 minutes
        gcTime: 10 * 60 * 1000,

        // Retry failed requests (with exponential backoff)
        retry: (failureCount, error: any) => {
          // Don't retry on 4xx errors (client errors)
          if (error?.status >= 400 && error?.status < 500) {
            return false
          }
          // Retry up to 2 times for 5xx errors
          return failureCount < 2
        },

        // Retry delay with exponential backoff
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

        // Refetch on window focus in production (good for data freshness)
        refetchOnWindowFocus: !import.meta.env.DEV,

        // Don't refetch on mount if data is fresh
        refetchOnMount: false,

        // Refetch on reconnect
        refetchOnReconnect: true,
      },
      mutations: {
        // Retry mutations once on network error
        retry: 1,

        // Retry delay for mutations
        retryDelay: 1000,
      },
      dehydrate: {
        // Only dehydrate successful queries to avoid sending errors to the client
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) &&
          query.state.status === 'success',
      },
    },
  })
}

// Singleton for client-side (browser)
let browserQueryClient: QueryClient | undefined

/**
 * Isomorphic QueryClient factory.
 * - Server: always creates a fresh instance (per-request isolation)
 * - Client: returns a singleton that persists across navigations
 */
export function getQueryClient() {
  if (typeof window === 'undefined') {
    // Server: create new per request
    return makeQueryClient()
  }
  // Client: reuse singleton to preserve cache across navigations
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient()
  }
  return browserQueryClient
}

/**
 * Query key factory for academic endpoints
 * Provides consistent, type-safe query keys
 */
export const academicKeys = {
  all: ['academic'] as const,

  academicYears: () => [...academicKeys.all, 'academic-years'] as const,
  academicYearsList: (filters?: Record<string, any>) =>
    [...academicKeys.academicYears(), 'list', filters] as const,
  academicYear: (id: string) => [...academicKeys.academicYears(), id] as const,
  academicYearCurrent: () =>
    [...academicKeys.academicYears(), 'current'] as const,

  cycles: () => [...academicKeys.all, 'cycles'] as const,
  cyclesList: (filters?: Record<string, any>) =>
    [...academicKeys.cycles(), 'list', filters] as const,
  cycle: (id: string) => [...academicKeys.cycles(), id] as const,
  cycleLevels: (id: string) => [...academicKeys.cycle(id), 'levels'] as const,
  cycleTracks: (id: string) => [...academicKeys.cycle(id), 'tracks'] as const,

  tracks: () => [...academicKeys.all, 'tracks'] as const,
  tracksList: (filters?: Record<string, any>) =>
    [...academicKeys.tracks(), 'list', filters] as const,
  track: (id: string) => [...academicKeys.tracks(), id] as const,
  trackLevels: (id: string) => [...academicKeys.track(id), 'levels'] as const,

  levels: () => [...academicKeys.all, 'levels'] as const,
  levelsList: (filters?: Record<string, any>) =>
    [...academicKeys.levels(), 'list', filters] as const,
  level: (id: string) => [...academicKeys.levels(), id] as const,

  subjects: () => [...academicKeys.all, 'subjects'] as const,
  subjectsList: (filters?: Record<string, any>) =>
    [...academicKeys.subjects(), 'list', filters] as const,
  subject: (id: string) => [...academicKeys.subjects(), id] as const,

  assessmentTypes: () => [...academicKeys.all, 'assessment-types'] as const,
  assessmentTypesList: (filters?: Record<string, any>) =>
    [...academicKeys.assessmentTypes(), 'list', filters] as const,
  assessmentType: (id: string) =>
    [...academicKeys.assessmentTypes(), id] as const,

  termTypes: () => [...academicKeys.all, 'term-types'] as const,
  termTypesList: (filters?: Record<string, any>) =>
    [...academicKeys.termTypes(), 'list', filters] as const,
  termType: (id: string) => [...academicKeys.termTypes(), id] as const,
  termTypeTerms: (id: string) =>
    [...academicKeys.termType(id), 'terms'] as const,

  terms: () => [...academicKeys.all, 'terms'] as const,
  termsList: (filters?: Record<string, any>) =>
    [...academicKeys.terms(), 'list', filters] as const,
  term: (id: string) => [...academicKeys.terms(), id] as const,
} as const

/**
 * Query key factory for geography endpoints
 */
export const geographyKeys = {
  all: ['geography'] as const,

  countries: () => [...geographyKeys.all, 'countries'] as const,
  countriesList: (filters?: Record<string, any>) =>
    [...geographyKeys.countries(), 'list', filters] as const,
  country: (id: string) => [...geographyKeys.countries(), id] as const,

  regions: () => [...geographyKeys.all, 'regions'] as const,
  regionsList: (filters?: Record<string, any>) =>
    [...geographyKeys.regions(), 'list', filters] as const,
  region: (id: string) => [...geographyKeys.regions(), id] as const,

  administrativeUnits: () =>
    [...geographyKeys.all, 'administrative-units'] as const,
  administrativeUnitsList: (filters?: Record<string, any>) =>
    [...geographyKeys.administrativeUnits(), 'list', filters] as const,
  administrativeUnit: (id: string) =>
    [...geographyKeys.administrativeUnits(), id] as const,

  localities: () => [...geographyKeys.all, 'localities'] as const,
  localitiesList: (filters?: Record<string, any>) =>
    [...geographyKeys.localities(), 'list', filters] as const,
  locality: (id: string) => [...geographyKeys.localities(), id] as const,
} as const

/**
 * Query key factory for school operations endpoints
 */
export const schoolOpsKeys = {
  all: ['school-operations'] as const,

  schools: () => [...schoolOpsKeys.all, 'schools'] as const,
  schoolsList: (filters?: Record<string, any>) =>
    [...schoolOpsKeys.schools(), 'list', filters] as const,
  school: (id: string) => [...schoolOpsKeys.schools(), id] as const,

  schoolYears: () => [...schoolOpsKeys.all, 'school-years'] as const,
  schoolYearsList: (filters?: Record<string, any>) =>
    [...schoolOpsKeys.schoolYears(), 'list', filters] as const,
  schoolYear: (id: string) => [...schoolOpsKeys.schoolYears(), id] as const,
  schoolYearCurrent: () => [...schoolOpsKeys.schoolYears(), 'current'] as const,
  schoolYearActive: () => [...schoolOpsKeys.schoolYears(), 'active'] as const,
} as const
