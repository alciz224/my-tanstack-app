// All types match the Django backend model precisely.
// Audit & soft-delete fields follow the shared pattern:
//   created_at (datetime, required), updated_at (datetime, required)
//   created_by (FK, optional), updated_by (FK, optional)
//   is_deleted (boolean), deleted_at (datetime, optional), deleted_by (FK, optional)

export interface School {
  id: string
  name: string
  code: string
  locality_id: string
  address?: string
  phone?: string
  email?: string
  website?: string
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
  is_deleted?: boolean
  deleted_at?: string
  deleted_by?: string
}

export interface SchoolYear {
  id: string
  school_id: string
  start_date: string
  end_date: string
  name: string
  status: 'CURRENT' | 'FUTURE' | 'ARCHIVE'
  created_at: string
  updated_at: string
  created_by?: string
  updated_by?: string
  is_deleted?: boolean
  deleted_at?: string
  deleted_by?: string
}

export interface SchoolYearCycle {
  id: string
  school_year_id: string
  cycle_id: string
  term_type_id: string
  created_at: string
  created_by?: string
  updated_by?: string
  is_deleted?: boolean
  deleted_at?: string
  deleted_by?: string
}

export interface SchoolYearLevel {
  id: string
  school_year_cycle_id: string
  level_id: string
  level_name?: string
  track_id?: string
  created_at: string
  created_by?: string
  updated_by?: string
  is_deleted?: boolean
  deleted_at?: string
  deleted_by?: string
}

export interface SchoolYearLevelSubject {
  id: string
  school_year_level_id: string
  subject_id: string
  coefficient: number
  created_at: string
  created_by?: string
  updated_by?: string
  is_deleted?: boolean
  deleted_at?: string
  deleted_by?: string
}

export interface Classroom {
  id: string
  school_year_level_id: string
  name: string
  capacity?: number
  room_number?: string
  created_at: string
  created_by?: string
  updated_by?: string
  is_deleted?: boolean
  deleted_at?: string
  deleted_by?: string
}

export interface CreateSchoolInput {
  name: string
  code: string
  locality_id: string
  address?: string
  phone?: string
  email?: string
  website?: string
}

export interface SchoolsDataAdapter {
  getSchools: () => Promise<Array<School>>
  getSchoolById: (id: string) => Promise<School | null>
  createSchool: (data: CreateSchoolInput) => Promise<School>
  updateSchool: (id: string, data: Partial<School>) => Promise<School>
  deleteSchool: (id: string) => Promise<void>
  getSchoolYears: (schoolId: string) => Promise<Array<SchoolYear>>
  getSchoolYearById: (id: string) => Promise<SchoolYear | null>
  createSchoolYear: (
    data: Omit<SchoolYear, 'id' | 'created_at' | 'updated_at'>,
  ) => Promise<SchoolYear>
  updateSchoolYear: (
    id: string,
    data: Partial<SchoolYear>,
  ) => Promise<SchoolYear>
  getSchoolYearCycles: (schoolYearId: string) => Promise<Array<SchoolYearCycle>>
  getSchoolYearLevels: (
    schoolYearCycleId: string,
  ) => Promise<Array<SchoolYearLevel>>
  getSchoolYearLevelSubjects: (
    schoolYearLevelId: string,
  ) => Promise<Array<SchoolYearLevelSubject>>
  getClassrooms: (schoolYearLevelId: string) => Promise<Array<Classroom>>
  createClassroom: (
    data: Omit<Classroom, 'id' | 'created_at'>,
  ) => Promise<Classroom>
}
