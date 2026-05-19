import type {
  Classroom,
  School,
  SchoolYear,
  SchoolYearCycle,
  SchoolYearLevel,
  SchoolYearLevelSubject,
} from './types'

// Real Guinea schools
export const mockSchools: Array<School> = [
  {
    id: 'school-1',
    name: 'Complexe Scolaire Excellence',
    code: 'EXC-001',
    locality_id: 'LOC-CON',
    address: 'Ratoma, Conakry',
    phone: '+224 622 12 34 56',
    email: 'contact@excellence.edu.gn',
    created_at: new Date().toISOString(),
  },
  {
    id: 'school-2',
    name: 'Lycée Don Bosco',
    code: 'DBC-001',
    locality_id: 'LOC-CON',
    address: 'Kaloum, Conakry',
    phone: '+224 624 11 22 33',
    email: 'info@donbosco.edu.gn',
    created_at: new Date().toISOString(),
  },
  {
    id: 'school-3',
    name: 'École Primaire Charles de Gaulle',
    name_fr: 'École Charles de Gaulle',
    code: 'CDG-001',
    locality_id: 'LOC-KIN',
    address: 'Kindia Centre',
    phone: '+224 626 33 44 55',
    email: 'contact@cdgkindia.edu.gn',
    created_at: new Date().toISOString(),
  },
  {
    id: 'school-4',
    name: 'Lycée Colonial de Boké',
    code: 'LCB-001',
    locality_id: 'LOC-BOK',
    address: 'Boké Ville',
    phone: '+224 628 44 55 66',
    email: 'lyceeboke@gmail.com',
    created_at: new Date().toISOString(),
  },
]

// School years
export const mockSchoolYears: Array<SchoolYear> = [
  {
    id: 'sy-1',
    school_id: 'school-1',
    start_date: '2023-09-15',
    end_date: '2024-06-30',
    name: '2023-2024',
    status: 'ARCHIVE',
  },
  {
    id: 'sy-2',
    school_id: 'school-1',
    start_date: '2024-09-15',
    end_date: '2025-06-30',
    name: '2024-2025',
    status: 'CURRENT',
  },
  {
    id: 'sy-3',
    school_id: 'school-1',
    start_date: '2025-09-15',
    end_date: '2026-06-30',
    name: '2025-2026',
    status: 'FUTURE',
  },
]

// School year cycles
export const mockSchoolYearCycles: Array<SchoolYearCycle> = [
  // For school-1 sy-2
  {
    id: 'syc-1',
    school_year_id: 'sy-2',
    cycle_id: 'PRI',
    term_type_id: 'TT-TERM',
    created_at: new Date().toISOString(),
  },
  {
    id: 'syc-2',
    school_year_id: 'sy-2',
    cycle_id: 'COL',
    term_type_id: 'TT-TERM',
    created_at: new Date().toISOString(),
  },
  {
    id: 'syc-3',
    school_year_id: 'sy-2',
    cycle_id: 'LYC',
    term_type_id: 'TT-TERM',
    created_at: new Date().toISOString(),
  },
]

// School year levels
export const mockSchoolYearLevels: Array<SchoolYearLevel> = [
  // Primaire (syc-1)
  {
    id: 'syl-1',
    school_year_cycle_id: 'syc-1',
    level_id: 'level-1',
    level_name: '6ème',
    created_at: new Date().toISOString(),
  },
  {
    id: 'syl-2',
    school_year_cycle_id: 'syc-1',
    level_id: 'level-2',
    level_name: '5ème',
    created_at: new Date().toISOString(),
  },
  {
    id: 'syl-3',
    school_year_cycle_id: 'syc-1',
    level_id: 'level-3',
    level_name: '4ème',
    created_at: new Date().toISOString(),
  },
  // Secondaire (syc-2, syc-3)
  {
    id: 'syl-4',
    school_year_cycle_id: 'syc-2',
    level_id: 'level-4',
    level_name: '3ème',
    created_at: new Date().toISOString(),
  },
  {
    id: 'syl-5',
    school_year_cycle_id: 'syc-3',
    level_id: 'level-5',
    level_name: '2nde',
    created_at: new Date().toISOString(),
  },
  {
    id: 'syl-6',
    school_year_cycle_id: 'syc-3',
    level_id: 'level-6',
    level_name: '1ère',
    created_at: new Date().toISOString(),
  },
  {
    id: 'syl-7',
    school_year_cycle_id: 'syc-3',
    level_id: 'level-7',
    level_name: 'Terminale',
    created_at: new Date().toISOString(),
  },
]

// Classroom data
export const mockClassrooms: Array<Classroom> = [
  // Primaire (cycle syc-1)
  {
    id: 'c1',
    school_year_level_id: 'syl-1',
    name: '6ème A',
    capacity: 35,
    room_number: 'R01',
    created_at: new Date().toISOString(),
  },
  {
    id: 'c2',
    school_year_level_id: 'syl-1',
    name: '6ème B',
    capacity: 35,
    room_number: 'R02',
    created_at: new Date().toISOString(),
  },
  {
    id: 'c3',
    school_year_level_id: 'syl-2',
    name: '5ème A',
    capacity: 35,
    room_number: 'R03',
    created_at: new Date().toISOString(),
  },
  {
    id: 'c4',
    school_year_level_id: 'syl-2',
    name: '5ème B',
    capacity: 35,
    room_number: 'R04',
    created_at: new Date().toISOString(),
  },
  {
    id: 'c5',
    school_year_level_id: 'syl-3',
    name: '4ème A',
    capacity: 30,
    room_number: 'R05',
    created_at: new Date().toISOString(),
  },
  // Secondaire Collège (syc-2)
  {
    id: 'c7',
    school_year_level_id: 'syl-4',
    name: '3ème A',
    capacity: 30,
    room_number: 'R07',
    created_at: new Date().toISOString(),
  },
  {
    id: 'c8',
    school_year_level_id: 'syl-4',
    name: '3ème B',
    capacity: 30,
    room_number: 'R08',
    created_at: new Date().toISOString(),
  },
  // Lycée (syc-3)
  {
    id: 'c9',
    school_year_level_id: 'syl-5',
    name: '2nde A',
    capacity: 35,
    room_number: 'R09',
    created_at: new Date().toISOString(),
  },
  {
    id: 'c11',
    school_year_level_id: 'syl-6',
    name: '1ère A',
    capacity: 30,
    room_number: 'R11',
    created_at: new Date().toISOString(),
  },
  {
    id: 'c13',
    school_year_level_id: 'syl-7',
    name: 'Terminale A',
    capacity: 30,
    room_number: 'R13',
    created_at: new Date().toISOString(),
  },
]

export const mockSchoolYearLevelSubjects: Array<SchoolYearLevelSubject> = [
  {
    id: 'syls-1',
    school_year_level_id: 'syl-1',
    subject_id: 'sub-1',
    coefficient: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: 'syls-2',
    school_year_level_id: 'syl-2',
    subject_id: 'sub-1',
    coefficient: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: 'syls-3',
    school_year_level_id: 'syl-1',
    subject_id: 'sub-2',
    coefficient: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: 'syls-4',
    school_year_level_id: 'syl-4',
    subject_id: 'sub-4',
    coefficient: 4,
    created_at: new Date().toISOString(),
  },
  {
    id: 'syls-5',
    school_year_level_id: 'syl-5',
    subject_id: 'sub-6',
    coefficient: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 'syls-6',
    school_year_level_id: 'syl-6',
    subject_id: 'sub-3',
    coefficient: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 'syls-7',
    school_year_level_id: 'syl-7',
    subject_id: 'sub-7',
    coefficient: 4,
    created_at: new Date().toISOString(),
  },
]

export type {
  School,
  SchoolYear,
  SchoolYearCycle,
  SchoolYearLevel,
  SchoolYearLevelSubject,
  Classroom,
} from './types'
