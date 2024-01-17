import { Prisma, Measurements as RawMeasurements } from '@prisma/client'
import { Measurements } from '@workout/enterprise/entities/measurements'

export class PrismaMeasurementsMapper {
  static toPrisma(
    measurements: Measurements,
  ): Prisma.MeasurementsUncheckedCreateInput {
    return {
      id: measurements.id,
      customerId: measurements.customerId,
      bust: measurements.bust,
      bicep: measurements.bicep,
      forearm: measurements.forearm,
      waist: measurements.waist,
      hips: measurements.hips,
      thigh: measurements.thigh,
      calf: measurements.calf,
      measurementsTakenAt: measurements.measurementsTakenAt,
    }
  }

  static toDomain(raw: RawMeasurements): Measurements {
    return Measurements.create(
      {
        customerId: raw.customerId,
        bust: Number(raw.bust),
        bicep: Number(raw.bicep),
        forearm: Number(raw.forearm),
        waist: Number(raw.waist),
        hips: Number(raw.hips),
        thigh: Number(raw.thigh),
        calf: Number(raw.calf),
        measurementsTakenAt: raw.measurementsTakenAt,
      },
      raw.id,
    )
  }
}
