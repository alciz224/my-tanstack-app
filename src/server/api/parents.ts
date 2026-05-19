import { createServerFn } from '@tanstack/react-start'
import type { Parent, ParentsFilter } from '@/server/data/parents/types'
import { getParentsService } from '@/server/data/parents/factory'

export type { Parent }

export const getParentsFn = createServerFn({ method: 'GET' })
  .inputValidator((d: unknown) => d as ParentsFilter | undefined)
  .handler(async ({ data: filter }): Promise<Array<Parent>> => {
    return getParentsService().getParents(filter ?? undefined)
  })

export const getParentByIdFn = createServerFn({ method: 'GET' })
  .inputValidator((id: string) => id)
  .handler(async ({ data: id }): Promise<Parent | undefined> => {
    return getParentsService().getParentById(id)
  })
