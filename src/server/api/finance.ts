import { createServerFn } from '@tanstack/react-start'
import type {
  FeeSummary,
  FeeType,
  FinanceStats,
  SchoolFee,
  StudentPayment,
} from '@/server/data/finance/types'
import { getFinanceService } from '@/server/data/finance/factory'

export const getFeeTypesFn = createServerFn({ method: 'GET' }).handler(
  async (): Promise<Array<FeeType>> => {
    return getFinanceService().getFeeTypes()
  },
)

export const getSchoolFeesFn = createServerFn({ method: 'GET' })
  .inputValidator((schoolYearId: string) => schoolYearId)
  .handler(async ({ data }): Promise<Array<SchoolFee>> => {
    return getFinanceService().getSchoolFees(data)
  })

export const createSchoolFeeFn = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: {
      school_year_id: string
      school_year_level_id: string
      fee_type_id: string
      amount: number
      due_date: string
      is_mandatory: boolean
    }) => data,
  )
  .handler(async ({ data }): Promise<SchoolFee> => {
    return getFinanceService().createSchoolFee(data)
  })

export const getStudentPaymentsFn = createServerFn({ method: 'GET' })
  .inputValidator((studentEnrollmentId: string) => studentEnrollmentId)
  .handler(async ({ data }): Promise<Array<StudentPayment>> => {
    return getFinanceService().getStudentPayments(data)
  })

export const createPaymentFn = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: {
      student_enrollment_id: string
      school_fee_id: string
      amount_paid: number
      payment_date: string
      payment_method: string
      reference_number?: string
    }) => data,
  )
  .handler(async ({ data }): Promise<StudentPayment> => {
    return getFinanceService().createPayment(
      data as Omit<StudentPayment, 'id' | 'created_at'>,
    )
  })

export const getFeeSummariesFn = createServerFn({ method: 'GET' })
  .inputValidator(
    (data: { schoolYearId: string; classroomId?: string }) => data,
  )
  .handler(async ({ data }): Promise<Array<FeeSummary>> => {
    return getFinanceService().getFeeSummaries(
      data.schoolYearId,
      data.classroomId,
    )
  })

export const getFinanceStatsFn = createServerFn({ method: 'GET' })
  .inputValidator((schoolYearId: string) => schoolYearId)
  .handler(async ({ data }): Promise<FinanceStats> => {
    return getFinanceService().getFinanceStats(data)
  })
