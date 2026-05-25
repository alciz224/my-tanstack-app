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
  createCycle: (data: Omit<Cycle, 'id'>) => Promise<Cycle>
  updateCycle: (id: string, data: Partial<Cycle>) => Promise<Cycle>
  deleteCycle: (id: string) => Promise<void>
  createLevel: (data: Omit<Level, 'id'>) => Promise<Level>
  updateLevel: (id: string, data: Partial<Level>) => Promise<Level>
  deleteLevel: (id: string) => Promise<void>
  createTrack: (data: Omit<Track, 'id'>) => Promise<Track>
  updateTrack: (id: string, data: Partial<Track>) => Promise<Track>
  deleteTrack: (id: string) => Promise<void>
  createSubject: (data: Omit<Subject, 'id'>) => Promise<Subject>
  updateSubject: (id: string, data: Partial<Subject>) => Promise<Subject>
  deleteSubject: (id: string) => Promise<void>
  createTermType: (data: Omit<TermType, 'id'>) => Promise<TermType>
  updateTermType: (id: string, data: Partial<TermType>) => Promise<TermType>
  deleteTermType: (id: string) => Promise<void>
  createTerm: (data: Omit<Term, 'id'>) => Promise<Term>
  updateTerm: (id: string, data: Partial<Term>) => Promise<Term>
  deleteTerm: (id: string) => Promise<void>
  createAssessmentType: (data: Omit<AssessmentType, 'id'>) => Promise<AssessmentType>
  updateAssessmentType: (id: string, data: Partial<AssessmentType>) => Promise<AssessmentType>
  deleteAssessmentType: (id: string) => Promise<void>
}
