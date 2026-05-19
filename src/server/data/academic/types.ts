export interface AcademicYear {
  id: string
  name: string
  start_year: number
  end_year: number
  is_current: boolean
  is_active: boolean
  status: string
}

export interface Cycle {
  id: string
  code: string
  name: string
  has_track: boolean
}

export interface Level {
  id: string
  cycle_id: string
  code: string
  name: string
  order: number
  track_id?: string | null
}

export interface Track {
  id: string
  cycle_id: string
  code: string
  name: string
  description?: string
}

export interface Subject {
  id: string
  code: string
  name: string
  description?: string
}

export interface TermType {
  id: string
  code: string
  name: string
  period_count: number
}

export interface Term {
  id: string
  term_type_id: string
  code: string
  name?: string
  order: number
}

export interface AssessmentType {
  id: string
  code: string
  name: string
  description?: string
}

export interface AcademicDataAdapter {
  getAcademicYears: () => Promise<Array<AcademicYear>>
  getCycles: () => Promise<Array<Cycle>>
  getLevels: () => Promise<Array<Level>>
  getTracks: () => Promise<Array<Track>>
  getSubjects: () => Promise<Array<Subject>>
  getTermTypes: () => Promise<Array<TermType>>
  getTerms: () => Promise<Array<Term>>
  getAssessmentTypes: () => Promise<Array<AssessmentType>>
}
