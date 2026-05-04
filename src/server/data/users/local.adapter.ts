import type { UsersDataAdapter, AdminUser } from './types';
import { mockAdminUsers } from './mocks';

export class LocalUsersAdapter implements UsersDataAdapter {
  private users = [...mockAdminUsers];

  private async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getUsers(): Promise<AdminUser[]> {
    await this.delay();
    return this.users.map(u => ({ ...u }));
  }
}
