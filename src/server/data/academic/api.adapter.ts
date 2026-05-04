import type { AcademicDataAdapter, Cycle, Level, Track, Subject, Period } from './types';
import { getRequest } from '@tanstack/react-start/server';

export class ApiAcademicAdapter implements AcademicDataAdapter {
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

  async getCycles(): Promise<Cycle[]> {
    return this.fetchApi<Cycle[]>('/academic/cycles/');
  }

  async getLevels(): Promise<Level[]> {
    return this.fetchApi<Level[]>('/academic/levels/');
  }

  async getTracks(): Promise<Track[]> {
    return this.fetchApi<Track[]>('/academic/tracks/');
  }

  async getSubjects(): Promise<Subject[]> {
    return this.fetchApi<Subject[]>('/academic/subjects/');
  }

  async getPeriods(): Promise<Period[]> {
    return this.fetchApi<Period[]>('/academic/periods/');
  }
}
