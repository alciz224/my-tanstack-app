import { LocalStudentsAdapter } from './local.adapter'
import { ApiStudentsAdapter } from './api.adapter'
import type { StudentsDataAdapter } from './types'

/**
 * Returns the correct students adapter based on VITE_LOCAL_DATA.
 * CRITICAL: Call inside server function handlers, never at module top-level.
 */
export function getStudentsService(): StudentsDataAdapter {
  if (import.meta.env.VITE_LOCAL_DATA === 'true') {
    return new LocalStudentsAdapter()
  }
  return new ApiStudentsAdapter()
}
