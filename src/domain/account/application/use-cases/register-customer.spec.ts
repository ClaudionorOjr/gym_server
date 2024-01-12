import 'reflect-metadata'
import { InMemoryCustomersRepository } from 'test/repositories/in-memory-customers-repository'
import { RegisterCustomerUseCase } from './register-customer'
import { makeCustomer } from 'test/factories/make-customer'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

let customersRepository: InMemoryCustomersRepository
let sut: RegisterCustomerUseCase

describe('Register customer use case', () => {
  beforeEach(() => {
    customersRepository = new InMemoryCustomersRepository()
    sut = new RegisterCustomerUseCase(customersRepository)
  })

  it('should be able to register a customer', async () => {
    const result = await sut.execute({
      completeName: 'John Doe',
      email: 'johndoe@example.com',
      phone: '(00) 98765-4321',
      birthdate: new Date(),
      registeredBy: 'admin-01',
    })

    expect(result.isSuccess()).toBe(true)
    expect(customersRepository.customers).toHaveLength(1)
  })

  it('should not be able to register a customer with same email', async () => {
    await customersRepository.create(
      makeCustomer({ email: 'johndoe@example.com' }),
    )

    const result = await sut.execute({
      completeName: 'John Doe',
      email: 'johndoe@example.com',
      phone: '(00) 98765-4321',
      birthdate: new Date(),
      registeredBy: 'admin-01',
    })

    expect(result.isFailure()).toBe(true)
    expect(result.value).toBeInstanceOf(UserAlreadyExistsError)
  })
})
