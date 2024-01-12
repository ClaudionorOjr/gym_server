import { Customer } from '@account/enterprise/entities/customer'
import { Either, success } from '@core/either'
import { CustomersRepository } from '../repositories/customers-repository'
import { inject, injectable } from 'tsyringe'

type FetchCustomersUseCaseResponse = Either<
  null,
  {
    customers: Customer[]
  }
>

@injectable()
export class FetchCustomersUseCase {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: CustomersRepository,
  ) {}

  async execute(): Promise<FetchCustomersUseCaseResponse> {
    const customers = await this.customersRepository.findMany()

    return success({ customers })
  }
}
