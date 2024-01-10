import { AdminsRepository } from '@account/application/repositories/admins-repository'
import { Admin } from '@account/enterprise/entities/admin'
import { PrismaService } from '..'
import { PrismaAdminMapper } from '../mappers/prisma-admin-mapper'
import { inject, injectable } from 'tsyringe'

@injectable()
export class PrismaAdminsRepository implements AdminsRepository {
  constructor(@inject('Prisma') private prisma: PrismaService) {}

  async create(admin: Admin): Promise<void> {
    const data = PrismaAdminMapper.toPrisma(admin)

    await this.prisma.admin.create({
      data,
    })
  }

  async findByEmail(email: string): Promise<Admin | null> {
    const admin = await this.prisma.admin.findUnique({ where: { email } })

    if (!admin) {
      return null
    }

    return PrismaAdminMapper.toDomain(admin)
  }

  async findById(id: string): Promise<Admin | null> {
    const admin = await this.prisma.admin.findUnique({ where: { id } })

    if (!admin) {
      return null
    }

    return PrismaAdminMapper.toDomain(admin)
  }

  async save(admin: Admin): Promise<void> {
    const data = PrismaAdminMapper.toPrisma(admin)

    await this.prisma.admin.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.admin.delete({
      where: {
        id,
      },
    })
  }
}
