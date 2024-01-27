import { InMemoryCustomersRepository } from 'test/repositories/in-memory-customers-repository'
import { InMemoryWorkoutsRepository } from 'test/repositories/in-memory-workouts-repository'
import { FetchWorkoutsCustomerUseCase } from './fetch-workouts-customer'
import { makeCustomer } from 'test/factories/make-customer'
import { makeWorkout } from 'test/factories/make-workout'

describe('Fetch workouts customer use case', () => {
  let workoutsRepository: InMemoryWorkoutsRepository
  let customersRepository: InMemoryCustomersRepository
  let sut: FetchWorkoutsCustomerUseCase

  beforeEach(() => {
    workoutsRepository = new InMemoryWorkoutsRepository()
    customersRepository = new InMemoryCustomersRepository()

    sut = new FetchWorkoutsCustomerUseCase(workoutsRepository)
  })

  it('should be able to fetch customer workouts', async () => {
    await customersRepository.create(makeCustomer({}, 'customer-01'))
    await workoutsRepository.create(makeWorkout({}, 'workout-01'))

    const result = await sut.execute({
      customerId: 'customer-01',
    })

    expect(result.isSuccess()).toBe(true)
  })
})
