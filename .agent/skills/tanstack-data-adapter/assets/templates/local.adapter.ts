import { BaseAdapter } from './base.adapter';
import type { CreateUserInput, DataAdapter, UpdateProductInput, User, Product } from './types';
import { mockUsers, mockProducts } from './mocks';

/**
 * Local Mock Adapter — in-memory fixtures with simulated latency.
 * Ideal for offline development, Storybook, and E2E test seeding.
 */
export class LocalAdapter extends BaseAdapter implements DataAdapter {
  private users: User[] = [...mockUsers];
  private products: Product[] = [...mockProducts];

  // ---- Users ----

  async getUsers(): Promise<User[]> {
    await this.delay(300);
    return [...this.users];
  }

  async getUserById(id: string): Promise<User | null> {
    await this.delay(200);
    const user = this.users.find((u) => u.id === id);
    return user ? { ...user } : null;
  }

  async createUser(input: CreateUserInput): Promise<User> {
    await this.delay(400);
    const user: User = {
      id: `local_${Date.now()}`,
      email: input.email,
      name: input.name,
      role: input.role ?? 'user',
      createdAt: new Date(),
    };
    this.users.push(user);
    return { ...user };
  }

  async updateUser(id: string, data: Partial<CreateUserInput>): Promise<User> {
    await this.delay(300);
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1) throw new Error(`User ${id} not found`);
    this.users[idx] = { ...this.users[idx], ...data };
    return { ...this.users[idx] };
  }

  async deleteUser(id: string): Promise<void> {
    await this.delay(300);
    this.users = this.users.filter((u) => u.id !== id);
  }

  // ---- Products ----

  async getProducts(filters?: { category?: string; inStock?: boolean }): Promise<Product[]> {
    await this.delay(350);
    let result = [...this.products];
    if (filters?.category) result = result.filter((p) => p.category === filters.category);
    if (filters?.inStock !== undefined) result = result.filter((p) => p.inStock === filters.inStock);
    return result;
  }

  async getProductById(id: string): Promise<Product | null> {
    await this.delay(200);
    const product = this.products.find((p) => p.id === id);
    return product ? { ...product } : null;
  }

  async createProduct(input: Omit<Product, 'id'>): Promise<Product> {
    await this.delay(400);
    const product: Product = { ...input, id: `local_prod_${Date.now()}` };
    this.products.push(product);
    return { ...product };
  }

  async updateProduct(id: string, input: UpdateProductInput): Promise<Product> {
    await this.delay(350);
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error(`Product ${id} not found`);
    this.products[idx] = { ...this.products[idx], ...input };
    return { ...this.products[idx] };
  }

  async deleteProduct(id: string): Promise<void> {
    await this.delay(300);
    this.products = this.products.filter((p) => p.id !== id);
  }
}
