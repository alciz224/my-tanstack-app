import { createServerFn } from '@tanstack/react-start'
import type { Parent, ParentsFilter } from '@/server/data/parents/types'

export type { Parent }

export const getParentsFn = createServerFn({ method: 'GET' })
  .inputValidator((d: unknown) => d as ParentsFilter | undefined)
  .handler(async ({ data: filter }): Promise<Array<Parent>> => {
    return (await import('@/server/data/parents/factory')).getParentsService().getParents(filter ?? undefined)
  })

export const getParentByIdFn = createServerFn({ method: 'GET' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }): Promise<Parent | undefined> => {
    return (await import('@/server/data/parents/factory')).getParentsService().getParentById(id)
  })
