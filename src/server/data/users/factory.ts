import { LocalUsersAdapter } from './local.adapter'
import { ApiUsersAdapter } from './api.adapter'
import type { UsersDataAdapter } from './types'

export function getUsersService(): UsersDataAdapter {
  if (
    process.env.VITE_LOCAL_DATA === 'true' ||
    process.env.NODE_ENV !== 'production'
  ) {
    return new LocalUsersAdapter()
  }
  return new ApiUsersAdapter()
}
