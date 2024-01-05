import { Customer } from '@account/enterprise/entities/customer'

export interface CustomersRepository {
  create(customer: Customer): Promise<void>
  findByEmail(email: string): Promise<Customer | null>
  findById(id: string): Promise<Customer | null>
  findMany(): Promise<Customer[]>
  save(customer: Customer): Promise<void>
  delete(id: string): Promise<void>
}
