import { MeasurementsRepository } from '@workout/application/repositories/measurements-repository'
import { Measurements } from '@workout/enterprise/entities/measurements'
import { PrismaService } from '..'
import { inject, injectable } from 'tsyringe'
import { PrismaMeasurementsMapper } from '../mappers/prisma-measurements-mapper'

@injectable()
export class PrismaMeasurementsRepository implements MeasurementsRepository {
  constructor(@inject('Prisma') private prisma: PrismaService) {}

  async create(measurements: Measurements): Promise<void> {
    const data = PrismaMeasurementsMapper.toPrisma(measurements)

    await this.prisma.measurements.create({
      data,
    })
  }

  async findById(id: string): Promise<Measurements | null> {
    const measurements = await this.prisma.measurements.findUnique({
      where: {
        id,
      },
    })

    if (!measurements) {
      return null
    }

    return PrismaMeasurementsMapper.toDomain(measurements)
  }

  async findManyByCustomerId(customerId: string): Promise<Measurements[]> {
    const measurements = await this.prisma.measurements.findMany({
      where: {
        customerId,
      },
    })

    return measurements.map(PrismaMeasurementsMapper.toDomain)
  }

  async delete(id: string): Promise<void> {
    await this.prisma.measurements.delete({
      where: {
        id,
      },
    })
  }
}
