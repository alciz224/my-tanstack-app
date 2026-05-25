import { getCookies } from '@tanstack/react-start/server'
import type {
  City,
  Country,
  District,
  GeographyDataAdapter,
  RegionAdministrative,
} from './types'

export class ApiGeographyAdapter implements GeographyDataAdapter {
  private baseUrl = `${process.env.BACKEND_URL ?? 'http://localhost:8000'}/api/v1`

  private async fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const cookies = getCookies()
    const cookie = Object.entries(cookies)
      .map(([k, v]) => `${k}=${v}`)
      .join('; ')

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookie,
        ...options?.headers,
      },
    })
    if (!response.ok) throw new Error(`API Error: ${response.status} on ${endpoint}`)
    const json = await response.json()
    return (Array.isArray(json) ? json : (json.results ?? json)) as T
  }

  async getCountries() { return this.fetchApi<Array<Country>>('/countries/') }
  async getRegions() { return this.fetchApi<Array<RegionAdministrative>>('/regions/') }
  async getCities() { return this.fetchApi<Array<City>>('/cities/') }
  async getDistricts() { return this.fetchApi<Array<District>>('/districts/') }

  async createCountry(data: Omit<Country, 'id'>) {
    return this.fetchApi<Country>('/countries/', { method: 'POST', body: JSON.stringify(data) })
  }
  async updateCountry(id: string, data: Partial<Country>) {
    return this.fetchApi<Country>(`/countries/${id}/`, { method: 'PATCH', body: JSON.stringify(data) })
  }
  async deleteCountry(id: string) {
    await this.fetchApi<void>(`/countries/${id}/`, { method: 'DELETE' })
  }
  async createRegion(data: Omit<RegionAdministrative, 'id'>) {
    return this.fetchApi<RegionAdministrative>('/regions/', { method: 'POST', body: JSON.stringify(data) })
  }
  async updateRegion(id: string, data: Partial<RegionAdministrative>) {
    return this.fetchApi<RegionAdministrative>(`/regions/${id}/`, { method: 'PATCH', body: JSON.stringify(data) })
  }
  async deleteRegion(id: string) {
    await this.fetchApi<void>(`/regions/${id}/`, { method: 'DELETE' })
  }
  async createCity(data: Omit<City, 'id'>) {
    return this.fetchApi<City>('/cities/', { method: 'POST', body: JSON.stringify(data) })
  }
  async updateCity(id: string, data: Partial<City>) {
    return this.fetchApi<City>(`/cities/${id}/`, { method: 'PATCH', body: JSON.stringify(data) })
  }
  async deleteCity(id: string) {
    await this.fetchApi<void>(`/cities/${id}/`, { method: 'DELETE' })
  }
  async createDistrict(data: Omit<District, 'id'>) {
    return this.fetchApi<District>('/districts/', { method: 'POST', body: JSON.stringify(data) })
  }
  async updateDistrict(id: string, data: Partial<District>) {
    return this.fetchApi<District>(`/districts/${id}/`, { method: 'PATCH', body: JSON.stringify(data) })
  }
  async deleteDistrict(id: string) {
    await this.fetchApi<void>(`/districts/${id}/`, { method: 'DELETE' })
  }
}
