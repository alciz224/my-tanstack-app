import { mockAdminUsers } from './mocks'
import type { AdminUser, UsersDataAdapter } from './types'

export class LocalUsersAdapter implements UsersDataAdapter {
  private users = [...mockAdminUsers]

  private async delay(ms = 300) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async getUsers(): Promise<Array<AdminUser>> {
    await this.delay()
    return this.users.map((u) => ({ ...u }))
  }
}
