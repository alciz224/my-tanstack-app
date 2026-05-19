import { getWebRequest } from '@tanstack/react-start/server'
import { BaseAdapter } from './base.adapter'
import type {
  CreateUserInput,
  DataAdapter,
  UpdateProductInput,
  User,
  Product,
} from './types'

/**
 * Real API Adapter — server-to-server fetch with request cookie forwarding.
 * Captures the incoming browser's httpOnly session cookie so the backend
 * can authenticate the request.
 */
export class ApiAdapter extends BaseAdapter implements DataAdapter {
  private readonly baseUrl: string
  private readonly apiKey: string
  private readonly cookieHeader: string | null

  constructor() {
    super()
    this.baseUrl = process.env.API_BASE_URL!
    this.apiKey = process.env.API_KEY!
    if (!this.baseUrl) throw new Error('API_BASE_URL is required')

    const request = getWebRequest()
    this.cookieHeader = request?.headers.get('cookie') ?? null
  }

  private async fetch<T>(path: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseUrl}${path}`
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
          ...(this.cookieHeader ? { cookie: this.cookieHeader } : {}),
          ...options?.headers,
        },
      })

      if (!response.ok) {
        if (response.status === 401) throw new Error('Unauthorized')
        const body = await response.text()
        throw new Error(`HTTP ${response.status}: ${body}`)
      }

      return await response.json()
    } catch (error) {
      this.wrapError(`fetch ${path}`, error)
    }
  }

  // ---- Users ----

  async getUsers(): Promise<User[]> {
    return this.fetch<User[]>('/users')
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      return await this.fetch<User>(`/users/${id}`)
    } catch (error) {
      if ((error as Error).message.includes('404')) return null
      throw error
    }
  }

  async createUser(input: CreateUserInput): Promise<User> {
    return this.fetch<User>('/users', {
      method: 'POST',
      body: JSON.stringify(input),
    })
  }

  async updateUser(id: string, data: Partial<CreateUserInput>): Promise<User> {
    return this.fetch<User>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async deleteUser(id: string): Promise<void> {
    await this.fetch<void>(`/users/${id}`, { method: 'DELETE' })
  }

  // ---- Products ----

  async getProducts(filters?: {
    category?: string
    inStock?: boolean
  }): Promise<Product[]> {
    const params = new URLSearchParams()
    if (filters?.category) params.set('category', filters.category)
    if (filters?.inStock !== undefined)
      params.set('inStock', String(filters.inStock))
    const query = params.toString()
    return this.fetch<Product[]>(`/products${query ? `?${query}` : ''}`)
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      return await this.fetch<Product>(`/products/${id}`)
    } catch (error) {
      if ((error as Error).message.includes('404')) return null
      throw error
    }
  }

  async createProduct(input: Omit<Product, 'id'>): Promise<Product> {
    return this.fetch<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(input),
    })
  }

  async updateProduct(id: string, input: UpdateProductInput): Promise<Product> {
    return this.fetch<Product>(`/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    })
  }

  async deleteProduct(id: string): Promise<void> {
    await this.fetch<void>(`/products/${id}`, { method: 'DELETE' })
  }
}
