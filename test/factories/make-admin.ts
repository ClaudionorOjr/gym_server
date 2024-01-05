import { Admin, AdminProps } from '@account/enterprise/entities/admin'
import { faker } from '@faker-js/faker'

export function makeAdmin(override?: Partial<AdminProps>, id?: string): Admin {
  return Admin.create(
    {
      completeName: faker.person.fullName(),
      email: faker.internet.email(),
      passwordHash: faker.internet.password(),
      phone: faker.phone.number(),
      ...override,
    },
    id,
  )
}
