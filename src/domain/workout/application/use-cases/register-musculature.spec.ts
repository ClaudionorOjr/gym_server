import 'reflect-metadata'
import { InMemoryMusculaturesRepository } from 'test/repositories/in-memory-musculatures-repository'
import { RegisterMusculatureUseCase } from './register-musculature'
import { ResourceAlreadyExistsError } from '@core/errors/resource-already-exists-error'
import { makeMusculature } from 'test/factories/make-musculature'

describe('Register musculature use case', () => {
  let musculaturesRepository: InMemoryMusculaturesRepository
  let sut: RegisterMusculatureUseCase

  beforeEach(() => {
    musculaturesRepository = new InMemoryMusculaturesRepository()

    sut = new RegisterMusculatureUseCase(musculaturesRepository)
  })

  it('should be able to register a musculature', async () => {
    const result = await sut.execute({
      name: 'biceps',
    })

    expect(result.isSuccess()).toBe(true)
    expect(musculaturesRepository.musculatures).toHaveLength(1)
  })

  it('should not be able to register a musculature with an existing name', async () => {
    await musculaturesRepository.create(makeMusculature({ name: 'biceps' }))

    const result = await sut.execute({
      name: 'biceps',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceAlreadyExistsError)
  })
})
