import type { GeographyDataAdapter, Country, RegionAdministrative, AdministrativeUnit, Locality } from './types';
import { getWebRequest } from '@tanstack/react-start/server';

export class ApiGeographyAdapter implements GeographyDataAdapter {
  private baseUrl = process.env.VITE_API_URL || 'http://localhost:8000/api/v2';

  private async fetchApi<T>(endpoint: string): Promise<T> {
    const request = getWebRequest();
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

  async getCountries(): Promise<Country[]> {
    return this.fetchApi<Country[]>('/geography/countries/');
  }

  async getRegions(): Promise<RegionAdministrative[]> {
    return this.fetchApi<RegionAdministrative[]>('/geography/regions/');
  }

  async getAdministrativeUnits(): Promise<AdministrativeUnit[]> {
    return this.fetchApi<AdministrativeUnit[]>('/geography/administrative-units/');
  }

  async getLocalities(): Promise<Locality[]> {
    return this.fetchApi<Locality[]>('/geography/localities/');
  }
}
