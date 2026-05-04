import type { GeographyDataAdapter, Country, RegionAdministrative, AdministrativeUnit, Locality } from './types';
import { mockCountries, mockRegions, mockAdminUnits, mockLocalities } from './mocks';

export class LocalGeographyAdapter implements GeographyDataAdapter {
  private countries = [...mockCountries];
  private regions = [...mockRegions];
  private adminUnits = [...mockAdminUnits];
  private localities = [...mockLocalities];

  private async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getCountries(): Promise<Country[]> {
    await this.delay();
    return this.countries.map(c => ({ ...c }));
  }

  async getRegions(): Promise<RegionAdministrative[]> {
    await this.delay();
    return this.regions.map(r => ({ ...r }));
  }

  async getAdministrativeUnits(): Promise<AdministrativeUnit[]> {
    await this.delay();
    return this.adminUnits.map(a => ({ ...a }));
  }

  async getLocalities(): Promise<Locality[]> {
    await this.delay();
    return this.localities.map(l => ({ ...l }));
  }
}
