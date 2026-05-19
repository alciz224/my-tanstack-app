import { getCookies } from '@tanstack/react-start/server'
import type {
  AdministrativeUnit,
  Country,
  GeographyDataAdapter,
  Locality,
  RegionAdministrative,
} from './types'

export class ApiGeographyAdapter implements GeographyDataAdapter {
  private baseUrl = process.env.VITE_API_URL || 'http://localhost:8000/api/v2'

  private async fetchApi<T>(endpoint: string): Promise<T> {
    const cookies = getCookies()
    const cookie = Object.entries(cookies)
      .map(([k, v]) => `${k}=${v}`)
      .join('; ')

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookie,
      },
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} on ${endpoint}`)
    }

    const json = await response.json()
    return (Array.isArray(json) ? json : (json.results ?? [])) as T
  }

  async getCountries(): Promise<Array<Country>> {
    return this.fetchApi<Array<Country>>('/geography/countries/')
  }

  async getRegions(): Promise<Array<RegionAdministrative>> {
    return this.fetchApi<Array<RegionAdministrative>>('/geography/regions/')
  }

  async getAdministrativeUnits(): Promise<Array<AdministrativeUnit>> {
    return this.fetchApi<Array<AdministrativeUnit>>(
      '/geography/administrative-units/',
    )
  }

  async getLocalities(): Promise<Array<Locality>> {
    return this.fetchApi<Array<Locality>>('/geography/localities/')
  }
}
