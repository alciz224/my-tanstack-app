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

export class LocalAcademicAdapter implements AcademicDataAdapter {
  private cycles = [...mockCycles]
  private levels = [...mockLevels]
  private tracks = [...mockTracks]
  private subjects = [...mockSubjects]
  private termTypes = [...mockTermTypes]
  private terms = [...mockTerms]
  private assessmentTypes = [...mockAssessmentTypes]
  private academicYears = [...mockAcademicYears]

  private async delay(ms = 300) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async getAcademicYears(): Promise<Array<AcademicYear>> {
    await this.delay()
    return this.academicYears.map((y) => ({ ...y }))
  }

  async getCycles(): Promise<Array<Cycle>> {
    await this.delay()
    return this.cycles.map((c) => ({ ...c }))
  }

  async getLevels(): Promise<Array<Level>> {
    await this.delay()
    return this.levels.map((l) => ({ ...l }))
  }

  async getTracks(): Promise<Array<Track>> {
    await this.delay()
    return this.tracks.map((t) => ({ ...t }))
  }

  async getSubjects(): Promise<Array<Subject>> {
    await this.delay()
    return this.subjects.map((s) => ({ ...s }))
  }

  async getTermTypes(): Promise<Array<TermType>> {
    await this.delay()
    return this.termTypes.map((t) => ({ ...t }))
  }

  async getTerms(): Promise<Array<Term>> {
    await this.delay()
    return this.terms.map((t) => ({ ...t }))
  }

  async getAssessmentTypes(): Promise<Array<AssessmentType>> {
    await this.delay()
    return this.assessmentTypes.map((a) => ({ ...a }))
  }
}
