import {
  mockAdminUnits,
  mockCountries,
  mockLocalities,
  mockRegions,
} from './mocks'
import type {
  AdministrativeUnit,
  Country,
  GeographyDataAdapter,
  Locality,
  RegionAdministrative,
} from './types'

export class LocalGeographyAdapter implements GeographyDataAdapter {
  private countries = [...mockCountries]
  private regions = [...mockRegions]
  private adminUnits = [...mockAdminUnits]
  private localities = [...mockLocalities]

  private async delay(ms = 300) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async getCountries(): Promise<Array<Country>> {
    await this.delay()
    return this.countries.map((c) => ({ ...c }))
  }

  async getRegions(): Promise<Array<RegionAdministrative>> {
    await this.delay()
    return this.regions.map((r) => ({ ...r }))
  }

  async getAdministrativeUnits(): Promise<Array<AdministrativeUnit>> {
    await this.delay()
    return this.adminUnits.map((a) => ({ ...a }))
  }

  async getLocalities(): Promise<Array<Locality>> {
    await this.delay()
    return this.localities.map((l) => ({ ...l }))
  }
}
