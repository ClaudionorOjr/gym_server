import { Admin, AdminProps } from '@account/enterprise/entities/admin'
import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { PrismaAdminMapper } from '@infra/database/prisma/mappers/prisma-admin-mapper'

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

export class AdminFactory {
  constructor(private prisma: PrismaClient) {}

  async makePrismaAdmin(
    data: Partial<AdminProps> = {},
    id?: string,
  ): Promise<Admin> {
    const admin = makeAdmin(data, id)

    await this.prisma.admin.create({
      data: PrismaAdminMapper.toPrisma(admin),
    })

    return admin
  }
}
