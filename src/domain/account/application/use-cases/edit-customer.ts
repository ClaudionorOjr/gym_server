import { Either, failure, success } from '@core/either'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { CustomersRepository } from '../repositories/customers-repository'
import { inject, injectable } from 'tsyringe'

interface EditCustomerUseCaseRequest {
  customerId: string
  completeName?: string
  email?: string
  phone?: string
  birthdate?: Date
  paymentDay?: string
}

type EditCustomerUseCaseResponse = Either<ResourceNotFoundError, object>

@injectable()
export class EditCustomerUseCase {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: CustomersRepository,
  ) {}

  async execute({
    customerId,
    completeName,
    email,
    phone,
    birthdate,
    paymentDay,
  }: EditCustomerUseCaseRequest): Promise<EditCustomerUseCaseResponse> {
    const customer = await this.customersRepository.findById(customerId)

    if (!customer) {
      return failure(new ResourceNotFoundError())
    }

    customer.completeName = completeName ?? customer.completeName
    customer.email = email ?? customer.email
    customer.phone = phone ?? customer.phone
    customer.birthdate = birthdate ?? customer.birthdate
    customer.paymentDay = paymentDay ?? customer.paymentDay

    await this.customersRepository.save(customer)

    return success({})
  }
}
