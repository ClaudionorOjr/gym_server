import { inject, injectable } from 'tsyringe'
import { PrismaService } from '..'
import { MusculaturesRepository } from '@workout/application/repositories/musculatures-repository'
import { Musculature } from '@workout/enterprise/entities/musculature'
import { PrismaMusculatureMapper } from '../mappers/prisma-musculature-mapper'

@injectable()
export class PrismaMusculaturesRepository implements MusculaturesRepository {
  constructor(@inject('Prisma') private prisma: PrismaService) {}

  async create(musculature: Musculature): Promise<void> {
    const data = PrismaMusculatureMapper.toPrisma(musculature)

    await this.prisma.musculature.create({
      data,
    })
  }

  async findById(id: string): Promise<Musculature | null> {
    const musculature = await this.prisma.musculature.findUnique({
      where: {
        id,
      },
    })

    if (!musculature) {
      return null
    }

    return PrismaMusculatureMapper.toDomain(musculature)
  }

  async findByName(name: string): Promise<Musculature | null> {
    const musculature = await this.prisma.musculature.findUnique({
      where: {
        name,
      },
    })

    if (!musculature) {
      return null
    }

    return PrismaMusculatureMapper.toDomain(musculature)
  }

  async findMany(): Promise<Musculature[]> {
    const musculatures = await this.prisma.musculature.findMany({})

    return musculatures.map(PrismaMusculatureMapper.toDomain)
  }

  async delete(id: string): Promise<void> {
    await this.prisma.musculature.delete({
      where: {
        id,
      },
    })
  }
}
