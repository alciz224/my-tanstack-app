/**
 * API Endpoint Constants
 *
 * Centralized definition of all API endpoints used in the application.
 * Organized by domain to match the backend structure.
 *
 * Backend API base: http://localhost:8000
 * - V1 endpoints: /api/v1/* (data APIs - JWT or session)
 * - Auth endpoints: /api/v2/auth/* (session-based auth)
 * - Other endpoints: /api/v1/*
 */

// ============================================================================
// Auth Endpoints (V2 - Session-based)
// ============================================================================
export const AUTH_ENDPOINTS = {
  CSRF: '/api/v2/auth/csrf/',
  LOGIN: '/api/v2/auth/login/',
  LOGOUT: '/api/v2/auth/logout/',
  REGISTER: '/api/v2/auth/register/',
  STATUS: '/api/v2/auth/status/',
  SELECT_ROLE: '/api/v2/auth/select-role/',
} as const

// ============================================================================
// Academic Reference Data Endpoints (V1)
// ============================================================================
export const ACADEMIC_ENDPOINTS = {
  // Academic Years
  ACADEMIC_YEARS: '/api/v1/academic/academic-years/',
  ACADEMIC_YEAR_DETAIL: (id: string) =>
    `/api/v1/academic/academic-years/${id}/`,
  ACADEMIC_YEAR_ACTIVATE: (id: string) =>
    `/api/v1/academic/academic-years/${id}/activate/`,
  ACADEMIC_YEAR_ARCHIVE: (id: string) =>
    `/api/v1/academic/academic-years/${id}/archive/`,
  ACADEMIC_YEAR_SET_CURRENT: (id: string) =>
    `/api/v1/academic/academic-years/${id}/set_current/`,
  ACADEMIC_YEAR_CURRENT: '/api/v1/academic/academic-years/current/',

  // Cycles
  CYCLES: '/api/v1/academic/cycles/',
  CYCLE_DETAIL: (id: string) => `/api/v1/academic/cycles/${id}/`,
  CYCLE_LEVELS: (id: string) => `/api/v1/academic/cycles/${id}/levels/`,
  CYCLE_TRACKS: (id: string) => `/api/v1/academic/cycles/${id}/tracks/`,

  // Tracks
  TRACKS: '/api/v1/academic/tracks/',
  TRACK_DETAIL: (id: string) => `/api/v1/academic/tracks/${id}/`,
  TRACK_LEVELS: (id: string) => `/api/v1/academic/tracks/${id}/levels/`,

  // Levels
  LEVELS: '/api/v1/academic/levels/',
  LEVEL_DETAIL: (id: string) => `/api/v1/academic/levels/${id}/`,

  // Subjects
  SUBJECTS: '/api/v1/academic/subjects/',
  SUBJECT_DETAIL: (id: string) => `/api/v1/academic/subjects/${id}/`,

  // Assessment Types
  ASSESSMENT_TYPES: '/api/v1/academic/assessment-types/',
  ASSESSMENT_TYPE_DETAIL: (id: string) =>
    `/api/v1/academic/assessment-types/${id}/`,

  // Term Types
  TERM_TYPES: '/api/v1/academic/term-types/',
  TERM_TYPE_DETAIL: (id: string) => `/api/v1/academic/term-types/${id}/`,
  TERM_TYPE_TERMS: (id: string) => `/api/v1/academic/term-types/${id}/terms/`,

  // Terms
  TERMS: '/api/v1/academic/terms/',
  TERM_DETAIL: (id: string) => `/api/v1/academic/terms/${id}/`,
} as const

// ============================================================================
// Geography Endpoints (V1)
// ============================================================================
export const GEOGRAPHY_ENDPOINTS = {
  COUNTRIES: '/api/v1/countries/',
  COUNTRY_DETAIL: (id: string) => `/api/v1/countries/${id}/`,

  REGIONS: '/api/v1/regions/',
  REGION_DETAIL: (id: string) => `/api/v1/regions/${id}/`,

  ADMINISTRATIVE_UNITS: '/api/v1/administrative-units/',
  ADMINISTRATIVE_UNIT_DETAIL: (id: string) =>
    `/api/v1/administrative-units/${id}/`,

  LOCALITIES: '/api/v1/localities/',
  LOCALITY_DETAIL: (id: string) => `/api/v1/localities/${id}/`,
} as const

// ============================================================================
// School Operations Endpoints (V1)
// ============================================================================
export const SCHOOL_OPERATIONS_ENDPOINTS = {
  // Schools
  SCHOOLS: '/api/v1/school-operations/schools/',
  SCHOOL_DETAIL: (id: string) => `/api/v1/school-operations/schools/${id}/`,

  // School Years
  SCHOOL_YEARS: '/api/v1/school-operations/school-years/',
  SCHOOL_YEAR_DETAIL: (id: string) =>
    `/api/v1/school-operations/school-years/${id}/`,
  SCHOOL_YEAR_CURRENT: '/api/v1/school-operations/school-years/current/',
  SCHOOL_YEAR_ACTIVE: '/api/v1/school-operations/school-years/active/',
  SCHOOL_YEARS_BY_SCHOOL: (schoolId: string) =>
    `/api/v1/school-operations/school-years/by-school/${schoolId}/`,
  SCHOOL_YEARS_BY_ACADEMIC_YEAR: (academicYearId: string) =>
    `/api/v1/school-operations/school-years/by-academic-year/${academicYearId}/`,

  // School Year Cycles
  SCHOOL_YEAR_CYCLES: '/api/v1/school-operations/school-year-cycles/',
  SCHOOL_YEAR_CYCLE_DETAIL: (id: string) =>
    `/api/v1/school-operations/school-year-cycles/${id}/`,

  // School Year Cycle Levels
  SCHOOL_YEAR_CYCLE_LEVELS:
    '/api/v1/school-operations/school-year-cycle-levels/',
  SCHOOL_YEAR_CYCLE_LEVEL_DETAIL: (id: string) =>
    `/api/v1/school-operations/school-year-cycle-levels/${id}/`,

  // School Year Cycle Level Subjects
  SCHOOL_YEAR_CYCLE_LEVEL_SUBJECTS:
    '/api/v1/school-operations/school-year-cycle-level-subjects/',
  SCHOOL_YEAR_CYCLE_LEVEL_SUBJECT_DETAIL: (id: string) =>
    `/api/v1/school-operations/school-year-cycle-level-subjects/${id}/`,

  // Time Slots
  TIME_SLOTS: '/api/v1/school-operations/time-slots/',
  TIME_SLOT_DETAIL: (id: string) =>
    `/api/v1/school-operations/time-slots/${id}/`,

  // School Year Cycle Time Slots
  SCHOOL_YEAR_CYCLE_TIME_SLOTS:
    '/api/v1/school-operations/school-year-cycle-time-slots/',
  SCHOOL_YEAR_CYCLE_TIME_SLOT_DETAIL: (id: string) =>
    `/api/v1/school-operations/school-year-cycle-time-slots/${id}/`,

  // Teachers
  TEACHERS: '/api/v1/school-operations/teachers/',
  TEACHER_DETAIL: (id: string) => `/api/v1/school-operations/teachers/${id}/`,
} as const

// ============================================================================
// Enrollment Endpoints (V1)
// ============================================================================
export const ENROLLMENT_ENDPOINTS = {
  CLASSROOMS: '/api/v1/enrollment/classrooms/',
  CLASSROOM_DETAIL: (id: string) => `/api/v1/enrollment/classrooms/${id}/`,

  STUDENT_ENROLLMENTS: '/api/v1/enrollment/student-enrollments/',
  STUDENT_ENROLLMENT_DETAIL: (id: string) =>
    `/api/v1/enrollment/student-enrollments/${id}/`,

  TEACHER_ASSIGNMENTS: '/api/v1/enrollment/teacher-assignments/',
  TEACHER_ASSIGNMENT_DETAIL: (id: string) =>
    `/api/v1/enrollment/teacher-assignments/${id}/`,
} as const

// ============================================================================
// Scheduling Endpoints (V1)
// ============================================================================
export const SCHEDULING_ENDPOINTS = {
  SCHEDULES: '/api/v1/scheduling/schedules/',
  SCHEDULE_DETAIL: (id: string) => `/api/v1/scheduling/schedules/${id}/`,
} as const

// ============================================================================
// Assessment Endpoints (V1)
// ============================================================================
export const ASSESSMENT_ENDPOINTS = {
  GRADING_SHEETS: '/api/v1/assessment/grading-sheets/',
  GRADING_SHEET_DETAIL: (id: string) =>
    `/api/v1/assessment/grading-sheets/${id}/`,

  REPORT_CARDS: '/api/v1/assessment/report-cards/',
  REPORT_CARD_DETAIL: (id: string) => `/api/v1/assessment/report-cards/${id}/`,

  TRANSCRIPTS: '/api/v1/assessment/transcripts/',
  TRANSCRIPT_DETAIL: (id: string) => `/api/v1/assessment/transcripts/${id}/`,
} as const
