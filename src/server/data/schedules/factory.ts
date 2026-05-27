import { LocalSchedulesAdapter } from './local.adapter'
import { ApiSchedulesAdapter } from './api.adapter'
import type { SchedulesDataAdapter } from './types'

export function getSchedulesService(): SchedulesDataAdapter {
  if (import.meta.env.VITE_LOCAL_DATA === 'true') {
    return new LocalSchedulesAdapter()
  }
  return new ApiSchedulesAdapter()
}
