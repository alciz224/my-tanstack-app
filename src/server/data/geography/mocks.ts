import type {
  AdministrativeUnit,
  Country,
  Locality,
  RegionAdministrative,
} from './types'

// Guinea - 8 regions + Conakry
export const mockCountries: Array<Country> = [
  { id: 'GN', code: 'GN', name: 'Guinée', description: 'République de Guinée' },
]

// All 8 regions of Guinea + Conakry
export const mockRegions: Array<RegionAdministrative> = [
  {
    id: 'REG-CON',
    country_id: 'GN',
    code: 'CON',
    name: 'Conakry',
    description: 'Capitale nationale, Zone Spéciale',
  },
  {
    id: 'REG-BOK',
    country_id: 'GN',
    code: 'BOK',
    name: 'Boké',
    description: 'Région minière (bauxite)',
  },
  {
    id: 'REG-FAR',
    country_id: 'GN',
    code: 'FAR',
    name: 'Faranah',
    description: 'Région forestière',
  },
  {
    id: 'REG-KAN',
    country_id: 'GN',
    code: 'KAN',
    name: 'Kankan',
    description: 'Région du Haute-Guinée',
  },
  {
    id: 'REG-KIN',
    country_id: 'GN',
    code: 'KIN',
    name: 'Kindia',
    description: 'Région de la Basse-Guinée',
  },
  {
    id: 'REG-LAB',
    country_id: 'GN',
    code: 'LAB',
    name: 'Labé',
    description: 'Région du Fouta Djallon',
  },
  {
    id: 'REG-MAM',
    country_id: 'GN',
    code: 'MAM',
    name: 'Mamou',
    description: 'Région du Fouta Djallon',
  },
  {
    id: 'REG-NZE',
    country_id: 'GN',
    code: 'NZE',
    name: 'Nzérékoré',
    description: 'Région forestière, Guinea forestière',
  },
]

// Communes/Prefectures
export const mockAdminUnits: Array<AdministrativeUnit> = [
  // Conakry (5 communes)
  {
    id: 'ADM-KAL',
    region_id: 'REG-CON',
    code: 'KAL',
    name: 'Kaloum',
    type: 'COMMUNE',
  },
  {
    id: 'ADM-DIX',
    region_id: 'REG-CON',
    code: 'DIX',
    name: 'Dixinn',
    type: 'COMMUNE',
  },
  {
    id: 'ADM-RAT',
    region_id: 'REG-CON',
    code: 'RAT',
    name: 'Ratoma',
    type: 'COMMUNE',
  },
  {
    id: 'ADM-MAT',
    region_id: 'REG-CON',
    code: 'MAT',
    name: 'Matam',
    type: 'COMMUNE',
  },
  {
    id: 'ADM-COY',
    region_id: 'REG-CON',
    code: 'COY',
    name: 'Coyah',
    type: 'COMMUNE',
  },

  // Boké region
  {
    id: 'ADM-BOK',
    region_id: 'REG-BOK',
    code: 'BOK',
    name: 'Boké',
    type: 'PREFECTURE',
  },
  {
    id: 'ADM-FRI',
    region_id: 'REG-BOK',
    code: 'FRI',
    name: 'Fria',
    type: 'PREFECTURE',
  },
  {
    id: 'ADM-GAU',
    region_id: 'REG-BOK',
    code: 'GAU',
    name: 'Gaoual',
    type: 'PREFECTURE',
  },
  {
    id: 'ADM-KOU',
    region_id: 'REG-BOK',
    code: 'KOU',
    name: 'Kounsitel',
    type: 'PREFECTURE',
  },
  {
    id: 'ADM-TOY',
    region_id: 'REG-BOK',
    code: 'TOY',
    name: 'Tougué',
    type: 'PREFECTURE',
  },

  // Kindia region
  {
    id: 'ADM-KIN',
    region_id: 'REG-KIN',
    code: 'KIN',
    name: 'Kindia',
    type: 'PREFECTURE',
  },
  {
    id: 'ADM-FOR',
    region_id: 'REG-KIN',
    code: 'FOR',
    name: 'Forécariah',
    type: 'PREFECTURE',
  },
  {
    id: 'ADM-FRE',
    region_id: 'REG-KIN',
    code: 'FRE',
    name: 'Frélah',
    type: 'PREFECTURE',
  },
  {
    id: 'ADM-DUB',
    region_id: 'REG-KIN',
    code: 'DUB',
    name: 'Dubréka',
    type: 'PREFECTURE',
  },
  {
    id: 'ADM-TEL',
    region_id: 'REG-KIN',
    code: 'TEL',
    name: 'Telimélé',
    type: 'PREFECTURE',
  },

  // Kankan region
  {
    id: 'ADM-KAN',
    region_id: 'REG-KAN',
    code: 'KAN',
    name: 'Kankan',
    type: 'PREFECTURE',
  },
  {
    id: 'ADM-KER',
    region_id: 'REG-KAN',
    code: 'KER',
    name: 'Kérouané',
    type: 'PREFECTURE',
  },
  {
    id: 'ADM-SIG',
    region_id: 'REG-KAN',
    code: 'SIG',
    name: 'Siguiri',
    type: 'PREFECTURE',
  },
  {
    id: 'ADM-KOU',
    region_id: 'REG-KAN',
    code: 'KOU',
    name: 'Kouroussa',
    type: 'PREFECTURE',
  },
  {
    id: 'ADM-MAND',
    region_id: 'REG-KAN',
    code: 'MAND',
    name: 'Mandiana',
    type: 'PREFECTURE',
  },

  // Nzérékoré region
  {
    id: 'ADM-NZE',
    region_id: 'REG-NZE',
    code: 'NZE',
    name: 'Nzérékoré',
    type: 'PREFECTURE',
  },
  {
    id: 'ADM-MAC',
    region_id: 'REG-NZE',
    code: 'MAC',
    name: 'Macenta',
    type: 'PREFECTURE',
  },
  {
    id: 'ADM-YOM',
    region_id: 'REG-NZE',
    code: 'YOM',
    name: 'Yomou',
    type: 'PREFECTURE',
  },
  {
    id: 'ADM-BEY',
    region_id: 'REG-NZE',
    code: 'BEY',
    name: 'Beyla',
    type: 'PREFECTURE',
  },
  {
    id: 'ADM-LOU',
    region_id: 'REG-NZE',
    code: 'LOU',
    name: 'Lola',
    type: 'PREFECTURE',
  },

  // Labé region
  {
    id: 'ADM-LAB',
    region_id: 'REG-LAB',
    code: 'LAB',
    name: 'Labé',
    type: 'PREFECTURE',
  },
  {
    id: 'ADM-DAL',
    region_id: 'REG-LAB',
    code: 'DAL',
    name: 'Dalaba',
    type: 'PREFECTURE',
  },
  {
    id: 'ADM-FOU',
    region_id: 'REG-LAB',
    code: 'FOU',
    name: 'Fouta',
    type: 'PREFECTURE',
  },
  {
    id: 'ADM-KOU',
    region_id: 'REG-LAB',
    code: 'KOU',
    name: 'Koulountou',
    type: 'PREFECTURE',
  },
  {
    id: 'ADM-GAY',
    region_id: 'REG-LAB',
    code: 'GAY',
    name: 'Gaya',
    type: 'PREFECTURE',
  },

  // Mamou region
  {
    id: 'ADM-MAM',
    region_id: 'REG-MAM',
    code: 'MAM',
    name: 'Mamou',
    type: 'PREFECTURE',
  },
  {
    id: 'ADM-PIT',
    region_id: 'REG-MAM',
    code: 'PIT',
    name: 'Pita',
    type: 'PREFECTURE',
  },
  {
    id: 'ADM-TIM',
    region_id: 'REG-MAM',
    code: 'TIM',
    name: 'Timbo',
    type: 'PREFECTURE',
  },
  {
    id: 'ADM-KAB',
    region_id: 'REG-MAM',
    code: 'KAB',
    name: 'Kébougou',
    type: 'PREFECTURE',
  },
  {
    id: 'ADM-ROU',
    region_id: 'REG-MAM',
    code: 'ROU',
    name: 'Rouma',
    type: 'PREFECTURE',
  },

  // Faranah region
  {
    id: 'ADM-FAR',
    region_id: 'REG-FAR',
    code: 'FAR',
    name: 'Faranah',
    type: 'PREFECTURE',
  },
  {
    id: 'ADM-DAB',
    region_id: 'REG-FAR',
    code: 'DAB',
    name: 'Dabola',
    type: 'PREFECTURE',
  },
  {
    id: 'ADM-DING',
    region_id: 'REG-FAR',
    code: 'DING',
    name: 'Dinguiraye',
    type: 'PREFECTURE',
  },
  {
    id: 'ADM-KIS',
    region_id: 'REG-FAR',
    code: 'KIS',
    name: 'Kissidougou',
    type: 'PREFECTURE',
  },
  {
    id: 'ADM-FAY',
    region_id: 'REG-FAR',
    code: 'FAY',
    name: 'Fakoya',
    type: 'PREFECTURE',
  },
]

// Localities/Cities
export const mockLocalities: Array<Locality> = [
  // Conakry
  {
    id: 'LOC-CON',
    administrative_unit_id: 'ADM-KAL',
    code: 'CON-CENT',
    name: 'Centre Commercial',
  },
  {
    id: 'LOC-KAL',
    administrative_unit_id: 'ADM-KAL',
    code: 'KAL-1',
    name: 'Boulbinet',
  },
  {
    id: 'LOC-DIX',
    administrative_unit_id: 'ADM-DIX',
    code: 'DIX-1',
    name: 'Bambéto',
  },
  {
    id: 'LOC-RAT',
    administrative_unit_id: 'ADM-RAT',
    code: 'RAT-1',
    name: 'Taïya',
  },
  {
    id: 'LOC-MAT',
    administrative_unit_id: 'ADM-MAT',
    code: 'MAT-1',
    name: 'Matam Centre',
  },
  {
    id: 'LOC-COY',
    administrative_unit_id: 'ADM-COY',
    code: 'COY-1',
    name: 'Coyah Centre',
  },

  // Boké
  {
    id: 'LOC-BOK',
    administrative_unit_id: 'ADM-BOK',
    code: 'BOK-1',
    name: 'Boké Ville',
  },
  {
    id: 'LOC-FRI',
    administrative_unit_id: 'ADM-FRI',
    code: 'FRI-1',
    name: 'Fria Ville',
  },

  // Kindia
  {
    id: 'LOC-KIN',
    administrative_unit_id: 'ADM-KIN',
    code: 'KIN-1',
    name: 'Kindia Ville',
  },
  {
    id: 'LOC-FOR',
    administrative_unit_id: 'ADM-FOR',
    code: 'FOR-1',
    name: 'Forécariah',
  },

  // Kankan
  {
    id: 'LOC-KAN',
    administrative_unit_id: 'ADM-KAN',
    code: 'KAN-1',
    name: 'Kankan Ville',
  },
  {
    id: 'LOC-SIG',
    administrative_unit_id: 'ADM-SIG',
    code: 'SIG-1',
    name: 'Siguiri',
  },

  // Nzérékoré
  {
    id: 'LOC-NZE',
    administrative_unit_id: 'ADM-NZE',
    code: 'NZE-1',
    name: 'Nzérékoré Ville',
  },
  {
    id: 'LOC-MAC',
    administrative_unit_id: 'ADM-MAC',
    code: 'MAC-1',
    name: 'Macenta',
  },

  // Labé
  {
    id: 'LOC-LAB',
    administrative_unit_id: 'ADM-LAB',
    code: 'LAB-1',
    name: 'Labé Ville',
  },
  {
    id: 'LOC-DAL',
    administrative_unit_id: 'ADM-DAL',
    code: 'DAL-1',
    name: 'Dalaba',
  },

  // Mamou
  {
    id: 'LOC-MAM',
    administrative_unit_id: 'ADM-MAM',
    code: 'MAM-1',
    name: 'Mamou Ville',
  },
  {
    id: 'LOC-PIT',
    administrative_unit_id: 'ADM-PIT',
    code: 'PIT-1',
    name: 'Pita',
  },

  // Faranah
  {
    id: 'LOC-FAR',
    administrative_unit_id: 'ADM-FAR',
    code: 'FAR-1',
    name: 'Faranah Ville',
  },
  {
    id: 'LOC-KIS',
    administrative_unit_id: 'ADM-KIS',
    code: 'KIS-1',
    name: 'Kissidougou',
  },
]

export type {
  Country,
  RegionAdministrative,
  AdministrativeUnit,
  Locality,
} from './types'
