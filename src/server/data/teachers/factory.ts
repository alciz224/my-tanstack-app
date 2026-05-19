import { LocalTeachersAdapter } from './local.adapter'
import { ApiTeachersAdapter } from './api.adapter'
import type { TeachersDataAdapter } from './types'

export function getTeachersService(): TeachersDataAdapter {
  if (
    process.env.VITE_LOCAL_DATA === 'true' ||
    process.env.NODE_ENV !== 'production'
  ) {
    return new LocalTeachersAdapter()
  }
  return new ApiTeachersAdapter()
}
