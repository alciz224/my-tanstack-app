/**
 * Academic Domain Types
 *
 * TypeScript types matching Django models from domain/academic
 * Used for type-safe API interactions with academic reference data
 */

/**
 * Academic Year
 * Platform-wide reference for academic calendar years
 * Example: "2024-2025"
 */
export interface AcademicYear {
  id: string | number
  name: string
  start_year: number
  end_year: number
  status: 'active' | 'inactive' | 'archived' // Backend uses status field
  is_active?: boolean // Deprecated, keeping for compatibility
  is_current: boolean
  created_at: string
  updated_at: string
}

/**
 * Cycle (Educational Level Group)
 * Example: "Primary", "Secondary", "High School"
 */
export interface Cycle {
  id: string
  name: string
  name_ar?: string
  name_fr?: string
  description?: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

/**
 * Track (Academic Pathway)
 * Example: "General", "Science", "Literature", "Technical"
 */
export interface Track {
  id: string
  cycle: string // Cycle ID
  cycle_details?: Cycle
  name: string
  name_ar?: string
  name_fr?: string
  code: string
  description?: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

/**
 * Level (Grade Level)
 * Example: "Grade 1", "Grade 2", "Year 10", "Year 11"
 */
export interface Level {
  id: string
  cycle: string // Cycle ID
  cycle_details?: Cycle
  track?: string | null // Track ID (optional)
  track_details?: Track | null
  name: string
  name_ar?: string
  name_fr?: string
  code: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

/**
 * Subject
 * Example: "Mathematics", "English", "Physics"
 */
export interface Subject {
  id: string
  name: string
  name_ar?: string
  name_fr?: string
  code: string
  description?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

/**
 * Assessment Type
 * Example: "Quiz", "Midterm", "Final Exam", "Project"
 */
export interface AssessmentType {
  id: string
  name: string
  name_ar?: string
  name_fr?: string
  code: string
  description?: string
  weight?: number // Percentage weight in final grade
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

/**
 * Term Type
 * Example: "Semester", "Trimester", "Quarter"
 */
export interface TermType {
  id: string
  name: string
  name_ar?: string
  name_fr?: string
  code: string
  num_terms: number // Number of terms in this type (e.g., 2 for semesters, 3 for trimesters)
  is_active: boolean
  created_at: string
  updated_at: string
}

/**
 * Term
 * Individual term within a term type
 * Example: "Semester 1", "Semester 2", "Trimester 1", "Quarter 1"
 */
export interface Term {
  id: string
  term_type: string // TermType ID
  term_type_details?: TermType
  name: string
  name_ar?: string
  name_fr?: string
  code: string
  sequence: number // Order within the term type (1, 2, 3, etc.)
  is_active: boolean
  created_at: string
  updated_at: string
}

// ============================================================================
// Request/Response Types
// ============================================================================

/**
 * Paginated list response
 */
export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: Array<T>
}

/**
 * Academic Year creation/update input
 */
export interface AcademicYearInput {
  name: string
  start_year: number
  end_year: number
  status?: 'active' | 'inactive' | 'archived'
}

/**
 * Cycle creation/update input
 */
export interface CycleInput {
  name: string
  name_ar?: string
  name_fr?: string
  description?: string
  display_order?: number
  is_active?: boolean
}

/**
 * Track creation/update input
 */
export interface TrackInput {
  cycle: string // Cycle ID
  name: string
  name_ar?: string
  name_fr?: string
  code: string
  description?: string
  display_order?: number
  is_active?: boolean
}

/**
 * Level creation/update input
 */
export interface LevelInput {
  cycle: string // Cycle ID
  track?: string | null // Track ID (optional)
  name: string
  name_ar?: string
  name_fr?: string
  code: string
  display_order?: number
  is_active?: boolean
}

/**
 * Subject creation/update input
 */
export interface SubjectInput {
  name: string
  name_ar?: string
  name_fr?: string
  code: string
  description?: string
  is_active?: boolean
}

/**
 * Assessment Type creation/update input
 */
export interface AssessmentTypeInput {
  name: string
  name_ar?: string
  name_fr?: string
  code: string
  description?: string
  weight?: number
  display_order?: number
  is_active?: boolean
}

/**
 * Term Type creation/update input
 */
export interface TermTypeInput {
  name: string
  name_ar?: string
  name_fr?: string
  code: string
  num_terms: number
  is_active?: boolean
}

/**
 * Term creation/update input
 */
export interface TermInput {
  term_type: string // TermType ID
  name: string
  name_ar?: string
  name_fr?: string
  code: string
  sequence: number
  is_active?: boolean
}

// ============================================================================
// Query Filters
// ============================================================================

/**
 * Common filter parameters for list endpoints
 */
export interface AcademicListFilters {
  is_active?: boolean
  search?: string
  ordering?: string
  page?: number
  page_size?: number
}

/**
 * Academic Year specific filters
 */
export interface AcademicYearFilters extends AcademicListFilters {
  is_current?: boolean
  start_year?: number
  end_year?: number
}

/**
 * Level specific filters
 */
export interface LevelFilters extends AcademicListFilters {
  cycle?: string // Cycle ID
  track?: string // Track ID
}

/**
 * Track specific filters
 */
export interface TrackFilters extends AcademicListFilters {
  cycle?: string // Cycle ID
}

/**
 * Term specific filters
 */
export interface TermFilters extends AcademicListFilters {
  term_type?: string // TermType ID
}
