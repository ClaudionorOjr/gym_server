import { Customer, CustomerProps } from '@account/enterprise/entities/customer'
import { faker } from '@faker-js/faker'
import { randomUUID } from 'node:crypto'

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
