import 'reflect-metadata'
import { InMemoryCustomersRepository } from 'test/repositories/in-memory-customers-repository'
import { EditCustomerUseCase } from './edit-customer'
import { makeCustomer } from 'test/factories/make-customer'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'

let customersRepository: InMemoryCustomersRepository
let sut: EditCustomerUseCase

describe('Edit customer use case', () => {
  beforeEach(() => {
    customersRepository = new InMemoryCustomersRepository()
    sut = new EditCustomerUseCase(customersRepository)
  })

  it('should be able to edit a customer', async () => {
    await customersRepository.create(makeCustomer({}, 'customer-01'))

    const result = await sut.execute({
      customerId: 'customer-01',
      completeName: 'John Doe',
      email: 'johndoe@example.com',
      phone: '(00) 98765-4321',
      birthdate: new Date('1998-10-20'),
    })

    expect(result.isSuccess()).toBe(true)
    expect(customersRepository.customers[0]).toMatchObject({
      completeName: 'John Doe',
      email: 'johndoe@example.com',
      phone: '(00) 98765-4321',
      birthdate: new Date('1998-10-20'),
    })
  })

  it('should not be able to edit a non existing customer', async () => {
    const result = await sut.execute({
      customerId: 'customer-01',
      completeName: 'John Doe',
      email: 'johndoe@example.com',
      phone: '(00) 98765-4321',
      birthdate: new Date('1998-10-20'),
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
