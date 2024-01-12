import { randomUUID } from 'node:crypto'
import {
  Measurements,
  MeasurementsProps,
} from '@workout/enterprise/entities/measurements'

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
