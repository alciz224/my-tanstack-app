import { LocalUsersAdapter } from './local.adapter'
import { ApiUsersAdapter } from './api.adapter'
import type { UsersDataAdapter } from './types'

export function getUsersService(): UsersDataAdapter {
  if (import.meta.env.VITE_LOCAL_DATA === 'true') {
    return new LocalUsersAdapter()
  }
  return new ApiUsersAdapter()
}
