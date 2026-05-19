import {
  mockCycles,
  mockLevels,
  mockPeriods,
  mockSubjects,
  mockTracks,
} from './mocks'
import type {
  AcademicDataAdapter,
  Cycle,
  Level,
  Period,
  Subject,
  Track,
} from './types'

export class LocalAcademicAdapter implements AcademicDataAdapter {
  private cycles = [...mockCycles]
  private levels = [...mockLevels]
  private tracks = [...mockTracks]
  private subjects = [...mockSubjects]
  private periods = [...mockPeriods]

  private async delay(ms = 300) {
    return new Promise((resolve) => setTimeout(resolve, ms))
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

  async getPeriods(): Promise<Array<Period>> {
    await this.delay()
    return this.periods.map((p) => ({ ...p }))
  }
}
