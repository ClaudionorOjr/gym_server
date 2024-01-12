import { Either, failure, success } from '@core/either'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { CustomersRepository } from '../repositories/customers-repository'
import { inject, injectable } from 'tsyringe'

interface DeleteCustomerUseCaseRequest {
  customerId: string
}

type DeleteCustomerUseCaseResponse = Either<ResourceNotFoundError, object>

@injectable()
export class DeleteCustomerUseCase {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: CustomersRepository,
  ) {}

  async execute({
    customerId,
  }: DeleteCustomerUseCaseRequest): Promise<DeleteCustomerUseCaseResponse> {
    const customer = await this.customersRepository.findById(customerId)

    if (!customer) {
      return failure(new ResourceNotFoundError())
    }

    await this.customersRepository.delete(customerId)

    return success({})
  }
}
