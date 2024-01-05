import { InMemoryMeasurementsRepository } from 'test/repositories/in-memory-measurements-repository'
import { DeleteMeasurementsUseCase } from './delete-measurements'
import { makeMeasurements } from 'test/factories/make-measurements'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'

let measurementsRepository: InMemoryMeasurementsRepository
let sut: DeleteMeasurementsUseCase

describe('Delete measurements use case', () => {
  beforeEach(() => {
    measurementsRepository = new InMemoryMeasurementsRepository()
    sut = new DeleteMeasurementsUseCase(measurementsRepository)
  })

  it('should be able to delete measurements', async () => {
    await measurementsRepository.create(makeMeasurements({}, 'measurements-01'))

    const result = await sut.execute({
      measurementId: 'measurements-01',
    })

    expect(result.isSuccess()).toBe(true)
    expect(measurementsRepository.measurements).toHaveLength(0)
  })

  it('should not be able to delete non existing measurements', async () => {
    const result = await sut.execute({
      measurementId: 'measurements-01',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
