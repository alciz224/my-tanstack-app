export interface Cycle {
  id: string;
  name: string;
  duration: string;
  status: 'Active' | 'Inactive';
}

export interface Level {
  id: string;
  cycle_id: string;
  name: string;
  code: string;
}

export interface Track {
  id: string;
  name: string;
  description: string;
  cycle_id: string;
  status: 'Active' | 'Inactive';
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  coefficient: number;
  track_id?: string;
  cycle_ids: string[];
}

export interface Period {
  id: string;
  name: string;
  type: 'Semestre' | 'Trimestre';
  start_date: string;
  end_date: string;
  status: 'Active' | 'Inactive';
}

export interface AcademicDataAdapter {
  getCycles(): Promise<Cycle[]>;
  getLevels(): Promise<Level[]>;
  getTracks(): Promise<Track[]>;
  getSubjects(): Promise<Subject[]>;
  getPeriods(): Promise<Period[]>;
}
