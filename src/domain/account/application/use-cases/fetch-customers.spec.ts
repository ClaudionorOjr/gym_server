import { InMemoryCustomersRepository } from 'test/repositories/in-memory-customers-repository'
import { FetchCustomersUseCase } from './fetch-customers'
import { makeCustomer } from 'test/factories/make-customer'

let customersRepository: InMemoryCustomersRepository
let sut: FetchCustomersUseCase

describe('Fetch customers use case', () => {
  beforeEach(() => {
    customersRepository = new InMemoryCustomersRepository()
    sut = new FetchCustomersUseCase(customersRepository)
  })

  it('should be able to fetch all customers', async () => {
    await customersRepository.create(makeCustomer({}, 'customer-01'))
    await customersRepository.create(makeCustomer({}, 'customer-02'))

    const result = await sut.execute()

    expect(result.isSuccess()).toBe(true)
    expect(result.value).toEqual({
      customers: expect.arrayContaining([
        expect.objectContaining({ id: 'customer-01' }),
        expect.objectContaining({ id: 'customer-02' }),
      ]),
    })
  })
})
