import { randomUUID } from 'node:crypto'
import {
  Measurements,
  MeasurementsProps,
} from '@workout/enterprise/entities/measurements'
import { PrismaMeasurementsMapper } from '@infra/database/prisma/mappers/prisma-measurements-mapper'
import { PrismaClient } from '@prisma/client'

export function makeMeasurements(
  override: Partial<MeasurementsProps> = {},
  id?: string,
) {
  return Measurements.create(
    {
      customerId: randomUUID(),
      bust: 80,
      bicep: 20,
      forearm: 15,
      waist: 70,
      hips: 80,
      thigh: 40,
      calf: 25,
      ...override,
    },
    id,
  )
}

export class MeasurementsFactory {
  constructor(private prisma: PrismaClient) {}

  async makePrismaMeasurements(
    data: Partial<MeasurementsProps> = {},
    id?: string,
  ) {
    const measurements = makeMeasurements(data, id)

    await this.prisma.measurements.create({
      data: PrismaMeasurementsMapper.toPrisma(measurements),
    })

    return measurements
  }
}
