import 'reflect-metadata'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { makeCustomer } from 'test/factories/make-customer'
import { InMemoryCustomersRepository } from 'test/repositories/in-memory-customers-repository'
import { InMemoryMeasurementsRepository } from 'test/repositories/in-memory-measurements-repository'
import { RegisterMeasurementsUseCase } from './register-measurements'

let customersRepository: InMemoryCustomersRepository
let measurementsRepository: InMemoryMeasurementsRepository
let sut: RegisterMeasurementsUseCase

describe('Register measurements use case', () => {
  beforeEach(() => {
    customersRepository = new InMemoryCustomersRepository()
    measurementsRepository = new InMemoryMeasurementsRepository()
    sut = new RegisterMeasurementsUseCase(
      customersRepository,
      measurementsRepository,
    )
  })

  it('should be able to register measurements for a customer', async () => {
    await customersRepository.create(makeCustomer({}, 'customer-01'))

    const result = await sut.execute({
      customerId: 'customer-01',
      bust: 80,
      biceps: 20,
      forearm: 15,
      waist: 70,
      hips: 80,
      thigh: 40,
      calf: 25,
    })

    expect(result.isSuccess()).toBe(true)
    expect(measurementsRepository.measurements).toHaveLength(1)
  })

  it('should not be able to register measurements for a non existing customer', async () => {
    const result = await sut.execute({
      customerId: 'customer-01',
      bust: 80,
      biceps: 20,
      forearm: 15,
      waist: 70,
      hips: 80,
      thigh: 40,
      calf: 25,
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
