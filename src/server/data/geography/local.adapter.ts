import { mockCities, mockCountries, mockDistricts, mockRegions } from './mocks'
import type {
  City,
  Country,
  District,
  GeographyDataAdapter,
  RegionAdministrative,
} from './types'

export class LocalGeographyAdapter implements GeographyDataAdapter {
  private countries = structuredClone(mockCountries)
  private regions = structuredClone(mockRegions)
  private cities = structuredClone(mockCities)
  private districts = structuredClone(mockDistricts)

  private async delay(ms = 200) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async getCountries() {
    await this.delay()
    return structuredClone(this.countries)
  }

  async getRegions() {
    await this.delay()
    return structuredClone(this.regions)
  }

  async getCities() {
    await this.delay()
    return structuredClone(this.cities)
  }

  async getDistricts() {
    await this.delay()
    return structuredClone(this.districts)
  }

  async createCountry(data: Omit<Country, 'id'>) {
    await this.delay()
    const id = `CTY-${data.code}`
    const item: Country = { id, ...data }
    this.countries.push(item)
    return structuredClone(item)
  }

  async updateCountry(id: string, data: Partial<Country>) {
    await this.delay()
    const idx = this.countries.findIndex((r) => r.id === id)
    if (idx === -1) throw new Error('Country not found')
    this.countries[idx] = { ...this.countries[idx], ...data }
    return structuredClone(this.countries[idx])
  }

  async deleteCountry(id: string) {
    await this.delay()
    const idx = this.countries.findIndex((r) => r.id === id)
    if (idx === -1) throw new Error('Country not found')
    if (this.regions.some((r) => r.country_id === id)) {
      throw new Error('Cannot delete country with existing regions')
    }
    this.countries.splice(idx, 1)
  }

  async createRegion(data: Omit<RegionAdministrative, 'id'>) {
    await this.delay()
    const id = `REG-${data.code}`
    const item: RegionAdministrative = { id, ...data }
    this.regions.push(item)
    return structuredClone(item)
  }

  async updateRegion(id: string, data: Partial<RegionAdministrative>) {
    await this.delay()
    const idx = this.regions.findIndex((r) => r.id === id)
    if (idx === -1) throw new Error('Region not found')
    this.regions[idx] = { ...this.regions[idx], ...data }
    return structuredClone(this.regions[idx])
  }

  async deleteRegion(id: string) {
    await this.delay()
    const idx = this.regions.findIndex((r) => r.id === id)
    if (idx === -1) throw new Error('Region not found')
    if (this.cities.some((c) => c.region_id === id)) {
      throw new Error('Cannot delete region with existing cities')
    }
    this.regions.splice(idx, 1)
  }

  async createCity(data: Omit<City, 'id'>) {
    await this.delay()
    const id = `CIT-${data.code}`
    const item: City = { id, ...data }
    this.cities.push(item)
    return structuredClone(item)
  }

  async updateCity(id: string, data: Partial<City>) {
    await this.delay()
    const idx = this.cities.findIndex((c) => c.id === id)
    if (idx === -1) throw new Error('City not found')
    this.cities[idx] = { ...this.cities[idx], ...data }
    return structuredClone(this.cities[idx])
  }

  async deleteCity(id: string) {
    await this.delay()
    const idx = this.cities.findIndex((c) => c.id === id)
    if (idx === -1) throw new Error('City not found')
    if (this.districts.some((d) => d.city_id === id)) {
      throw new Error('Cannot delete city with existing districts')
    }
    this.cities.splice(idx, 1)
  }

  async createDistrict(data: Omit<District, 'id'>) {
    await this.delay()
    const id = `DST-${data.code}`
    const item: District = { id, ...data }
    this.districts.push(item)
    return structuredClone(item)
  }

  async updateDistrict(id: string, data: Partial<District>) {
    await this.delay()
    const idx = this.districts.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error('District not found')
    this.districts[idx] = { ...this.districts[idx], ...data }
    return structuredClone(this.districts[idx])
  }

  async deleteDistrict(id: string) {
    await this.delay()
    const idx = this.districts.findIndex((d) => d.id === id)
    if (idx === -1) throw new Error('District not found')
    this.districts.splice(idx, 1)
  }
}
