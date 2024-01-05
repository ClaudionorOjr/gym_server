import { Measurements } from '../../enterprise/entities/measurements'

export interface MeasurementsRepository {
  create(measurements: Measurements): Promise<void>
  findById(id: string): Promise<Measurements | null>
  findManyByCustomerId(customerId: string): Promise<Measurements[]>
  delete(id: string): Promise<void>
}
