import type { UsersDataAdapter } from './types';
import { LocalUsersAdapter } from './local.adapter';
import { ApiUsersAdapter } from './api.adapter';

export function getUsersService(): UsersDataAdapter {
  if (process.env.VITE_LOCAL_DATA === 'true' || process.env.NODE_ENV !== 'production') {
    return new LocalUsersAdapter();
  }
  return new ApiUsersAdapter();
}
