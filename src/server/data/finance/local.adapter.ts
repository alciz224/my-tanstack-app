import {
  generateFeeSummaries,
  generateFinanceStats,
  mockFeeTypes,
  mockSchoolFees,
  mockStudentPayments,
} from './mocks'
import type {
  FeeSummary,
  FeeType,
  FinanceDataAdapter,
  FinanceStats,
  SchoolFee,
  StudentPayment,
} from './types'

export class LocalFinanceAdapter implements FinanceDataAdapter {
  private feeTypes = [...mockFeeTypes]
  private schoolFees = [...mockSchoolFees]
  private studentPayments = [...mockStudentPayments]

  async getFeeTypes(): Promise<Array<FeeType>> {
    return this.feeTypes.filter((f) => f.is_active)
  }

  async getSchoolFees(schoolYearId: string): Promise<Array<SchoolFee>> {
    return this.schoolFees.filter((f) => f.school_year_id === schoolYearId)
  }

  async createSchoolFee(
    data: Omit<SchoolFee, 'id' | 'created_at'>,
  ): Promise<SchoolFee> {
    const newFee: SchoolFee = {
      id: `sf-${Date.now()}`,
      ...data,
      created_at: new Date().toISOString(),
    }
    this.schoolFees.push(newFee)
    return newFee
  }

  async updateSchoolFee(
    id: string,
    updates: Partial<SchoolFee>,
  ): Promise<SchoolFee> {
    const index = this.schoolFees.findIndex((f) => f.id === id)
    if (index === -1) throw new Error('Fee not found')
    this.schoolFees[index] = { ...this.schoolFees[index], ...updates }
    return this.schoolFees[index]
  }

  async getStudentPayments(
    studentEnrollmentId: string,
  ): Promise<Array<StudentPayment>> {
    return this.studentPayments.filter(
      (p) => p.student_enrollment_id === studentEnrollmentId,
    )
  }

  async getClassPayments(classroomId: string): Promise<Array<StudentPayment>> {
    // Would need to join with student_enrollments to filter by classroom
    return this.studentPayments
  }

  async createPayment(
    data: Omit<StudentPayment, 'id' | 'created_at'>,
  ): Promise<StudentPayment> {
    const newPayment: StudentPayment = {
      id: `sp-${Date.now()}`,
      ...data,
      created_at: new Date().toISOString(),
    }
    this.studentPayments.push(newPayment)
    return newPayment
  }

  async getFeeSummaries(
    schoolYearId: string,
    classroomId?: string,
  ): Promise<Array<FeeSummary>> {
    // In real app, this would calculate from school_fees and student_payments
    return generateFeeSummaries()
  }

  async getFinanceStats(schoolYearId: string): Promise<FinanceStats> {
    return generateFinanceStats()
  }
}
