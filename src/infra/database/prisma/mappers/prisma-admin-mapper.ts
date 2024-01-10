import { Admin } from '@account/enterprise/entities/admin'
import { Prisma, Admin as RawAdmin } from '@prisma/client'

export class PrismaAdminMapper {
  /**
   * Converts an `Admin` object to a `Prisma.AdminUncheckedCreateInput` object.
   *
   * @param {Admin} admin - The `Admin` object to convert.
   * @return {Prisma.AdminUncheckedCreateInput} - The converted `Prisma.AdminUncheckedCreateInput` object.
   */
  static toPrisma(admin: Admin): Prisma.AdminUncheckedCreateInput {
    return {
      id: admin.id,
      completeName: admin.completeName,
      email: admin.email,
      passwordHash: admin.passwordHash,
      phone: admin.phone,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    }
  }

  /**
   * Converts a Prisma raw Admin object into an `Admin` domain object.
   *
   * @param {RawAdmin} raw - The Prisma raw Admin object to convert.
   * @return {Admin} - The converted `Admin` domain object.
   */
  static toDomain(raw: RawAdmin): Admin {
    return Admin.create(
      {
        completeName: raw.completeName,
        email: raw.email,
        passwordHash: raw.passwordHash,
        phone: raw.phone,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      raw.id,
    )
  }
}
