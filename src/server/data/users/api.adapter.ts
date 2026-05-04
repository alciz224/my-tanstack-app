import type { UsersDataAdapter, AdminUser } from './types';
import { getRequest } from '@tanstack/react-start/server';

export class ApiUsersAdapter implements UsersDataAdapter {
  private baseUrl = process.env.VITE_API_URL || 'http://localhost:8000/api/v2';

  private async fetchApi<T>(endpoint: string): Promise<T> {
    const request = getRequest();
    const cookie = request?.headers.get('cookie') || '';
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookie,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} on ${endpoint}`);
    }

    const json = await response.json();
    return Array.isArray(json) ? json : json.results ?? [];
  }

  async getUsers(): Promise<AdminUser[]> {
    return this.fetchApi<AdminUser[]>('/users/');
  }
}
