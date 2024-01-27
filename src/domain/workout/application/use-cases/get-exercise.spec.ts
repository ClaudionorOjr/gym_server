import { InMemoryExercisesRepository } from 'test/repositories/in-memory-exercises-repository'
import { GetExerciseUseCase } from './get-exercise'
import { makeExercise } from 'test/factories/make-exercise'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'

describe('Get exercise use case', () => {
  let exercisesRepository: InMemoryExercisesRepository
  let sut: GetExerciseUseCase

  beforeEach(() => {
    exercisesRepository = new InMemoryExercisesRepository()

    sut = new GetExerciseUseCase(exercisesRepository)
  })

  it('should be able to get exercise', async () => {
    await exercisesRepository.create(makeExercise({}, 'exercise-01'))
    const result = await sut.execute({
      exerciseId: 'exercise-01',
    })

    expect(result.isSuccess()).toBe(true)

    expect(result.value).toEqual({
      exercise: expect.objectContaining({
        id: 'exercise-01',
      }),
    })
  })

  it('should not be able to get non existing exercise', async () => {
    const result = await sut.execute({
      exerciseId: 'exercise-01',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
