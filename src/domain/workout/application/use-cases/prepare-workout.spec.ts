import 'reflect-metadata'
import { makeCustomer } from 'test/factories/make-customer'
import { makeExercise } from 'test/factories/make-exercise'
import { InMemoryCustomersRepository } from 'test/repositories/in-memory-customers-repository'
import { InMemoryExercisesRepository } from 'test/repositories/in-memory-exercises-repository'
import { PrepareWorkoutUseCase } from './prepare-workout'
import { InMemoryWorkoutsRepository } from 'test/repositories/in-memory-workouts-repository'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'

describe('Prepare workout use case', () => {
  let customersRepository: InMemoryCustomersRepository
  let exercisesRepository: InMemoryExercisesRepository
  let workoutsRepository: InMemoryWorkoutsRepository
  let sut: PrepareWorkoutUseCase

  beforeEach(() => {
    customersRepository = new InMemoryCustomersRepository()
    exercisesRepository = new InMemoryExercisesRepository()
    workoutsRepository = new InMemoryWorkoutsRepository()

    sut = new PrepareWorkoutUseCase(
      workoutsRepository,
      customersRepository,
      exercisesRepository,
    )
  })

  it('should be able to prepare a workout', async () => {
    await customersRepository.create(makeCustomer({}, 'customer-01'))
    await exercisesRepository.create(makeExercise({}, 'exercise-01'))

    const result = await sut.execute({
      customerId: 'customer-01',
      exerciseId: 'exercise-01',
      series: 3,
      repetitions: 12,
      weight: 70,
      note: 'note',
    })

    expect(result.isSuccess()).toBe(true)
  })

  it('should not be able to prepare a workout with non-existing customer', async () => {
    const result = await sut.execute({
      customerId: 'customer-01',
      exerciseId: 'exercise-01',
      series: 3,
      repetitions: 12,
      weight: 70,
      note: 'note',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to prepare a workout with non-existing exercise', async () => {
    await customersRepository.create(makeCustomer({}, 'customer-01'))

    const result = await sut.execute({
      customerId: 'customer-01',
      exerciseId: 'exercise-01',
      series: 3,
      repetitions: 12,
      weight: 70,
      note: 'note',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
