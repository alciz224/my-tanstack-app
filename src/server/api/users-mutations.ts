import { createServerFn } from '@tanstack/react-start'
import type { AdminUser, CreateAdminUserInput } from '@/server/data/users/types'

export const createUserFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as CreateAdminUserInput)
  .handler(async ({ data }) => {
    const { getUsersService } = await import('@/server/data/users/factory')
    return getUsersService().createUser(data)
  })

export const updateUserFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as { id: string; data: Partial<AdminUser> })
  .handler(async ({ data }) => {
    const { getUsersService } = await import('@/server/data/users/factory')
    return getUsersService().updateUser(data.id, data.data)
  })

export const deleteUserFn = createServerFn({ method: 'POST' })
  .inputValidator((d: unknown) => d as { id: string })
  .handler(async ({ data }) => {
    const { getUsersService } = await import('@/server/data/users/factory')
    return getUsersService().deleteUser(data.id)
  })
