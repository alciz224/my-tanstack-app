import {
  mockAssessmentTypes,
  mockAcademicYears,
  mockCycles,
  mockLevels,
  mockSubjects,
  mockTermTypes,
  mockTerms,
  mockTracks,
} from './mocks'
import type {
  AcademicDataAdapter,
  AcademicYear,
  AssessmentType,
  Cycle,
  Level,
  Subject,
  Term,
  TermType,
  Track,
} from './types'

let nextId = 1000

function genId(prefix: string) {
  return `${prefix}-${nextId++}`
}

export class LocalAcademicAdapter implements AcademicDataAdapter {
  private cycles = structuredClone(mockCycles)
  private levels = structuredClone(mockLevels)
  private tracks = structuredClone(mockTracks)
  private subjects = structuredClone(mockSubjects)
  private termTypes = structuredClone(mockTermTypes)
  private terms = structuredClone(mockTerms)
  private assessmentTypes = structuredClone(mockAssessmentTypes)
  private academicYears = structuredClone(mockAcademicYears)

  private async delay(ms = 300) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async getAcademicYears(): Promise<Array<AcademicYear>> {
    await this.delay()
    return structuredClone(this.academicYears)
  }

  async getCycles(): Promise<Array<Cycle>> {
    await this.delay()
    return structuredClone(this.cycles)
  }

  async getLevels(): Promise<Array<Level>> {
    await this.delay()
    return structuredClone(this.levels)
  }

  async getTracks(): Promise<Array<Track>> {
    await this.delay()
    return structuredClone(this.tracks)
  }

  async getSubjects(): Promise<Array<Subject>> {
    await this.delay()
    return structuredClone(this.subjects)
  }

  async getTermTypes(): Promise<Array<TermType>> {
    await this.delay()
    return structuredClone(this.termTypes)
  }

  async getTerms(): Promise<Array<Term>> {
    await this.delay()
    return structuredClone(this.terms)
  }

  async getAssessmentTypes(): Promise<Array<AssessmentType>> {
    await this.delay()
    return structuredClone(this.assessmentTypes)
  }

  async createCycle(data: Omit<Cycle, 'id'>): Promise<Cycle> {
    await this.delay()
    const cycle: Cycle = { id: genId('cycle'), ...data }
    this.cycles.push(cycle)
    return structuredClone(cycle)
  }

  async updateCycle(id: string, data: Partial<Cycle>): Promise<Cycle> {
    await this.delay()
    const idx = this.cycles.findIndex((c) => c.id === id)
    if (idx === -1) throw new Error('Cycle not found')
    this.cycles[idx] = { ...this.cycles[idx], ...data }
    return structuredClone(this.cycles[idx])
  }

  async deleteCycle(id: string): Promise<void> {
    await this.delay()
    const idx = this.cycles.findIndex((c) => c.id === id)
    if (idx === -1) throw new Error('Cycle not found')
    if (this.levels.some((l) => l.cycle_id === id)) {
      throw new Error('Cannot delete cycle with existing levels')
    }
    this.cycles.splice(idx, 1)
  }

  async createLevel(data: Omit<Level, 'id'>): Promise<Level> {
    await this.delay()
    const level: Level = { id: genId('level'), ...data }
    this.levels.push(level)
    return structuredClone(level)
  }

  async updateLevel(id: string, data: Partial<Level>): Promise<Level> {
    await this.delay()
    const idx = this.levels.findIndex((l) => l.id === id)
    if (idx === -1) throw new Error('Level not found')
    this.levels[idx] = { ...this.levels[idx], ...data }
    return structuredClone(this.levels[idx])
  }

  async deleteLevel(id: string): Promise<void> {
    await this.delay()
    const idx = this.levels.findIndex((l) => l.id === id)
    if (idx === -1) throw new Error('Level not found')
    this.levels.splice(idx, 1)
  }

  async createTrack(data: Omit<Track, 'id'>): Promise<Track> {
    await this.delay()
    const track: Track = { id: genId('track'), ...data }
    this.tracks.push(track)
    return structuredClone(track)
  }

  async updateTrack(id: string, data: Partial<Track>): Promise<Track> {
    await this.delay()
    const idx = this.tracks.findIndex((t) => t.id === id)
    if (idx === -1) throw new Error('Track not found')
    this.tracks[idx] = { ...this.tracks[idx], ...data }
    return structuredClone(this.tracks[idx])
  }

  async deleteTrack(id: string): Promise<void> {
    await this.delay()
    const idx = this.tracks.findIndex((t) => t.id === id)
    if (idx === -1) throw new Error('Track not found')
    this.tracks.splice(idx, 1)
  }

  async createSubject(data: Omit<Subject, 'id'>): Promise<Subject> {
    await this.delay()
    const subject: Subject = { id: genId('sub'), ...data }
    this.subjects.push(subject)
    return structuredClone(subject)
  }

  async updateSubject(id: string, data: Partial<Subject>): Promise<Subject> {
    await this.delay()
    const idx = this.subjects.findIndex((s) => s.id === id)
    if (idx === -1) throw new Error('Subject not found')
    this.subjects[idx] = { ...this.subjects[idx], ...data }
    return structuredClone(this.subjects[idx])
  }

  async deleteSubject(id: string): Promise<void> {
    await this.delay()
    const idx = this.subjects.findIndex((s) => s.id === id)
    if (idx === -1) throw new Error('Subject not found')
    this.subjects.splice(idx, 1)
  }

  async createTermType(data: Omit<TermType, 'id'>): Promise<TermType> {
    await this.delay()
    const tt: TermType = { id: genId('tt'), ...data }
    this.termTypes.push(tt)
    return structuredClone(tt)
  }

  async updateTermType(id: string, data: Partial<TermType>): Promise<TermType> {
    await this.delay()
    const idx = this.termTypes.findIndex((t) => t.id === id)
    if (idx === -1) throw new Error('TermType not found')
    this.termTypes[idx] = { ...this.termTypes[idx], ...data }
    return structuredClone(this.termTypes[idx])
  }

  async deleteTermType(id: string): Promise<void> {
    await this.delay()
    const idx = this.termTypes.findIndex((t) => t.id === id)
    if (idx === -1) throw new Error('TermType not found')
    if (this.terms.some((t) => t.term_type_id === id)) {
      throw new Error('Cannot delete term type with existing terms')
    }
    this.termTypes.splice(idx, 1)
  }

  async createTerm(data: Omit<Term, 'id'>): Promise<Term> {
    await this.delay()
    const term: Term = { id: genId('term'), ...data }
    this.terms.push(term)
    return structuredClone(term)
  }

  async updateTerm(id: string, data: Partial<Term>): Promise<Term> {
    await this.delay()
    const idx = this.terms.findIndex((t) => t.id === id)
    if (idx === -1) throw new Error('Term not found')
    this.terms[idx] = { ...this.terms[idx], ...data }
    return structuredClone(this.terms[idx])
  }

  async deleteTerm(id: string): Promise<void> {
    await this.delay()
    const idx = this.terms.findIndex((t) => t.id === id)
    if (idx === -1) throw new Error('Term not found')
    this.terms.splice(idx, 1)
  }

  async createAssessmentType(data: Omit<AssessmentType, 'id'>): Promise<AssessmentType> {
    await this.delay()
    const at: AssessmentType = { id: genId('at'), ...data }
    this.assessmentTypes.push(at)
    return structuredClone(at)
  }

  async updateAssessmentType(id: string, data: Partial<AssessmentType>): Promise<AssessmentType> {
    await this.delay()
    const idx = this.assessmentTypes.findIndex((a) => a.id === id)
    if (idx === -1) throw new Error('AssessmentType not found')
    this.assessmentTypes[idx] = { ...this.assessmentTypes[idx], ...data }
    return structuredClone(this.assessmentTypes[idx])
  }

  async deleteAssessmentType(id: string): Promise<void> {
    await this.delay()
    const idx = this.assessmentTypes.findIndex((a) => a.id === id)
    if (idx === -1) throw new Error('AssessmentType not found')
    this.assessmentTypes.splice(idx, 1)
  }
}