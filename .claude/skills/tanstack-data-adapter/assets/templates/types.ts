/**
 * Shared TypeScript interfaces for the Data Adapter pattern.
 * All adapters (local, real, test) MUST implement DataAdapter.
 * Server functions depend ONLY on this interface.
 */

// ===== Domain Types =====

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
  createdAt: Date
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  inStock: boolean
}

// ===== Input Types =====

export interface CreateUserInput {
  email: string
  name: string
  role?: 'admin' | 'user'
}

export interface UpdateProductInput {
  name?: string
  description?: string
  price?: number
  inStock?: boolean
}

// ===== Adapter Contract =====

export interface DataAdapter {
  // Users
  getUsers(): Promise<User[]>
  getUserById(id: string): Promise<User | null>
  createUser(input: CreateUserInput): Promise<User>
  updateUser(id: string, data: Partial<CreateUserInput>): Promise<User>
  deleteUser(id: string): Promise<void>

  // Products
  getProducts(filters?: {
    category?: string
    inStock?: boolean
  }): Promise<Product[]>
  getProductById(id: string): Promise<Product | null>
  createProduct(input: Omit<Product, 'id'>): Promise<Product>
  updateProduct(id: string, input: UpdateProductInput): Promise<Product>
  deleteProduct(id: string): Promise<void>
}
