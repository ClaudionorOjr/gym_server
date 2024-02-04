import { Prisma, Musculature as RawMusculature } from '@prisma/client'
import { Musculature } from '@workout/enterprise/entities/musculature'

export class PrismaMusculatureMapper {
  /**
   * Converts an `Musculature` object to a `Prisma.MusculatureUncheckedCreateInput` object.
   *
   * @param {Musculature} musculature - The `Musculature` object to convert.
   * @return {Prisma.MusculatureUncheckedCreateInput} - The converted `Prisma.MusculatureUncheckedCreateInput` object.
   */
  static toPrisma(
    musculature: Musculature,
  ): Prisma.MusculatureUncheckedCreateInput {
    return {
      id: musculature.id,
      name: musculature.name,
    }
  }

  /**
   * Converts a Prisma raw Musculature object into an `Musculature` domain object.
   *
   * @param {RawMusculature} raw - The Prisma raw Musculature object to convert.
   * @return {Musculature} - The converted `Musculature` domain object.
   */
  static toDomain(raw: RawMusculature): Musculature {
    return Musculature.create(
      {
        name: raw.name,
      },
      raw.id,
    )
  }
}
