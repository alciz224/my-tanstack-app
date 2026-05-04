export interface Country {
  id: string;
  code: string;
  name: string;
  description?: string;
}

export interface RegionAdministrative {
  id: string;
  country_id: string;
  code: string;
  name: string;
  description?: string;
}

export interface AdministrativeUnit {
  id: string;
  region_id: string;
  parent_id?: string | null;
  code: string;
  name: string;
  type: 'PREFECTURE' | 'COMMUNE' | 'SUBPREFECTURE';
}

export interface Locality {
  id: string;
  administrative_unit_id: string;
  code: string;
  name: string;
}

export interface GeographyDataAdapter {
  getCountries(): Promise<Country[]>;
  getRegions(): Promise<RegionAdministrative[]>;
  getAdministrativeUnits(): Promise<AdministrativeUnit[]>;
  getLocalities(): Promise<Locality[]>;
}
