import 'reflect-metadata'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { makeWorkout } from 'test/factories/make-workout'
import { InMemoryWorkoutsRepository } from 'test/repositories/in-memory-workouts-repository'
import { EditWorkoutUseCase } from './edit-workout'

describe('Edit workout use case', () => {
  let workoutsRepository: InMemoryWorkoutsRepository
  let sut: EditWorkoutUseCase

  beforeEach(() => {
    workoutsRepository = new InMemoryWorkoutsRepository()

    sut = new EditWorkoutUseCase(workoutsRepository)
  })

  it('should be able to edit a workout', async () => {
    await workoutsRepository.create(makeWorkout({}, 'workout-01'))

    const result = await sut.execute({
      workoutId: 'workout-01',
      series: 3,
      repetitions: 12,
      weight: 70,
      note: 'note',
    })

    expect(result.isSuccess()).toBe(true)
    expect(workoutsRepository.workouts[0]).toMatchObject({
      series: 3,
      repetitions: 12,
      weight: 70,
      note: 'note',
    })
  })

  it('should not be able to edit a non-existing workout', async () => {
    const result = await sut.execute({
      workoutId: 'workout-01',
      series: 3,
      repetitions: 12,
      weight: 70,
      note: 'note',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
