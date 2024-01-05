import { CustomersRepository } from '@account/application/repositories/customers-repository'
import { Customer } from '@account/enterprise/entities/customer'

export class InMemoryCustomersRepository implements CustomersRepository {
  public customers: Customer[] = []

  async create(customer: Customer): Promise<void> {
    this.customers.push(customer)
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const customer = this.customers.find((customer) => customer.email === email)

    if (!customer) {
      return null
    }

    return customer
  }

  async findById(id: string): Promise<Customer | null> {
    const customer = this.customers.find((customer) => customer.id === id)

    if (!customer) {
      return null
    }

    return customer
  }

  // TODO: Fazer paginação (?)
  async findMany(): Promise<Customer[]> {
    return this.customers
  }

  async save(customer: Customer): Promise<void> {
    const customerIndex = this.customers.findIndex(
      (item) => item.id === customer.id,
    )

    this.customers[customerIndex] = customer
  }

  async delete(id: string): Promise<void> {
    const customerIndex = this.customers.findIndex((item) => item.id === id)

    this.customers.splice(customerIndex, 1)
  }
}
