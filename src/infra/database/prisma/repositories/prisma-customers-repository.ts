import { inject, injectable } from 'tsyringe'
import { PrismaService } from '..'
import { CustomersRepository } from '@account/application/repositories/customers-repository'
import { Customer } from '@account/enterprise/entities/customer'
import { PrismaCustomerMapper } from '../mappers/prisma-customer-mapper'

@injectable()
export class PrismaCustomersRepository implements CustomersRepository {
  constructor(@inject('Prisma') private prisma: PrismaService) {}

  async create(customer: Customer): Promise<void> {
    const data = PrismaCustomerMapper.toPrisma(customer)

    await this.prisma.customer.create({
      data,
    })
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const customer = await this.prisma.customer.findUnique({
      where: {
        email,
      },
    })

    if (!customer) {
      return null
    }

    return PrismaCustomerMapper.toDomain(customer)
  }

  async findById(id: string): Promise<Customer | null> {
    const customer = await this.prisma.customer.findUnique({
      where: {
        id,
      },
    })

    if (!customer) {
      return null
    }

    return PrismaCustomerMapper.toDomain(customer)
  }

  async findMany(): Promise<Customer[]> {
    const customers = await this.prisma.customer.findMany()

    return customers.map(PrismaCustomerMapper.toDomain)
  }

  async save(customer: Customer): Promise<void> {
    const data = PrismaCustomerMapper.toPrisma(customer)

    await this.prisma.customer.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.customer.delete({
      where: {
        id,
      },
    })
  }
}
