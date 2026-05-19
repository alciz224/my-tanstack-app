import { mockParents } from './mocks'
import type { Parent, ParentsDataAdapter, ParentsFilter } from './types'

export class LocalParentsAdapter implements ParentsDataAdapter {
  private parents = [...mockParents]

  async getParents(filter?: ParentsFilter): Promise<Array<Parent>> {
    let result = [...this.parents]

    if (filter?.search) {
      const searchTerm = filter.search
      const searchLower = searchTerm.toLowerCase()
      result = result.filter(
        (p) =>
          p.full_name.toLowerCase().includes(searchLower) ||
          (p.email && p.email.toLowerCase().includes(searchLower)) ||
          (p.phone && p.phone.includes(searchTerm)) ||
          p.children.some((c) =>
            c.full_name.toLowerCase().includes(searchLower),
          ),
      )
    }

    if (filter?.has_email === true) {
      result = result.filter((p) => p.email !== null)
    }

    if (filter?.has_phone === true) {
      result = result.filter((p) => p.phone !== null)
    }

    return result
  }

  async getParentById(id: string): Promise<Parent | undefined> {
    return this.parents.find((p) => p.id === id)
  }
}
