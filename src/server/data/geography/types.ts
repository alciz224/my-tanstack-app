export interface Country {
  id: string
  code: string
  name: string
  description?: string
}

export interface RegionAdministrative {
  id: string
  country_id: string
  code: string
  name: string
  description?: string
}

export interface AdministrativeUnit {
  id: string
  region_id: string
  code: string
  name: string
  type: 'CAPITAL' | 'COMMUNE' | 'VILLE'
}

export interface Locality {
  id: string
  administrative_unit_id: string
  code: string
  name: string
  type: 'QUARTIER' | 'DISTRICT'
}

export interface GeographyDataAdapter {
  getCountries: () => Promise<Array<Country>>
  getRegions: () => Promise<Array<RegionAdministrative>>
  getAdministrativeUnits: () => Promise<Array<AdministrativeUnit>>
  getLocalities: () => Promise<Array<Locality>>
  createCountry: (data: Omit<Country, 'id'>) => Promise<Country>
  updateCountry: (id: string, data: Partial<Country>) => Promise<Country>
  deleteCountry: (id: string) => Promise<void>
  createRegion: (data: Omit<RegionAdministrative, 'id'>) => Promise<RegionAdministrative>
  updateRegion: (id: string, data: Partial<RegionAdministrative>) => Promise<RegionAdministrative>
  deleteRegion: (id: string) => Promise<void>
  createAdministrativeUnit: (data: Omit<AdministrativeUnit, 'id'>) => Promise<AdministrativeUnit>
  updateAdministrativeUnit: (id: string, data: Partial<AdministrativeUnit>) => Promise<AdministrativeUnit>
  deleteAdministrativeUnit: (id: string) => Promise<void>
  createLocality: (data: Omit<Locality, 'id'>) => Promise<Locality>
  updateLocality: (id: string, data: Partial<Locality>) => Promise<Locality>
  deleteLocality: (id: string) => Promise<void>
}
