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

export interface City {
  id: string
  region_id: string
  code: string
  name: string
  type: 'CAPITAL' | 'COMMUNE' | 'VILLE'
}

export interface District {
  id: string
  city_id: string
  code: string
  name: string
  type: 'QUARTIER' | 'DISTRICT'
}

export interface GeographyDataAdapter {
  getCountries: () => Promise<Array<Country>>
  getRegions: () => Promise<Array<RegionAdministrative>>
  getCities: () => Promise<Array<City>>
  getDistricts: () => Promise<Array<District>>
  createCountry: (data: Omit<Country, 'id'>) => Promise<Country>
  updateCountry: (id: string, data: Partial<Country>) => Promise<Country>
  deleteCountry: (id: string) => Promise<void>
  createRegion: (data: Omit<RegionAdministrative, 'id'>) => Promise<RegionAdministrative>
  updateRegion: (id: string, data: Partial<RegionAdministrative>) => Promise<RegionAdministrative>
  deleteRegion: (id: string) => Promise<void>
  createCity: (data: Omit<City, 'id'>) => Promise<City>
  updateCity: (id: string, data: Partial<City>) => Promise<City>
  deleteCity: (id: string) => Promise<void>
  createDistrict: (data: Omit<District, 'id'>) => Promise<District>
  updateDistrict: (id: string, data: Partial<District>) => Promise<District>
  deleteDistrict: (id: string) => Promise<void>
}
