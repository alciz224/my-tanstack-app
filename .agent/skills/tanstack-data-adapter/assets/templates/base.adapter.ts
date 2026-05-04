import { DataAdapter } from './types';

/**
 * Abstract base adapter with shared utilities.
 * Subclasses implement domain methods; this class provides helpers.
 */
export abstract class BaseAdapter implements DataAdapter {
  // -- Abstract: must be implemented by subclasses --
  abstract getUsers(): Promise<ReturnType<DataAdapter['getUsers']>>;
  abstract getUserById(id: string): Promise<ReturnType<DataAdapter['getUserById']>>;
  abstract createUser(input: Parameters<DataAdapter['createUser']>[0]): Promise<ReturnType<DataAdapter['createUser']>>;
  abstract updateUser(id: string, data: Parameters<DataAdapter['updateUser']>[1]): Promise<ReturnType<DataAdapter['updateUser']>>;
  abstract deleteUser(id: string): Promise<void>;
  abstract getProducts(filters?: Parameters<DataAdapter['getProducts']>[0]): Promise<ReturnType<DataAdapter['getProducts']>>;
  abstract getProductById(id: string): Promise<ReturnType<DataAdapter['getProductById']>>;
  abstract createProduct(input: Parameters<DataAdapter['createProduct']>[0]): Promise<ReturnType<DataAdapter['createProduct']>>;
  abstract updateProduct(id: string, input: Parameters<DataAdapter['updateProduct']>[1]): Promise<ReturnType<DataAdapter['updateProduct']>>;
  abstract deleteProduct(id: string): Promise<void>;

  // -- Shared helpers --

  protected wrapError(operation: string, error: unknown): never {
    const message = error instanceof Error ? error.message : 'Unknown error';
    const code = (error as any)?.code || 'DATA_ERROR';
    throw new Error(`[${operation}] ${code}: ${message}`);
  }

  protected delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
