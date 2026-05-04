import type { AcademicDataAdapter, Cycle, Level, Track, Subject, Period } from './types';
import { mockCycles, mockLevels, mockTracks, mockSubjects, mockPeriods } from './mocks';

export class LocalAcademicAdapter implements AcademicDataAdapter {
  private cycles = [...mockCycles];
  private levels = [...mockLevels];
  private tracks = [...mockTracks];
  private subjects = [...mockSubjects];
  private periods = [...mockPeriods];

  private async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getCycles(): Promise<Cycle[]> {
    await this.delay();
    return this.cycles.map(c => ({ ...c }));
  }

  async getLevels(): Promise<Level[]> {
    await this.delay();
    return this.levels.map(l => ({ ...l }));
  }

  async getTracks(): Promise<Track[]> {
    await this.delay();
    return this.tracks.map(t => ({ ...t }));
  }

  async getSubjects(): Promise<Subject[]> {
    await this.delay();
    return this.subjects.map(s => ({ ...s }));
  }

  async getPeriods(): Promise<Period[]> {
    await this.delay();
    return this.periods.map(p => ({ ...p }));
  }
}
