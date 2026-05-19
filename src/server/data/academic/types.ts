export interface Cycle {
  id: string
  name: string
  duration: string
  status: 'Active' | 'Inactive'
}

export interface Level {
  id: string
  cycle_id: string
  name: string
  code: string
}

export interface Track {
  id: string
  name: string
  description: string
  cycle_id: string
  status: 'Active' | 'Inactive'
}

export interface Subject {
  id: string
  name: string
  code: string
  coefficient: number
  track_id?: string
  cycle_ids: Array<string>
}

export interface Period {
  id: string
  name: string
  type: 'Semestre' | 'Trimestre'
  start_date: string
  end_date: string
  status: 'Active' | 'Inactive'
}

export interface AcademicDataAdapter {
  getCycles: () => Promise<Array<Cycle>>
  getLevels: () => Promise<Array<Level>>
  getTracks: () => Promise<Array<Track>>
  getSubjects: () => Promise<Array<Subject>>
  getPeriods: () => Promise<Array<Period>>
}
