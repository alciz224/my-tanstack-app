import type { Cycle, Level, Period, Subject, Track } from './types'

// Guinea school system
export const mockCycles: Array<Cycle> = [
  { id: 'PRI', name: 'Primaire', duration: '6 ans', status: 'Active' },
  { id: 'COL', name: 'Collège', duration: '4 ans', status: 'Active' },
  { id: 'LYC', name: 'Lycée', duration: '3 ans', status: 'Active' },
]

export const mockLevels: Array<Level> = [
  // Primaire (1ère à 6ème année)
  { id: 'level-1', cycle_id: 'PRI', code: '1A', name: '1ère Année', order: 1 },
  { id: 'level-2', cycle_id: 'PRI', code: '2A', name: '2ème Année', order: 2 },
  { id: 'level-3', cycle_id: 'PRI', code: '3A', name: '3ème Année', order: 3 },
  { id: 'level-4', cycle_id: 'PRI', code: '4A', name: '4ème Année', order: 4 },
  { id: 'level-5', cycle_id: 'PRI', code: '5A', name: '5ème Année', order: 5 },
  { id: 'level-6', cycle_id: 'PRI', code: '6A', name: '6ème Année', order: 6 },
  // Collège (7ème à 10ème / 3ème)
  { id: 'level-7', cycle_id: 'COL', code: '7A', name: '7ème Année', order: 7 },
  { id: 'level-8', cycle_id: 'COL', code: '8A', name: '8ème Année', order: 8 },
  { id: 'level-9', cycle_id: 'COL', code: '9A', name: '9ème Année', order: 9 },
  {
    id: 'level-10',
    cycle_id: 'COL',
    code: '10A',
    name: '10ème Année',
    order: 10,
  },
  // Lycée (2nde, 1ère, Terminale)
  { id: 'level-11', cycle_id: 'LYC', code: '2NDE', name: '2nde', order: 11 },
  { id: 'level-12', cycle_id: 'LYC', code: '1ERE', name: '1ère', order: 12 },
  {
    id: 'level-13',
    cycle_id: 'LYC',
    code: 'TERM',
    name: 'Terminale',
    order: 13,
  },
]

// Only for Lycée (has_track = true)
export const mockTracks: Array<Track> = [
  {
    id: 'TRK-SM',
    cycle_id: 'LYC',
    code: 'SM',
    name: 'Sciences Mathématiques (SM)',
    status: 'ACTIVE',
  },
  {
    id: 'TRK-SE',
    cycle_id: 'LYC',
    code: 'SE',
    name: 'Sciences Expérimentales (SE)',
    status: 'ACTIVE',
  },
  {
    id: 'TRK-SS',
    cycle_id: 'LYC',
    code: 'SS',
    name: 'Sciences Sociales (SS)',
    status: 'ACTIVE',
  },
  {
    id: 'TRK-TC',
    cycle_id: 'LYC',
    code: 'TC',
    name: 'Technique Commerciale',
    status: 'ACTIVE',
  },
  {
    id: 'TRK-TI',
    cycle_id: 'LYC',
    code: 'TI',
    name: 'Technique Industrielle',
    status: 'ACTIVE',
  },
]

export const mockSubjects: Array<Subject> = [
  {
    id: 'sub-1',
    code: 'MATH',
    name: 'Mathématiques',
    description: 'Mathématiques générales',
  },
  {
    id: 'sub-2',
    code: 'FRAN',
    name: 'Français',
    description: 'Langue et littérature françaises',
  },
  { id: 'sub-3', code: 'ANG', name: 'Anglais', description: 'Langue anglaise' },
  {
    id: 'sub-4',
    code: 'PHY',
    name: 'Physique',
    description: 'Physique-Chimie',
  },
  {
    id: 'sub-5',
    code: 'SVT',
    name: 'SVT',
    description: 'Sciences de la Vie et de la Terre',
  },
  {
    id: 'sub-6',
    code: 'HG',
    name: 'Histoire-Géographie',
    description: 'Histoire et Géographie',
  },
  {
    id: 'sub-7',
    code: 'PHILO',
    name: 'Philosophie',
    description: 'Philosophie',
  },
  {
    id: 'sub-8',
    code: 'EPS',
    name: 'Éducation Physique',
    description: 'Éducation physique et sportive',
  },
  {
    id: 'sub-9',
    code: 'ECM',
    name: 'Éducation au Citoyen',
    description: 'Éducation Civique et Morale',
  },
  {
    id: 'sub-10',
    code: 'ART',
    name: 'Arts',
    description: 'Education artistique',
  },
]

export const mockPeriods: Array<Period> = [
  {
    id: 'p1',
    name: 'Trimestre 1',
    start_date: '2024-09-15',
    end_date: '2024-12-15',
  },
  {
    id: 'p2',
    name: 'Trimestre 2',
    start_date: '2025-01-06',
    end_date: '2025-03-31',
  },
  {
    id: 'p3',
    name: 'Trimestre 3',
    start_date: '2025-04-14',
    end_date: '2025-06-30',
  },
]

export type { Cycle, Level, Track, Subject, Period } from './types'
