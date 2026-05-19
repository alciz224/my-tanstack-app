// Finance types for Guinea school context

export type FeeCategory =
  | 'REGISTRATION' // Frais d'inscription
  | 'TUITION' // Scolarité
  | 'MATERIAL' // Fournitures
  | 'EXAM' // Frais d'examens
  | 'TRANSPORT' // Transport
  | 'MEAL' // Cantine
  | 'PTA' // Contribution APG
  | 'OTHER' // Autres

export type PaymentStatus =
  | 'PENDING' // En attente
  | 'PAID' // Payé
  | 'PARTIAL' // Partiellement payé
  | 'OVERDUE' // En retard
  | 'EXEMPTED' // Exempté

export type PaymentFrequency =
  | 'ANNUAL' // Annuel
  | 'TERM' // Par trimestre
  | 'MONTHLY' // Mensuel

export interface FeeType {
  id: string
  name: string
  category: FeeCategory
  description: string | null
  default_amount: number
  payment_frequency: PaymentFrequency
  is_active: boolean
}

export interface SchoolFee {
  id: string
  school_year_id: string
  school_year_level_id: string
  fee_type_id: string
  amount: number
  due_date: string
  school_year_cycle_id?: string // For term-based fees
  is_mandatory: boolean
  created_at?: string

  // Human-readable labels for UI
  fee_name?: string
  level_name?: string
}

export interface StudentPayment {
  id: string
  student_enrollment_id: string
  school_fee_id: string
  amount_paid: number
  payment_date: string
  payment_method: 'CASH' | 'BANK_TRANSFER' | 'MOBILE_MONEY' | 'CHECK'
  reference_number?: string
  collected_by?: string // user_id
  notes?: string
  created_at?: string

  // Human-readable labels for UI
  student_name?: string
  fee_name?: string
}

export interface FeeSummary {
  // From student perspective
  student_id: string
  student_name: string
  class_name: string
  level: string
  total_due: number
  total_paid: number
  balance: number
  status: PaymentStatus
  last_payment_date: string | null
}

export interface FinanceStats {
  total_expected: number
  total_collected: number
  total_pending: number
  total_overdue: number
  collection_rate: number // percentage
  students_count: number
  students_paid: number
  students_pending: number
}

export interface FinanceDataAdapter {
  getFeeTypes: () => Promise<Array<FeeType>>
  getSchoolFees: (schoolYearId: string) => Promise<Array<SchoolFee>>
  createSchoolFee: (
    data: Omit<SchoolFee, 'id' | 'created_at'>,
  ) => Promise<SchoolFee>
  updateSchoolFee: (
    id: string,
    updates: Partial<SchoolFee>,
  ) => Promise<SchoolFee>

  getStudentPayments: (
    studentEnrollmentId: string,
  ) => Promise<Array<StudentPayment>>
  getClassPayments: (classroomId: string) => Promise<Array<StudentPayment>>
  createPayment: (
    data: Omit<StudentPayment, 'id' | 'created_at'>,
  ) => Promise<StudentPayment>

  getFeeSummaries: (
    schoolYearId: string,
    classroomId?: string,
  ) => Promise<Array<FeeSummary>>
  getFinanceStats: (schoolYearId: string) => Promise<FinanceStats>
}
