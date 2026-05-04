import type { Country, RegionAdministrative, AdministrativeUnit, Locality } from './types';

export const mockCountries: Country[] = [
  { id: 'GN', code: 'GN', name: 'Guinée', description: 'République de Guinée' },
];

export const mockRegions: RegionAdministrative[] = [
  { id: 'REG-CON', country_id: 'GN', code: 'CON', name: 'Conakry', description: 'Zone Spéciale de Conakry (IRE Conakry)' },
  { id: 'REG-KIN', country_id: 'GN', code: 'KIN', name: 'Kindia', description: 'IRE Kindia' },
  { id: 'REG-BOK', country_id: 'GN', code: 'BOK', name: 'Boké', description: 'IRE Boké' },
];

export const mockAdminUnits: AdministrativeUnit[] = [
  { id: 'ADM-RAT', region_id: 'REG-CON', code: 'RAT', name: 'Ratoma', type: 'COMMUNE' },
  { id: 'ADM-DIX', region_id: 'REG-CON', code: 'DIX', name: 'Dixinn', type: 'COMMUNE' },
  { id: 'ADM-KAL', region_id: 'REG-CON', code: 'KAL', name: 'Kaloum', type: 'COMMUNE' },
  { id: 'ADM-COY', region_id: 'REG-KIN', code: 'COY', name: 'Coyah', type: 'PREFECTURE' },
  { id: 'ADM-MAN', region_id: 'REG-KIN', code: 'MAN', name: 'Maneah', type: 'SUBPREFECTURE', parent_id: 'ADM-COY' },
];

export const mockLocalities: Locality[] = [
  { id: 'LOC-KIP', administrative_unit_id: 'ADM-RAT', code: 'KIP', name: 'Kipé' },
  { id: 'LOC-NON', administrative_unit_id: 'ADM-RAT', code: 'NON', name: 'Nongo' },
  { id: 'LOC-KAM', administrative_unit_id: 'ADM-DIX', code: 'KAM', name: 'Cameroun' },
];
