import 'reflect-metadata'
import { InMemoryMeasurementsRepository } from 'test/repositories/in-memory-measurements-repository'
import { GetMeasurementsUseCase } from './get-measurements'
import { makeMeasurements } from 'test/factories/make-measurements'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'

describe('Get measurements use case', () => {
  let measurementsRepository: InMemoryMeasurementsRepository
  let sut: GetMeasurementsUseCase

  beforeEach(() => {
    measurementsRepository = new InMemoryMeasurementsRepository()

    sut = new GetMeasurementsUseCase(measurementsRepository)
  })

  it('should be able to get measurements', async () => {
    await measurementsRepository.create(makeMeasurements({}, 'measurements-01'))
    const result = await sut.execute({
      measurementsId: 'measurements-01',
    })

    expect(result.isSuccess()).toBe(true)

    expect(result.value).toEqual({
      measurements: expect.objectContaining({
        id: 'measurements-01',
      }),
    })
  })

  it('should not be able to get non existing measurements', async () => {
    const result = await sut.execute({
      measurementsId: 'measurements-01',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
