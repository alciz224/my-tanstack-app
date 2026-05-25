import type {
  City,
  Country,
  District,
  RegionAdministrative,
} from './types'

export const mockCountries: Array<Country> = [
  { id: 'GN', code: 'GN', name: 'Guinée', description: 'République de Guinée' },
]

export const mockRegions: Array<RegionAdministrative> = [
  { id: 'REG-CON', country_id: 'GN', code: 'CON', name: 'Conakry', description: 'Zone Spéciale — Capitale nationale' },
  { id: 'REG-BOK', country_id: 'GN', code: 'BOK', name: 'Boké', description: 'Région minière (bauxite)' },
  { id: 'REG-FAR', country_id: 'GN', code: 'FAR', name: 'Faranah', description: 'Région forestière' },
  { id: 'REG-KAN', country_id: 'GN', code: 'KAN', name: 'Kankan', description: 'Haute-Guinée' },
  { id: 'REG-KIN', country_id: 'GN', code: 'KIN', name: 'Kindia', description: 'Basse-Guinée' },
  { id: 'REG-LAB', country_id: 'GN', code: 'LAB', name: 'Labé', description: 'Fouta Djallon' },
  { id: 'REG-MAM', country_id: 'GN', code: 'MAM', name: 'Mamou', description: 'Fouta Djallon' },
  { id: 'REG-NZE', country_id: 'GN', code: 'NZE', name: 'Nzérékoré', description: 'Guinée forestière' },
]

export const mockCities: Array<City> = [
  // Conakry — 5 communes
  { id: 'CIT-KAL', region_id: 'REG-CON', code: 'KAL', name: 'Kaloum', type: 'COMMUNE' },
  { id: 'CIT-DIX', region_id: 'REG-CON', code: 'DIX', name: 'Dixinn', type: 'COMMUNE' },
  { id: 'CIT-RAT', region_id: 'REG-CON', code: 'RAT', name: 'Ratoma', type: 'COMMUNE' },
  { id: 'CIT-MAT', region_id: 'REG-CON', code: 'MAT', name: 'Matam', type: 'COMMUNE' },
  { id: 'CIT-MTO', region_id: 'REG-CON', code: 'MTO', name: 'Matoto', type: 'COMMUNE' },

  // Boké
  { id: 'CIT-BOK', region_id: 'REG-BOK', code: 'BOK', name: 'Boké', type: 'VILLE' },
  { id: 'CIT-FRI', region_id: 'REG-BOK', code: 'FRI', name: 'Fria', type: 'VILLE' },
  { id: 'CIT-GAU', region_id: 'REG-BOK', code: 'GAU', name: 'Gaoual', type: 'VILLE' },
  { id: 'CIT-KOU', region_id: 'REG-BOK', code: 'KOU', name: 'Koundara', type: 'VILLE' },

  // Kindia
  { id: 'CIT-KIN', region_id: 'REG-KIN', code: 'KIN', name: 'Kindia', type: 'VILLE' },
  { id: 'CIT-FOR', region_id: 'REG-KIN', code: 'FOR', name: 'Forécariah', type: 'VILLE' },
  { id: 'CIT-DUB', region_id: 'REG-KIN', code: 'DUB', name: 'Dubréka', type: 'VILLE' },
  { id: 'CIT-TEL', region_id: 'REG-KIN', code: 'TEL', name: 'Télimélé', type: 'VILLE' },

  // Kankan
  { id: 'CIT-KAN', region_id: 'REG-KAN', code: 'KAN', name: 'Kankan', type: 'VILLE' },
  { id: 'CIT-KER', region_id: 'REG-KAN', code: 'KER', name: 'Kérouané', type: 'VILLE' },
  { id: 'CIT-SIG', region_id: 'REG-KAN', code: 'SIG', name: 'Siguiri', type: 'VILLE' },
  { id: 'CIT-KRS', region_id: 'REG-KAN', code: 'KRS', name: 'Kouroussa', type: 'VILLE' },
  { id: 'CIT-MAN', region_id: 'REG-KAN', code: 'MAN', name: 'Mandiana', type: 'VILLE' },

  // Labé
  { id: 'CIT-LAB', region_id: 'REG-LAB', code: 'LAB', name: 'Labé', type: 'VILLE' },
  { id: 'CIT-DAL', region_id: 'REG-LAB', code: 'DAL', name: 'Dalaba', type: 'VILLE' },

  // Mamou
  { id: 'CIT-MAM', region_id: 'REG-MAM', code: 'MAM', name: 'Mamou', type: 'VILLE' },
  { id: 'CIT-PIT', region_id: 'REG-MAM', code: 'PIT', name: 'Pita', type: 'VILLE' },

  // Faranah
  { id: 'CIT-FAR', region_id: 'REG-FAR', code: 'FAR', name: 'Faranah', type: 'VILLE' },
  { id: 'CIT-DAB', region_id: 'REG-FAR', code: 'DAB', name: 'Dabola', type: 'VILLE' },
  { id: 'CIT-DIN', region_id: 'REG-FAR', code: 'DIN', name: 'Dinguiraye', type: 'VILLE' },
  { id: 'CIT-KIS', region_id: 'REG-FAR', code: 'KIS', name: 'Kissidougou', type: 'VILLE' },

  // Nzérékoré
  { id: 'CIT-NZE', region_id: 'REG-NZE', code: 'NZE', name: 'Nzérékoré', type: 'VILLE' },
  { id: 'CIT-MAC', region_id: 'REG-NZE', code: 'MAC', name: 'Macenta', type: 'VILLE' },
  { id: 'CIT-YOM', region_id: 'REG-NZE', code: 'YOM', name: 'Yomou', type: 'VILLE' },
  { id: 'CIT-BEY', region_id: 'REG-NZE', code: 'BEY', name: 'Beyla', type: 'VILLE' },
  { id: 'CIT-LOL', region_id: 'REG-NZE', code: 'LOL', name: 'Lola', type: 'VILLE' },
]

export const mockDistricts: Array<District> = [
  // === Conakry: Kaloum ===
  { id: 'DST-CON-CEN', city_id: 'CIT-KAL', code: 'CON-CEN', name: 'Centre Commercial', type: 'QUARTIER' },
  { id: 'DST-CON-BOU', city_id: 'CIT-KAL', code: 'CON-BOU', name: 'Boulbinet', type: 'QUARTIER' },
  { id: 'DST-CON-COR', city_id: 'CIT-KAL', code: 'CON-COR', name: 'Coronthie', type: 'QUARTIER' },
  { id: 'DST-CON-ALM', city_id: 'CIT-KAL', code: 'CON-ALM', name: 'Almamya', type: 'QUARTIER' },
  { id: 'DST-CON-SAN', city_id: 'CIT-KAL', code: 'CON-SAN', name: 'Sandervalia', type: 'QUARTIER' },

  // Conakry: Dixinn
  { id: 'DST-DIX-BAM', city_id: 'CIT-DIX', code: 'DIX-BAM', name: 'Bambéto', type: 'QUARTIER' },
  { id: 'DST-DIX-CEN', city_id: 'CIT-DIX', code: 'DIX-CEN', name: 'Dixinn Centre', type: 'QUARTIER' },
  { id: 'DST-DIX-MIN', city_id: 'CIT-DIX', code: 'DIX-MIN', name: 'Minière', type: 'QUARTIER' },
  { id: 'DST-DIX-CAM', city_id: 'CIT-DIX', code: 'DIX-CAM', name: 'Cameroun', type: 'QUARTIER' },
  { id: 'DST-DIX-LAN', city_id: 'CIT-DIX', code: 'DIX-LAN', name: 'Landréah', type: 'QUARTIER' },

  // Conakry: Ratoma
  { id: 'DST-RAT-TAI', city_id: 'CIT-RAT', code: 'RAT-TAI', name: 'Taïya', type: 'QUARTIER' },
  { id: 'DST-RAT-CEN', city_id: 'CIT-RAT', code: 'RAT-CEN', name: 'Ratoma Centre', type: 'QUARTIER' },
  { id: 'DST-RAT-HAF', city_id: 'CIT-RAT', code: 'RAT-HAF', name: 'Hafia', type: 'QUARTIER' },
  { id: 'DST-RAT-GBE', city_id: 'CIT-RAT', code: 'RAT-GBE', name: 'Gbessia', type: 'QUARTIER' },
  { id: 'DST-RAT-KOL', city_id: 'CIT-RAT', code: 'RAT-KOL', name: 'Koloma', type: 'QUARTIER' },

  // Conakry: Matam
  { id: 'DST-MAT-CEN', city_id: 'CIT-MAT', code: 'MAT-CEN', name: 'Matam Centre', type: 'QUARTIER' },
  { id: 'DST-MAT-MAD', city_id: 'CIT-MAT', code: 'MAT-MAD', name: 'Madina', type: 'QUARTIER' },
  { id: 'DST-MAT-KIP', city_id: 'CIT-MAT', code: 'MAT-KIP', name: 'Kipé', type: 'QUARTIER' },
  { id: 'DST-MAT-BON', city_id: 'CIT-MAT', code: 'MAT-BON', name: 'Bonfi', type: 'QUARTIER' },
  { id: 'DST-MAT-YIM', city_id: 'CIT-MAT', code: 'MAT-YIM', name: 'Yimbaya', type: 'QUARTIER' },

  // Conakry: Matoto
  { id: 'DST-MTO-CEN', city_id: 'CIT-MTO', code: 'MTO-CEN', name: 'Matoto Centre', type: 'QUARTIER' },
  { id: 'DST-MTO-KAG', city_id: 'CIT-MTO', code: 'MTO-KAG', name: 'Kagbélén', type: 'QUARTIER' },
  { id: 'DST-MTO-SIM', city_id: 'CIT-MTO', code: 'MTO-SIM', name: 'Simbaya', type: 'QUARTIER' },
  { id: 'DST-MTO-WAN', city_id: 'CIT-MTO', code: 'MTO-WAN', name: 'Wanindara', type: 'QUARTIER' },
  { id: 'DST-MTO-DAB', city_id: 'CIT-MTO', code: 'MTO-DAB', name: 'Dabondi', type: 'QUARTIER' },

  // === Boké ===
  { id: 'DST-BOK-VIL', city_id: 'CIT-BOK', code: 'BOK-VIL', name: 'Boké Ville', type: 'QUARTIER' },
  { id: 'DST-BOK-KAM', city_id: 'CIT-BOK', code: 'BOK-KAM', name: 'Kamsar', type: 'QUARTIER' },
  { id: 'DST-BOK-KAW', city_id: 'CIT-BOK', code: 'BOK-KAW', name: 'Kawassi', type: 'QUARTIER' },
  { id: 'DST-FRI-CEN', city_id: 'CIT-FRI', code: 'FRI-CEN', name: 'Fria Centre', type: 'QUARTIER' },
  { id: 'DST-FRI-KIM', city_id: 'CIT-FRI', code: 'FRI-KIM', name: 'Kimbo', type: 'QUARTIER' },
  { id: 'DST-GAU-CEN', city_id: 'CIT-GAU', code: 'GAU-CEN', name: 'Gaoual Centre', type: 'QUARTIER' },
  { id: 'DST-GAU-KAK', city_id: 'CIT-GAU', code: 'GAU-KAK', name: 'Kakoni', type: 'QUARTIER' },
  { id: 'DST-KOU-CEN', city_id: 'CIT-KOU', code: 'KOU-CEN', name: 'Koundara Centre', type: 'QUARTIER' },

  // === Kindia ===
  { id: 'DST-KIN-CEN', city_id: 'CIT-KIN', code: 'KIN-CEN', name: 'Kindia Centre', type: 'QUARTIER' },
  { id: 'DST-KIN-KAN', city_id: 'CIT-KIN', code: 'KIN-KAN', name: 'Kandia', type: 'QUARTIER' },
  { id: 'DST-KIN-DAM', city_id: 'CIT-KIN', code: 'KIN-DAM', name: 'Damakania', type: 'QUARTIER' },
  { id: 'DST-KIN-MAD', city_id: 'CIT-KIN', code: 'KIN-MAD', name: 'Madina Oula', type: 'QUARTIER' },
  { id: 'DST-KIN-KIT', city_id: 'CIT-KIN', code: 'KIN-KIT', name: 'Kito', type: 'QUARTIER' },
  { id: 'DST-FOR-CEN', city_id: 'CIT-FOR', code: 'FOR-CEN', name: 'Forécariah Centre', type: 'QUARTIER' },
  { id: 'DST-FOR-FAR', city_id: 'CIT-FOR', code: 'FOR-FAR', name: 'Farmoréah', type: 'QUARTIER' },
  { id: 'DST-FOR-KAB', city_id: 'CIT-FOR', code: 'FOR-KAB', name: 'Kaback', type: 'QUARTIER' },
  { id: 'DST-DUB-CEN', city_id: 'CIT-DUB', code: 'DUB-CEN', name: 'Dubréka Centre', type: 'QUARTIER' },
  { id: 'DST-DUB-TAN', city_id: 'CIT-DUB', code: 'DUB-TAN', name: 'Tanéné', type: 'QUARTIER' },
  { id: 'DST-TEL-CEN', city_id: 'CIT-TEL', code: 'TEL-CEN', name: 'Télimélé Centre', type: 'QUARTIER' },
  { id: 'DST-TEL-BOG', city_id: 'CIT-TEL', code: 'TEL-BOG', name: 'Bognè', type: 'QUARTIER' },

  // === Kankan ===
  { id: 'DST-KAN-VIL', city_id: 'CIT-KAN', code: 'KAN-VIL', name: 'Kankan Ville', type: 'QUARTIER' },
  { id: 'DST-KAN-CEN', city_id: 'CIT-KAN', code: 'KAN-CEN', name: 'Kankan Centre', type: 'QUARTIER' },
  { id: 'DST-KAN-BAR', city_id: 'CIT-KAN', code: 'KAN-BAR', name: 'Baro', type: 'QUARTIER' },
  { id: 'DST-KAN-DJE', city_id: 'CIT-KAN', code: 'KAN-DJE', name: 'Djélibakoro', type: 'QUARTIER' },
  { id: 'DST-KER-CEN', city_id: 'CIT-KER', code: 'KER-CEN', name: 'Kérouané Centre', type: 'QUARTIER' },
  { id: 'DST-SIG-CEN', city_id: 'CIT-SIG', code: 'SIG-CEN', name: 'Siguiri Centre', type: 'QUARTIER' },
  { id: 'DST-SIG-DOK', city_id: 'CIT-SIG', code: 'SIG-DOK', name: 'Doko', type: 'QUARTIER' },
  { id: 'DST-SIG-KIN', city_id: 'CIT-SIG', code: 'SIG-KIN', name: 'Kintinian', type: 'QUARTIER' },
  { id: 'DST-KRS-CEN', city_id: 'CIT-KRS', code: 'KRS-CEN', name: 'Kouroussa Centre', type: 'QUARTIER' },
  { id: 'DST-MAN-CEN', city_id: 'CIT-MAN', code: 'MAN-CEN', name: 'Mandiana Centre', type: 'QUARTIER' },

  // === Labé ===
  { id: 'DST-LAB-CEN', city_id: 'CIT-LAB', code: 'LAB-CEN', name: 'Labé Centre', type: 'QUARTIER' },
  { id: 'DST-LAB-TEL', city_id: 'CIT-LAB', code: 'LAB-TEL', name: 'Téliko', type: 'QUARTIER' },
  { id: 'DST-LAB-DAR', city_id: 'CIT-LAB', code: 'LAB-DAR', name: 'Dara', type: 'QUARTIER' },
  { id: 'DST-LAB-HAF', city_id: 'CIT-LAB', code: 'LAB-HAF', name: 'Hafia Labé', type: 'QUARTIER' },
  { id: 'DST-DAL-CEN', city_id: 'CIT-DAL', code: 'DAL-CEN', name: 'Dalaba Centre', type: 'QUARTIER' },
  { id: 'DST-DAL-KEB', city_id: 'CIT-DAL', code: 'DAL-KEB', name: 'Kébali', type: 'QUARTIER' },
  { id: 'DST-DAL-DIT', city_id: 'CIT-DAL', code: 'DAL-DIT', name: 'Ditinn', type: 'QUARTIER' },

  // === Mamou ===
  { id: 'DST-MAM-CEN', city_id: 'CIT-MAM', code: 'MAM-CEN', name: 'Mamou Centre', type: 'QUARTIER' },
  { id: 'DST-MAM-TIM', city_id: 'CIT-MAM', code: 'MAM-TIM', name: 'Timbo', type: 'QUARTIER' },
  { id: 'DST-MAM-SOG', city_id: 'CIT-MAM', code: 'MAM-SOG', name: 'Sogoboli', type: 'QUARTIER' },
  { id: 'DST-PIT-CEN', city_id: 'CIT-PIT', code: 'PIT-CEN', name: 'Pita Centre', type: 'QUARTIER' },
  { id: 'DST-PIT-BAN', city_id: 'CIT-PIT', code: 'PIT-BAN', name: 'Bantignèl', type: 'QUARTIER' },
  { id: 'DST-PIT-YAY', city_id: 'CIT-PIT', code: 'PIT-YAY', name: 'Yaya', type: 'QUARTIER' },

  // === Faranah ===
  { id: 'DST-FAR-VIL', city_id: 'CIT-FAR', code: 'FAR-VIL', name: 'Faranah Ville', type: 'QUARTIER' },
  { id: 'DST-FAR-TIR', city_id: 'CIT-FAR', code: 'FAR-TIR', name: 'Tiro', type: 'QUARTIER' },
  { id: 'DST-FAR-NIA', city_id: 'CIT-FAR', code: 'FAR-NIA', name: 'Nialia', type: 'QUARTIER' },
  { id: 'DST-DAB-CEN', city_id: 'CIT-DAB', code: 'DAB-CEN', name: 'Dabola Centre', type: 'QUARTIER' },
  { id: 'DST-DAB-BIS', city_id: 'CIT-DAB', code: 'DAB-BIS', name: 'Bissikrima', type: 'QUARTIER' },
  { id: 'DST-DIN-CEN', city_id: 'CIT-DIN', code: 'DIN-CEN', name: 'Dinguiraye Centre', type: 'QUARTIER' },
  { id: 'DST-KIS-CEN', city_id: 'CIT-KIS', code: 'KIS-CEN', name: 'Kissidougou Centre', type: 'QUARTIER' },
  { id: 'DST-KIS-YOM', city_id: 'CIT-KIS', code: 'KIS-YOM', name: 'Yombiro', type: 'QUARTIER' },
  { id: 'DST-KIS-FER', city_id: 'CIT-KIS', code: 'KIS-FER', name: 'Fermessadou', type: 'QUARTIER' },

  // === Nzérékoré ===
  { id: 'DST-NZE-VIL', city_id: 'CIT-NZE', code: 'NZE-VIL', name: 'Nzérékoré Ville', type: 'QUARTIER' },
  { id: 'DST-NZE-DOR', city_id: 'CIT-NZE', code: 'NZE-DOR', name: 'Dorota', type: 'QUARTIER' },
  { id: 'DST-NZE-PAL', city_id: 'CIT-NZE', code: 'NZE-PAL', name: 'Palais', type: 'QUARTIER' },
  { id: 'DST-MAC-CEN', city_id: 'CIT-MAC', code: 'MAC-CEN', name: 'Macenta Centre', type: 'QUARTIER' },
  { id: 'DST-MAC-FAS', city_id: 'CIT-MAC', code: 'MAC-FAS', name: 'Fassankoni', type: 'QUARTIER' },
  { id: 'DST-YOM-CEN', city_id: 'CIT-YOM', code: 'YOM-CEN', name: 'Yomou Centre', type: 'QUARTIER' },
  { id: 'DST-BEY-CEN', city_id: 'CIT-BEY', code: 'BEY-CEN', name: 'Beyla Centre', type: 'QUARTIER' },
  { id: 'DST-LOL-CEN', city_id: 'CIT-LOL', code: 'LOL-CEN', name: 'Lola Centre', type: 'QUARTIER' },
]

export type {
  City,
  Country,
  District,
  RegionAdministrative,
} from './types'
