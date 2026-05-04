import type { AdminUser } from './types';

export const mockAdminUsers: AdminUser[] = [
  { id: 'USR-001', name: 'Jean Dupont', email: 'jean.dupont@example.com', role: 'admin', status: 'Active' },
  { id: 'USR-002', name: 'Marie Martin', email: 'marie.m@example.com', role: 'teacher', status: 'Active' },
  { id: 'USR-003', name: 'Paul Bernard', email: 'paul.b@example.com', role: 'student', status: 'Inactive' },
  { id: 'USR-004', name: 'Sophie Laurent', email: 'sophie.l@example.com', role: 'parent', status: 'Active' },
  { id: 'USR-005', name: 'Lucas Moreau', email: 'lucas.m@example.com', role: 'teacher', status: 'Pending' },
];
