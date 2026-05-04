export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student' | 'parent';
  status: 'Active' | 'Inactive' | 'Pending';
}

export interface UsersDataAdapter {
  getUsers(): Promise<AdminUser[]>;
}
