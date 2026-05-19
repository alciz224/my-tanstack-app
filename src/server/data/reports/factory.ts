import { localReportsAdapter } from './local.adapter'
import { apiReportsAdapter } from './api.adapter'
import type { ReportsDataAdapter } from './types'

const useLocalData =
  typeof window !== 'undefined'
    ? localStorage.getItem('VITE_LOCAL_DATA') === 'true'
    : process.env.VITE_LOCAL_DATA === 'true'

export function getReportsService(): ReportsDataAdapter {
  return useLocalData ? localReportsAdapter : apiReportsAdapter
}
