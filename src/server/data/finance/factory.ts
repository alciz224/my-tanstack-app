import { LocalFinanceAdapter } from './local.adapter'
import { ApiFinanceAdapter } from './api.adapter'
import type { FinanceDataAdapter } from './types'

let financeService: FinanceDataAdapter | null = null

export function getFinanceService(): FinanceDataAdapter {
  if (!financeService) {
    const isLocal =
      typeof window !== 'undefined'
        ? localStorage.getItem('VITE_LOCAL_DATA') === 'true'
        : process.env.VITE_LOCAL_DATA === 'true'
    financeService = isLocal
      ? new LocalFinanceAdapter()
      : new ApiFinanceAdapter()
  }
  return financeService
}
