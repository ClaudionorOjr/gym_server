import { PrismaClient } from '@prisma/client'
import {
  Musculature,
  MusculatureProps,
} from '@workout/enterprise/entities/musculature'
import { PrismaMusculatureMapper } from '@infra/database/prisma/mappers/prisma-musculature-mapper'

export function makeMusculature(
  override: Partial<MusculatureProps> = {},
  id?: string,
) {
  return Musculature.create(
    {
      name: 'Thigh',
      ...override,
    },
    id,
  )
}

export class MusculatureFactory {
  constructor(private prisma: PrismaClient) {}

  async makePrismaMusculature(
    data: Partial<MusculatureProps> = {},
    id?: string,
  ) {
    const musculature = makeMusculature(data, id)

    await this.prisma.musculature.create({
      data: PrismaMusculatureMapper.toPrisma(musculature),
    })

    return musculature
  }
}
