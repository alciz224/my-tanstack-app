import { localReportsAdapter } from './local.adapter'
import { apiReportsAdapter } from './api.adapter'
import type { ReportsDataAdapter } from './types'

export function getReportsService(): ReportsDataAdapter {
  return import.meta.env.VITE_LOCAL_DATA === 'true'
    ? localReportsAdapter
    : apiReportsAdapter
}
