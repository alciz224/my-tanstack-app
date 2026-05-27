import { mockAdministrativeUnits, mockCountries, mockLocalities, mockRegions } from './mocks'
import type {
  AdministrativeUnit,
  Country,
  GeographyDataAdapter,
  Locality,
  RegionAdministrative,
} from './types'

export class LocalGeographyAdapter implements GeographyDataAdapter {
  private countries = structuredClone(mockCountries)
  private regions = structuredClone(mockRegions)
  private administrativeUnits = structuredClone(mockAdministrativeUnits)
  private localities = structuredClone(mockLocalities)

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

  async getAdministrativeUnits() {
    await this.delay()
    return structuredClone(this.administrativeUnits)
  }

  async getLocalities() {
    await this.delay()
    return structuredClone(this.localities)
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
    if (this.administrativeUnits.some((au) => au.region_id === id)) {
      throw new Error('Cannot delete region with existing administrative units')
    }
    this.regions.splice(idx, 1)
  }

  async createAdministrativeUnit(data: Omit<AdministrativeUnit, 'id'>) {
    await this.delay()
    const id = `AU-${data.code}`
    const item: AdministrativeUnit = { id, ...data }
    this.administrativeUnits.push(item)
    return structuredClone(item)
  }

  async updateAdministrativeUnit(id: string, data: Partial<AdministrativeUnit>) {
    await this.delay()
    const idx = this.administrativeUnits.findIndex((au) => au.id === id)
    if (idx === -1) throw new Error('AdministrativeUnit not found')
    this.administrativeUnits[idx] = { ...this.administrativeUnits[idx], ...data }
    return structuredClone(this.administrativeUnits[idx])
  }

  async deleteAdministrativeUnit(id: string) {
    await this.delay()
    const idx = this.administrativeUnits.findIndex((au) => au.id === id)
    if (idx === -1) throw new Error('AdministrativeUnit not found')
    if (this.localities.some((loc) => loc.administrative_unit_id === id)) {
      throw new Error('Cannot delete administrative unit with existing localities')
    }
    this.administrativeUnits.splice(idx, 1)
  }

  async createLocality(data: Omit<Locality, 'id'>) {
    await this.delay()
    const id = `LOC-${data.code}`
    const item: Locality = { id, ...data }
    this.localities.push(item)
    return structuredClone(item)
  }

  async updateLocality(id: string, data: Partial<Locality>) {
    await this.delay()
    const idx = this.localities.findIndex((loc) => loc.id === id)
    if (idx === -1) throw new Error('Locality not found')
    this.localities[idx] = { ...this.localities[idx], ...data }
    return structuredClone(this.localities[idx])
  }

  async deleteLocality(id: string) {
    await this.delay()
    const idx = this.localities.findIndex((loc) => loc.id === id)
    if (idx === -1) throw new Error('Locality not found')
    this.localities.splice(idx, 1)
  }
}
