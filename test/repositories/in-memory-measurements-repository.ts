import { MeasurementsRepository } from 'src/domain/training/application/repositories/measurements-repository'
import { Measurements } from 'src/domain/training/enterprise/entities/measurements'

export class InMemoryMeasurementsRepository implements MeasurementsRepository {
  public measurements: Measurements[] = []

  async create(measurements: Measurements): Promise<void> {
    this.measurements.push(measurements)
  }

  async findById(id: string): Promise<Measurements | null> {
    const measurements = this.measurements.find(
      (measurements) => measurements.id === id,
    )

    if (!measurements) {
      return null
    }

    return measurements
  }

  async findManyByCustomerId(customerId: string): Promise<Measurements[]> {
    const measurements = this.measurements.filter(
      (measurements) => measurements.customerId === customerId,
    )

    return measurements
  }

  async delete(id: string): Promise<void> {
    const measurementsIndex = this.measurements.findIndex(
      (measurements) => measurements.id === id,
    )

    this.measurements.splice(measurementsIndex, 1)
  }
}
