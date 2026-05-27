import { LocalTeachersAdapter } from './local.adapter'
import { ApiTeachersAdapter } from './api.adapter'
import type { TeachersDataAdapter } from './types'

export function getTeachersService(): TeachersDataAdapter {
  if (import.meta.env.VITE_LOCAL_DATA === 'true') {
    return new LocalTeachersAdapter()
  }
  return new ApiTeachersAdapter()
}
