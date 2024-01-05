import { Either, failure, success } from '@core/either'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { CustomersRepository } from '../repositories/customers-repository'

interface EditCustomerUseCaseRequest {
  customerId: string
  completeName: string
  email: string
  phone: string
  birthdate: Date
}

type EditCustomerUseCaseResponse = Either<ResourceNotFoundError, object>

export class EditCustomerUseCase {
  constructor(private customersRepository: CustomersRepository) {}

  async execute({
    customerId,
    completeName,
    email,
    phone,
    birthdate,
  }: EditCustomerUseCaseRequest): Promise<EditCustomerUseCaseResponse> {
    const customer = await this.customersRepository.findById(customerId)

    if (!customer) {
      return failure(new ResourceNotFoundError())
    }

    customer.completeName = completeName ?? customer.completeName
    customer.email = email ?? customer.email
    customer.phone = phone ?? customer.phone
    customer.birthdate = birthdate ?? customer.birthdate

    await this.customersRepository.save(customer)

    return success({})
  }
}
