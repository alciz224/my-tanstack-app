import type { ReportCard, ReportsDataAdapter, Transcript } from './types'

const mockReportCards: Array<ReportCard> = [
  {
    id: 'rc-1',
    student_enrollment_id: 'se-1',
    school_year_cycle_term_id: 'term-1',
    school_year_id: 'sy-2',
    average_score: 14.5,
    rank: 3,
    decision: 'PASS',
    status: 'LOCKED',
    generated_at: '2025-02-15T10:00:00Z',
    locked_at: '2025-02-20T14:30:00Z',
    student_name: 'Alpha Diallo',
    student_matricule: '2025-001',
    term_name: 'Trimestre 1',
    classroom_name: '6ème A',
    line_items: [
      {
        id: 'li-1',
        subject_name: 'Mathématiques',
        coefficient: 3,
        score: 15.5,
        weighted_score: 46.5,
        teacher_name: 'M. Bah',
        appreciation: 'Très bon travail',
      },
      {
        id: 'li-2',
        subject_name: 'Français',
        coefficient: 3,
        score: 14.0,
        weighted_score: 42.0,
        teacher_name: 'Mme. Sylla',
        appreciation: 'Bon trimestre',
      },
      {
        id: 'li-3',
        subject_name: 'Anglais',
        coefficient: 2,
        score: 16.0,
        weighted_score: 32.0,
        teacher_name: 'M. Barry',
        appreciation: 'Excellent',
      },
      {
        id: 'li-4',
        subject_name: 'Histoire-Géo',
        coefficient: 2,
        score: 13.5,
        weighted_score: 27.0,
        teacher_name: 'M. Camara',
        appreciation: 'Assez bien',
      },
      {
        id: 'li-5',
        subject_name: 'Sciences',
        coefficient: 2,
        score: 14.0,
        weighted_score: 28.0,
        teacher_name: 'Mme. Touré',
        appreciation: 'En progrès',
      },
    ],
  },
  {
    id: 'rc-2',
    student_enrollment_id: 'se-2',
    school_year_cycle_term_id: 'term-1',
    school_year_id: 'sy-2',
    average_score: 12.8,
    rank: 8,
    decision: 'PASS',
    status: 'FINAL',
    generated_at: '2025-02-16T09:00:00Z',
    student_name: 'Fatou Bâ',
    student_matricule: '2025-002',
    term_name: 'Trimestre 1',
    classroom_name: '6ème A',
  },
  {
    id: 'rc-3',
    student_enrollment_id: 'se-3',
    school_year_cycle_term_id: 'term-1',
    school_year_id: 'sy-2',
    average_score: 9.2,
    rank: 15,
    decision: 'REPEAT',
    status: 'FINAL',
    generated_at: '2025-02-17T11:00:00Z',
    student_name: 'Mohamed Condé',
    student_matricule: '2025-003',
    term_name: 'Trimestre 1',
    classroom_name: '5ème B',
  },
  {
    id: 'rc-4',
    student_enrollment_id: 'se-1',
    school_year_cycle_term_id: 'term-2',
    school_year_id: 'sy-2',
    average_score: 15.2,
    rank: 2,
    decision: 'PASS',
    status: 'DRAFT',
    generated_at: '2025-05-10T08:00:00Z',
    student_name: 'Alpha Diallo',
    student_matricule: '2025-001',
    term_name: 'Trimestre 2',
    classroom_name: '6ème A',
  },
]

const mockTranscripts: Array<Transcript> = [
  {
    id: 'tr-1',
    student_enrollment_id: 'se-1',
    school_year_id: 'sy-2',
    cycle_id: 'syc-1',
    level_id: 'syl-1',
    average_score: 14.85,
    rank: 2,
    decision: 'PASS',
    remarks: 'Excellente année scolaire',
    status: 'LOCKED',
    generated_at: '2025-07-01T10:00:00Z',
    locked_at: '2025-07-05T16:00:00Z',
    student_name: 'Alpha Diallo',
    student_matricule: '2025-001',
    school_year_name: '2024-2025',
    cycle_name: 'Primaire',
    level_name: '6ème Année',
  },
  {
    id: 'tr-2',
    student_enrollment_id: 'se-2',
    school_year_id: 'sy-2',
    cycle_id: 'syc-1',
    level_id: 'syl-1',
    average_score: 13.2,
    rank: 5,
    decision: 'PASS',
    status: 'FINAL',
    generated_at: '2025-07-02T09:00:00Z',
    student_name: 'Fatou Bâ',
    student_matricule: '2025-002',
    school_year_name: '2024-2025',
    cycle_name: 'Primaire',
    level_name: '6ème Année',
  },
]

export const localReportsAdapter: ReportsDataAdapter = {
  async getReportCards(filter) {
    let cards = [...mockReportCards]
    if (filter?.student_enrollment_id) {
      cards = cards.filter(
        (c) => c.student_enrollment_id === filter.student_enrollment_id,
      )
    }
    if (filter?.school_year_id) {
      cards = cards.filter((c) => c.school_year_id === filter.school_year_id)
    }
    if (filter?.status) {
      cards = cards.filter((c) => c.status === filter.status)
    }
    return cards
  },

  async getReportCardById(id) {
    return mockReportCards.find((c) => c.id === id)
  },

  async createReportCard(data) {
    const newCard: ReportCard = {
      ...data,
      id: `rc-${Date.now()}`,
    }
    mockReportCards.push(newCard)
    return newCard
  },

  async updateReportCard(id, updates) {
    const index = mockReportCards.findIndex((c) => c.id === id)
    if (index === -1) throw new Error('Report card not found')
    mockReportCards[index] = { ...mockReportCards[index], ...updates }
    return mockReportCards[index]
  },

  async getTranscripts(filter) {
    let transcripts = [...mockTranscripts]
    if (filter?.student_enrollment_id) {
      transcripts = transcripts.filter(
        (t) => t.student_enrollment_id === filter.student_enrollment_id,
      )
    }
    if (filter?.school_year_id) {
      transcripts = transcripts.filter(
        (t) => t.school_year_id === filter.school_year_id,
      )
    }
    if (filter?.status) {
      transcripts = transcripts.filter((t) => t.status === filter.status)
    }
    return transcripts
  },

  async getTranscriptById(id) {
    return mockTranscripts.find((t) => t.id === id)
  },

  async createTranscript(data) {
    const newTranscript: Transcript = {
      ...data,
      id: `tr-${Date.now()}`,
    }
    mockTranscripts.push(newTranscript)
    return newTranscript
  },

  async updateTranscript(id, updates) {
    const index = mockTranscripts.findIndex((t) => t.id === id)
    if (index === -1) throw new Error('Transcript not found')
    mockTranscripts[index] = { ...mockTranscripts[index], ...updates }
    return mockTranscripts[index]
  },

  async getReportStats(filter) {
    return {
      totalStudents: 245,
      totalClasses: 8,
      averageScore: 12.8,
      passRate: 78.5,
      repeatRate: 8.2,
      dropOutRate: 2.1,
      subjectStats: [
        { name: 'Mathématiques', average: 13.2, passRate: 82 },
        { name: 'Français', average: 12.5, passRate: 76 },
        { name: 'Anglais', average: 11.8, passRate: 68 },
        { name: 'Histoire-Géo', average: 13.5, passRate: 84 },
        { name: 'Sciences', average: 12.1, passRate: 72 },
      ],
      classStats: [
        { name: '6ème A', students: 32, average: 13.8, passRate: 85 },
        { name: '6ème B', students: 30, average: 12.5, passRate: 78 },
        { name: '5ème A', students: 31, average: 12.2, passRate: 74 },
        { name: '5ème B', students: 28, average: 11.8, passRate: 70 },
        { name: '4ème A', students: 33, average: 13.5, passRate: 82 },
        { name: '4ème B', students: 29, average: 12.8, passRate: 79 },
        { name: '3ème A', students: 31, average: 14.2, passRate: 88 },
        { name: '3ème B', students: 31, average: 13.1, passRate: 81 },
      ],
    }
  },
}
