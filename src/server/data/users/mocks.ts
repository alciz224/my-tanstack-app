import type { AdminUser } from './types'

export const mockAdminUsers: Array<AdminUser> = [
  {
    id: 'usr-001',
    name: 'Bassekou Sidibé',
    email: 'b.sidibe@excellence.edu.gn',
    role: 'school_admin',
    status: 'Active',
  },
  {
    id: 'usr-002',
    name: 'Mamadou Diallo',
    email: 'm.diallo@excellence.edu.gn',
    role: 'teacher',
    status: 'Active',
  },
  {
    id: 'usr-003',
    name: 'Aïssatou Bah',
    email: 'a.bah@excellence.edu.gn',
    role: 'teacher',
    status: 'Active',
  },
  {
    id: 'usr-004',
    name: 'Mohamed Camara',
    email: 'm.camara@excellence.edu.gn',
    role: 'admin',
    status: 'Active',
  },
  {
    id: 'usr-005',
    name: 'Fatoumata Touré',
    email: 'f.toure@excellence.edu.gn',
    role: 'parent',
    status: 'Active',
  },
  {
    id: 'usr-006',
    name: 'Ousmane Sow',
    email: 'o.sow@excellence.edu.gn',
    role: 'student',
    status: 'Active',
  },
  {
    id: 'usr-007',
    name: 'Mariam Barry',
    email: 'm.barry@excellence.edu.gn',
    role: 'teacher',
    status: 'Inactive',
  },
  {
    id: 'usr-008',
    name: 'Abdoulaye Konaté',
    email: 'a.konate@excellence.edu.gn',
    role: 'super_admin',
    status: 'Active',
  },
]

export type { AdminUser } from './types'
