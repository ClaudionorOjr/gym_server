import { Either, success } from '@core/either'
import { Measurements } from '../../enterprise/entities/measurements'
import { MeasurementsRepository } from '../repositories/measurements-repository'

interface FetchMeasurementsUseCaseRequest {
  customerId: string
}

type FetchMeasurementsUseCaseResponse = Either<
  null,
  { measurements: Measurements[] }
>

export class FetchMeasurementsUseCase {
  constructor(private measurementsRepository: MeasurementsRepository) {}

  async execute({
    customerId,
  }: FetchMeasurementsUseCaseRequest): Promise<FetchMeasurementsUseCaseResponse> {
    const measurements =
      await this.measurementsRepository.findManyByCustomerId(customerId)

    return success({ measurements })
  }
}
