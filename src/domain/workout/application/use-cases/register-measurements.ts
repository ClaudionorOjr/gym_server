import { CustomersRepository } from '@account/application/repositories/customers-repository'
import { MeasurementsRepository } from '../repositories/measurements-repository'
import { Measurements } from '../../enterprise/entities/measurements'
import { Either, failure, success } from '@core/either'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'
import { inject, injectable } from 'tsyringe'

interface RegisterMeasurementsUseCaseRequest {
  customerId: string
  bust: number
  bicep: number
  forearm: number
  waist: number
  hips: number
  thigh: number
  calf: number
}

type RegisterMeasurementsUseCaseResponse = Either<ResourceNotFoundError, object>

@injectable()
export class RegisterMeasurementsUseCase {
  constructor(
    @inject('CustomersRepository')
    private customersRepository: CustomersRepository,
    @inject('MeasurementsRepository')
    private measurementsRepository: MeasurementsRepository,
  ) {}

  async execute({
    customerId,
    bust,
    bicep,
    forearm,
    waist,
    hips,
    thigh,
    calf,
  }: RegisterMeasurementsUseCaseRequest): Promise<RegisterMeasurementsUseCaseResponse> {
    const customer = await this.customersRepository.findById(customerId)

    if (!customer) {
      return failure(new ResourceNotFoundError())
    }

    const measurements = Measurements.create({
      customerId,
      bust,
      bicep,
      forearm,
      waist,
      hips,
      thigh,
      calf,
    })

    await this.measurementsRepository.create(measurements)

    return success({})
  }
}
