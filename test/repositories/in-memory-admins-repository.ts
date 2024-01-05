import { Admin } from '@account/enterprise/entities/admin'
import { AdminsRepository } from '@account/application/repositories/admins-repository'

export class InMemoryAdminsRepository implements AdminsRepository {
  public admins: Admin[] = []

  async create(admin: Admin): Promise<void> {
    this.admins.push(admin)
  }

  async findByEmail(email: string): Promise<Admin | null> {
    const admin = this.admins.find((admin) => admin.email === email)

    if (!admin) {
      return null
    }

    return admin
  }

  async findById(id: string): Promise<Admin | null> {
    const admin = this.admins.find((admin) => admin.id === id)

    if (!admin) {
      return null
    }

    return admin
  }

  async save(admin: Admin): Promise<void> {
    const adminIndex = this.admins.findIndex((item) => item.id === admin.id)

    this.admins[adminIndex] = admin
  }

  async delete(id: string): Promise<void> {
    const adminIndex = this.admins.findIndex((admin) => admin.id === id)

    this.admins.splice(adminIndex, 1)
  }
}
