import { mockSchedules, mockTimeSlots } from './mocks'
import type {
  Schedule,
  SchedulesDataAdapter,
  SchoolYearCycleTimeSlot,
} from './types'

// Overlap detection helper
function timesToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

function hasTimeOverlap(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
): boolean {
  return (
    timesToMinutes(aStart) < timesToMinutes(bEnd) &&
    timesToMinutes(aEnd) > timesToMinutes(bStart)
  )
}

export class LocalSchedulesAdapter implements SchedulesDataAdapter {
  private timeSlots = [...mockTimeSlots]
  private schedules = [...mockSchedules]

  async getTimeSlots(
    schoolYearCycleId: string,
  ): Promise<Array<SchoolYearCycleTimeSlot>> {
    return this.timeSlots
      .filter((t) => t.school_year_cycle_id === schoolYearCycleId)
      .sort((a, b) => a.order - b.order)
  }

  async createTimeSlot(
    data: Omit<SchoolYearCycleTimeSlot, 'id'>,
  ): Promise<SchoolYearCycleTimeSlot> {
    // Validate start < end
    if (
      timesToMinutes(data.start_time) >= timesToMinutes(data.end_time)
    ) {
      throw new Error(
        "L'heure de début doit être antérieure à l'heure de fin.",
      )
    }

    // Overlap check within same cycle
    const overlap = this.timeSlots
      .filter(
        (t) =>
          t.school_year_cycle_id === data.school_year_cycle_id &&
          t.status === 'ACTIVE',
      )
      .find((t) =>
        hasTimeOverlap(data.start_time, data.end_time, t.start_time, t.end_time),
      )

    if (overlap) {
      throw new Error(
        `Chevauchement avec le créneau "${overlap.name}" (${overlap.start_time}–${overlap.end_time}).`,
      )
    }

    // Order uniqueness check
    const orderConflict = this.timeSlots.find(
      (t) =>
        t.school_year_cycle_id === data.school_year_cycle_id &&
        t.order === data.order,
    )
    if (orderConflict) {
      throw new Error(
        `Le numéro d'ordre ${data.order} est déjà utilisé par "${orderConflict.name}".`,
      )
    }

    const newSlot: SchoolYearCycleTimeSlot = { ...data, id: `ts-${Date.now()}` }
    this.timeSlots.push(newSlot)
    return newSlot
  }

  async updateTimeSlot(
    id: string,
    updates: Partial<SchoolYearCycleTimeSlot>,
  ): Promise<SchoolYearCycleTimeSlot> {
    const idx = this.timeSlots.findIndex((t) => t.id === id)
    if (idx === -1) throw new Error('Time slot not found')

    // Check if slot is in use (immutability rule)
    const inUse = this.schedules.some((s) => s.time_slot_id === id)
    if (inUse && (updates.start_time || updates.end_time)) {
      throw new Error(
        'Ce créneau est utilisé par des cours existants. Modifiez uniquement le nom ou le statut.',
      )
    }

    this.timeSlots[idx] = { ...this.timeSlots[idx], ...updates }
    return this.timeSlots[idx]
  }

  async deleteTimeSlot(id: string): Promise<void> {
    // Block delete if slot is used by any schedule block
    const inUse = this.schedules.some((s) => s.time_slot_id === id)
    if (inUse) {
      throw new Error(
        'Impossible de supprimer ce créneau : il est utilisé par des cours. Désactivez-le à la place.',
      )
    }
    this.timeSlots = this.timeSlots.filter((t) => t.id !== id)
  }

  async getClassroomSchedule(classroomId: string): Promise<Array<Schedule>> {
    return this.schedules.filter(
      (s) => s.classroom_id === classroomId && s.status === 'ACTIVE',
    )
  }

  async getTeacherSchedule(
    teacherAssignmentId: string,
  ): Promise<Array<Schedule>> {
    return this.schedules.filter(
      (s) =>
        s.teacher_assignment_id === teacherAssignmentId &&
        s.status === 'ACTIVE',
    )
  }

  async createScheduleBlock(data: Omit<Schedule, 'id'>): Promise<Schedule> {
    // Conflict detection: teacher and classroom double-booking
    const conflict = this.schedules.find(
      (s) =>
        s.status === 'ACTIVE' &&
        s.time_slot_id === data.time_slot_id &&
        s.day_of_week === data.day_of_week &&
        (s.classroom_id === data.classroom_id ||
          s.teacher_assignment_id === data.teacher_assignment_id),
    )
    if (conflict) {
      const reason =
        conflict.classroom_id === data.classroom_id
          ? 'cette classe est déjà occupée'
          : `${conflict.teacher_name || 'ce professeur'} a déjà un cours`
      throw new Error(
        `Conflit détecté : ${reason} à ce créneau (${conflict.subject_name}).`,
      )
    }

    const newBlock: Schedule = { ...data, id: `sch-${Date.now()}` }
    this.schedules.push(newBlock)
    return newBlock
  }

  async updateScheduleBlock(
    id: string,
    updates: Partial<Schedule>,
  ): Promise<Schedule> {
    const idx = this.schedules.findIndex((s) => s.id === id)
    if (idx === -1) throw new Error('Schedule block not found')
    this.schedules[idx] = { ...this.schedules[idx], ...updates }
    return this.schedules[idx]
  }

  async deleteScheduleBlock(id: string): Promise<void> {
    this.schedules = this.schedules.filter((s) => s.id !== id)
  }
}
