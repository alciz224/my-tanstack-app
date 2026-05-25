import { createServerFn } from '@tanstack/react-start'

export const getUsersFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    return (await import('@/server/data/users/factory'))
      .getUsersService()
      .getUsers()
  },
)

export const getUserByIdFn = createServerFn({ method: 'GET' })
  .inputValidator((d: unknown) => d as { id: string })
  .handler(async ({ data }) => {
    return (await import('@/server/data/users/factory'))
      .getUsersService()
      .getUserById(data.id)
  })
