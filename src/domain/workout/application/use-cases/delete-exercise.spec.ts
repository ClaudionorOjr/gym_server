import { InMemoryExercisesRepository } from 'test/repositories/in-memory-exercises-repository'
import { DeleteExerciseUseCase } from './delete-exercise'
import { makeExercise } from 'test/factories/make-exercise'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'

describe('Delete exercise use case', () => {
  let exercisesRepository: InMemoryExercisesRepository
  let sut: DeleteExerciseUseCase

  beforeEach(() => {
    exercisesRepository = new InMemoryExercisesRepository()

    sut = new DeleteExerciseUseCase(exercisesRepository)
  })

  it('should be able to delete a exercise', async () => {
    await Promise.all([
      exercisesRepository.create(
        makeExercise({ name: 'biceps' }, 'exercise-01'),
      ),
      exercisesRepository.create(
        makeExercise({ name: 'forearm' }, 'exercise-02'),
      ),
    ])

    const result = await sut.execute({ exerciseId: 'exercise-01' })

    expect(result.isSuccess()).toBe(true)
    expect(exercisesRepository.exercises).toHaveLength(1)
  })

  it('should not be able to delete a non existing exercise', async () => {
    const result = await sut.execute({ exerciseId: 'exercise-01' })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
