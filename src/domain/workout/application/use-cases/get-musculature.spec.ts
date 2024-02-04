import 'reflect-metadata'
import { InMemoryMusculaturesRepository } from 'test/repositories/in-memory-musculatures-repository'
import { GetMusculatureUseCase } from './get-musculature'
import { makeMusculature } from 'test/factories/make-musculature'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'

describe('Get musculature use case', () => {
  let musculaturesRepository: InMemoryMusculaturesRepository
  let sut: GetMusculatureUseCase

  beforeEach(() => {
    musculaturesRepository = new InMemoryMusculaturesRepository()

    sut = new GetMusculatureUseCase(musculaturesRepository)
  })

  it('should be able to get musculature', async () => {
    await musculaturesRepository.create(makeMusculature({}, 'musculature-01'))
    const result = await sut.execute({
      musculatureId: 'musculature-01',
    })

    expect(result.isSuccess()).toBe(true)

    expect(result.value).toEqual({
      musculature: expect.objectContaining({
        id: 'musculature-01',
      }),
    })
  })

  it('should not be able to get non existing musculature', async () => {
    const result = await sut.execute({
      musculatureId: 'musculature-01',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
