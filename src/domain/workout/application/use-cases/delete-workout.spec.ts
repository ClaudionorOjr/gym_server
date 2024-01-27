import { InMemoryWorkoutsRepository } from 'test/repositories/in-memory-workouts-repository'
import { DeleteWorkoutUseCase } from './delete-workout'
import { makeWorkout } from 'test/factories/make-workout'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'

describe('Delete workout use case', () => {
  let workoutsRepository: InMemoryWorkoutsRepository
  let sut: DeleteWorkoutUseCase

  beforeEach(() => {
    workoutsRepository = new InMemoryWorkoutsRepository()

    sut = new DeleteWorkoutUseCase(workoutsRepository)
  })

  it('should be able to delete a workout', async () => {
    await Promise.all([
      workoutsRepository.create(makeWorkout({}, 'workout-01')),
      workoutsRepository.create(makeWorkout({}, 'workout-02')),
    ])

    const result = await sut.execute({ workoutId: 'workout-01' })

    expect(result.isSuccess()).toBe(true)
    expect(workoutsRepository.workouts).toHaveLength(1)
  })

  it('should not be able to delete a non existing workout', async () => {
    const result = await sut.execute({ workoutId: 'workout-01' })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
