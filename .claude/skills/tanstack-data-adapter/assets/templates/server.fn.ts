import { createServerFn } from '@tanstack/react-start'
import { getDataService } from '~/server/data'

/**
 * Server functions — completely agnostic of data source.
 * getDataService() resolves the correct adapter per request.
 */

export const getUsers = createServerFn({ method: 'GET' }).handler(async () => {
  const dataService = getDataService()
  return dataService.getUsers()
})

export const getUserById = createServerFn({ method: 'GET' })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const dataService = getDataService()
    const user = await dataService.getUserById(id)
    if (!user) throw new Error('User not found')
    return user
  })

export const createUser = createServerFn({ method: 'POST' })
  .validator(
    (input: { email: string; name: string; role?: 'admin' | 'user' }) => input,
  )
  .handler(async ({ data }) => {
    const dataService = getDataService()
    return dataService.createUser(data)
  })

export const updateUser = createServerFn({ method: 'POST' })
  .validator(
    (input: {
      id: string
      data: Partial<{ email: string; name: string; role: 'admin' | 'user' }>
    }) => input,
  )
  .handler(async ({ data: { id, data } }) => {
    const dataService = getDataService()
    return dataService.updateUser(id, data)
  })

export const deleteUser = createServerFn({ method: 'POST' })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const dataService = getDataService()
    return dataService.deleteUser(id)
  })

export const getProducts = createServerFn({ method: 'GET' })
  .validator((filters?: { category?: string; inStock?: boolean }) => filters)
  .handler(async ({ data: filters }) => {
    const dataService = getDataService()
    return dataService.getProducts(filters)
  })

export const getProductById = createServerFn({ method: 'GET' })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const dataService = getDataService()
    const product = await dataService.getProductById(id)
    if (!product) throw new Error('Product not found')
    return product
  })

export const createProduct = createServerFn({ method: 'POST' })
  .validator(
    (input: {
      name: string
      description: string
      price: number
      category: string
    }) => input,
  )
  .handler(async ({ data }) => {
    const dataService = getDataService()
    return dataService.createProduct({ ...data, inStock: true })
  })

export const updateProduct = createServerFn({ method: 'POST' })
  .validator(
    (input: {
      id: string
      data: Partial<{
        name: string
        description: string
        price: number
        inStock: boolean
      }>
    }) => input,
  )
  .handler(async ({ data: { id, data } }) => {
    const dataService = getDataService()
    return dataService.updateProduct(id, data)
  })

export const deleteProduct = createServerFn({ method: 'POST' })
  .validator((id: string) => id)
  .handler(async ({ data: id }) => {
    const dataService = getDataService()
    return dataService.deleteProduct(id)
  })
