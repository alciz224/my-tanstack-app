import { LocalParentsAdapter } from './local.adapter'
import { ApiParentsAdapter } from './api.adapter'
import type { ParentsDataAdapter } from './types'

let parentsService: ParentsDataAdapter | null = null

export function getParentsService(): ParentsDataAdapter {
  if (!parentsService) {
    const isLocal =
      typeof window !== 'undefined'
        ? localStorage.getItem('VITE_LOCAL_DATA') === 'true'
        : process.env.VITE_LOCAL_DATA === 'true'
    parentsService = isLocal
      ? new LocalParentsAdapter()
      : new ApiParentsAdapter()
  }
  return parentsService
}
