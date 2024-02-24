import { Prisma, Measurements as RawMeasurements } from '@prisma/client'
import { Measurements } from '@workout/enterprise/entities/measurements'

export class PrismaMeasurementsMapper {
  /**
   * Converts an `Measurements` object to a `Prisma.MeasurementsUncheckedCreateInput` object.
   *
   * @param {Measurements} measurements - The `Measurements` object to convert.
   * @return {Prisma.MeasurementsUncheckedCreateInput} - The converted `Prisma.MeasurementsUncheckedCreateInput` object.
   */
  static toPrisma(
    measurements: Measurements,
  ): Prisma.MeasurementsUncheckedCreateInput {
    return {
      id: measurements.id,
      customerId: measurements.customerId,
      bust: measurements.bust,
      bicep: measurements.biceps,
      forearm: measurements.forearm,
      waist: measurements.waist,
      hips: measurements.hips,
      thigh: measurements.thigh,
      calf: measurements.calf,
      measurementsTakenAt: measurements.measurementsTakenAt,
    }
  }

  /**
   * Converts a Prisma raw Measurements object into an `Measurements` domain object.
   *
   * @param {RawMeasurements} raw - The Prisma raw Measurements object to convert.
   * @return {Measurements} - The converted `Measurements` domain object.
   */
  static toDomain(raw: RawMeasurements): Measurements {
    return Measurements.create(
      {
        customerId: raw.customerId,
        bust: Number(raw.bust),
        biceps: Number(raw.bicep),
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
