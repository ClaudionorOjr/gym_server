import { Admin } from '@account/enterprise/entities/admin'

export interface AdminsRepository {
  create(admin: Admin): Promise<void>
  findByEmail(email: string): Promise<Admin | null>
  findById(id: string): Promise<Admin | null>
  save(admin: Admin): Promise<void>
  delete(id: string): Promise<void>
}
