export interface ReportCard {
  id: string
  student_enrollment_id: string
  school_year_cycle_term_id: string
  school_year_id: string
  average_score?: number
  rank?: number
  decision: 'PASS' | 'FAIL' | 'REPEAT' | 'TRANSFER' | 'PENDING'
  status: 'DRAFT' | 'FINAL' | 'LOCKED'
  generated_at: string
  locked_at?: string
  student_name?: string
  student_matricule?: string
  term_name?: string
  classroom_name?: string
  line_items?: Array<ReportCardLineItem>
}

export interface ReportCardLineItem {
  id: string
  subject_name: string
  coefficient: number
  score: number
  weighted_score: number
  teacher_name?: string
  appreciation?: string
}

export interface Transcript {
  id: string
  student_enrollment_id: string
  school_year_id: string
  cycle_id: string
  level_id: string
  average_score?: number
  rank?: number
  decision: 'PASS' | 'FAIL' | 'REPEAT' | 'TRANSFER' | 'PENDING'
  remarks?: string
  status: 'DRAFT' | 'FINAL' | 'LOCKED'
  generated_at: string
  locked_at?: string
  student_name?: string
  student_matricule?: string
  school_year_name?: string
  cycle_name?: string
  level_name?: string
}

export interface ReportStats {
  totalStudents: number
  totalClasses: number
  averageScore: number
  passRate: number
  repeatRate: number
  dropOutRate: number
  subjectStats: Array<{
    name: string
    average: number
    passRate: number
  }>
  classStats: Array<{
    name: string
    students: number
    average: number
    passRate: number
  }>
}

export interface ReportsDataAdapter {
  getReportCards: (filter?: {
    student_enrollment_id?: string
    school_year_id?: string
    status?: ReportCard['status']
  }) => Promise<Array<ReportCard>>
  getReportCardById: (id: string) => Promise<ReportCard | undefined>
  createReportCard: (data: Omit<ReportCard, 'id'>) => Promise<ReportCard>
  updateReportCard: (
    id: string,
    updates: Partial<ReportCard>,
  ) => Promise<ReportCard>

  getTranscripts: (filter?: {
    student_enrollment_id?: string
    school_year_id?: string
    status?: Transcript['status']
  }) => Promise<Array<Transcript>>
  getTranscriptById: (id: string) => Promise<Transcript | undefined>
  createTranscript: (data: Omit<Transcript, 'id'>) => Promise<Transcript>
  updateTranscript: (
    id: string,
    updates: Partial<Transcript>,
  ) => Promise<Transcript>

  getReportStats: (filter?: {
    school_year_id?: string
  }) => Promise<ReportStats>
}
