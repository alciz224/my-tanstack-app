import { createServerFn } from '@tanstack/react-start'

export const getUsersFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    return (await import('@/server/data/users/factory')).getUsersService().getUsers()
  },
)
