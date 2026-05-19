import type {
  Classroom,
  SchoolYear,
  SchoolYearCycle,
  SchoolYearCycleTimeSlot,
  SchoolYearLevel,
  SchoolYearLevelSubject,
} from './types'

// Mock Schools (reference)
const mockSchoolId = 'school-1'

// School Years for the mock school
export const mockSchoolYears: Array<SchoolYear> = [
  {
    id: 'sy-2024-2025',
    school_id: mockSchoolId,
    name: '2024-2025',
    start_date: '2024-09-15',
    end_date: '2025-06-30',
    status: 'CURRENT',
  },
  {
    id: 'sy-2025-2026',
    school_id: mockSchoolId,
    name: '2025-2026',
    start_date: '2025-09-15',
    end_date: '2026-06-30',
    status: 'FUTURE',
  },
  {
    id: 'sy-2023-2024',
    school_id: mockSchoolId,
    name: '2023-2024',
    start_date: '2023-09-15',
    end_date: '2024-06-30',
    status: 'ARCHIVE',
  },
]

// School Year Cycles - link cycles to school year
export const mockSchoolYearCycles: Array<SchoolYearCycle> = [
  {
    id: 'syc-1',
    school_year_id: 'sy-2024-2025',
    cycle_id: 'PRI',
    term_type_id: 'tt-trim',
  },
  {
    id: 'syc-2',
    school_year_id: 'sy-2024-2025',
    cycle_id: 'COL',
    term_type_id: 'tt-trim',
  },
  {
    id: 'syc-3',
    school_year_id: 'sy-2024-2025',
    cycle_id: 'LYC',
    term_type_id: 'tt-sem',
  },
]

// School Year Levels - link levels to cycles
export const mockSchoolYearLevels: Array<SchoolYearLevel> = [
  // Primaire levels
  {
    id: 'syl-1',
    school_year_cycle_id: 'syc-1',
    level_id: 'level-1',
    track_id: null,
  },
  {
    id: 'syl-2',
    school_year_cycle_id: 'syc-1',
    level_id: 'level-2',
    track_id: null,
  },
  {
    id: 'syl-3',
    school_year_cycle_id: 'syc-1',
    level_id: 'level-3',
    track_id: null,
  },
  {
    id: 'syl-4',
    school_year_cycle_id: 'syc-1',
    level_id: 'level-4',
    track_id: null,
  },
  {
    id: 'syl-5',
    school_year_cycle_id: 'syc-1',
    level_id: 'level-5',
    track_id: null,
  },
  {
    id: 'syl-6',
    school_year_cycle_id: 'syc-1',
    level_id: 'level-6',
    track_id: null,
  },
  // Collège levels
  {
    id: 'syl-7',
    school_year_cycle_id: 'syc-2',
    level_id: 'level-7',
    track_id: null,
  },
  {
    id: 'syl-8',
    school_year_cycle_id: 'syc-2',
    level_id: 'level-8',
    track_id: null,
  },
  {
    id: 'syl-9',
    school_year_cycle_id: 'syc-2',
    level_id: 'level-9',
    track_id: null,
  },
  {
    id: 'syl-10',
    school_year_cycle_id: 'syc-2',
    level_id: 'level-10',
    track_id: null,
  },
  // Lycée levels with tracks
  {
    id: 'syl-11a',
    school_year_cycle_id: 'syc-3',
    level_id: 'level-11',
    track_id: 'TRK-SM',
  },
  {
    id: 'syl-11b',
    school_year_cycle_id: 'syc-3',
    level_id: 'level-11',
    track_id: 'TRK-SE',
  },
  {
    id: 'syl-11c',
    school_year_cycle_id: 'syc-3',
    level_id: 'level-11',
    track_id: 'TRK-SS',
  },
  {
    id: 'syl-12a',
    school_year_cycle_id: 'syc-3',
    level_id: 'level-12',
    track_id: 'TRK-SM',
  },
  {
    id: 'syl-12b',
    school_year_cycle_id: 'syc-3',
    level_id: 'level-12',
    track_id: 'TRK-SE',
  },
  {
    id: 'syl-13a',
    school_year_cycle_id: 'syc-3',
    level_id: 'level-13',
    track_id: 'TRK-SM',
  },
]

// Subjects with coefficients per level
export const mockSchoolYearLevelSubjects: Array<SchoolYearLevelSubject> = [
  // Grade 1 (CP)
  {
    id: 'syls-1-1',
    school_year_level_id: 'syl-1',
    subject_id: 'sub-1',
    coefficient: 5,
  }, // Math
  {
    id: 'syls-1-2',
    school_year_level_id: 'syl-1',
    subject_id: 'sub-2',
    coefficient: 5,
  }, // Français
  {
    id: 'syls-1-3',
    school_year_level_id: 'syl-1',
    subject_id: 'sub-3',
    coefficient: 2,
  }, // Anglais
  {
    id: 'syls-1-4',
    school_year_level_id: 'syl-1',
    subject_id: 'sub-8',
    coefficient: 2,
  }, // EPS
  {
    id: 'syls-1-5',
    school_year_level_id: 'syl-1',
    subject_id: 'sub-9',
    coefficient: 1,
  }, // ECM
  // Grade 7 (6ème)
  {
    id: 'syls-7-1',
    school_year_level_id: 'syl-7',
    subject_id: 'sub-1',
    coefficient: 4,
  },
  {
    id: 'syls-7-2',
    school_year_level_id: 'syl-7',
    subject_id: 'sub-2',
    coefficient: 4,
  },
  {
    id: 'syls-7-3',
    school_year_level_id: 'syl-7',
    subject_id: 'sub-3',
    coefficient: 2,
  },
  {
    id: 'syls-7-4',
    school_year_level_id: 'syl-7',
    subject_id: 'sub-4',
    coefficient: 3,
  },
  {
    id: 'syls-7-5',
    school_year_level_id: 'syl-7',
    subject_id: 'sub-5',
    coefficient: 3,
  },
  {
    id: 'syls-7-6',
    school_year_level_id: 'syl-7',
    subject_id: 'sub-6',
    coefficient: 2,
  },
  {
    id: 'syls-7-7',
    school_year_level_id: 'syl-7',
    subject_id: 'sub-8',
    coefficient: 1,
  },
  {
    id: 'syls-7-8',
    school_year_level_id: 'syl-7',
    subject_id: 'sub-9',
    coefficient: 1,
  },
  // 2nde SM
  {
    id: 'syls-11a-1',
    school_year_level_id: 'syl-11a',
    subject_id: 'sub-1',
    coefficient: 5,
  },
  {
    id: 'syls-11a-2',
    school_year_level_id: 'syl-11a',
    subject_id: 'sub-2',
    coefficient: 4,
  },
  {
    id: 'syls-11a-3',
    school_year_level_id: 'syl-11a',
    subject_id: 'sub-3',
    coefficient: 2,
  },
  {
    id: 'syls-11a-4',
    school_year_level_id: 'syl-11a',
    subject_id: 'sub-4',
    coefficient: 5,
  },
  {
    id: 'syls-11a-5',
    school_year_level_id: 'syl-11a',
    subject_id: 'sub-5',
    coefficient: 4,
  },
  {
    id: 'syls-11a-6',
    school_year_level_id: 'syl-11a',
    subject_id: 'sub-7',
    coefficient: 2,
  },
  {
    id: 'syls-11a-7',
    school_year_level_id: 'syl-11a',
    subject_id: 'sub-8',
    coefficient: 1,
  },
  {
    id: 'syls-11a-8',
    school_year_level_id: 'syl-11a',
    subject_id: 'sub-9',
    coefficient: 1,
  },
]

// Classrooms per level
export const mockClassrooms: Array<Classroom> = [
  // Grade 1
  {
    id: 'class-1-1',
    school_year_level_id: 'syl-1',
    name: 'CP A',
    capacity: 30,
    room_number: '101',
  },
  {
    id: 'class-1-2',
    school_year_level_id: 'syl-1',
    name: 'CP B',
    capacity: 28,
    room_number: '102',
  },
  // Grade 2
  {
    id: 'class-2-1',
    school_year_level_id: 'syl-2',
    name: 'CE1 A',
    capacity: 30,
    room_number: '103',
  },
  {
    id: 'class-2-2',
    school_year_level_id: 'syl-2',
    name: 'CE1 B',
    capacity: 25,
    room_number: '104',
  },
  // Grade 7 (6ème)
  {
    id: 'class-7-1',
    school_year_level_id: 'syl-7',
    name: '6ème A',
    capacity: 35,
    room_number: '201',
  },
  {
    id: 'class-7-2',
    school_year_level_id: 'syl-7',
    name: '6ème B',
    capacity: 32,
    room_number: '202',
  },
  // 2nde SM
  {
    id: 'class-11a-1',
    school_year_level_id: 'syl-11a',
    name: '2nde SM A',
    capacity: 30,
    room_number: '301',
  },
]

// Time slots per cycle
export const mockTimeSlots: Array<SchoolYearCycleTimeSlot> = [
  // Primaire/Collège (Trimestre - 6 periods/day)
  {
    id: 'ts-1-1',
    school_year_cycle_id: 'syc-1',
    name: 'Heure 1',
    order: 1,
    start_time: '08:00',
    end_time: '08:45',
    duration_minutes: 45,
    status: 'ACTIVE',
  },
  {
    id: 'ts-1-2',
    school_year_cycle_id: 'syc-1',
    name: 'Heure 2',
    order: 2,
    start_time: '08:45',
    end_time: '09:30',
    duration_minutes: 45,
    status: 'ACTIVE',
  },
  {
    id: 'ts-1-3',
    school_year_cycle_id: 'syc-1',
    name: 'Récréation',
    order: 3,
    start_time: '09:30',
    end_time: '09:45',
    duration_minutes: 15,
    status: 'ACTIVE',
  },
  {
    id: 'ts-1-4',
    school_year_cycle_id: 'syc-1',
    name: 'Heure 3',
    order: 4,
    start_time: '09:45',
    end_time: '10:30',
    duration_minutes: 45,
    status: 'ACTIVE',
  },
  {
    id: 'ts-1-5',
    school_year_cycle_id: 'syc-1',
    name: 'Heure 4',
    order: 5,
    start_time: '10:30',
    end_time: '11:15',
    duration_minutes: 45,
    status: 'ACTIVE',
  },
  {
    id: 'ts-1-6',
    school_year_cycle_id: 'syc-1',
    name: 'Pause',
    order: 6,
    start_time: '11:15',
    end_time: '11:30',
    duration_minutes: 15,
    status: 'ACTIVE',
  },
  {
    id: 'ts-1-7',
    school_year_cycle_id: 'syc-1',
    name: 'Heure 5',
    order: 7,
    start_time: '11:30',
    end_time: '12:15',
    duration_minutes: 45,
    status: 'ACTIVE',
  },
  {
    id: 'ts-1-8',
    school_year_cycle_id: 'syc-1',
    name: 'Heure 6',
    order: 8,
    start_time: '12:15',
    end_time: '13:00',
    duration_minutes: 45,
    status: 'ACTIVE',
  },
  // Lycée (Semestre - different schedule)
  {
    id: 'ts-3-1',
    school_year_cycle_id: 'syc-3',
    name: 'Cours 1',
    order: 1,
    start_time: '08:00',
    end_time: '09:00',
    duration_minutes: 60,
    status: 'ACTIVE',
  },
  {
    id: 'ts-3-2',
    school_year_cycle_id: 'syc-3',
    name: 'Cours 2',
    order: 2,
    start_time: '09:00',
    end_time: '10:00',
    duration_minutes: 60,
    status: 'ACTIVE',
  },
  {
    id: 'ts-3-3',
    school_year_cycle_id: 'syc-3',
    name: 'Récréation',
    order: 3,
    start_time: '10:00',
    end_time: '10:15',
    duration_minutes: 15,
    status: 'ACTIVE',
  },
  {
    id: 'ts-3-4',
    school_year_cycle_id: 'syc-3',
    name: 'Cours 3',
    order: 4,
    start_time: '10:15',
    end_time: '11:15',
    duration_minutes: 60,
    status: 'ACTIVE',
  },
  {
    id: 'ts-3-5',
    school_year_cycle_id: 'syc-3',
    name: 'Cours 4',
    order: 5,
    start_time: '11:15',
    end_time: '12:15',
    duration_minutes: 60,
    status: 'ACTIVE',
  },
  {
    id: 'ts-3-6',
    school_year_cycle_id: 'syc-3',
    name: 'Pause déj',
    order: 6,
    start_time: '12:15',
    end_time: '13:30',
    duration_minutes: 75,
    status: 'ACTIVE',
  },
  {
    id: 'ts-3-7',
    school_year_cycle_id: 'syc-3',
    name: 'Cours 5',
    order: 7,
    start_time: '13:30',
    end_time: '14:30',
    duration_minutes: 60,
    status: 'ACTIVE',
  },
  {
    id: 'ts-3-8',
    school_year_cycle_id: 'syc-3',
    name: 'Cours 6',
    order: 8,
    start_time: '14:30',
    end_time: '15:30',
    duration_minutes: 60,
    status: 'ACTIVE',
  },
]

export type {
  SchoolYear,
  SchoolYearCycle,
  SchoolYearLevel,
  SchoolYearLevelSubject,
  Classroom,
  SchoolYearCycleTimeSlot,
} from './types'
