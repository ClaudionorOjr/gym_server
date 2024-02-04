import 'reflect-metadata'
import { InMemoryMusculaturesRepository } from 'test/repositories/in-memory-musculatures-repository'
import { FetchMusculaturesUseCase } from './fetch-musculatures'
import { makeMusculature } from 'test/factories/make-musculature'

describe('Fetch musculatures use case', () => {
  let musculaturesRepository: InMemoryMusculaturesRepository
  let sut: FetchMusculaturesUseCase

  beforeEach(() => {
    musculaturesRepository = new InMemoryMusculaturesRepository()
    sut = new FetchMusculaturesUseCase(musculaturesRepository)
  })

  it('should be able to fetch musculatures', async () => {
    await Promise.all([
      musculaturesRepository.create(makeMusculature({ name: 'biceps' })),
      musculaturesRepository.create(makeMusculature({ name: 'forearm' })),
      musculaturesRepository.create(makeMusculature({ name: 'bust' })),
    ])

    const result = await sut.execute()

    expect(result.isSuccess()).toBe(true)
    expect(result.value).toEqual({
      musculatures: expect.arrayContaining([
        expect.objectContaining({ name: 'biceps' }),
        expect.objectContaining({ name: 'forearm' }),
        expect.objectContaining({ name: 'bust' }),
      ]),
    })
  })
})
