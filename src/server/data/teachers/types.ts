export interface Teacher {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
}

export interface SchoolYearTeacher {
  id: string
  school_year_id: string
  teacher_id: string
  status: 'ACTIVE' | 'SUSPENDED' | 'LEFT'
  hire_date?: string
  end_date?: string
  // Related data
  teacher?: Teacher
}

export interface TeacherAssignment {
  id: string
  school_year_teacher_id: string
  classroom_id: string
  school_year_level_subject_id: string
  assignment_status: 'ACTIVE' | 'REPLACED' | 'ENDED'
  start_date: string
  end_date?: string
  replaced_by_id?: string
  // Related data for display
  classroom_name?: string
  subject_name?: string
}

export interface TeachersDataAdapter {
  getTeachers: () => Promise<Array<Teacher>>
  getSchoolYearTeachers: (
    schoolYearId: string,
  ) => Promise<Array<SchoolYearTeacher>>
  getTeacherAssignments: (
    schoolYearTeacherId: string,
  ) => Promise<Array<TeacherAssignment>>
  assignTeacherToSchoolYear: (
    data: Omit<SchoolYearTeacher, 'id'>,
  ) => Promise<SchoolYearTeacher>
  updateSchoolYearTeacher: (
    id: string,
    updates: Partial<SchoolYearTeacher>,
  ) => Promise<SchoolYearTeacher>
  createTeacherAssignment: (
    data: Omit<TeacherAssignment, 'id'>,
  ) => Promise<TeacherAssignment>
  updateTeacherAssignment: (
    id: string,
    updates: Partial<TeacherAssignment>,
  ) => Promise<TeacherAssignment>
}
