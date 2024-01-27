import { makeExercise } from 'test/factories/make-exercise'
import { RegisterExerciseUseCase } from './register-exercise'
import { InMemoryExercisesRepository } from 'test/repositories/in-memory-exercises-repository'
import { ResourceAlreadyExistsError } from '@core/errors/resource-already-exists-error'
import { InMemoryMusculaturesRepository } from 'test/repositories/in-memory-musculatures-repository'
import { makeMusculature } from 'test/factories/make-musculature'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'

describe('Register exercise use case', () => {
  let exercisesRepository: InMemoryExercisesRepository
  let musculaturesRepository: InMemoryMusculaturesRepository
  let sut: RegisterExerciseUseCase

  beforeEach(() => {
    exercisesRepository = new InMemoryExercisesRepository()
    musculaturesRepository = new InMemoryMusculaturesRepository()
    sut = new RegisterExerciseUseCase(
      exercisesRepository,
      musculaturesRepository,
    )
  })

  it('should be able to register an exercise', async () => {
    await musculaturesRepository.create(makeMusculature({}, 'musculature-01'))

    const result = await sut.execute({
      name: 'bench press',
      musculatureId: 'musculature-01',
      equipment: 'incline bench press',
    })

    expect(result.isSuccess()).toBe(true)
    expect(exercisesRepository.exercises).toHaveLength(1)
  })

  it('should not be able to register an exercise with an existing name', async () => {
    await exercisesRepository.create(makeExercise({ name: 'bench press' }))

    const result = await sut.execute({
      name: 'bench press',
      musculatureId: 'musculature-01',
      equipment: 'incline bench press',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceAlreadyExistsError)
  })

  it('should not be able to register an exercise with non-existing musculature', async () => {
    const result = await sut.execute({
      name: 'bench press',
      musculatureId: 'musculature-01',
      equipment: 'incline bench press',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
