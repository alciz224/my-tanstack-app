export interface Parent {
  id: string
  full_name: string
  email: string | null
  phone: string | null
  address: string | null
  // Derived from students
  children_count: number
  children: Array<{
    id: string
    full_name: string
    class_name: string
    level: string
    academic_year: string
    enrollment_status: string
  }>
}

export interface ParentsFilter {
  search?: string
  has_email?: boolean
  has_phone?: boolean
}

export interface ParentsDataAdapter {
  getParents: (filter?: ParentsFilter) => Promise<Array<Parent>>
  getParentById: (id: string) => Promise<Parent | undefined>
}
