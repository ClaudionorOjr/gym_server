import { InMemoryExercisesRepository } from 'test/repositories/in-memory-exercises-repository'
import { InMemoryMusculaturesRepository } from 'test/repositories/in-memory-musculatures-repository'
import { EditExerciseUseCase } from './edit-exercise'
import { makeExercise } from 'test/factories/make-exercise'
import { makeMusculature } from 'test/factories/make-musculature'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'

describe('Edit exercise use case', () => {
  let exercisesRepository: InMemoryExercisesRepository
  let musculaturesRepository: InMemoryMusculaturesRepository
  let sut: EditExerciseUseCase

  beforeEach(() => {
    exercisesRepository = new InMemoryExercisesRepository()
    musculaturesRepository = new InMemoryMusculaturesRepository()

    sut = new EditExerciseUseCase(exercisesRepository, musculaturesRepository)
  })

  it('should be able to edit an exercise', async () => {
    await musculaturesRepository.create(makeMusculature({}, 'musculature-01'))
    await exercisesRepository.create(makeExercise({}, 'exercise-01'))

    const result = await sut.execute({
      exerciseId: 'exercise-01',
      name: 'leg press',
      musculatureId: 'musculature-01',
      equipment: 'leg press machine',
    })

    expect(result.isSuccess()).toBe(true)
    expect(exercisesRepository.exercises[0]).toMatchObject({
      name: 'leg press',
      musculatureId: 'musculature-01',
      equipment: 'leg press machine',
    })
  })

  it('should not be able to edit a non-existing exercise', async () => {
    const result = await sut.execute({
      exerciseId: 'exercise-01',
      name: 'leg press',
      musculatureId: 'musculature-01',
      equipment: 'leg press machine',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to edit an exercise with non-existing musculature', async () => {
    await exercisesRepository.create(makeExercise({}, 'exercise-01'))

    const result = await sut.execute({
      exerciseId: 'exercise-01',
      name: 'leg press',
      musculatureId: 'musculature-01',
      equipment: 'leg press machine',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
