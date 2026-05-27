import { getCookies } from '@tanstack/react-start/server'
import type {
  AdministrativeUnit,
  Country,
  GeographyDataAdapter,
  Locality,
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
    if (json && typeof json === 'object' && 'success' in json && 'data' in json) {
      return json.data as T
    }
    return (Array.isArray(json) ? json : (json.results ?? json)) as T
  }

  async getCountries() { return this.fetchApi<Array<Country>>('/countries/') }
  async getRegions() { return this.fetchApi<Array<RegionAdministrative>>('/regions/') }
  async getAdministrativeUnits() { return this.fetchApi<Array<AdministrativeUnit>>('/administrative-units/') }
  async getLocalities() { return this.fetchApi<Array<Locality>>('/localities/') }

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
  async createAdministrativeUnit(data: Omit<AdministrativeUnit, 'id'>) {
    return this.fetchApi<AdministrativeUnit>('/administrative-units/', { method: 'POST', body: JSON.stringify(data) })
  }
  async updateAdministrativeUnit(id: string, data: Partial<AdministrativeUnit>) {
    return this.fetchApi<AdministrativeUnit>(`/administrative-units/${id}/`, { method: 'PATCH', body: JSON.stringify(data) })
  }
  async deleteAdministrativeUnit(id: string) {
    await this.fetchApi<void>(`/administrative-units/${id}/`, { method: 'DELETE' })
  }
  async createLocality(data: Omit<Locality, 'id'>) {
    return this.fetchApi<Locality>('/localities/', { method: 'POST', body: JSON.stringify(data) })
  }
  async updateLocality(id: string, data: Partial<Locality>) {
    return this.fetchApi<Locality>(`/localities/${id}/`, { method: 'PATCH', body: JSON.stringify(data) })
  }
  async deleteLocality(id: string) {
    await this.fetchApi<void>(`/localities/${id}/`, { method: 'DELETE' })
  }
}
