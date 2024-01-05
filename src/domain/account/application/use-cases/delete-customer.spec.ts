import { InMemoryCustomersRepository } from 'test/repositories/in-memory-customers-repository'
import { DeleteCustomerUseCase } from './delete-customer'
import { makeCustomer } from 'test/factories/make-customer'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'

let customersRepository: InMemoryCustomersRepository
let sut: DeleteCustomerUseCase

describe('Delete customer use case', () => {
  beforeEach(() => {
    customersRepository = new InMemoryCustomersRepository()
    sut = new DeleteCustomerUseCase(customersRepository)
  })

  it('should be able to delete a customer', async () => {
    await customersRepository.create(makeCustomer({}, 'customer-01'))

    const result = await sut.execute({
      customerId: 'customer-01',
    })

    expect(result.isSuccess()).toBe(true)
    expect(customersRepository.customers).toHaveLength(0)
  })

  it('should not be able to delete a non existing customer', async () => {
    const result = await sut.execute({
      customerId: 'customer-01',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
