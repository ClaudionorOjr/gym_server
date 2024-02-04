import 'reflect-metadata'
import { InMemoryMusculaturesRepository } from 'test/repositories/in-memory-musculatures-repository'
import { DeleteMusculatureUseCase } from './delete-musculature'
import { makeMusculature } from 'test/factories/make-musculature'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'

describe('Delete musculature use case', () => {
  let musculaturesRepository: InMemoryMusculaturesRepository
  let sut: DeleteMusculatureUseCase

  beforeEach(() => {
    musculaturesRepository = new InMemoryMusculaturesRepository()

    sut = new DeleteMusculatureUseCase(musculaturesRepository)
  })

  it('should be able to delete a musculature', async () => {
    await Promise.all([
      musculaturesRepository.create(
        makeMusculature({ name: 'biceps' }, 'musculature-01'),
      ),
      musculaturesRepository.create(
        makeMusculature({ name: 'forearm' }, 'musculature-02'),
      ),
    ])

    const result = await sut.execute({ musculatureId: 'musculature-01' })

    expect(result.isSuccess()).toBe(true)
    expect(musculaturesRepository.musculatures).toHaveLength(1)
  })

  it('should not be able to delete a non existing musculature', async () => {
    const result = await sut.execute({ musculatureId: 'musculature-01' })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
