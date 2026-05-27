import type {
  Classroom,
  School,
  SchoolYear,
  SchoolYearCycle,
  SchoolYearLevel,
  SchoolYearLevelSubject,
} from './types'

// Real Guinea schools
const now = new Date().toISOString()

export const mockSchools: Array<School> = [
  {
    id: 'school-1',
    name: 'Complexe Scolaire Excellence',
    code: 'EXC-001',
    locality_id: 'LOC-RAT-GBE',
    address: 'Ratoma, Conakry',
    phone: '+224 622 12 34 56',
    email: 'contact@excellence.edu.gn',
    created_at: now,
    updated_at: now,
  },
  {
    id: 'school-2',
    name: 'Lycée Don Bosco',
    code: 'DBC-001',
    locality_id: 'LOC-KAL-CEN',
    address: 'Kaloum, Conakry',
    phone: '+224 624 11 22 33',
    email: 'info@donbosco.edu.gn',
    created_at: now,
    updated_at: now,
  },
  {
    id: 'school-3',
    name: 'École Primaire Charles de Gaulle',
    code: 'CDG-001',
    locality_id: 'LOC-KIN-CEN',
    address: 'Kindia Centre',
    phone: '+224 626 33 44 55',
    email: 'contact@cdgkindia.edu.gn',
    created_at: now,
    updated_at: now,
  },
  {
    id: 'school-4',
    name: 'Lycée Colonial de Boké',
    code: 'LCB-001',
    locality_id: 'LOC-BOK-VIL',
    address: 'Boké Ville',
    phone: '+224 628 44 55 66',
    email: 'lyceeboke@gmail.com',
    created_at: now,
    updated_at: now,
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
    created_at: now,
    updated_at: now,
  },
  {
    id: 'sy-2',
    school_id: 'school-1',
    start_date: '2024-09-15',
    end_date: '2025-06-30',
    name: '2024-2025',
    status: 'CURRENT',
    created_at: now,
    updated_at: now,
  },
  {
    id: 'sy-3',
    school_id: 'school-1',
    start_date: '2025-09-15',
    end_date: '2026-06-30',
    name: '2025-2026',
    status: 'FUTURE',
    created_at: now,
    updated_at: now,
  },
]

// School year cycles
export const mockSchoolYearCycles: Array<SchoolYearCycle> = [
  {
    id: 'syc-1',
    school_year_id: 'sy-2',
    cycle_id: 'PRI',
    term_type_id: 'TT-TERM',
    created_at: now,
  },
  {
    id: 'syc-2',
    school_year_id: 'sy-2',
    cycle_id: 'COL',
    term_type_id: 'TT-TERM',
    created_at: now,
  },
  {
    id: 'syc-3',
    school_year_id: 'sy-2',
    cycle_id: 'LYC',
    term_type_id: 'TT-TERM',
    created_at: now,
  },
]

// School year levels
export const mockSchoolYearLevels: Array<SchoolYearLevel> = [
  {
    id: 'syl-1',
    school_year_cycle_id: 'syc-1',
    level_id: 'level-1',
    level_name: '6ème',
    created_at: now,
  },
  {
    id: 'syl-2',
    school_year_cycle_id: 'syc-1',
    level_id: 'level-2',
    level_name: '5ème',
    created_at: now,
  },
  {
    id: 'syl-3',
    school_year_cycle_id: 'syc-1',
    level_id: 'level-3',
    level_name: '4ème',
    created_at: now,
  },
  {
    id: 'syl-4',
    school_year_cycle_id: 'syc-2',
    level_id: 'level-4',
    level_name: '3ème',
    created_at: now,
  },
  {
    id: 'syl-5',
    school_year_cycle_id: 'syc-3',
    level_id: 'level-5',
    level_name: '2nde',
    created_at: now,
  },
  {
    id: 'syl-6',
    school_year_cycle_id: 'syc-3',
    level_id: 'level-6',
    level_name: '1ère',
    created_at: now,
  },
  {
    id: 'syl-7',
    school_year_cycle_id: 'syc-3',
    level_id: 'level-7',
    level_name: 'Terminale',
    created_at: now,
  },
]

// Classroom data
export const mockClassrooms: Array<Classroom> = [
  {
    id: 'c1',
    school_year_level_id: 'syl-1',
    name: '6ème A',
    capacity: 35,
    room_number: 'R01',
    created_at: now,
  },
  {
    id: 'c2',
    school_year_level_id: 'syl-1',
    name: '6ème B',
    capacity: 35,
    room_number: 'R02',
    created_at: now,
  },
  {
    id: 'c3',
    school_year_level_id: 'syl-2',
    name: '5ème A',
    capacity: 35,
    room_number: 'R03',
    created_at: now,
  },
  {
    id: 'c4',
    school_year_level_id: 'syl-2',
    name: '5ème B',
    capacity: 35,
    room_number: 'R04',
    created_at: now,
  },
  {
    id: 'c5',
    school_year_level_id: 'syl-3',
    name: '4ème A',
    capacity: 30,
    room_number: 'R05',
    created_at: now,
  },
  {
    id: 'c7',
    school_year_level_id: 'syl-4',
    name: '3ème A',
    capacity: 30,
    room_number: 'R07',
    created_at: now,
  },
  {
    id: 'c8',
    school_year_level_id: 'syl-4',
    name: '3ème B',
    capacity: 30,
    room_number: 'R08',
    created_at: now,
  },
  {
    id: 'c9',
    school_year_level_id: 'syl-5',
    name: '2nde A',
    capacity: 35,
    room_number: 'R09',
    created_at: now,
  },
  {
    id: 'c11',
    school_year_level_id: 'syl-6',
    name: '1ère A',
    capacity: 30,
    room_number: 'R11',
    created_at: now,
  },
  {
    id: 'c13',
    school_year_level_id: 'syl-7',
    name: 'Terminale A',
    capacity: 30,
    room_number: 'R13',
    created_at: now,
  },
]

export const mockSchoolYearLevelSubjects: Array<SchoolYearLevelSubject> = [
  {
    id: 'syls-1',
    school_year_level_id: 'syl-1',
    subject_id: 'sub-1',
    coefficient: 3,
    created_at: now,
  },
  {
    id: 'syls-2',
    school_year_level_id: 'syl-2',
    subject_id: 'sub-1',
    coefficient: 3,
    created_at: now,
  },
  {
    id: 'syls-3',
    school_year_level_id: 'syl-1',
    subject_id: 'sub-2',
    coefficient: 3,
    created_at: now,
  },
  {
    id: 'syls-4',
    school_year_level_id: 'syl-4',
    subject_id: 'sub-4',
    coefficient: 4,
    created_at: now,
  },
  {
    id: 'syls-5',
    school_year_level_id: 'syl-5',
    subject_id: 'sub-6',
    coefficient: 2,
    created_at: now,
  },
  {
    id: 'syls-6',
    school_year_level_id: 'syl-6',
    subject_id: 'sub-3',
    coefficient: 2,
    created_at: now,
  },
  {
    id: 'syls-7',
    school_year_level_id: 'syl-7',
    subject_id: 'sub-7',
    coefficient: 4,
    created_at: now,
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
