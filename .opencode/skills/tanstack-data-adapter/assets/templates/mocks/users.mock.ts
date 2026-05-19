import type { User } from '../types'

export const mockUsers: User[] = [
  {
    id: 'local_user_1',
    email: 'alice@example.com',
    name: 'Alice Johnson',
    role: 'admin',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'local_user_2',
    email: 'bob@example.com',
    name: 'Bob Smith',
    role: 'user',
    createdAt: new Date('2024-02-20'),
  },
  {
    id: 'local_user_3',
    email: 'carol@example.com',
    name: 'Carol Williams',
    role: 'user',
    createdAt: new Date('2024-03-10'),
  },
]
