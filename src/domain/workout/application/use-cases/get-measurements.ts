import { Either, failure, success } from '@core/either'
import { Measurements } from '@workout/enterprise/entities/measurements'
import { MeasurementsRepository } from '../repositories/measurements-repository'
import { ResourceNotFoundError } from '@core/errors/resource-not-found-error'

interface GetMeasurementsUseCaseRequest {
  measurementsId: string
}

type GetMeasurementsUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    measurements: Measurements
  }
>

export class GetMeasurementsUseCase {
  constructor(private measurementsRepository: MeasurementsRepository) {}

  async execute({
    measurementsId,
  }: GetMeasurementsUseCaseRequest): Promise<GetMeasurementsUseCaseResponse> {
    const measurements =
      await this.measurementsRepository.findById(measurementsId)

    if (!measurements) {
      return failure(new ResourceNotFoundError())
    }

    return success({ measurements })
  }
}
