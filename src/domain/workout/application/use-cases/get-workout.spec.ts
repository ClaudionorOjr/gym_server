import 'reflect-metadata'
import { InMemoryWorkoutsRepository } from 'test/repositories/in-memory-workouts-repository'
import { GetWorkoutUseCase } from './get-workout'
import { makeWorkout } from 'test/factories/make-workout'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'

describe('Get workout use case', () => {
  let workoutsRepository: InMemoryWorkoutsRepository
  let sut: GetWorkoutUseCase

  beforeEach(() => {
    workoutsRepository = new InMemoryWorkoutsRepository()

    sut = new GetWorkoutUseCase(workoutsRepository)
  })

  it('should be able to get workout', async () => {
    await workoutsRepository.create(makeWorkout({}, 'workout-01'))
    const result = await sut.execute({
      workoutId: 'workout-01',
    })

    expect(result.isSuccess()).toBe(true)

    expect(result.value).toEqual({
      workout: expect.objectContaining({
        id: 'workout-01',
      }),
    })
  })

  it('should not be able to get non existing workout', async () => {
    const result = await sut.execute({
      workoutId: 'workout-01',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
