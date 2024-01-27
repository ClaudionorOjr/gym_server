import { InMemoryExercisesRepository } from 'test/repositories/in-memory-exercises-repository'
import { FetchExercisesUseCase } from './fetch-exercises'
import { makeExercise } from 'test/factories/make-exercise'

describe('Fetch exercises use case', () => {
  let exercisesRepository: InMemoryExercisesRepository
  let sut: FetchExercisesUseCase

  beforeEach(() => {
    exercisesRepository = new InMemoryExercisesRepository()
    sut = new FetchExercisesUseCase(exercisesRepository)
  })

  it('should be able to fetch exercises', async () => {
    await Promise.all([
      exercisesRepository.create(makeExercise({ name: 'bench press' })),
      exercisesRepository.create(makeExercise({ name: 'leg press' })),
      exercisesRepository.create(
        makeExercise({ name: 'triceps', equipment: 'cable crossover' }),
      ),
    ])

    const result = await sut.execute()

    expect(result.isSuccess()).toBe(true)
    expect(result.value).toEqual({
      exercises: expect.arrayContaining([
        expect.objectContaining({ name: 'bench press' }),
        expect.objectContaining({ name: 'leg press' }),
        expect.objectContaining({
          name: 'triceps',
          equipment: 'cable crossover',
        }),
      ]),
    })
  })
})
