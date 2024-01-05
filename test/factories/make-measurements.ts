import {
  Measurements,
  MeasurementsProps,
} from 'src/domain/training/enterprise/entities/measurements'
import { randomUUID } from 'node:crypto'

export function makeMeasurements(
  override?: Partial<MeasurementsProps>,
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
