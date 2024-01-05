import { InMemoryMeasurementsRepository } from 'test/repositories/in-memory-measurements-repository'
import { FetchMeasurementsUseCase } from './fetch-measurements'
import { makeMeasurements } from 'test/factories/make-measurements'

let measurementsRepository: InMemoryMeasurementsRepository
let sut: FetchMeasurementsUseCase

describe('Fetch measurements use case', () => {
  beforeEach(() => {
    measurementsRepository = new InMemoryMeasurementsRepository()
    sut = new FetchMeasurementsUseCase(measurementsRepository)
  })

  it('should be able to fetch measurements for a customer', async () => {
    await measurementsRepository.create(
      makeMeasurements({ customerId: 'customer-01' }),
    )
    await measurementsRepository.create(
      makeMeasurements({ customerId: 'customer-01' }),
    )

    const result = await sut.execute({
      customerId: 'customer-01',
    })

    expect(result.isSuccess()).toBe(true)
    expect(result.value).toEqual({
      measurements: expect.arrayContaining([
        expect.objectContaining({ customerId: 'customer-01' }),
        expect.objectContaining({ customerId: 'customer-01' }),
      ]),
    })
  })
})
