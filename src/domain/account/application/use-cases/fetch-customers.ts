import { Customer } from '@account/enterprise/entities/customer'
import { Either, success } from '@core/either'
import { CustomersRepository } from '../repositories/customers-repository'

type FetchCustomerUseCaseResponse = Either<
  null,
  {
    customers: Customer[]
  }
>

export class FetchCustomerUseCase {
  constructor(private customersRepository: CustomersRepository) {}

  async execute(): Promise<FetchCustomerUseCaseResponse> {
    const customers = await this.customersRepository.findMany()

    return success({ customers })
  }
}
