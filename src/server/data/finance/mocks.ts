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
  // Primaire - 4ème
  {
    id: 'FEE-2024-014',
    school_year_id: 'sy-2',
    school_year_level_id: 'syl-3',
    fee_type_id: 'FTYP-001',
    amount: 100000,
    due_date: '2024-09-15',
    is_mandatory: true,
  },
  {
    id: 'FEE-2024-015',
    school_year_id: 'sy-2',
    school_year_level_id: 'syl-3',
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
  // Lycée - 2nde
  {
    id: 'FEE-2024-016',
    school_year_id: 'sy-2',
    school_year_level_id: 'syl-5',
    fee_type_id: 'FTYP-001',
    amount: 150000,
    due_date: '2024-09-15',
    is_mandatory: true,
  },
  {
    id: 'FEE-2024-017',
    school_year_id: 'sy-2',
    school_year_level_id: 'syl-5',
    fee_type_id: 'FTYP-002',
    amount: 400000,
    due_date: '2024-10-15',
    is_mandatory: true,
  },
  // Lycée - 1ère
  {
    id: 'FEE-2024-018',
    school_year_id: 'sy-2',
    school_year_level_id: 'syl-6',
    fee_type_id: 'FTYP-001',
    amount: 150000,
    due_date: '2024-09-15',
    is_mandatory: true,
  },
  {
    id: 'FEE-2024-019',
    school_year_id: 'sy-2',
    school_year_level_id: 'syl-6',
    fee_type_id: 'FTYP-002',
    amount: 400000,
    due_date: '2024-10-15',
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

const CLASSROOM_FEES_IDS: Record<string, Array<string>> = {
  c1: ['FEE-2024-001', 'FEE-2024-002', 'FEE-2024-005'],
  c2: ['FEE-2024-001', 'FEE-2024-002', 'FEE-2024-005'],
  c3: ['FEE-2024-006', 'FEE-2024-007'],
  c4: ['FEE-2024-006', 'FEE-2024-007'],
  c5: ['FEE-2024-014', 'FEE-2024-015'],
  c7: ['FEE-2024-008', 'FEE-2024-009', 'FEE-2024-010'],
  c8: ['FEE-2024-008', 'FEE-2024-009', 'FEE-2024-010'],
  c9: ['FEE-2024-016', 'FEE-2024-017'],
  c11: ['FEE-2024-018', 'FEE-2024-019'],
  c13: ['FEE-2024-011', 'FEE-2024-012', 'FEE-2024-013'],
}

const PAYMENT_METHODS: Array<string> = [
  'CASH',
  'BANK_TRANSFER',
  'MOBILE_MONEY',
  'CHECK',
]
const STUDENT_NAMES: Array<string> = [
  'Alpha Oumar Diallo',
  'Aïcha Bah',
  'Moussa Camara',
  'Fatou Touré',
  'Mamadou Sow',
  'Mariam Barry',
  'Souleymane Konaté',
  'Kadiatou Diallo',
  'Ibrahim Barry',
  'Mamadou Bangoura',
  'Oumar Baldé',
  'Moussa Condé',
  'Abdou Koulibaly',
  'Mamadou Doumbouya',
  'Lansana Conté',
  'Sékou Touré',
  'Alpha Condé',
  'Mamadou Yansané',
  'Ousmane Soumah',
  'Mamadou Sano',
]

// Generate student payments for all classrooms
function generateStudentPayments(): Array<StudentPayment> {
  const payments: Array<StudentPayment> = []
  let payCounter = 1
  let enrCounter = 1

  for (const [classroomId, feeIds] of Object.entries(CLASSROOM_FEES_IDS)) {
    for (let i = 1; i <= 15; i++) {
      const enrollmentId = `ENR-2024-${String(enrCounter).padStart(3, '0')}`

      // Pay some, but not all fees (realistic partial payment)
      const feesToPay = feeIds.filter(() => Math.random() < 0.6)

      for (const feeId of feesToPay) {
        const fee = mockSchoolFees.find((f) => f.id === feeId)
        if (!fee) continue

        const payPercent = 0.3 + Math.random() * 0.7
        const amountPaid = Math.round((fee.amount * payPercent) / 1000) * 1000
        const paymentMethod =
          PAYMENT_METHODS[Math.floor(Math.random() * PAYMENT_METHODS.length)]

        payments.push({
          id: `PAY-2024-${String(payCounter).padStart(3, '0')}`,
          student_enrollment_id: enrollmentId,
          school_fee_id: feeId,
          amount_paid: amountPaid,
          payment_date: `2024-09-${String(5 + Math.floor(Math.random() * 20)).padStart(2, '0')}`,
          payment_method: paymentMethod,
          reference_number:
            paymentMethod === 'BANK_TRANSFER'
              ? `TRF-${String(payCounter).padStart(3, '0')}`
              : paymentMethod === 'MOBILE_MONEY'
                ? `OM-${String(100000 + payCounter)}`
                : undefined,
          collected_by: 'admin-1',
          created_at: `2024-09-${String(5 + Math.floor(Math.random() * 20)).padStart(2, '0')}T10:00:00Z`,
        })
        payCounter++
      }

      enrCounter++
    }
  }

  return payments
}

export const mockStudentPayments: Array<StudentPayment> =
  generateStudentPayments()

const LEVEL_TOTAL_FEES: Record<string, number> = {
  'syl-1': 750000,
  'syl-2': 350000,
  'syl-3': 350000,
  'syl-4': 650000,
  'syl-5': 550000,
  'syl-6': 550000,
  'syl-7': 850000,
}

const CLASSROOM_LEVEL_MAP: Record<
  string,
  { sylId: string; className: string; level: string }
> = {
  c1: { sylId: 'syl-1', className: '6ème A', level: '6ème' },
  c2: { sylId: 'syl-1', className: '6ème B', level: '6ème' },
  c3: { sylId: 'syl-2', className: '5ème A', level: '5ème' },
  c4: { sylId: 'syl-2', className: '5ème B', level: '5ème' },
  c5: { sylId: 'syl-3', className: '4ème A', level: '4ème' },
  c7: { sylId: 'syl-4', className: '3ème A', level: '3ème' },
  c8: { sylId: 'syl-4', className: '3ème B', level: '3ème' },
  c9: { sylId: 'syl-5', className: '2nde A', level: '2nde' },
  c11: { sylId: 'syl-6', className: '1ère A', level: '1ère' },
  c13: { sylId: 'syl-7', className: 'Terminale A', level: 'Terminale' },
}

export function generateFeeSummaries(): Array<FeeSummary> {
  const summaries: Array<FeeSummary> = []
  const statuses: Array<'PAID' | 'PARTIAL' | 'OVERDUE' | 'PENDING'> = [
    'PAID',
    'PARTIAL',
    'OVERDUE',
    'PENDING',
  ]
  let studentIndex = 0

  for (const [classroomId, info] of Object.entries(CLASSROOM_LEVEL_MAP)) {
    const totalDue = LEVEL_TOTAL_FEES[info.sylId] || 500000

    for (let i = 1; i <= 15; i++) {
      const enrNum = studentIndex + 1
      const enrollmentId = `ENR-2024-${String(enrNum).padStart(3, '0')}`
      const nameIndex = studentIndex % STUDENT_NAMES.length
      const statusRoll = Math.random()

      let status: 'PAID' | 'PARTIAL' | 'OVERDUE' | 'PENDING'
      let totalPaid: number
      let lastPayment: string | null

      if (statusRoll < 0.2) {
        status = 'PAID'
        totalPaid = totalDue
        lastPayment = `2024-09-${String(5 + Math.floor(Math.random() * 10)).padStart(2, '0')}`
      } else if (statusRoll < 0.55) {
        status = 'PARTIAL'
        totalPaid =
          Math.round((totalDue * (0.2 + Math.random() * 0.5)) / 1000) * 1000
        lastPayment = `2024-${Math.random() < 0.5 ? '09' : '10'}-${String(5 + Math.floor(Math.random() * 20)).padStart(2, '0')}`
      } else if (statusRoll < 0.8) {
        status = 'OVERDUE'
        totalPaid =
          Math.round((totalDue * (0.1 + Math.random() * 0.2)) / 1000) * 1000
        lastPayment = `2024-09-${String(5 + Math.floor(Math.random() * 10)).padStart(2, '0')}`
      } else {
        status = 'PENDING'
        totalPaid = 0
        lastPayment = null
      }

      summaries.push({
        student_id: enrollmentId,
        student_name: STUDENT_NAMES[nameIndex],
        class_name: info.className,
        level: info.level,
        total_due: totalDue,
        total_paid: totalPaid,
        balance: totalDue - totalPaid,
        status,
        last_payment_date: lastPayment,
      })

      studentIndex++
    }
  }

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
