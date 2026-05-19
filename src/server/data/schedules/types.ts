export interface SchoolYearCycleTimeSlot {
  id: string
  school_year_cycle_id: string
  name: string // e.g. "1ère Heure", "Récréation"
  order: number
  start_time: string // e.g. "08:00"
  end_time: string // e.g. "08:50"
  duration_minutes: number
  status: 'ACTIVE' | 'INACTIVE'
}

export interface Schedule {
  id: string
  school_year_id: string
  school_year_cycle_id: string
  classroom_id: string
  teacher_assignment_id: string
  day_of_week: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT'
  time_slot_id: string
  start_time: string
  end_time: string
  effective_from: string
  effective_to?: string
  status: 'DRAFT' | 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED'
  // Relational display helpers
  teacher_name?: string
  subject_name?: string
  subject_color?: string
}

export interface SchedulesDataAdapter {
  getTimeSlots: (
    schoolYearCycleId: string,
  ) => Promise<Array<SchoolYearCycleTimeSlot>>
  createTimeSlot: (
    data: Omit<SchoolYearCycleTimeSlot, 'id'>,
  ) => Promise<SchoolYearCycleTimeSlot>
  updateTimeSlot: (
    id: string,
    updates: Partial<SchoolYearCycleTimeSlot>,
  ) => Promise<SchoolYearCycleTimeSlot>
  deleteTimeSlot: (id: string) => Promise<void>

  getClassroomSchedule: (classroomId: string) => Promise<Array<Schedule>>
  getTeacherSchedule: (teacherAssignmentId: string) => Promise<Array<Schedule>>
  createScheduleBlock: (data: Omit<Schedule, 'id'>) => Promise<Schedule>
  updateScheduleBlock: (
    id: string,
    updates: Partial<Schedule>,
  ) => Promise<Schedule>
  deleteScheduleBlock: (id: string) => Promise<void>
}
