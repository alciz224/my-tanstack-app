import { LocalSchedulesAdapter } from './local.adapter'
import { ApiSchedulesAdapter } from './api.adapter'
import type { SchedulesDataAdapter } from './types'

export function getSchedulesService(): SchedulesDataAdapter {
  if (
    process.env.VITE_LOCAL_DATA === 'true' ||
    process.env.NODE_ENV !== 'production'
  ) {
    return new LocalSchedulesAdapter()
  }
  return new ApiSchedulesAdapter()
}
