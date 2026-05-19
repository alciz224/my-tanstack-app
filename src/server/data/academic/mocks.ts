import type {
  AcademicYear,
  AssessmentType,
  Cycle,
  Level,
  Subject,
  Term,
  TermType,
  Track,
} from './types'

// Academic Years - Guinea uses Sept-June school year
export const mockAcademicYears: Array<AcademicYear> = [
  {
    id: 'year-current',
    name: '2025-2026',
    start_year: 2025,
    end_year: 2026,
    is_current: true,
    is_active: true,
    status: 'active',
  },
  {
    id: 'year-2024',
    name: '2024-2025',
    start_year: 2024,
    end_year: 2025,
    is_current: false,
    is_active: true,
    status: 'active',
  },
  {
    id: 'year-2023',
    name: '2023-2024',
    start_year: 2023,
    end_year: 2024,
    is_current: false,
    is_active: false,
    status: 'inactive',
  },
]

// Guinea school system - Cycles
export const mockCycles: Array<Cycle> = [
  { id: 'MAT', code: 'MAT', name: 'Maternelle', has_track: false },
  { id: 'PRI', code: 'PRI', name: 'Primaire', has_track: false },
  { id: 'COL', code: 'COL', name: 'Collège', has_track: false },
  { id: 'LYC', code: 'LYC', name: 'Lycée', has_track: true },
]

export const mockLevels: Array<Level> = [
  // Maternelle (petite section, moyenne section, grande section)
  {
    id: 'level-ps',
    cycle_id: 'MAT',
    code: 'PS',
    name: 'Petite Section',
    order: 1,
  },
  {
    id: 'level-ms',
    cycle_id: 'MAT',
    code: 'MS',
    name: 'Moyenne Section',
    order: 2,
  },
  {
    id: 'level-gs',
    cycle_id: 'MAT',
    code: 'GS',
    name: 'Grande Section',
    order: 3,
  },
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
  },
  {
    id: 'TRK-SE',
    cycle_id: 'LYC',
    code: 'SE',
    name: 'Sciences Expérimentales (SE)',
  },
  { id: 'TRK-SS', cycle_id: 'LYC', code: 'SS', name: 'Sciences Sociales (SS)' },
  { id: 'TRK-TC', cycle_id: 'LYC', code: 'TC', name: 'Technique Commerciale' },
  { id: 'TRK-TI', cycle_id: 'LYC', code: 'TI', name: 'Technique Industrielle' },
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

// Term Types - defines how the school year is divided
export const mockTermTypes: Array<TermType> = [
  { id: 'tt-trim', code: 'TRIMESTER', name: 'Trimestre', period_count: 3 },
  { id: 'tt-sem', code: 'SEMESTER', name: 'Semestre', period_count: 2 },
]

// Terms - actual periods within a term type
export const mockTerms: Array<Term> = [
  // Trimestre terms
  {
    id: 'term-t1',
    term_type_id: 'tt-trim',
    code: 'T1',
    name: 'Trimestre 1',
    order: 1,
  },
  {
    id: 'term-t2',
    term_type_id: 'tt-trim',
    code: 'T2',
    name: 'Trimestre 2',
    order: 2,
  },
  {
    id: 'term-t3',
    term_type_id: 'tt-trim',
    code: 'T3',
    name: 'Trimestre 3',
    order: 3,
  },
  // Semester terms
  {
    id: 'term-s1',
    term_type_id: 'tt-sem',
    code: 'S1',
    name: 'Semestre 1',
    order: 1,
  },
  {
    id: 'term-s2',
    term_type_id: 'tt-sem',
    code: 'S2',
    name: 'Semestre 2',
    order: 2,
  },
]

// Assessment Types - types of evaluations
export const mockAssessmentTypes: Array<AssessmentType> = [
  {
    id: 'at-comp',
    code: 'COMPO',
    name: 'Composition',
    description: 'Examen écrit de fin de période',
  },
  {
    id: 'at-cours',
    code: 'COURS',
    name: 'Devoir sur table',
    description: 'Devoir surveillé classique',
  },
  {
    id: 'at-part',
    code: 'PART',
    name: 'Participation',
    description: 'Évaluation continue',
  },
  {
    id: 'at-oral',
    code: 'ORAL',
    name: 'Évaluation orale',
    description: 'Examen oral',
  },
  {
    id: 'at-proj',
    code: 'PROJET',
    name: 'Projet',
    description: 'Projet de groupe ou individuel',
  },
]

export type {
  Cycle,
  Level,
  Track,
  Subject,
  TermType,
  Term,
  AssessmentType,
} from './types'
