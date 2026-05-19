import type {
  FeeSummary,
  FeeType,
  FinanceStats,
  SchoolFee,
  StudentPayment,
} from './types'

// Standard fee types in Guinea schools
export const mockFeeTypes: Array<FeeType> = [
  {
    id: 'FTYP-001',
    name: 'Registration Fee',
    name_fr: "Frais d'inscription",
    category: 'REGISTRATION',
    description: "Frais d'inscription annuelle",
    default_amount: 150000, // 150,000 GNF
    payment_frequency: 'ANNUAL',
    is_active: true,
  },
  {
    id: 'FTYP-002',
    name: 'Tuition - Term 1',
    name_fr: 'Scolarité - Trimestre 1',
    category: 'TUITION',
    description: 'Scolarité premier trimestre',
    default_amount: 400000, // 400,000 GNF
    payment_frequency: 'TERM',
    is_active: true,
  },
  {
    id: 'FTYP-003',
    name: 'Tuition - Term 2',
    name_fr: 'Scolarité - Trimestre 2',
    category: 'TUITION',
    description: 'Scolarité deuxième trimestre',
    default_amount: 400000,
    payment_frequency: 'TERM',
    is_active: true,
  },
  {
    id: 'FTYP-004',
    name: 'Tuition - Term 3',
    name_fr: 'Scolarité - Trimestre 3',
    category: 'TUITION',
    description: 'Scolarité troisième trimestre',
    default_amount: 400000,
    payment_frequency: 'TERM',
    is_active: true,
  },
  {
    id: 'FTYP-005',
    name: 'School Materials',
    name_fr: 'Fournitures scolaires',
    category: 'MATERIAL',
    description: 'Frais de fournitures et manuels',
    default_amount: 200000,
    payment_frequency: 'ANNUAL',
    is_active: true,
  },
  {
    id: 'FTYP-006',
    name: 'Exam Fee - BEPC',
    name_fr: "Frais d'examen - BEPC",
    category: 'EXAM',
    description: 'Frais examen Brevet',
    default_amount: 100000,
    payment_frequency: 'ANNUAL',
    is_active: true,
  },
  {
    id: 'FTYP-007',
    name: 'Exam Fee - BAC',
    name_fr: "Frais d'examen - BAC",
    category: 'EXAM',
    description: 'Frais examen Baccalauréat',
    default_amount: 150000,
    payment_frequency: 'ANNUAL',
    is_active: true,
  },
  {
    id: 'FTYP-008',
    name: 'PTA Contribution',
    name_fr: 'Contribution APG',
    category: 'PTA',
    description: "Contribution à l'Association des Parents d'Elèves",
    default_amount: 50000,
    payment_frequency: 'ANNUAL',
    is_active: true,
  },
  {
    id: 'FTYP-009',
    name: 'Transportation',
    name_fr: 'Transport scolaire',
    category: 'TRANSPORT',
    description: 'Frais de transport scolaire',
    default_amount: 150000,
    payment_frequency: 'TERM',
    is_active: true,
  },
  {
    id: 'FTYP-010',
    name: 'Meals - Term',
    name_fr: 'Cantine - Trimestre',
    category: 'MEAL',
    description: 'Frais de cantine par trimestre',
    default_amount: 180000,
    payment_frequency: 'TERM',
    is_active: true,
  },
]

// School fees per level
export const mockSchoolFees: Array<SchoolFee> = [
  // Primaire - 6ème
  {
    id: 'FEE-2024-001',
    school_year_id: 'sy-2',
    school_year_level_id: 'syl-1',
    fee_type_id: 'FTYP-001',
    amount: 100000,
    due_date: '2024-09-15',
    is_mandatory: true,
  },
  {
    id: 'FEE-2024-002',
    school_year_id: 'sy-2',
    school_year_level_id: 'syl-1',
    fee_type_id: 'FTYP-002',
    amount: 250000,
    due_date: '2024-10-15',
    is_mandatory: true,
  },
  {
    id: 'FEE-2024-003',
    school_year_id: 'sy-2',
    school_year_level_id: 'syl-1',
    fee_type_id: 'FTYP-003',
    amount: 250000,
    due_date: '2025-01-15',
    is_mandatory: true,
  },
  {
    id: 'FEE-2024-004',
    school_year_id: 'sy-2',
    school_year_level_id: 'syl-1',
    fee_type_id: 'FTYP-004',
    amount: 250000,
    due_date: '2025-04-15',
    is_mandatory: true,
  },
  {
    id: 'FEE-2024-005',
    school_year_id: 'sy-2',
    school_year_level_id: 'syl-1',
    fee_type_id: 'FTYP-005',
    amount: 150000,
    due_date: '2024-09-30',
    is_mandatory: true,
  },
  // Primaire - 5ème
  {
    id: 'FEE-2024-006',
    school_year_id: 'sy-2',
    school_year_level_id: 'syl-2',
    fee_type_id: 'FTYP-001',
    amount: 100000,
    due_date: '2024-09-15',
    is_mandatory: true,
  },
  {
    id: 'FEE-2024-007',
    school_year_id: 'sy-2',
    school_year_level_id: 'syl-2',
    fee_type_id: 'FTYP-002',
    amount: 250000,
    due_date: '2024-10-15',
    is_mandatory: true,
  },
  // Collège - 3ème (includes BEPC)
  {
    id: 'FEE-2024-008',
    school_year_id: 'sy-2',
    school_year_level_id: 'syl-4',
    fee_type_id: 'FTYP-001',
    amount: 150000,
    due_date: '2024-09-15',
    is_mandatory: true,
  },
  {
    id: 'FEE-2024-009',
    school_year_id: 'sy-2',
    school_year_level_id: 'syl-4',
    fee_type_id: 'FTYP-002',
    amount: 400000,
    due_date: '2024-10-15',
    is_mandatory: true,
  },
  {
    id: 'FEE-2024-010',
    school_year_id: 'sy-2',
    school_year_level_id: 'syl-4',
    fee_type_id: 'FTYP-006',
    amount: 100000,
    due_date: '2025-03-01',
    is_mandatory: true,
  },
  // Lycée - Terminale (includes BAC)
  {
    id: 'FEE-2024-011',
    school_year_id: 'sy-2',
    school_year_level_id: 'syl-7',
    fee_type_id: 'FTYP-001',
    amount: 200000,
    due_date: '2024-09-15',
    is_mandatory: true,
  },
  {
    id: 'FEE-2024-012',
    school_year_id: 'sy-2',
    school_year_level_id: 'syl-7',
    fee_type_id: 'FTYP-002',
    amount: 500000,
    due_date: '2024-10-15',
    is_mandatory: true,
  },
  {
    id: 'FEE-2024-013',
    school_year_id: 'sy-2',
    school_year_level_id: 'syl-7',
    fee_type_id: 'FTYP-007',
    amount: 150000,
    due_date: '2025-02-01',
    is_mandatory: true,
  },
]

// Sample student payments
export const mockStudentPayments: Array<StudentPayment> = [
  {
    id: 'PAY-2024-001',
    student_enrollment_id: 'ENR-2024-001',
    school_fee_id: 'FEE-2024-001',
    amount_paid: 100000,
    payment_date: '2024-09-10',
    payment_method: 'CASH',
    collected_by: 'admin-1',
    created_at: '2024-09-10T10:00:00Z',
  },
  {
    id: 'PAY-2024-002',
    student_enrollment_id: 'ENR-2024-001',
    school_fee_id: 'FEE-2024-002',
    amount_paid: 250000,
    payment_date: '2024-10-12',
    payment_method: 'BANK_TRANSFER',
    reference_number: 'TRF-001',
    created_at: '2024-10-12T14:30:00Z',
  },
  {
    id: 'PAY-2024-003',
    student_enrollment_id: 'ENR-2024-002',
    school_fee_id: 'FEE-2024-001',
    amount_paid: 50000,
    payment_date: '2024-09-14',
    payment_method: 'MOBILE_MONEY',
    reference_number: 'OM-123456',
    created_at: '2024-09-14T09:15:00Z',
  },
  {
    id: 'PAY-2024-004',
    student_enrollment_id: 'ENR-2024-002',
    school_fee_id: 'FEE-2024-002',
    amount_paid: 100000,
    payment_date: '2024-10-20',
    payment_method: 'CASH',
    created_at: '2024-10-20T11:00:00Z',
  },
  {
    id: 'PAY-2024-005',
    student_enrollment_id: 'ENR-2024-003',
    school_fee_id: 'FEE-2024-008',
    amount_paid: 150000,
    payment_date: '2024-09-05',
    payment_method: 'BANK_TRANSFER',
    reference_number: 'TRF-002',
    created_at: '2024-09-05T16:00:00Z',
  },
  {
    id: 'PAY-2024-006',
    student_enrollment_id: 'ENR-2024-004',
    school_fee_id: 'FEE-2024-011',
    amount_paid: 200000,
    payment_date: '2024-09-08',
    payment_method: 'CASH',
    created_at: '2024-09-08T10:30:00Z',
  },
]

export function generateFeeSummaries(): Array<FeeSummary> {
  const summaries: Array<FeeSummary> = []

  // For each student, calculate their fee summary
  const students = [
    {
      id: 'ENR-2024-001',
      name: 'Alpha Diallo',
      class: '6ème A',
      level: '6ème',
      total_due: 850000,
      total_paid: 350000,
      status: 'PARTIAL' as PaymentStatus,
      last_payment: '2024-10-12',
    },
    {
      id: 'ENR-2024-002',
      name: 'Aïcha Bah',
      class: '6ème A',
      level: '6ème',
      total_due: 850000,
      total_paid: 150000,
      status: 'OVERDUE' as PaymentStatus,
      last_payment: '2024-10-20',
    },
    {
      id: 'ENR-2024-003',
      name: 'Mamadou Sow',
      class: '3ème A',
      level: '3ème',
      total_due: 650000,
      total_paid: 150000,
      status: 'PARTIAL' as PaymentStatus,
      last_payment: '2024-09-05',
    },
    {
      id: 'ENR-2024-004',
      name: 'Fatou Touré',
      class: 'Terminale A',
      level: 'Terminale',
      total_due: 850000,
      total_paid: 200000,
      status: 'PARTIAL' as PaymentStatus,
      last_payment: '2024-09-08',
    },
    {
      id: 'ENR-2024-005',
      name: 'Boubacar Diallo',
      class: '6ème B',
      level: '6ème',
      total_due: 850000,
      total_paid: 850000,
      status: 'PAID' as PaymentStatus,
      last_payment: '2024-09-12',
    },
    {
      id: 'ENR-2024-006',
      name: 'Mariam Camara',
      class: '5ème A',
      level: '5ème',
      total_due: 850000,
      total_paid: 0,
      status: 'PENDING' as PaymentStatus,
      last_payment: null,
    },
    {
      id: 'ENR-2024-007',
      name: 'Souleymane Barry',
      class: '3ème B',
      level: '3ème',
      total_due: 650000,
      total_paid: 650000,
      status: 'PAID' as PaymentStatus,
      last_payment: '2024-09-15',
    },
    {
      id: 'ENR-2024-008',
      name: 'Kadiatou Diallo',
      class: 'Terminale S',
      level: 'Terminale',
      total_due: 850000,
      total_paid: 500000,
      status: 'PARTIAL' as PaymentStatus,
      last_payment: '2024-11-01',
    },
  ]

  students.forEach((s) => {
    summaries.push({
      student_id: s.id,
      student_name: s.name,
      class_name: s.class,
      level: s.level,
      total_due: s.total_due,
      total_paid: s.total_paid,
      balance: s.total_due - s.total_paid,
      status: s.status,
      last_payment_date: s.last_payment,
    })
  })

  return summaries
}

export function generateFinanceStats(): FinanceStats {
  const summaries = generateFeeSummaries()
  const total_expected = summaries.reduce((sum, s) => sum + s.total_due, 0)
  const total_collected = summaries.reduce((sum, s) => sum + s.total_paid, 0)
  const students_paid = summaries.filter((s) => s.status === 'PAID').length
  const students_pending = summaries.filter(
    (s) =>
      s.status === 'PENDING' ||
      s.status === 'PARTIAL' ||
      s.status === 'OVERDUE',
  ).length

  return {
    total_expected,
    total_collected,
    total_pending: total_expected - total_collected,
    total_overdue: summaries
      .filter((s) => s.status === 'OVERDUE')
      .reduce((sum, s) => sum + s.balance, 0),
    collection_rate: Math.round((total_collected / total_expected) * 100),
    students_count: summaries.length,
    students_paid,
    students_pending,
  }
}

export type {
  FeeType,
  SchoolFee,
  StudentPayment,
  FeeSummary,
  FinanceStats,
} from './types'
