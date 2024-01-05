import { Customer } from '@account/enterprise/entities/customer'
import { CustomersRepository } from '../repositories/customers-repository'
import { Either, failure, success } from '@core/either'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface RegisterCustomerUseCaseRequest {
  completeName: string
  email: string
  phone: string
  birthdate: Date
  registeredBy: string
}

type RegisterCustomerUseCaseResponse = Either<UserAlreadyExistsError, object>

export class RegisterCustomerUseCase {
  constructor(private customersRepository: CustomersRepository) {}
  async execute({
    completeName,
    email,
    phone,
    birthdate,
    registeredBy,
  }: RegisterCustomerUseCaseRequest): Promise<RegisterCustomerUseCaseResponse> {
    const customerAlreadyExists =
      await this.customersRepository.findByEmail(email)

    if (customerAlreadyExists) {
      return failure(new UserAlreadyExistsError())
    }

    const customer = Customer.create({
      completeName,
      email,
      phone,
      birthdate,
      registeredBy,
    })

    await this.customersRepository.create(customer)

    return success({})
  }
}
