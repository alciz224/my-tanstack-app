import {
  mockAssessmentSubjects,
  mockAssessments,
  mockStudentAssessments,
  getStudentAssessmentsBySubject,
} from './mocks'
import type {
  Assessment,
  AssessmentSubject,
  AssessmentsDataAdapter,
  AssessmentsFilter,
  GradeEntryData,
  StudentAssessment,
} from './types'

export class LocalAssessmentsAdapter implements AssessmentsDataAdapter {
  private assessments = [...mockAssessments]
  private subjects = [...mockAssessmentSubjects]
  private grades = [...mockStudentAssessments]

  async getAssessments(filter?: AssessmentsFilter): Promise<Array<Assessment>> {
    let result = this.assessments

    if (filter?.school_year_cycle_id) {
      result = result.filter(
        (a) => a.school_year_cycle_id === filter.school_year_cycle_id,
      )
    }
    if (filter?.status) {
      result = result.filter((a) => a.status === filter.status)
    }
    if (filter?.school_year_cycle_term_id) {
      result = result.filter(
        (a) => a.school_year_cycle_term_id === filter.school_year_cycle_term_id,
      )
    }

    return result
  }

  async getAssessmentById(id: string): Promise<Assessment | undefined> {
    return this.assessments.find((a) => a.id === id)
  }

  async createAssessment(data: Omit<Assessment, 'id'>): Promise<Assessment> {
    const newItem: Assessment = { ...data, id: `ass-${Date.now()}` }
    this.assessments.push(newItem)
    return newItem
  }

  async updateAssessment(
    id: string,
    updates: Partial<Assessment>,
  ): Promise<Assessment> {
    const idx = this.assessments.findIndex((a) => a.id === id)
    if (idx === -1) throw new Error('Assessment not found')
    this.assessments[idx] = { ...this.assessments[idx], ...updates }
    return this.assessments[idx]
  }

  async getAssessmentSubjects(
    assessmentId: string,
  ): Promise<Array<AssessmentSubject>> {
    return this.subjects.filter((s) => s.assessment_id === assessmentId)
  }

  async getAssessmentSubjectById(
    id: string,
  ): Promise<AssessmentSubject | undefined> {
    return this.subjects.find((s) => s.id === id)
  }

  async createAssessmentSubject(
    data: Omit<AssessmentSubject, 'id'>,
  ): Promise<AssessmentSubject> {
    const newItem: AssessmentSubject = { ...data, id: `asub-${Date.now()}` }
    this.subjects.push(newItem)
    return newItem
  }

  async updateAssessmentSubject(
    id: string,
    updates: Partial<AssessmentSubject>,
  ): Promise<AssessmentSubject> {
    const idx = this.subjects.findIndex((s) => s.id === id)
    if (idx === -1) throw new Error('Subject not found')
    this.subjects[idx] = { ...this.subjects[idx], ...updates }
    return this.subjects[idx]
  }

  async getStudentAssessments(
    assessmentSubjectId: string,
  ): Promise<Array<StudentAssessment>> {
    return getStudentAssessmentsBySubject(assessmentSubjectId)
  }

  async getGradeEntryData(
    assessmentSubjectId: string,
  ): Promise<GradeEntryData> {
    const assessmentSubject = this.subjects.find(
      (s) => s.id === assessmentSubjectId,
    )
    if (!assessmentSubject) {
      throw new Error('Assessment subject not found')
    }

    const students = getStudentAssessmentsBySubject(assessmentSubjectId)
    const present = students.filter((s) => !s.is_absent)
    const absent = students.filter((s) => s.is_absent && !s.is_excused)
    const excused = students.filter((s) => s.is_excused)
    const scored = present.filter((s) => s.raw_score !== undefined)

    const avgScore =
      scored.length > 0
        ? scored.reduce((sum, s) => sum + (s.raw_score || 0), 0) / scored.length
        : 0

    return {
      assessmentSubject,
      students: students.sort((a, b) =>
        (a.student_last_name || '').localeCompare(b.student_last_name || ''),
      ),
      stats: {
        total: students.length,
        present: present.length,
        absent: absent.length,
        excused: excused.length,
        avgScore: Math.round(avgScore * 100) / 100,
      },
    }
  }

  async updateStudentAssessment(
    id: string,
    updates: Partial<StudentAssessment>,
  ): Promise<StudentAssessment> {
    const idx = this.grades.findIndex((g) => g.id === id)
    if (idx === -1) throw new Error('Student assessment not found')
    this.grades[idx] = { ...this.grades[idx], ...updates }
    return this.grades[idx]
  }

  async bulkUpdateStudentAssessments(
    updates: Array<{ id: string; updates: Partial<StudentAssessment> }>,
  ): Promise<Array<StudentAssessment>> {
    const results: Array<StudentAssessment> = []
    for (const { id, updates: updateData } of updates) {
      const idx = this.grades.findIndex((g) => g.id === id)
      if (idx !== -1) {
        this.grades[idx] = { ...this.grades[idx], ...updateData }
        results.push(this.grades[idx])
      }
    }
    return results
  }
}
