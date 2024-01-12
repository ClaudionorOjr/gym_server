import { Customer, CustomerProps } from '@account/enterprise/entities/customer'
import { faker } from '@faker-js/faker'
import { randomUUID } from 'node:crypto'

import { PrismaCustomerMapper } from '@infra/database/prisma/mappers/prisma-customer-mapper'
import { PrismaClient } from '@prisma/client'

export function makeCustomer(
  override?: Partial<CustomerProps>,
  id?: string,
): Customer {
  return Customer.create(
    {
      completeName: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      birthdate: faker.date.birthdate(),
      registeredBy: randomUUID(),
      ...override,
    },
    id,
  )
}

export class CustomerFactory {
  constructor(private prisma: PrismaClient) {}

  async makePrismaCustomer(data: Partial<CustomerProps> = {}, id?: string) {
    const customer = makeCustomer(data, id)

    await this.prisma.customer.create({
      data: PrismaCustomerMapper.toPrisma(customer),
    })

    return customer
  }
}
