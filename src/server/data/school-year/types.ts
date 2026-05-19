export interface SchoolYear {
  id: string
  school_id: string
  name: string
  start_date: string
  end_date: string
  status: 'CURRENT' | 'FUTURE' | 'ARCHIVE'
}

export interface SchoolYearCycle {
  id: string
  school_year_id: string
  cycle_id: string
  term_type_id: string
}

export interface SchoolYearLevel {
  id: string
  school_year_cycle_id: string
  level_id: string
  track_id?: string | null
}

export interface SchoolYearLevelSubject {
  id: string
  school_year_level_id: string
  subject_id: string
  coefficient: number
}

export interface Classroom {
  id: string
  school_year_level_id: string
  name: string
  capacity?: number | null
  room_number?: string | null
}

export interface SchoolYearCycleTimeSlot {
  id: string
  school_year_cycle_id: string
  name: string
  order: number
  start_time: string
  end_time: string
  duration_minutes: number
  status: 'ACTIVE' | 'INACTIVE'
}

export interface SchoolYearDataAdapter {
  getSchoolYears: (schoolId?: string) => Promise<Array<SchoolYear>>
  getSchoolYear: (id: string) => Promise<SchoolYear | null>
  getSchoolYearCycles: (schoolYearId: string) => Promise<Array<SchoolYearCycle>>
  getSchoolYearLevels: (
    schoolYearCycleId: string,
  ) => Promise<Array<SchoolYearLevel>>
  getSchoolYearLevelSubjects: (
    schoolYearLevelId: string,
  ) => Promise<Array<SchoolYearLevelSubject>>
  getClassrooms: (schoolYearLevelId: string) => Promise<Array<Classroom>>
  getTimeSlots: (
    schoolYearCycleId: string,
  ) => Promise<Array<SchoolYearCycleTimeSlot>>
}
